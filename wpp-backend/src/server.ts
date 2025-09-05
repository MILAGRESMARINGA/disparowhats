require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const wppconnect = require('@wppconnect-team/wppconnect');
const { sessionStore } = require('./lib/sessionStore');

const app = express();
const PORT = process.env.PORT || 3333;
const SESSION_NAME = process.env.SESSION_NAME || 'crm-pro';

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://*.bolt.host',
    process.env.FRONTEND_ORIGIN
  ].filter(Boolean),
  credentials: true
}));

// Estado da aplicação
let client = null;
let connectionStatus = 'DISCONNECTED';
let currentQRCode = null;
let isInitializing = false;

// Configuração de upload
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ 
  dest: uploadDir,
  limits: {
    fileSize: 16 * 1024 * 1024 // 16MB max
  }
});

// Função para inicializar cliente WPPConnect
async function initializeWPPClient() {
  if (client || isInitializing) {
    console.log('Cliente já existe ou está inicializando...');
    return client;
  }

  isInitializing = true;
  connectionStatus = 'STARTING';
  
  try {
    console.log(`🚀 Inicializando WPPConnect - Sessão: ${SESSION_NAME}`);
    console.log(`📦 Storage: ${sessionStore.getStorageInfo().type.toUpperCase()}`);
    
    const storageInfo = sessionStore.getStorageInfo();
    if (storageInfo.path) {
      console.log(`📁 Caminho: ${storageInfo.path}`);
    }

    client = await wppconnect.create({
      session: SESSION_NAME,
      headless: true,
      useChrome: true,
      disableWelcome: true,
      
      // Configuração de storage baseada no tipo
      ...(storageInfo.type === 'redis' ? {
        // Para Redis, usar storage customizado
        tokenStore: 'file', // WPPConnect ainda precisa de file, mas vamos interceptar
        folderNameToken: './tokens-temp'
      } : {
        // Para filesystem
        tokenStore: 'file',
        folderNameToken: storageInfo.path || './tokens'
      }),

      // Callbacks
      catchQR: (base64, asciiQR, attempts, urlCode) => {
        console.log(`📱 QR Code gerado (tentativa ${attempts})`);
        currentQRCode = `data:image/png;base64,${base64}`;
        connectionStatus = 'QRCODE';
        
        // Salvar QR no storage para recuperação
        sessionStore.set('current_qr', currentQRCode);
      },

      statusFind: (statusSession, session) => {
        console.log(`📊 Status da sessão: ${statusSession}`);
        
        switch (statusSession) {
          case 'isLogged':
            connectionStatus = 'CONNECTED';
            currentQRCode = null;
            sessionStore.del('current_qr');
            console.log('✅ WhatsApp conectado com sucesso!');
            break;
          case 'notLogged':
            connectionStatus = 'DISCONNECTED';
            currentQRCode = null;
            break;
          case 'browserClose':
            connectionStatus = 'DISCONNECTED';
            client = null;
            console.log('🔌 Navegador fechado, cliente desconectado');
            break;
          case 'qrReadSuccess':
            console.log('📱 QR Code escaneado com sucesso!');
            break;
          case 'qrReadFail':
            console.log('❌ Falha ao escanear QR Code');
            break;
        }
      },

      // Configurações do Puppeteer
      puppeteerOptions: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });

    console.log('✅ Cliente WPPConnect inicializado');
    return client;

  } catch (error) {
    console.error('❌ Erro ao inicializar WPPConnect:', error);
    connectionStatus = 'ERROR';
    throw error;
  } finally {
    isInitializing = false;
  }
}

// Middleware para verificar cliente
const ensureClient = async (req, res, next) => {
  try {
    if (!client) {
      await initializeWPPClient();
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      ok: false, 
      error: 'Falha ao inicializar cliente WhatsApp',
      details: error.message 
    });
  }
};

// ENDPOINTS

// Health check
app.get('/health', (req, res) => {
  const storageInfo = sessionStore.getStorageInfo();
  res.json({
    ok: true,
    status: connectionStatus,
    hasClient: !!client,
    storage: storageInfo.type,
    ...(storageInfo.path && { path: storageInfo.path }),
    ...(storageInfo.connected !== undefined && { redisConnected: storageInfo.connected }),
    session: SESSION_NAME,
    timestamp: new Date().toISOString()
  });
});

