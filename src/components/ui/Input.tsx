import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

/**
 * Componente Input reutilizável com label, validação e ícone opcional
 * @param label - Texto do label acima do input
 * @param error - Mensagem de erro de validação
 * @param helperText - Texto de ajuda abaixo do input
 * @param icon - Ícone a ser exibido dentro do input
 * @param required - Se o campo é obrigatório (adiciona *)
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  required,
  className = '',
  ...props
}) => {
  // Classes base do input
  const baseClasses = 'w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200';

  // Classes condicionais baseadas no estado de erro
  const errorClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-slate-600/50 focus:ring-blue-500 focus:border-blue-500 hover:bg-slate-700/70';

  // Classes para input com ícone
  const iconClasses = icon ? 'pl-12' : '';

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input container */}
      <div className="relative group">
        {/* Ícone */}
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          className={`${baseClasses} ${errorClasses} ${iconClasses} ${className}`}
          {...props}
        />

        {/* Ícone de erro */}
        {error && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400">
            <AlertCircle className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="text-sm text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
