import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Send,
  Calendar,
  Settings,
  LogOut,
  Sparkles,
  Trello,
  CheckCircle
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuth } from '../../hooks/useAuth';
import DarkModeToggle from '../ui/DarkModeToggle';

/**
 * Item de navegação da sidebar
 */
interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

/**
 * Componente Sidebar com navegação principal
 */
const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { logout } = useAuth();

  // Itens de navegação
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      label: 'Contatos',
      path: '/contacts',
      icon: <Users className="w-5 h-5" />
    },
    {
      label: 'Pipeline',
      path: '/kanban',
      icon: <Trello className="w-5 h-5" />
    },
    {
      label: 'Mensagens',
      path: '/messages',
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      label: 'Envio em Massa',
      path: '/send-mass',
      icon: <Send className="w-5 h-5" />
    },
    {
      label: 'Agenda',
      path: '/agenda',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      label: 'Extração IA',
      path: '/diagnostics',
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      label: 'Diagnósticos',
      path: '/health',
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  /**
   * Verifica se o item está ativo
   */
  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-900 dark:bg-slate-950 border-r border-slate-700/50 dark:border-slate-800/50 z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-72`}
      >
        {/* Logo/Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-700/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">CRM Pro</h1>
              <p className="text-xs text-slate-400">WhatsApp Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-900'
              }`}
            >
              <span
                className={`${
                  isActive(item.path)
                    ? 'text-blue-400'
                    : 'text-slate-500 group-hover:text-blue-400'
                } transition-colors`}
              >
                {item.icon}
              </span>
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 dark:border-slate-800/50 space-y-3">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-4">
            <span className="text-sm text-slate-400">Tema</span>
            <DarkModeToggle />
          </div>

          {/* Settings */}
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-900 transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