// Iniciar sessão e obter QR Code
app.get('/api/session/start', async (req, res) => {
  try {
    if (connectionStatus === 'CONNECTED') {
      return res.json({ status: 'CONNECTED' });
    }

    // Verificar se já temos QR Code salvo
    if (connectionStatus === 'QRCODE' && currentQRCode) {
      return res.json({ 
        status: 'QRCODE', 
        qrcode: currentQRCode 
      });
    }

    // Inicializar cliente se necessário
    if (!client && !isInitializing) {
      await initializeWPPClient();
    }

    // Aguardar QR Code ser gerado
    let attempts = 0;
    while (attempts < 30 && connectionStatus !== 'CONNECTED' && !currentQRCode) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (connectionStatus === 'CONNECTED') {
      res.json({ status: 'CONNECTED' });
    } else if (currentQRCode) {
      res.json({ 
        status: 'QRCODE', 
        qrcode: currentQRCode 
      });
    } else {
      res.json({ 
        status: connectionStatus,
        message: 'QR Code não disponível ainda. Tente novamente em alguns segundos.' 
      });
    }

  } catch (error) {
    console.error('Erro ao iniciar sessão:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Falha ao iniciar sessão',
      details: error.message 
    });
  }
});

// Status da sessão
app.get('/api/session/status', (req, res) => {
  res.json({
    status: connectionStatus,
    connected: connectionStatus === 'CONNECTED',
    hasQR: !!currentQRCode,
    session: SESSION_NAME
  });
});

// Encerrar sessão
app.post('/api/session/close', async (req, res) => {
  try {
    if (client) {
      await client.close();
      client = null;
    }
    
    connectionStatus = 'DISCONNECTED';
    currentQRCode = null;
    
    // Limpar dados da sessão
    await sessionStore.del('current_qr');
    await sessionStore.del(`session_${SESSION_NAME}`);
    
    console.log('🔌 Sessão WhatsApp encerrada');
    res.json({ ok: true, status: connectionStatus });
    
  } catch (error) {
    console.error('Erro ao encerrar sessão:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Falha ao encerrar sessão',
      details: error.message 
    });
  }
});

// Enviar mensagem de texto
app.post('/api/send-message', ensureClient, async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Parâmetros "to" e "message" são obrigatórios' 
      });
    }

    if (connectionStatus !== 'CONNECTED') {
      return res.status(400).json({ 
        ok: false, 
        error: 'WhatsApp não está conectado' 
      });
    }

    // Formatar número para WhatsApp
    const phoneNumber = to.includes('@c.us') ? to : `${to}@c.us`;
    
    console.log(`📤 Enviando mensagem para: ${phoneNumber}`);
    const result = await client.sendText(phoneNumber, message);
    
    console.log('✅ Mensagem enviada com sucesso');
    res.json({ 
      ok: true, 
      result: {
        id: result.id,
        to: phoneNumber,
        message: message,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Falha ao enviar mensagem',
      details: error.message 
    });
  }
});

// Enviar mídia
app.post('/api/send-media', upload.single('media'), ensureClient, async (req, res) => {
  try {
    const { to, caption = '' } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Arquivo de mídia é obrigatório' 
      });
    }

    if (!to) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Parâmetro "to" é obrigatório' 
      });
    }

    if (connectionStatus !== 'CONNECTED') {
      return res.status(400).json({ 
        ok: false, 
        error: 'WhatsApp não está conectado' 
      });
    }

    const phoneNumber = to.includes('@c.us') ? to : `${to}@c.us`;
    const filePath = path.resolve(req.file.path);
    const fileName = req.file.originalname;
    
    console.log(`📎 Enviando mídia para: ${phoneNumber}`);
    console.log(`📁 Arquivo: ${fileName} (${req.file.size} bytes)`);

    // Detectar tipo de mídia
    const mimeType = req.file.mimetype;
    let result;

    if (mimeType.startsWith('image/')) {
      result = await client.sendImage(phoneNumber, filePath, fileName, caption);
    } else if (mimeType.startsWith('video/')) {
      result = await client.sendVideoAsGif(phoneNumber, filePath, fileName, caption);
    } else if (mimeType.startsWith('audio/')) {
      result = await client.sendVoice(phoneNumber, filePath);
    } else {
      result = await client.sendFile(phoneNumber, filePath, fileName, caption);
    }

    // Limpar arquivo temporário
    fs.unlink(filePath, (err) => {
      if (err) console.error('Erro ao deletar arquivo temporário:', err);
    });

    console.log('✅ Mídia enviada com sucesso');
    res.json({ 
      ok: true, 
      result: {
        id: result.id,
        to: phoneNumber,
        fileName: fileName,
        caption: caption,
        mimeType: mimeType,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erro ao enviar mídia:', error);
    
    // Limpar arquivo em caso de erro
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    
    res.status(500).json({ 
      ok: false, 
      error: 'Falha ao enviar mídia',
      details: error.message 
    });
  }
});

