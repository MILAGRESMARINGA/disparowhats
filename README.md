# CRM WhatsApp Pro

Sistema CRM moderno e responsivo com integração completa ao WhatsApp via WPPConnect.

## 🚀 Funcionalidades

- **PWA (Progressive Web App)** - Funciona offline e pode ser instalado
- **Autenticação simples** - Login local sem backend
- **Dashboard executivo** - Métricas e visão geral
- **Conexão WhatsApp** - Integração via WPPConnect com QR Code
- **Envio em massa** - Mensagens para múltiplos contatos
- **Design responsivo** - Interface moderna e profissional

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Tailwind CSS** - Estilização moderna
- **Vite** - Build tool otimizada
- **React Router** - Navegação SPA
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones modernos
- **Vite PWA Plugin** - Funcionalidades PWA

## 📦 Instalação

```bash
# Clone o repositório
git clone <seu-repo>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

## ⚙️ Configuração

1. **Configure as Variáveis de Ambiente**:

   **No Bolt Hosting**, vá em Settings → Environment Variables e adicione:
   ```
   VITE_API_BASE=https://seu-backend.railway.app/api
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
   ```


2. **Obter credenciais do Supabase**:
   - Acesse [supabase.com](https://supabase.com) e crie um projeto
   - Vá em Settings > API
   - Copie a URL e a chave anon/public
   - Execute as migrações SQL na aba SQL Editor

3. **Backend WPPConnect** (Hospedagem Pública - SEM setup no PC do usuário):
   
   **Hospedar backend próprio:**
   - Use Render.com, Railway.app ou VPS com HTTPS
   - Configure seu backend com os endpoints:
     - `GET /session/start` - Iniciar sessão e obter QR Code
     - `GET /session/status` - Status da conexão
     - `POST /session/close` - Encerrar sessão
     - `POST /send-message` - Enviar mensagem
     - `POST /send-media` - Enviar mídia
     - `GET /health` - Status do servidor
   - Configure CORS para permitir seu domínio Bolt Hosting

4. **Verificar configuração**: 
   - Acesse `/health` no seu app para diagnosticar problemas
   - Acesse `/whatsapp` para conectar e obter QR Code


## 🌐 Deploy

### Frontend (Netlify)

1. Faça build do projeto:
   ```bash
   npm run build
   ```

2. Faça deploy da pasta `dist` no Netlify

3. Configure as variáveis de ambiente no Netlify

### Backend (Render/Railway)

Configure seu backend Node.js com WPPConnect nos serviços de cloud.

## 📱 PWA

O sistema funciona como PWA e pode ser instalado em dispositivos móveis e desktop.

## 🎨 Design

- **Cores principais**: Azul (#2563eb), Slate (#1e293b)
- **Tema escuro** com gradientes tecnológicos
- **Interface responsiva** para todos os dispositivos
- **Animações suaves** e micro-interações

## 📋 Uso

1. **Login**: Use qualquer email/senha para entrar (demo)
2. **Conectar WhatsApp**: Vá em "Conexão WhatsApp" e escaneie o QR Code
3. **Enviar mensagens**: Use "Envio em Massa" para campanhas

## ⚖️ Conformidade WhatsApp

- **Conexão via QR Code**: Sempre escaneado pelo usuário em seu próprio aparelho
- **Uma sessão por vez**: Conectar em outro local encerra a anterior
- **Consentimento**: Só envie mensagens a quem consentiu (evite ban)
- **Limites**: Respeite limites de envio e pausas automáticas
- **Uso legítimo**: Use apenas seus próprios contatos/conversas

## 🔧 Scripts

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.