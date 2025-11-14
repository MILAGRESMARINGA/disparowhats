import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Tamanhos disponíveis para o modal
 */
type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
}

/**
 * Componente Modal reutilizável com overlay e tamanhos configuráveis
 * @param isOpen - Estado de abertura do modal
 * @param onClose - Função chamada ao fechar o modal
 * @param title - Título exibido no header do modal
 * @param children - Conteúdo do modal
 * @param footer - Conteúdo do footer (botões de ação)
 * @param size - Tamanho do modal (sm, md, lg, xl)
 * @param closeOnOverlayClick - Se permite fechar clicando fora do modal
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true
}) => {
  // Bloquear scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fechar modal com tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Não renderizar se não estiver aberto
  if (!isOpen) return null;

  // Classes de tamanho
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  // Handler para click no overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      {/* Modal Container */}
      <div
        className={`${sizeClasses[size]} w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700 bg-slate-700/30">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
