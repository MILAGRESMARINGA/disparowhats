// src/services/whatsapp.ts
import { apiUrl, apiBaseUrl, DEMO_MODE } from '../config/api';

function withTimeout<T>(p: Promise<T>, ms = 8000) {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then((v) => { clearTimeout(t); resolve(v); })
     .catch((e) => { clearTimeout(t); reject(e); });
  });
}

async function safeFetch(input: RequestInfo | URL, init?: RequestInit) {
  return withTimeout(fetch(input, { ...init, headers: { Accept: 'application/json', ...(init?.headers || {}) } }), 10000);
}

export interface SessionStatus {
  status: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
  qrcode?: string;
  message?: string;
}

export interface SendMessageRequest {
  phone: string;
  message: string;
}

export interface SendMediaRequest {
  phone: string;
  media: File;
  caption?: string;
}

// QR base64 de demonstração (mock) — substitua se quiser outro
export const DEMO_QR =
  'data:image/svg+xml;base64,' +
  btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <rect width="100%" height="100%" fill="#f8fafc"/>
    <rect x="20" y="20" width="216" height="216" fill="none" stroke="#334155" stroke-width="2" rx="8"/>
    <text x="128" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="#475569">QR CODE DEMO</text>
    <text x="128" y="120" text-anchor="middle" font-family="Arial" font-size="12" fill="#64748b">Configure VITE_API_BASE</text>
    <text x="128" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="#64748b">para QR real</text>
    <circle cx="50" cy="50" r="8" fill="#334155"/>
    <circle cx="206" cy="50" r="8" fill="#334155"/>
    <circle cx="50" cy="206" r="8" fill="#334155"/>
    <rect x="70" y="70" width="116" height="116" fill="none" stroke="#334155" stroke-width="1"/>
    <rect x="90" y="90" width="76" height="76" fill="#e2e8f0"/>
  </svg>`);

export class WhatsAppService {
  static async getSessionStatus(): Promise<{ status: string; connected?: boolean } | { demo: true; note: string }> {
    if (!apiBaseUrl) {
      if (DEMO_MODE) return { demo: true, note: 'API não configurada. Modo DEMO ativo.' };
      throw new Error('VITE_API_BASE ausente. Configure em Hosting → Environment.');
    }
    try {
      const res = await safeFetch(apiUrl('/session/status'));
      if (!res.ok) throw new Error(`API ${res.status}`);
      return res.json();
    } catch (e: any) {
      if (DEMO_MODE) return { demo: true, note: 'Falha ao contatar API. Modo DEMO ativo.' };
      throw new Error('Falha ao contatar API. Verifique VITE_API_BASE, CORS e HTTPS.');
    }
  }

  static async startSession(): Promise<{ qrcode?: string; status?: string } | { demo: true; qrcode: string; note: string }> {
    if (!apiBaseUrl) {
      if (DEMO_MODE) {
        return { demo: true, qrcode: DEMO_QR, note: 'API não configurada. Exibindo QR de demonstração.' };
      }
      throw new Error('VITE_API_BASE ausente. Configure em Hosting → Environment.');
    }
    try {
      const res = await safeFetch(apiUrl('/session/start'));
      if (!res.ok) throw new Error(`API ${res.status}`);
      return res.json();
    } catch (e: any) {
      if (DEMO_MODE) {
        return { demo: true, qrcode: DEMO_QR, note: 'Não foi possível acessar a API. QR de demonstração exibido.' };
      }
      throw new Error('Falha ao iniciar sessão. Verifique backend público e CORS.');
    }
  }

  static async closeSession(): Promise<{ ok: boolean } | { demo: true; ok: boolean }> {
    if (!apiBaseUrl) return DEMO_MODE ? { demo: true, ok: true } : Promise.reject(new Error('VITE_API_BASE ausente.'));
    try {
      const res = await safeFetch(apiUrl('/session/close'), { method: 'POST' });
      if (!res.ok) throw new Error(`API ${res.status}`);
      return { ok: true };
    } catch {
      return DEMO_MODE ? { demo: true, ok: true } : Promise.reject(new Error('Falha ao encerrar sessão.'));
    }
  }

  static async sendMessage(data: SendMessageRequest): Promise<void> {
    if (!apiBaseUrl) {
      if (DEMO_MODE) {
        console.log('DEMO: Enviando mensagem para', data.phone, ':', data.message);
        return;
      }
      throw new Error('VITE_API_BASE ausente.');
    }
    
    try {
      const res = await safeFetch(apiUrl('/send-message'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) throw new Error(`API ${res.status}`);
    } catch (error) {
      if (DEMO_MODE) {
        console.log('DEMO: Simulando envio de mensagem para', data.phone);
        return;
      }
      console.error('Erro ao enviar mensagem:', error);
      throw new Error('Falha ao enviar mensagem');
    }
  }

  static async sendMedia(data: SendMediaRequest): Promise<void> {
    if (!apiBaseUrl) {
      if (DEMO_MODE) {
        console.log('DEMO: Enviando mídia para', data.phone);
        return;
      }
      throw new Error('VITE_API_BASE ausente.');
    }
    
    try {
      const formData = new FormData();
      formData.append('phone', data.phone);
      formData.append('media', data.media);
      if (data.caption) {
        formData.append('caption', data.caption);
      }

      const res = await safeFetch(apiUrl('/send-media'), {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error(`API ${res.status}`);
    } catch (error) {
      if (DEMO_MODE) {
        console.log('DEMO: Simulando envio de mídia para', data.phone);
        return;
      }
      console.error('Erro ao enviar mídia:', error);
      throw new Error('Falha ao enviar mídia');
    }
  }

  static async health() {
    if (!apiBaseUrl) {
      return { ok: false, error: 'VITE_API_BASE não configurada' };
    }
    
    try {
      const response = await safeFetch(apiUrl('/health'));
      const data = await response.json();
      return { ok: true, data };
    } catch (error: any) {
      return { ok: false, error: error?.message ?? 'Erro de rede' };
    }
  }
}