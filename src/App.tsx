import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/ui/Toast';
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
import HealthCheck from './pages/HealthCheck';

function App() {
  const { user, loading } = useAuth();
  const { toasts, removeToast } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {/* Toast Container Global */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <Routes>
        {user ? (
          <>
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
            <Route path="/health" element={<HealthCheck />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<SignUp />} />
            <Route path="/recuperar-senha" element={<ForgotPassword />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/health" element={<HealthCheck />} />
            <Route path="/whatsapp" element={<WhatsApp />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;