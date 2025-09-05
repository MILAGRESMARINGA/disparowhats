import { API_BASE } from '../config/api';

const DEMO_QR_SVG =
  `data:image/svg+xml;base64,` +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280">
      <rect width="100%" height="100%" fill="#fff"/>
      <rect x="20" y="20" width="240" height="240" fill="none" stroke="#333" stroke-width="2" rx="8"/>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" fill="#111" font-size="16" font-family="Arial">QR CODE DEMO</text>
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="12" font-family="Arial">Configure VITE_API_BASE</text>
      <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="12" font-family="Arial">para QR real</text>
      <circle cx="60" cy="60" r="8" fill="#333"/>
      <circle cx="220" cy="60" r="8" fill="#333"/>
      <circle cx="60" cy="220" r="8" fill="#333"/>
      <rect x="100" y="100" width="80" height="80" fill="none" stroke="#333" stroke-width="1"/>
    </svg>`
  );

export const WhatsAppService = {
  async getSessionStatus() {
    try {
      const r = await fetch(`${API_BASE}/session/status`, { 
        credentials: 'omit',
        signal: AbortSignal.timeout(8000)
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (error) {
      console.warn('WhatsApp API não disponível, usando modo demo');
      return { status: 'DISCONNECTED', demo: true };
    }
  },

  async startSession() {
    try {
      const r = await fetch(`${API_BASE}/session/start`, {
        signal: AbortSignal.timeout(10000)
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json(); // deve vir {qrcode: base64...}
    } catch (error) {
      console.warn('WhatsApp API não disponível, retornando QR demo');
      return { qrcode: DEMO_QR_SVG, demo: true };
    }
  },

  async closeSession() {
    try {
      const r = await fetch(`${API_BASE}/session/close`, {
        method: 'POST',
        signal: AbortSignal.timeout(5000)
      });
      return { ok: r.ok };
    } catch (error) {
      console.warn('Erro ao encerrar sessão:', error);
      return { ok: true, demo: true };
    }
  },

  async sendMessage(to: string, message: string) {
    try {
      const r = await fetch(`${API_BASE}/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message }),
        signal: AbortSignal.timeout(10000)
      });
      return await r.json();
    } catch (error) {
      console.warn('Simulando envio de mensagem em modo demo');
      return { ok: true, demo: true, to, message };
    }
  },

  async health() {
    if (!API_BASE) {
      return { ok: false, error: 'VITE_API_BASE não configurada' };
    }
    
    try {
      const response = await fetch(`${API_BASE}/health`, {
        signal: AbortSignal.timeout(8000)
      });
      const data = await response.json();
      return { ok: true, data };
    } catch (error: any) {
      return { ok: false, error: error?.message ?? 'Erro de rede' };
    }
  }
};