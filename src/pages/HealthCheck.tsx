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
  Smartphone
} from 'lucide-react';

export default function HealthCheck() {
  const [apiOk, setApiOk] = useState<'pending'|'ok'|'fail'>('pending');
  const [apiMsg, setApiMsg] = useState('');
  const [supabaseOk, setSupabaseOk] = useState<'pending'|'ok'|'fail'>('pending');
  const [supabaseMsg, setSupabaseMsg] = useState('');
  
  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const apiBase = import.meta.env.VITE_API_BASE;
  const supaKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    const pingAPI = async () => {
      try {
        const res = await fetch(apiUrl('/health'), { 
          method: 'GET',
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        if (res.ok) {
          const data = await res.json();
          setApiOk('ok');
          setApiMsg(`API está respondendo 👍 - ${JSON.stringify(data)}`);
        } else {
          setApiOk('fail');
          setApiMsg(`API respondeu com status ${res.status}`);
        }
      } catch (e: any) {
        setApiOk('fail');
        if (e.name === 'TimeoutError') {
          setApiMsg('Timeout - API não respondeu em 10s');
        } else if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
          setApiMsg('Erro de rede - verifique CORS e URL da API');
        } else {
          setApiMsg(`Erro de rede: ${e?.message || e}`);
        }
      }
    };

    const pingSupabase = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setSupabaseOk('fail');
          setSupabaseMsg(`Erro Supabase: ${error.message}`);
        } else {
          setSupabaseOk('ok');
          setSupabaseMsg('Supabase conectado 👍');
        }
      } catch (e: any) {
        setSupabaseOk('fail');
        setSupabaseMsg(`Erro de conexão: ${e?.message || e}`);
      }
    };

    pingAPI();
    pingSupabase();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('📋 Copiado para a área de transferência!');
  };

  const getStatusIcon = (status: 'pending'|'ok'|'fail') => {
    switch (status) {
      case 'pending': return <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />;
      case 'ok': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'fail': return <AlertCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const getStatusColor = (status: 'pending'|'ok'|'fail') => {
    switch (status) {
      case 'pending': return 'bg-blue-500/10 border-blue-500/20';
      case 'ok': return 'bg-green-500/10 border-green-500/20';
      case 'fail': return 'bg-red-500/10 border-red-500/20';
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
            <div className={`p-4 rounded-xl border ${apiBase ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">VITE_API_BASE</p>
                  <p className={`text-sm ${apiBase ? 'text-green-400' : 'text-red-400'}`}>
                    {apiBase || 'não definida'}
                  </p>
                </div>
                {apiBase && (
                  <button
                    onClick={() => copyToClipboard(apiBase)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${supaUrl ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">VITE_SUPABASE_URL</p>
                  <p className={`text-sm ${supaUrl ? 'text-green-400' : 'text-red-400'}`}>
                    {supaUrl || 'não definida'}
                  </p>
                </div>
                {supaUrl && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(supaUrl)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={supaUrl}
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

            <div className={`p-4 rounded-xl border ${supaKey ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">VITE_SUPABASE_ANON_KEY</p>
                  <p className={`text-sm ${supaKey ? 'text-green-400' : 'text-red-400'}`}>
                    {supaKey ? '*** definido ***' : 'não definida'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50`}>
          <div className="flex items-center space-x-3 mb-4">
            <Server className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Status da API</h2>
          </div>
          
          <div className={`p-4 rounded-xl border ${getStatusColor(apiOk)}`}>
            <div className="flex items-center space-x-3">
              {getStatusIcon(apiOk)}
              <div className="flex-1">
                <p className="text-white font-medium">
                  Backend WhatsApp: {apiOk === 'pending' ? 'Testando...' : apiOk === 'ok' ? 'Online' : 'Offline'}
                </p>
                <p className="text-sm text-slate-300">{apiMsg}</p>
                <p className="text-xs text-slate-500 mt-1">
                  URL: {apiBase || 'não configurada'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Supabase Status */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Status do Supabase</h2>
          </div>
          
          <div className={`p-4 rounded-xl border ${getStatusColor(supabaseOk)}`}>
            <div className="flex items-center space-x-3">
              {getStatusIcon(supabaseOk)}
              <div className="flex-1">
                <p className="text-white font-medium">
                  Banco de Dados: {supabaseOk === 'pending' ? 'Testando...' : supabaseOk === 'ok' ? 'Conectado' : 'Erro'}
                </p>
                <p className="text-sm text-slate-300">{supabaseMsg}</p>
                <p className="text-xs text-slate-500 mt-1">
                  URL: {supaUrl || 'não configurada'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Instructions */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">📋 Como Configurar</h2>
          
          <div className="space-y-6">
            {/* Development */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">🔧 Desenvolvimento Local</h3>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-slate-300 text-sm mb-3">
                  1. Crie um arquivo <code className="bg-slate-700 px-2 py-1 rounded">.env</code> na raiz do projeto
                </p>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <code className="text-green-400 text-sm">
                    VITE_API_BASE=http://localhost:3333<br/>
                    VITE_SUPABASE_URL=https://seu-projeto.supabase.co<br/>
                    VITE_SUPABASE_ANON_KEY=sua-chave-anon
                  </code>
                  <button
                    onClick={() => copyToClipboard(`VITE_API_BASE=http://localhost:3333\nVITE_SUPABASE_URL=https://seu-projeto.supabase.co\nVITE_SUPABASE_ANON_KEY=sua-chave-anon`)}
                    className="ml-3 p-1 text-blue-400 hover:bg-blue-500/10 rounded"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Production */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">🚀 Produção (Bolt Hosting)</h3>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
                  <li>Vá em <strong>Settings → Environment Variables</strong> no Bolt Hosting</li>
                  <li>Adicione as seguintes variáveis:</li>
                </ol>
                <div className="bg-slate-700/50 rounded-lg p-3 mt-3">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <code className="text-green-400">VITE_API_BASE</code>
                      <span className="text-slate-400">=</span>
                      <code className="text-blue-400">https://seu-backend.onrender.com</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-green-400">VITE_SUPABASE_URL</code>
                      <span className="text-slate-400">=</span>
                      <code className="text-blue-400">https://seu-projeto.supabase.co</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-green-400">VITE_SUPABASE_ANON_KEY</code>
                      <span className="text-slate-400">=</span>
                      <code className="text-blue-400">sua-chave-anon</code>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-3">
                  3. Clique em <strong>Deploy</strong> para republicar com as novas variáveis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Missing Variables Warning */}
        {(!apiBase || !supaUrl || !supaKey) && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-yellow-400 font-bold mb-2">⚠️ Variáveis de Ambiente Ausentes</h3>
                <p className="text-yellow-300 text-sm mb-4">
                  O sistema está rodando em modo demo limitado. Configure as variáveis para funcionalidade completa:
                </p>
                <ul className="text-yellow-300 text-sm space-y-1 list-disc list-inside">
                  {!apiBase && <li>VITE_API_BASE - URL do backend WhatsApp</li>}
                  {!supaUrl && <li>VITE_SUPABASE_URL - URL do projeto Supabase</li>}
                  {!supaKey && <li>VITE_SUPABASE_ANON_KEY - Chave pública do Supabase</li>}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-4">
            <a
              href="/whatsapp"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              <Smartphone className="h-5 w-5" />
              <span>Ir para WhatsApp</span>
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center space-x-2 bg-slate-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-600 transition-all"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Recarregar Testes</span>
            </button>
          </div>
        </div>

        {/* Backend Setup Guide */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">🚀 Setup do Backend (Sem instalação no PC)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-medium mb-3">1. Hospedar Backend:</h3>
              <div className="space-y-2">
                <a
                  href="https://render.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Render.com (Recomendado)</span>
                </a>
                <a
                  href="https://railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Railway.app</span>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-3">2. Endpoints Necessários:</h3>
              <div className="space-y-1 text-sm text-slate-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <code>GET /health</code>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <code>GET /session/start</code>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <code>GET /session/status</code>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <code>POST /session/close</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}