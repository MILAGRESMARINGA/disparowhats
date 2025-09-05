# Backend WPPConnect para CRM WhatsApp

Servidor Node.js com integração WPPConnect para automação WhatsApp com suporte a Redis.

## 🚀 Instalação e Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Instalar Redis (Opcional)
```bash
# Local (opcional)
docker run -d -p 6379:6379 redis:alpine

# Ou usar Redis Cloud/Upstash para produção
```

### 3. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```
PORT=3333
SESSION_NAME=crm-pro
REDIS_URL=redis://localhost:6379  # Opcional
FRONTEND_ORIGIN=https://seu-frontend.bolt.host
```

### 4. Iniciar Servidor
```bash
npm start
# ou para desenvolvimento:
npm run dev
```

## 📦 Storage de Sessões

O sistema suporta dois tipos de storage:

### Redis (Recomendado para Produção)
- Configure `REDIS_URL` no .env
- Sessões persistem entre restarts
- Melhor para múltiplas instâncias

### Filesystem (Fallback)
- Usado quando Redis não está disponível
- Busca por `/data` (volume persistente) ou `/tmp`
- Adequado para desenvolvimento e instância única

## 📡 Endpoints da API

### Sessão WhatsApp
- `GET /session/start` - Iniciar sessão e obter QR Code
- `GET /session/status` - Verificar status da conexão
- `POST /session/close` - Encerrar sessão

### Envio de Mensagens
- `POST /send-message` - Enviar mensagem de texto
- `POST /send-media` - Enviar mídia (imagem/vídeo)

### Dados WhatsApp
- `GET /contacts` - Buscar contatos do WhatsApp
- `GET /chats` - Buscar chats recentes

### Sistema
- `GET /health` - Status do servidor

## 📱 Como Usar

### 1. Conectar WhatsApp
```bash
curl http://localhost:3333/session/start
```

### 2. Escanear QR Code
Use o QR Code retornado na resposta para conectar seu WhatsApp.

### 3. Enviar Mensagem
```bash
curl -X POST http://localhost:3333/send-message \
  -H "Content-Type: application/json" \
  -d '{"phone": "5511999999999", "message": "Olá! Como posso ajudá-lo?"}'
```

### 4. Enviar Mídia
```bash
curl -X POST http://localhost:3333/send-media \
  -F "phone=5511999999999" \
  -F "media=@imagem.jpg" \
  -F "caption=Confira esta imagem!"
```

## 🔧 Configuração no Frontend

No seu arquivo `.env` do frontend React:
```
VITE_API_BASE=http://localhost:3333
```

Para produção, substitua pela URL do seu servidor hospedado.

## 🌐 Deploy em Produção

### Render.com
1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Use o comando de build: `npm install`
4. Use o comando de start: `npm start`

### Railway
1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. O Railway detectará automaticamente o Node.js

### Fly.io
1. Instale o CLI do Fly.io
2. Execute `fly launch`
3. Configure as variáveis de ambiente

## ⚠️ Requisitos

- Node.js 16+ 
- Chrome/Chromium instalado (para WPPConnect)
- Conexão estável com a internet
- WhatsApp instalado no celular

## 🔒 Segurança

- Configure CORS adequadamente para produção
- Use HTTPS em produção
- Implemente autenticação se necessário
- Monitore logs de acesso

## 📝 Logs

O servidor registra todas as operações importantes:
- Conexões WhatsApp
- Mensagens enviadas
- Erros e exceções
- Status das sessões

## 🐛 Troubleshooting

### WhatsApp não conecta
- Verifique se o Chrome está instalado
- Certifique-se de que não há outras sessões ativas
- Tente reiniciar o servidor

### Erro de CORS
- Adicione a URL do frontend nas origens permitidas
- Verifique a configuração do CORS no código

### Erro de upload
- Verifique se a pasta `uploads` existe
- Confirme as permissões de escrita
- Verifique o tamanho do arquivo (máximo 16MB)

## 📄 Licença

MIT License