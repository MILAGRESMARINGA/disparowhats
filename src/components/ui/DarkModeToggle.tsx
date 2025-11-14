import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

/**
 * Componente para alternar entre tema claro e escuro
 */
const DarkModeToggle: React.FC = () => {
  const { theme, toggleTheme } = useUIStore();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-14 h-8 bg-slate-700 dark:bg-slate-600 rounded-full transition-colors hover:bg-slate-600 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      aria-label="Alternar modo escuro"
    >
      {/* Slider */}
      <span
        className={`absolute left-1 inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 shadow-lg ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}
      />

      {/* Ícone Sol (esquerda) */}
      <Sun
        className={`absolute left-2 w-4 h-4 transition-opacity ${
          theme === 'light' ? 'text-yellow-500 opacity-100' : 'text-slate-400 opacity-50'
        }`}
      />

      {/* Ícone Lua (direita) */}
      <Moon
        className={`absolute right-2 w-4 h-4 transition-opacity ${
          theme === 'dark' ? 'text-blue-400 opacity-100' : 'text-slate-400 opacity-50'
        }`}
      />
    </button>
  );
};

export default DarkModeToggle;
