import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Tipos de toast disponíveis
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

/**
 * Componente Toast para notificações temporárias
 * @param id - ID único do toast
 * @param type - Tipo do toast (success, error, warning, info)
 * @param message - Mensagem a ser exibida
 * @param duration - Duração em ms antes de fechar automaticamente
 * @param onClose - Callback ao fechar o toast
 */
const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 5000,
  onClose
}) => {
  // Fechar automaticamente após duração
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  // Configurações por tipo
  const config = {
    success: {
      icon: CheckCircle,
      bgClass: 'bg-green-500/10 border-green-500/30',
      iconClass: 'text-green-400',
      textClass: 'text-green-100'
    },
    error: {
      icon: XCircle,
      bgClass: 'bg-red-500/10 border-red-500/30',
      iconClass: 'text-red-400',
      textClass: 'text-red-100'
    },
    warning: {
      icon: AlertCircle,
      bgClass: 'bg-yellow-500/10 border-yellow-500/30',
      iconClass: 'text-yellow-400',
      textClass: 'text-yellow-100'
    },
    info: {
      icon: Info,
      bgClass: 'bg-blue-500/10 border-blue-500/30',
      iconClass: 'text-blue-400',
      textClass: 'text-blue-100'
    }
  };

  const { icon: Icon, bgClass, iconClass, textClass } = config[type];

  return (
    <div
      className={`${bgClass} border rounded-xl p-4 shadow-lg backdrop-blur-xl animate-in slide-in-from-right duration-300 max-w-md`}
    >
      <div className="flex items-start gap-3">
        {/* Ícone */}
        <Icon className={`h-5 w-5 ${iconClass} flex-shrink-0 mt-0.5`} />

        {/* Mensagem */}
        <p className={`flex-1 text-sm font-medium ${textClass}`}>
          {message}
        </p>

        {/* Botão fechar */}
        <button
          onClick={() => onClose(id)}
          className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
          aria-label="Fechar notificação"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Barra de progresso */}
      <div className="mt-2 h-1 bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${iconClass.replace('text-', 'bg-')} animate-progress`}
          style={{
            animation: `progress ${duration}ms linear`
          }}
        />
      </div>
    </div>
  );
};

/**
 * Container de Toasts posicionado no canto superior direito
 */
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default Toast;
