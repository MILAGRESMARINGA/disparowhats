import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { contactsService } from '../services/supabaseService';
import { whatsappService, SendResult } from '../services/whatsappService';
import { Contact } from '../lib/supabase';
import { 
  Send, 
  Users, 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Plus,
  Loader2
} from 'lucide-react';

interface SendLog {
  id: string;
  contact: Contact;
  message: string;
  status: 'pending' | 'sending' | 'success' | 'error';
  sent_at: string;
  error?: string;
}

const SendMass: React.FC = () => {
  // Estados principais
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendLogs, setSendLogs] = useState<SendLog[]>([]);
  const [activeTab, setActiveTab] = useState<'compose' | 'queue'>('compose');
  const [dailyCount, setDailyCount] = useState(0);
  const [sendProgress, setSendProgress] = useState({ sent: 0, total: 0, current: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Constantes
  const DAILY_LIMIT = 50000; // 50 mil mensagens por dia
  const DELAY_BETWEEN_MESSAGES = 5000; // 5 segundos
  const BATCH_SIZE = 200;
  const BATCH_PAUSE_MINUTES = 5;
  const MAX_ATTEMPTS = 3;

  // Carregar contatos do Supabase
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await contactsService.getAll();
        setContacts(data);
      } catch (error) {
        console.error('Erro ao carregar contatos:', error);
        // Fallback para dados simulados se Supabase não disponível
        const mockContacts: Contact[] = [
          { id: '1', name: 'João Silva', phone: '5511999887766', type: 'cliente', created_at: new Date().toISOString() },
          { id: '2', name: 'Maria Santos', phone: '5511988776655', type: 'lead', created_at: new Date().toISOString() },
          { id: '3', name: 'Carlos Oliveira', phone: '5511977665544', type: 'cliente', created_at: new Date().toISOString() },
        ];
        setContacts(mockContacts);
      }
    };

    fetchContacts();
  }, []);

  // Carregar contador diário do localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedCount = localStorage.getItem(`daily_count_${today}`);
    setDailyCount(savedCount ? parseInt(savedCount) : 0);
  }, []);

  // Filtrar contatos por busca
  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone?.includes(searchTerm)
  );

  // Selecionar/deselecionar contato
  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Selecionar todos os contatos
  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  // Salvar log no Supabase (simulado)
  const saveSendLog = async (log: Omit<SendLog, 'id'>) => {
    // Em produção, usar Supabase client para inserir na tabela send_logs
    const newLog: SendLog = {
      ...log,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    setSendLogs(prev => [...prev, newLog]);
    return newLog;
  };

  // Atualizar contador diário
  const updateDailyCount = (increment: number) => {
    const newCount = dailyCount + increment;
    setDailyCount(newCount);
    
    const today = new Date().toDateString();
    localStorage.setItem(`daily_count_${today}`, newCount.toString());
  };

  // Função principal de envio em massa
  const handleSendMass = async () => {
    if (!message.trim()) {
      alert('Digite uma mensagem antes de enviar');
      return;
    }

    if (selectedContacts.length === 0) {
      alert('Selecione pelo menos um contato');
      return;
    }

    if (dailyCount + selectedContacts.length > DAILY_LIMIT) {
      alert(`Limite diário excedido! Você pode enviar apenas ${DAILY_LIMIT - dailyCount} mensagens hoje.`);
      return;
    }

    // Verificar se o WhatsApp está configurado
    if (!whatsappService.isConfigured()) {
      alert('Configure primeiro as credenciais da API WhatsApp no arquivo whatsappService.ts');
      return;
    }

    setIsSending(true);
    setActiveTab('queue');
    setSendProgress({ sent: 0, total: selectedContacts.length, current: '' });

    const selectedContactsData = contacts.filter(c => selectedContacts.includes(c.id));

    try {
      // Usar o serviço de envio em massa do WhatsApp
      const results = await whatsappService.sendMassMessages(
        selectedContactsData.map(c => ({
          id: c.id,
          name: c.name || 'Cliente',
          phone: c.phone || ''
        })),
        message,
        (progress) => {
          setSendProgress(progress);
        }
      );
      
      // Atualizar logs locais com os resultados
      const newLogs: SendLog[] = results.map((result, index) => ({
        id: Date.now().toString() + index,
        contact: selectedContactsData[index],
        message: message.replace(/\{\{nome\}\}/g, selectedContactsData[index].name || 'Cliente'),
        status: result.status === 'success' ? 'success' : 'error',
        sent_at: new Date().toISOString(),
        error: result.error
      }));
      
      setSendLogs(prev => [...prev, ...newLogs]);
      
      const successCount = results.filter(r => r.status === 'success').length;
      updateDailyCount(successCount);
      
      alert(`Envio concluído! ${successCount}/${results.length} mensagens enviadas com sucesso.`);
    } catch (error) {
      console.error('Erro no envio em massa:', error);
      alert('Erro no envio: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }

    setIsSending(false);
    setSelectedContacts([]);
    setSendProgress({ sent: 0, total: 0, current: '' });
  };

  // Obter ícone de status
  const getStatusIcon = (status: SendLog['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'sending': return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
    }
  };

  // Obter cor de status
  const getStatusColor = (status: SendLog['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'sending': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'success': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  const getStatusText = (status: SendLog['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'sending': return 'Enviando...';
      case 'success': return 'Enviada';
      case 'error': return 'Erro';
    }
  };

  return (
    <Layout title="Envio em Massa">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4">
            <Send className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Envio em Massa
          </h1>
          <p className="text-slate-400">
            Envie mensagens personalizadas via WhatsApp para múltiplos contatos
          </p>
          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 max-w-md mx-auto">
            <p className="text-blue-400 text-sm">
              📊 Enviadas hoje: <strong>{dailyCount.toLocaleString()}/{DAILY_LIMIT.toLocaleString()}</strong>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-800/30 rounded-xl p-1 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('compose')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'compose'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Compor
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'queue'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Clock className="h-4 w-4 inline mr-2" />
              Fila ({sendLogs.length})
            </button>
          </div>
        </div>

        {activeTab === 'compose' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Composer */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center space-x-3 mb-6">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Mensagem</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Texto da Mensagem
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Olá {{nome}}! Esta é uma mensagem personalizada..."
                      className="w-full h-40 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                    <p className="text-slate-400 text-sm mt-2">
                      Use <code className="bg-slate-700 px-1 rounded">{'{{nome}}'}</code> para personalizar
                    </p>
                  </div>

                  {/* Preview */}
                  {message && (
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Preview:</h4>
                      <div className="bg-green-600 text-white p-3 rounded-lg max-w-xs">
                        <p className="text-sm whitespace-pre-wrap">
                          {message.replace(/\{\{nome\}\}/g, 'João Silva')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Config Status */}
                  <div className={`p-3 rounded-xl border ${
                    whatsappService.isConfigured() 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-yellow-500/10 border-yellow-500/20'
                  }`}>
                    <p className={`text-sm ${
                      whatsappService.isConfigured() 
                        ? 'text-green-400' 
                        : 'text-yellow-400'
                    }`}>
                      {whatsappService.isConfigured() 
                        ? '✅ WhatsApp API configurada' 
                        : '⚠️ Configure as credenciais da API no whatsappService.ts'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-green-400" />
                    <h2 className="text-xl font-bold text-white">
                      Contatos ({selectedContacts.length}/{filteredContacts.length})
                    </h2>
                  </div>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {selectedContacts.length === filteredContacts.length ? 'Desmarcar' : 'Selecionar'} Todos
                  </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Buscar contatos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Contacts List */}
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {filteredContacts.map((contact) => (
                    <label key={contact.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => handleContactToggle(contact.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{contact.name || 'Nome não informado'}</p>
                        <p className="text-slate-400 text-sm">{contact.phone || 'Telefone não informado'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        contact.type === 'cliente'
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {contact.type || 'lead'}
                      </span>
                    </label>
                  ))}
                </div>

                {filteredContacts.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum contato encontrado</p>
                  </div>
                )}
              </div>
            </div>

            {/* Send Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleSendMass}
                disabled={isSending || !message.trim() || selectedContacts.length === 0}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-12 py-4 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 mx-auto shadow-lg"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Enviar para {selectedContacts.length} contatos</span>
                  </>
                )}
              </button>

              {selectedContacts.length > 0 && !isSending && (
                <div className="mt-4 text-center">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 max-w-md mx-auto">
                    <p className="text-blue-400 text-sm mb-2">⏱️ Tempo estimado:</p>
                    <p className="text-blue-300 text-xs">
                      {Math.ceil((selectedContacts.length * 3) / 60)} minutos
                      <br />
                      (3 segundos entre mensagens + pausas automáticas)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Queue Tab */
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Fila de Envio</h2>
              </div>
              
              {/* Stats */}
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">
                    {sendLogs.filter(log => log.status === 'success').length} enviadas
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-red-400">
                    {sendLogs.filter(log => log.status === 'error').length} falharam
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {isSending && sendProgress.total > 0 && (
              <div className="mb-6 bg-slate-700/30 rounded-xl p-4">
                <div className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>Progresso: {sendProgress.sent}/{sendProgress.total}</span>
                  <span>{Math.round((sendProgress.sent / sendProgress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(sendProgress.sent / sendProgress.total) * 100}%` }}
                  />
                </div>
                {sendProgress.current && (
                  <p className="text-slate-400 text-xs mt-2">
                    Enviando para: {sendProgress.current}
                  </p>
                )}
              </div>
            )}

            {sendLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Nenhuma mensagem na fila</p>
                <p className="text-sm">As mensagens enviadas aparecerão aqui</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sendLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <div className="flex items-center space-x-4 flex-1">
                      {getStatusIcon(log.status)}
                      <div className="flex-1">
                        <p className="text-white font-medium">{log.contact.name || 'Nome não informado'}</p>
                        <p className="text-slate-400 text-sm">{log.contact.phone || 'Telefone não informado'}</p>
                        {log.error && (
                          <p className="text-red-400 text-xs mt-1">{log.error}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs border ${getStatusColor(log.status)}`}>
                        {getStatusIcon(log.status)}
                        <span>{getStatusText(log.status)}</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">
                        {new Date(log.sent_at).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SendMass;