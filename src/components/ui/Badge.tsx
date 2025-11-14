import React from 'react';
import { ContactStatus, ContactPriority } from '../../types/crm';
import { CONTACT_STATUS, CONTACT_PRIORITY } from '../../utils/constants';

/**
 * Variantes de badge
 */
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Componente Badge para exibir status, tags e categorias
 * @param variant - Cor do badge (default, success, warning, error, info)
 * @param size - Tamanho do badge (sm, md, lg)
 * @param icon - Ícone opcional a esquerda do texto
 * @param children - Conteúdo do badge
 */
const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon
}) => {
  // Classes base
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full border transition-colors';

  // Classes por variante
  const variantClasses = {
    default: 'bg-slate-700/30 text-slate-300 border-slate-600/50',
    success: 'bg-green-500/10 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/10 text-red-400 border-red-500/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  };

  // Classes por tamanho
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};

/**
 * Badge específico para Status de Contato
 */
export const StatusBadge: React.FC<{ status: ContactStatus }> = ({ status }) => {
  const config = CONTACT_STATUS[status];

  const variantMap: Record<ContactStatus, BadgeVariant> = {
    novo: 'info',
    negociacao: 'warning',
    proposta: 'warning',
    fechado: 'success',
    perdido: 'error'
  };

  return (
    <Badge variant={variantMap[status]} size="md">
      {config.label}
    </Badge>
  );
};

/**
 * Badge específico para Prioridade de Contato
 */
export const PriorityBadge: React.FC<{ priority: ContactPriority }> = ({ priority }) => {
  const config = CONTACT_PRIORITY[priority];

  const variantMap: Record<ContactPriority, BadgeVariant> = {
    alta: 'error',
    media: 'warning',
    baixa: 'success'
  };

  return (
    <Badge variant={variantMap[priority]} size="sm" icon={config.icon}>
      {config.label}
    </Badge>
  );
};

/**
 * Badge para Tags genéricas
 */
export const TagBadge: React.FC<{ tag: string; onRemove?: () => void }> = ({ tag, onRemove }) => {
  return (
    <Badge variant="default" size="sm">
      {tag}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 hover:text-red-400 transition-colors"
          aria-label={`Remover tag ${tag}`}
        >
          ×
        </button>
      )}
    </Badge>
  );
};

export default Badge;
