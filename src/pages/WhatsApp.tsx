import React from 'react';
import Layout from '../components/Layout';
import { useWhatsAppConnection } from '../hooks/useWhatsAppConnection';
import { 
  Smartphone, 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Power,
  PowerOff,
  Wifi,
  WifiOff,
  Settings,
  ExternalLink,
  Copy,
  Info
} from 'lucide-react';

const WhatsAppPage: React.FC = () => {
  const { status, qrcode, message, loading, start, stop, refresh } = useWhatsAppConnection();

  const getStatusIcon = () => {
    switch (status) {
      case 'conectado':
        return <CheckCircle className="h-8 w-8 text-green-400" />;
      case 'aguardando':
        return <RefreshCw className="h-8 w-8 text-yellow-400 animate-spin" />;
      case 'demo':
        return <Info className="h-8 w-8 text-blue-400" />;
      case 'erro':
        return <AlertCircle className="h-8 w-8 text-red-400" />;
      default:
        return <WifiOff className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'conectado': return 'WhatsApp Conectado';
      case 'aguardando': return 'Aguardando Conexão...';
      case 'demo': return 'Modo Demonstração';
      case 'erro': return 'Erro de Conexão';
      default: return 'WhatsApp Desconectado';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'conectado': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'aguardando': return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 'demo': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'erro': return 'from-red-500/20 to-rose-500/20 border-red-500/30';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('📋 Copiado para a área de transferência!');
  };

  return (
    <Layout title="Conexão WhatsApp">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Conexão WhatsApp
          </h1>
          <p className="text-slate-400">
            Configure e gerencie sua conexão com o WhatsApp
          </p>
        </div>

        {/* Status Card */}
        <div className={`mb-8 bg-gradient-to-r ${getStatusColor()} backdrop-blur-xl rounded-2xl p-8 border text-center`}>
          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {getStatusText()}
              </h2>
              <p className="text-slate-300 max-w-md">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Demo Mode Info */}
        {status === 'demo' && (
          <div className="mb-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-blue-400 font-bold mb-2">🎭 Modo Demonstração Ativo</h3>
                <p className="text-blue-300 text-sm mb-4">
                  O sistema está funcionando em modo demo porque a API WhatsApp não está configurada ou acessível.
                  Para usar funcionalidades reais:
                </p>
                <ol className="text-blue-300 text-sm space-y-1 list-decimal list-inside">
                  <li>Configure um backend WPPConnect em Render/Railway com HTTPS</li>
                  <li>Defina VITE_API_BASE no Bolt Hosting → Environment Variables</li>
                  <li>Republique o site</li>
                  <li>Volte aqui para escanear o QR Code real</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Section */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* QR Code Display */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <QrCode className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">
                  {status === 'demo' ? 'QR Code de Demonstração' : 'QR Code WhatsApp'}
                </h3>
              </div>
              
              <div className="bg-white p-6 rounded-2xl inline-block mb-6 shadow-2xl">
                {qrcode ? (
                  <img
                    src={qrcode}
                    alt="QR Code WhatsApp"
                    className="w-64 h-64 mx-auto"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <QrCode className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">QR Code não disponível</p>
                    </div>
                  </div>
                )}
              </div>
              
              {status === 'demo' && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 max-w-sm mx-auto">
                  <p className="text-blue-400 text-sm">
                    ⚠️ Este é um QR Code de demonstração. Configure a API para obter o QR real.
                  </p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                {status === 'demo' ? 'Como Ativar Conexão Real:' : 'Como conectar:'}
              </h4>
              
              {status === 'demo' ? (
                <ol className="text-slate-300 space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <div>
                      <p className="font-medium">Configure um backend WPPConnect</p>
                      <p className="text-sm text-slate-400">Hospede em Render, Railway ou VPS com HTTPS</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <div>
                      <p className="font-medium">Configure VITE_API_BASE</p>
                      <p className="text-sm text-slate-400">No Bolt Hosting → Environment Variables</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <div>
                      <p className="font-medium">Republique o site</p>
                      <p className="text-sm text-slate-400">Clique em Deploy para aplicar as mudanças</p>
                    </div>
                  </li>
                </ol>
              ) : (
                <ol className="text-slate-300 space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Abra o WhatsApp no seu celular</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Vá em Menu → Dispositivos conectados</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Toque em "Conectar um dispositivo"</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <span>Escaneie o código QR ao lado</span>
                  </li>
                </ol>
              )}
            </div>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mb-8 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-yellow-400 font-bold mb-2">⚖️ Regras de Conformidade WhatsApp</h3>
              <ul className="text-yellow-300 text-sm space-y-1 list-disc list-inside">
                <li><strong>Conexão via QR:</strong> Sempre escaneado pelo usuário em seu próprio aparelho</li>
                <li><strong>Uma sessão por vez:</strong> Conectar em outro local encerra a anterior</li>
                <li><strong>Consentimento:</strong> Só envie mensagens a quem consentiu (evite ban)</li>
                <li><strong>Limites:</strong> Respeite limites de envio e pausas automáticas</li>
                <li><strong>Uso legítimo:</strong> Use apenas seus próprios contatos/conversas</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {status === 'desconectado' || status === 'demo' ? (
            <button
              onClick={start}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Iniciando...</span>
                </>
              ) : (
                <>
                  <Power className="h-5 w-5" />
                  <span>{status === 'demo' ? 'Tentar Conexão Real' : 'Iniciar Sessão'}</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={stop}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-8 py-4 rounded-xl font-medium hover:from-red-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Desconectando...</span>
                </>
              ) : (
                <>
                  <PowerOff className="h-5 w-5" />
                  <span>Desconectar</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={refresh}
            disabled={loading}
            className="bg-slate-700 text-white px-8 py-4 rounded-xl font-medium hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar Status</span>
          </button>
        </div>

        {/* Backend Configuration Info */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Configuração do Backend</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2">URL da API Atual:</h4>
              <div className="bg-slate-900/50 rounded-xl p-3 flex items-center justify-between">
                <code className="text-green-400 text-sm">
                  {import.meta.env.VITE_API_BASE || 'não configurada'}
                </code>
                {import.meta.env.VITE_API_BASE && (
                  <button
                    onClick={() => copyToClipboard(import.meta.env.VITE_API_BASE)}
                    className="p-1 text-blue-400 hover:bg-blue-500/10 rounded"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Endpoints Necessários:</h4>
              <div className="space-y-1 text-sm text-slate-300">
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
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <code>POST /send-message</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-purple-400 font-bold mb-4">🚀 Setup Rápido (Backend Público)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">1. Hospedar Backend:</h4>
              <div className="space-y-2">
                <a
                  href="https://render.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Render.com (Recomendado)</span>
                </a>
                <a
                  href="https://railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Railway.app</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-3">2. Configurar Variáveis:</h4>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-slate-300 text-sm mb-2">No Bolt Hosting → Environment:</p>
                <code className="text-green-400 text-xs block">
                  VITE_API_BASE=https://seu-app.onrender.com
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Test */}
        <div className="text-center">
          <a
            href="/health"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Ir para Health Check</span>
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default WhatsAppPage;