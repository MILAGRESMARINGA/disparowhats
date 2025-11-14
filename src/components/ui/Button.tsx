import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Variantes disponíveis para o botão
 */
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';

/**
 * Tamanhos disponíveis para o botão
 */
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

/**
 * Componente Button reutilizável com variantes e estados
 * @param variant - Estilo do botão (primary, secondary, danger, ghost, success)
 * @param size - Tamanho do botão (sm, md, lg)
 * @param loading - Estado de carregamento
 * @param fullWidth - Se o botão deve ocupar largura total
 * @param icon - Ícone a ser exibido antes do texto
 * @param children - Conteúdo do botão
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Classes base do botão
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Classes por variante
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600 focus:ring-slate-500 border border-slate-600',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 focus:ring-red-500 shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-700/50 focus:ring-slate-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 focus:ring-green-500 shadow-lg hover:shadow-xl'
  };

  // Classes por tamanho
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg'
  };

  // Classes de largura
  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Carregando...
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
