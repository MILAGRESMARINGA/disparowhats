import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { useCRMStore } from '../../store/useCRMStore';

/**
 * Componente Header com busca e notificações
 */
const Header: React.FC = () => {
  const { toggleSidebar } = useUIStore();
  const { user } = useAuth();
  const { contacts } = useCRMStore();

  // Calcular notificações (aniversariantes + inativos)
  const today = new Date();
  const todayStr = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today
    .getDate()
    .toString()
    .padStart(2, '0')}`;

  const birthdaysToday = contacts.filter((c) => c.aniversario === todayStr).length;

  const inactiveContacts = contacts.filter((c) => {
    const lastContact = new Date(c.ultimoContato);
    const diffDays = Math.floor((today.getTime() - lastContact.getTime()) / 86400000);
    return diffDays > 7;
  }).length;

  const totalNotifications = birthdaysToday + inactiveContacts;

  return (
    <header className="h-20 bg-slate-900/50 dark:bg-slate-950/50 backdrop-blur-xl border-b border-slate-700/50 dark:border-slate-800/50 sticky top-0 z-30">
      <div className="h-full max-w-[1920px] mx-auto px-6 flex items-center justify-between gap-4">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar contatos, mensagens..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-800/50 dark:bg-slate-900/50 border border-slate-700/50 dark:border-slate-800/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-900 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalNotifications > 9 ? '9+' : totalNotifications}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 dark:bg-slate-900/50 rounded-xl border border-slate-700/50 dark:border-slate-800/50">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">
                {user?.username || 'Admin'}
              </p>
              <p className="text-xs text-slate-400">
                {contacts.length} contatos
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
