import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ToastType, ToastProps } from '../components/ui/Toast';

interface ToastState {
  toasts: ToastProps[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

/**
 * Hook para gerenciar toasts (notificações temporárias)
 * Usa Zustand para estado global
 */
export const useToast = create<ToastState>((set) => ({
  toasts: [],

  /**
   * Adiciona um novo toast
   * @param type - Tipo do toast (success, error, warning, info)
   * @param message - Mensagem a ser exibida
   * @param duration - Duração em ms (padrão: 5000)
   */
  addToast: (type, message, duration = 5000) => {
    const id = uuidv4();
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          type,
          message,
          duration,
          onClose: state.removeToast
        }
      ]
    }));
  },

  /**
   * Remove um toast pelo ID
   * @param id - ID do toast a ser removido
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  },

  /**
   * Atalho para toast de sucesso
   * @param message - Mensagem de sucesso
   * @param duration - Duração em ms
   */
  success: (message, duration) => {
    useToast.getState().addToast('success', message, duration);
  },

  /**
   * Atalho para toast de erro
   * @param message - Mensagem de erro
   * @param duration - Duração em ms
   */
  error: (message, duration) => {
    useToast.getState().addToast('error', message, duration);
  },

  /**
   * Atalho para toast de aviso
   * @param message - Mensagem de aviso
   * @param duration - Duração em ms
   */
  warning: (message, duration) => {
    useToast.getState().addToast('warning', message, duration);
  },

  /**
   * Atalho para toast de informação
   * @param message - Mensagem de informação
   * @param duration - Duração em ms
   */
  info: (message, duration) => {
    useToast.getState().addToast('info', message, duration);
  }
}));
