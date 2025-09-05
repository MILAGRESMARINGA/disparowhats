import React, { useEffect, useState } from 'react';
import { apiUrl, apiBaseUrl } from '../config/api';
import { supabase } from '../lib/supabase';
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Server, 
  Database,
  Globe,
  Settings,
  Copy,
  ExternalLink,
  Smartphone,
  Zap,
  ExternalLink,
  Copy,
  Save,
  TestTube
} from 'lucide-react';

interface HealthCheck {
  endpoint: string;
  status: 'checking' | 'success' | 'error';
  response?: any;
  error?: string;
  duration?: number;
}

const HealthCheck: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem('custom_api_url') || 
    import.meta.env.VITE_API_BASE || 
    'https://seu-backend.onrender.com'
  );
  const [tempApiUrl, setTempApiUrl] = useState(apiUrl);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [testing, setTesting] = useState(false);
  const [testPhone, setTestPhone] = useState('5511999887766');
  const [testMessage, setTestMessage] = useState('🤖 Teste do CRM WhatsApp Pro - ' + new Date().toLocaleTimeString());

  const endpoints = [
    { path: '/health', name: 'Health Check', description: 'Verifica se o servidor está online' },
    { path: '/session/status', name: 'WhatsApp Status', description: 'Status da conexão WhatsApp' },
    { path: '/session/start', name: 'Session Start', description: 'Iniciar sessão WhatsApp' }
  ];

  useEffect(() => {
    if (apiUrl !== import.meta.env.VITE_API_BASE) {
      localStorage.setItem('custom_api_url', apiUrl);
    }
  }, [apiUrl]);

  const runHealthCheck = async (endpoint: string): Promise<HealthCheck> => {
    const startTime = Date.now();
    const fullUrl = `${apiUrl}${endpoint}`;
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      const duration = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        endpoint,
        status: 'success',
        response: data,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      let errorMessage = 'Erro desconhecido';
      if (error.name === 'TimeoutError') {
        errorMessage = 'Timeout - servidor não respondeu em 10s';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Erro de rede - verifique a URL e CORS';
      } else if (error.message.includes('ERR_NETWORK')) {
        errorMessage = 'Erro de conexão - backend pode estar offline';
      } else {
        errorMessage = error.message;
      }

      return {
        endpoint,
        status: 'error',
        error: errorMessage,
        duration
      };
    }
  };

  const runAllChecks = async () => {
    setTesting(true);
    const checks: HealthCheck[] = [];
    
    for (const endpoint of endpoints) {
      const check = { ...endpoint, endpoint: endpoint.path, status: 'checking' as const };
      checks.push(check);
      setHealthChecks([...checks]);
      
      const result = await runHealthCheck(endpoint.path);
      const index = checks.findIndex(c => c.endpoint === endpoint.path);
      checks[index] = result;
      setHealthChecks([...checks]);
    }
    
    setTesting(false);
  };

  const testSendMessage = async () => {
    if (!testPhone || !testMessage) {
      alert('Preencha telefone e mensagem para teste');
      return;
    }

    setTesting(true);
    
    try {
      const response = await fetch(`${apiUrl}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testPhone,
          message: testMessage
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('✅ Mensagem enviada com sucesso!\n\n' + JSON.stringify(result, null, 2));
      } else {
        alert('❌ Erro no envio:\n\n' + JSON.stringify(result, null, 2));
      }
    } catch (error: any) {
      alert('❌ Erro de conexão:\n\n' + error.message);
    } finally {
      setTesting(false);
    }
  };

  const saveApiUrl = () => {
    setApiUrl(tempApiUrl);
    alert('✅ URL da API salva! Execute os testes novamente.');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('📋 Copiado para a área de transferência!');
  };

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'checking': return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: HealthCheck['status']) => {
    switch (status) {
      case 'checking': return 'bg-blue-500/10 border-blue-500/20';
      case 'success': return 'bg-green-500/10 border-green-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Health Check</h1>
          <p className="text-slate-400">Diagnóstico do sistema e variáveis de ambiente</p>
        </div>

        {/* Environment Variables */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Variáveis de Ambiente</h2>
          </div>
          
          <div className="space-y-3">
            <div className={`p-4 rounded-xl border ${import.meta.env.VITE_API_BASE ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">VITE_API_BASE</p>
                  <p className={`text-sm ${import.meta.env.VITE_API_BASE ? 'text-green-400' : 'text-red-400'}`}>
                    {import.meta.env.VITE_API_BASE || 'não definida'}
                  </p>
                </div>
                {import.meta.env.VITE_API_BASE && (
                  <button
                    onClick={() => copyToClipboard(import.meta.env.VITE_API_BASE)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${import.meta.env.VITE_SUPABASE_URL ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">VITE_SUPABASE_URL</p>
                  <p className={`text-sm ${import.meta.env.VITE_SUPABASE_URL ? 'text-green-400' : 'text-red-400'}`}>
                    {import.meta.env.VITE_SUPABASE_URL || 'não definida'}
                  </p>
                </div>
                {import.meta.env.VITE_SUPABASE_URL && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(import.meta.env.VITE_SUPABASE_URL)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={import.meta.env.VITE_SUPABASE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">VITE_SUPABASE_ANON_KEY</p>
                  <p className={`text-sm ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-400' : 'text-red-400'}`}>
                    {import.meta.env.VITE_SUPABASE_ANON_KEY ? '*** definido ***' : 'não definida'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Test */}
        <div className="text-center">
          <a
            href="/whatsapp"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            <Smartphone className="h-5 w-5" />
            <span>Ir para Conexão WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;