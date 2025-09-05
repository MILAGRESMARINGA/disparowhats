import React, { useEffect, useState } from 'react';
import { 
  Copy, 
  Globe, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Smartphone,
  Info
} from 'lucide-react';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { API_BASE } from '../config/api';

type Health = { 
  endpoint: string; 
  status: 'checking' | 'success' | 'error'; 
  duration?: number; 
  error?: string; 
  response?: any 
};

const HealthCheck: React.FC = () => {
  const [apiUrl, setApiUrl] = useState<string>(API_BASE);
  const [checks, setChecks] = useState<Health[]>([]);
  const [testing, setTesting] = useState(false);

  const endpoints = ['/health', '/session/status', '/session/start'];

  const runHealthCheck = async (endpoint: string): Promise<Health> => {
    const startTime = Date.now();
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        signal: AbortSignal.timeout(8000)
      });
      const duration = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json().catch(() => ({}));
      return { endpoint, status: 'success', response: data, duration };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      let errorMessage = 'Erro desconhecido';
      
      if (error.name === 'TimeoutError') {
        errorMessage = 'Timeout - servidor não respondeu';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de rede - verifique URL e CORS';
      } else {
        errorMessage = error.message;
      }

      return { endpoint, status: 'error', error: errorMessage, duration };
    }
  };

  const runAllChecks = async () => {
    setTesting(true);
    const newChecks: Health[] = [];
    
    for (const endpoint of endpoints) {
      const check = { endpoint, status: 'checking' as const };
      newChecks.push(check);
      setChecks([...newChecks]);
      
      const result = await runHealthCheck(endpoint);
      const index = newChecks.findIndex(c => c.endpoint === endpoint);
      newChecks[index] = result;
      setChecks([...newChecks]);
    }
    
    setTesting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('📋 Copiado para a área de transferência!');
  };

  const getStatusIcon = (status: Health['status']) => {
    switch (status) {
      case 'checking': return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: Health['status']) => {
    switch (status) {
      case 'checking': return 'bg-blue-500/10 border-blue-500/20';
      case 'success': return 'bg-green-500/10 border-green-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
    }
  };

  useEffect(() => {
    runAllChecks();
  }, [apiUrl]);

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
                      <ExternalLinkIcon className="h-4 w-4" />
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

        {/* API Health Checks */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-green-400" />
              <h2 className="text-xl font-bold text-white">Testes de API</h2>
            </div>
            <button
              onClick={runAllChecks}
              disabled={testing}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              {testing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Testando...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Executar Testes</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {endpoints.map((endpoint) => {
              const check = checks.find(c => c.endpoint === endpoint);
              
              return (
                <div key={endpoint} className={`p-4 rounded-xl border ${check ? getStatusColor(check.status) : 'bg-slate-700/30 border-slate-600/30'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {check ? getStatusIcon(check.status) : <Globe className="h-4 w-4 text-slate-400" />}
                      <div>
                        <h3 className="text-white font-medium">{endpoint}</h3>
                        <code className="text-xs text-slate-500">{apiUrl}{endpoint}</code>
                      </div>
                    </div>
                    
                    {check && (
                      <div className="text-right">
                        {check.duration && (
                          <p className="text-slate-400 text-xs">{check.duration}ms</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {check?.error && (
                    <div className="mt-3 bg-red-900/30 rounded-lg p-3">
                      <p className="text-red-400 text-sm">❌ {check.error}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center space-y-4">
          <a
            href="/whatsapp"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            <Smartphone className="h-5 w-5" />
            <span>Ir para Conexão WhatsApp</span>
          </a>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="text-blue-400 font-medium mb-1">Informação</h4>
                <p className="text-blue-300 text-sm">
                  Configure as variáveis de ambiente para conectar com o backend WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;