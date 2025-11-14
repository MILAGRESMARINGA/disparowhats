import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './hooks/useAuth';
import { initializeTheme } from './store/uiStore';
import './index.css';

// Inicializar tema antes de renderizar
initializeTheme();

// ⚠️ PWA/Service Worker desativado temporariamente para resolver problemas de publicação

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);