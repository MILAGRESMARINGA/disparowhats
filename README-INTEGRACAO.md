# Integração

## 1) WhatsApp backend (WPPConnect/Express)
- Exponha sua API e coloque a URL em `VITE_API_BASE`.
- Endpoints esperados:
  - GET `/health`
  - GET `/session/status`
  - GET `/session/start` → retorna `{ qrcode: <dataURI> }`
  - POST `/send-message` → `{ to, message }`

## 2) Supabase (auth real)
- Crie projeto e pegue `url` e `anon key`.
- Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

## 3) Sem variáveis?
- App roda em **modo DEMO**:
  - Login funciona com qualquer e-mail/senha
  - QRCode simulado para testes

## 4) Publicação no Bolt Hosting
1. Vá em Settings → Environment Variables
2. Adicione as 3 variáveis com valores reais
3. Clique em Deploy para republicar

## ✅ O que isso resolve
- **Login travado/400**: modo DEMO quando Supabase não configurado
- **"Failed to fetch"**: fallback seguro para API indisponível
- **QR Code**: QR simulado quando backend offline
- **Export errors**: páginas com export default garantido
- **Import duplicado**: imports limpos e organizados