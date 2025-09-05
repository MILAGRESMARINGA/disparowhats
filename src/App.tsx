import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import EnvBanner from './components/EnvBanner';
import StatusPage from './pages/Status';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import WhatsApp from './pages/WhatsApp';
import SendMass from './pages/SendMass';
import Contacts from './pages/Contacts';
import Profile from './pages/Profile';
import Agenda from './pages/Agenda';
import Kanban from './pages/Kanban';
import Messages from './pages/Messages';
import EnvStatus from './pages/EnvStatus';
import Diagnostics from './pages/Diagnostics';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <EnvBanner />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando CRM...</p>
        </div>
      </div>
    );
  }

  console.log('App render - user:', user, 'loading:', loading, 'isAuthenticated:', !!user);

  return (
    <Router>
      <EnvBanner />
      <Routes>
        {user ? (
          <>
            {console.log('🏠 Renderizando rotas autenticadas para:', user.name)}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/whatsapp" element={<WhatsApp />} />
            <Route path="/send-mass" element={<SendMass />} />
            <Route path="/mass-send" element={<SendMass />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<WhatsApp />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/env" element={<EnvStatus />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {console.log('🔐 Renderizando tela de login')}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<SignUp />} />
            <Route path="/recuperar-senha" element={<ForgotPassword />} />
            <Route path="/cadastro" element={<SignUp />} />
            <Route path="/recuperar-senha" element={<ForgotPassword />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;