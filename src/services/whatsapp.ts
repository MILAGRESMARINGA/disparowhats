import { http } from './http'
import { apiUrl } from '../config/api'

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

export class WhatsAppService {
  static async startSession(): Promise<SessionStatus> {
    try {
      const response = await fetch(apiUrl('/session/start'));
      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || error.message.includes('timeout')) {
        console.warn('Backend WPPConnect não está disponível');
        return { status: 'DISCONNECTED', message: 'Backend não disponível' };
      }
      console.error('Erro ao iniciar sessão:', error);
      return { status: 'DISCONNECTED', message: 'Falha na conexão' };
    }
  }

  static async getSessionStatus(): Promise<SessionStatus> {
    try {
      const response = await fetch(apiUrl('/session/status'));
      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || error.message.includes('timeout')) {
        console.warn('Backend WPPConnect não está disponível');
        return { status: 'DISCONNECTED', message: 'Backend não disponível' };
      }
      console.error('Erro ao verificar status:', error);
      return { status: 'DISCONNECTED', message: 'Falha na conexão' };
    }
  }

  static async closeSession(): Promise<void> {
    try {
      await fetch(apiUrl('/session/close'), { method: 'POST' });
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || error.message.includes('timeout')) {
        console.warn('Backend não disponível para desconectar');
        return; // Silently fail if backend is not available
      }
      console.error('Erro ao encerrar sessão:', error);
      console.warn('Falha ao desconectar - continuando...');
    }
  }

  static async sendMessage(data: SendMessageRequest): Promise<void> {
    try {
      await fetch(apiUrl('/send-message'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw new Error('Falha ao enviar mensagem');
    }
  }

  static async sendMedia(data: SendMediaRequest): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('phone', data.phone);
      formData.append('media', data.media);
      if (data.caption) {
        formData.append('caption', data.caption);
      }

      await fetch(apiUrl('/send-media'), {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.error('Erro ao enviar mídia:', error);
      throw new Error('Falha ao enviar mídia');
    }
  }

  static async sendBulkMessages(phones: string[], message: string): Promise<void> {
    try {
      const promises = phones.map(phone => 
        this.sendMessage({ phone, message })
      );
      
      // Enviar com delay para evitar spam
      for (let i = 0; i < promises.length; i++) {
        await promises[i];
        if (i < promises.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
        }
      }
    } catch (error) {
      console.error('Erro no envio em massa:', error);
      throw new Error('Falha no envio em massa');
    }
  }

  static async health() {
    try {
      const response = await fetch(apiUrl('/health'));
      const data = await response.json();
      return { ok: true, data };
    } catch (error: any) {
      return { ok: false, error: error?.message ?? 'Erro de rede' };
    }
  }
}