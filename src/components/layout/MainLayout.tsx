import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal da aplicação
 * Contém Sidebar + Header + Conteúdo
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
