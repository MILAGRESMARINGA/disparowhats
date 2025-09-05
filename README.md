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

1. **Configure o Supabase**: Crie um arquivo `.env` na raiz do projeto:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_API_BASE=https://SUA-URL-PUBLICA-DO-BACKEND
   ```

2. **Obter credenciais do Supabase**:
   - Acesse [supabase.com](https://supabase.com) e crie um projeto
   - Vá em Settings > API
   - Copie a URL e a chave anon/public
   - Execute as migrações SQL na aba SQL Editor

3. **Backend WPPConnect**: Certifique-se de que seu backend possui os endpoints:
   - `GET /session/start` - Iniciar sessão e obter QR Code
   - `GET /session/status` - Status da conexão
   - `POST /session/close` - Encerrar sessão
   - `POST /send-message` - Enviar mensagem
   - `POST /send-media` - Enviar mídia

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

## 🔧 Scripts

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.