// Buscar contatos do WhatsApp
app.get('/api/contacts', ensureClient, async (req, res) => {
  try {
    if (connectionStatus !== 'CONNECTED') {
      return res.status(400).json({ 
        ok: false, 
        error: 'WhatsApp não está conectado' 
      });
    }

    const contacts = await client.getAllContacts();
    
    // Filtrar e formatar contatos
    const formattedContacts = contacts
      .filter(contact => !contact.isGroup && contact.id.user)
      .map(contact => ({
        id: contact.id.user,
        name: contact.name || contact.pushname || contact.id.user,
        phone: contact.id.user,
        profilePic: contact.profilePicThumbObj?.eurl || null,
        isMyContact: contact.isMyContact || false
      }))
      .slice(0, 100); // Limitar a 100 contatos

    res.json({ 
      ok: true, 
      contacts: formattedContacts,
      total: formattedContacts.length 
    });

  } catch (error) {
    console.error('❌ Erro ao buscar contatos:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Falha ao buscar contatos',
      details: error.message 
    });
  }
});

// Buscar chats recentes
app.get('/api/chats', ensureClient, async (req, res) => {
  try {
    if (connectionStatus !== 'CONNECTED') {
      return res.status(400).json({ 
        ok: false, 
        error: 'WhatsApp não está conectado' 
      });
    }

    const chats = await client.getAllChats();
    
    // Filtrar e formatar chats
    const formattedChats = chats
      .filter(chat => !chat.isGroup)
      .slice(0, 50) // Últimos 50 chats
      .map(chat => ({
        id: chat.id.user,
        name: chat.name || chat.contact?.name || chat.id.user,
        phone: chat.id.user,
        lastMessage: chat.lastMessage ? {
          content: chat.lastMessage.body || '',
          timestamp: chat.lastMessage.timestamp,
          fromMe: chat.lastMessage.fromMe
        } : null,
        unreadCount: chat.unreadCount || 0
      }));

    res.json({ 
      ok: true, 
      chats: formattedChats,
      total: formattedChats.length 
    });

  } catch (error) {
    console.error('❌ Erro ao buscar chats:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Falha ao buscar chats',
      details: error.message 
    });
  }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('❌ Erro não tratado:', error);
  res.status(500).json({
    ok: false,
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
  });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor WPPConnect rodando em http://localhost:${PORT}`);
  console.log(`📱 Sessão: ${SESSION_NAME}`);
  console.log(`📦 Storage: ${sessionStore.getStorageInfo().type.toUpperCase()}`);
  
  const storageInfo = sessionStore.getStorageInfo();
  if (storageInfo.path) {
    console.log(`📁 Caminho: ${storageInfo.path}`);
  }
  if (storageInfo.connected !== undefined) {
    console.log(`🔗 Redis: ${storageInfo.connected ? 'Conectado' : 'Desconectado'}`);
  }
  
  console.log('');
  console.log('📋 Endpoints disponíveis:');
  console.log(`   GET  /health`);
  console.log(`   GET  /api/session/start`);
  console.log(`   GET  /api/session/status`);
  console.log(`   POST /api/session/close`);
  console.log(`   POST /api/send-message`);
  console.log(`   POST /api/send-media`);
  console.log(`   GET  /api/contacts`);
  console.log(`   GET  /api/chats`);
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Encerrando servidor...');
  
  if (client) {
    try {
      await client.close();
      console.log('✅ Cliente WhatsApp desconectado');
    } catch (error) {
      console.error('Erro ao desconectar cliente:', error);
    }
  }
  
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
});