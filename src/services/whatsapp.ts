import { API_BASE } from '../config/api';


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
      throw new Error('WhatsApp API não disponível. Verifique a configuração do backend.');
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
      throw new Error('Falha ao iniciar sessão WhatsApp. Verifique se o backend está configurado.');
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
      throw new Error('Erro ao encerrar sessão WhatsApp');
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
      throw new Error('Falha ao enviar mensagem. Verifique a conexão WhatsApp.');
    }
  },

  async health() {
    try {
      const response = await fetch(`${API_BASE}/health`, {
        signal: AbortSignal.timeout(8000)
      });
      const data = await response.json();
      return { ok: true, data };
    } catch (error: any) {
      throw new Error(error?.message ?? 'Backend WhatsApp não disponível');
    }
  }
};