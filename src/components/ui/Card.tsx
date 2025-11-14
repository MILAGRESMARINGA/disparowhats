import React from 'react';

interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Componente Card reutilizável com header e footer opcionais
 * @param children - Conteúdo principal do card
 * @param header - Conteúdo do header (título, ações)
 * @param footer - Conteúdo do footer (botões, informações extras)
 * @param className - Classes CSS adicionais
 * @param padding - Tamanho do padding interno (none, sm, md, lg)
 * @param hover - Se o card deve ter efeito hover
 * @param onClick - Função chamada ao clicar no card
 */
const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  className = '',
  padding = 'md',
  hover = false,
  onClick
}) => {
  // Classes base do card
  const baseClasses = 'bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 transition-all duration-200';

  // Classes de hover
  const hoverClasses = hover
    ? 'hover:border-slate-600/50 hover:shadow-xl hover:scale-[1.02] cursor-pointer'
    : '';

  // Classes de padding
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      {header && (
        <div className={`border-b border-slate-700/50 ${paddingClasses[padding]} pb-4`}>
          {header}
        </div>
      )}

      {/* Content */}
      <div className={header || footer ? `${paddingClasses[padding]}` : paddingClasses[padding]}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={`border-t border-slate-700/50 ${paddingClasses[padding]} pt-4 bg-slate-700/20`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
