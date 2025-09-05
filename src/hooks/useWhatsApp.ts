import { useState } from 'react';
import { Contact } from '../types';

// URL da API WPPConnect - ajuste conforme necessário
export const API_BASE_URL = 'http://localhost:3333/api';

export const useWhatsApp = () => {
  const [sending, setSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionLoading, setConnectionLoading] = useState(false);

  const fetchConnectionStatus = async () => {
    try {
      setConnectionLoading(true);
      setConnectionError(null);
      
      const response = await fetch(`${API_BASE_URL}/session/start`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'CONNECTED') {
        setConnectionStatus('connected');
        setQrCode(null);
      } else if (data.qrcode) {
        setConnectionStatus('connecting');
        setQrCode(data.qrcode);
      } else {
        setConnectionStatus('disconnected');
        setQrCode(null);
      }
    } catch (error) {
      console.error('Erro ao conectar à API WPPConnect:', error);
      setConnectionError(error instanceof Error ? error.message : 'Erro desconhecido');
      setConnectionStatus('disconnected');
      setQrCode(null);
    } finally {
      setConnectionLoading(false);
    }
  };

  const startSession = async () => {
    await fetchConnectionStatus();
    
    // Se ainda estiver conectando, verificar status periodicamente
    if (connectionStatus === 'connecting') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/session/status`);
          const data = await response.json();
          
          if (data.status === 'CONNECTED') {
            setConnectionStatus('connected');
            setQrCode(null);
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
        }
      }, 3000);

      // Limpar interval após 5 minutos
      setTimeout(() => clearInterval(interval), 300000);
    }
  };

  const closeSession = async () => {
    try {
      setConnectionLoading(true);
      await fetch(`${API_BASE_URL}/session/close`, {
        method: 'POST',
      });
      
      setConnectionStatus('disconnected');
      setQrCode(null);
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      setConnectionError('Erro ao desconectar');
    } finally {
      setConnectionLoading(false);
    }
  };

  // Legacy connect function for backward compatibility
  const connect = async () => {
    setConnectionStatus('connecting');
    
    try {
      const response = await fetch(`${API_BASE_URL}/session/start`);
      const data = await response.json();
      
      if (data.status === 'CONNECTED') {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('connecting');
      }
    } catch (error) {
      console.error('Erro ao conectar:', error);
      setConnectionStatus('disconnected');
    }
  };

  const disconnect = async () => {
    try {
      await fetch(`${API_BASE_URL}/session/close`, {
        method: 'POST',
      });
      setConnectionStatus('disconnected');
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      setConnectionStatus('disconnected');
    }
  };

  // Envia mensagem real via WPPConnect
  const sendMessage = async (
    contact: Contact, 
    message: string, 
    media?: { file: File; type: 'image' | 'video'; caption: string }
  ): Promise<boolean> => {
    if (connectionStatus !== 'connected') {
      throw new Error('WhatsApp não conectado');
    }

    setSending(true);
    
    try {
      // Chamada real para API do backend
      if (media) {
        // Envio real de mídia
        const formData = new FormData();
        formData.append('phone', contact.phone);
        formData.append('media', media.file);
        formData.append('type', media.type);
        formData.append('caption', media.caption);

        const response = await fetch(`${API_BASE_URL}/send-media`, {
          method: 'POST',
          body: formData,
        });

        console.log('Enviando mídia para:', contact.phone);
        console.log('Tipo:', media.type);
        console.log('Arquivo:', media.file.name);
        console.log('Legenda:', media.caption);
      } else {
        // Envio real de mensagem de texto
        const response = await fetch(`${API_BASE_URL}/send-message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: contact.phone,
            message: message,
          }),
        });

        console.log('Enviando mensagem para:', contact.phone);
        console.log('Mensagem:', message);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Resposta da API:', result);
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return false;
    } finally {
      setSending(false);
    }
  };

  const sendBulkMessages = async (
    contacts: Contact[], 
    message: string, 
    media?: { file: File; type: 'image' | 'video'; caption: string }
  ) => {
    const results = [];
    
    for (const contact of contacts) {
      try {
        const success = await sendMessage(contact, message, media);
        results.push({ contact, success });
        // Delay entre mensagens para evitar spam
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        results.push({ contact, success: false, error });
      }
    }
    
    return results;
  };

  return {
    sending,
    connectionStatus,
    qrCode,
    connectionError,
    connectionLoading,
    fetchConnectionStatus,
    startSession,
    closeSession,
    connect,
    disconnect,
    sendMessage,
    sendBulkMessages,
  };
};