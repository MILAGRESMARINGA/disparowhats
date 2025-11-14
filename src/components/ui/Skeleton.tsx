import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

/**
 * Componente Skeleton para estados de loading
 * @param variant - Tipo do skeleton (text, circular, rectangular)
 * @param width - Largura customizada
 * @param height - Altura customizada
 * @param count - Número de skeletons a renderizar
 * @param className - Classes CSS adicionais
 */
const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  count = 1
}) => {
  // Classes base
  const baseClasses = 'animate-pulse bg-slate-700/30 dark:bg-slate-600/30';

  // Classes por variante
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl'
  };

  // Estilo inline
  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined
  };

  // Renderizar múltiplos skeletons se count > 1
  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

/**
 * Skeleton pré-configurado para cards de contato
 */
export const ContactCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-800/50 dark:bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Skeleton variant="circular" width={48} height={48} />

        <div className="flex-1 space-y-3">
          {/* Nome */}
          <Skeleton width="60%" height={20} />

          {/* Telefone */}
          <Skeleton width="40%" height={16} />

          {/* Tags */}
          <div className="flex gap-2">
            <Skeleton width={60} height={24} />
            <Skeleton width={80} height={24} />
          </div>
        </div>

        {/* Badge status */}
        <Skeleton width={100} height={28} />
      </div>
    </div>
  );
};

/**
 * Skeleton pré-configurado para tabela
 */
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 bg-slate-800/50 dark:bg-slate-800/30 rounded-xl"
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton width="25%" height={16} />
          <Skeleton width="20%" height={16} />
          <Skeleton width="15%" height={16} />
          <Skeleton width="10%" height={16} />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton pré-configurado para dashboard stats
 */
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-800/50 dark:bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton width={60} height={24} />
      </div>
      <Skeleton width="40%" height={32} className="mb-2" />
      <Skeleton width="60%" height={16} />
    </div>
  );
};

export default Skeleton;
