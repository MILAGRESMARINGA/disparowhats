// src/hooks/useWhatsAppConnection.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { WhatsAppService } from '../services/whatsapp';

export function useWhatsAppConnection() {
  const [status, setStatus] = useState<'desconectado'|'aguardando'|'conectado'|'erro'|'demo'>('desconectado');
  const [qrcode, setQrcode] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const timer = useRef<number | null>(null);

  const clearTimer = () => { 
    if (timer.current) { 
      window.clearInterval(timer.current); 
      timer.current = null; 
    } 
  };

  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await WhatsAppService.getSessionStatus();
      
      if (res?.demo) {
        setStatus('demo'); 
        setMessage(res?.note || 'DEMO'); 
        setQrcode(null);
        return;
      }
      
      if (res?.connected || res?.status === 'CONNECTED') {
        setStatus('conectado'); 
        setMessage('Conectado ✅'); 
        setQrcode(null);
      } else {
        setStatus('desconectado'); 
        setMessage('Desconectado'); 
        setQrcode(null);
      }
    } catch (error) {
      setStatus('erro');
      setMessage(error instanceof Error ? error.message : 'Erro desconhecido');
      setQrcode(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const start = useCallback(async () => {
    try {
      setLoading(true);
      setStatus('aguardando'); 
      setMessage('Gerando QR Code...');
      
      const res: any = await WhatsAppService.startSession();
      
      if (res?.demo) {
        setStatus('demo'); 
        setQrcode(res.qrcode); 
        setMessage(res.note || 'DEMO');
        return;
      }
      
      if (res?.qrcode) {
        const qrData = res.qrcode.startsWith('data:') ? res.qrcode : `data:image/png;base64,${res.qrcode}`;
        setQrcode(qrData);
        setStatus('aguardando'); 
        setMessage('Escaneie o QR com o WhatsApp.');
        
        // Start polling for connection
        clearTimer();
        timer.current = window.setInterval(async () => {
          try {
            const statusRes: any = await WhatsAppService.getSessionStatus();
            if (statusRes?.connected || statusRes?.status === 'CONNECTED') {
              setStatus('conectado');
              setMessage('Conectado ✅');
              setQrcode(null);
              clearTimer();
            }
          } catch (error) {
            console.error('Erro ao verificar status:', error);
          }
        }, 3000);
        
      } else if (res?.status === 'CONNECTED') {
        setStatus('conectado'); 
        setQrcode(null); 
        setMessage('Conectado ✅');
      } else {
        setStatus('erro'); 
        setMessage('Não foi possível gerar QR.');
      }
    } catch (error) {
      setStatus('erro');
      setMessage(error instanceof Error ? error.message : 'Erro ao iniciar sessão');
    } finally {
      setLoading(false);
    }
  }, []);

  const stop = useCallback(async () => {
    try {
      setLoading(true);
      await WhatsAppService.closeSession();
      setStatus('desconectado'); 
      setQrcode(null); 
      setMessage('Sessão encerrada');
      clearTimer();
    } catch (error) {
      setMessage('Erro ao encerrar sessão');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
    return () => clearTimer();
  }, [checkStatus]);

  return { 
    status, 
    qrcode, 
    message, 
    loading,
    start, 
    stop, 
    refresh: checkStatus 
  };
}