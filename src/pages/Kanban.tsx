import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Contact, ContactStatus } from '../types';
import { leadsService, Lead } from '../services/leadsService';
import ContactCard from '../components/ContactCard';
import ContactForm from '../components/ContactForm';
import MessageComposer from '../components/MessageComposer';
import { useContacts } from '../hooks/useContacts';
import { 
  Plus, 
  Filter, 
  Target,
  TrendingUp,
  Users,
  Calendar,
  Phone,
  Home,
  Building,
  MapPin,
  DollarSign,
  Thermometer,
  Star,
  Clock,
  CheckCircle,
  UserCheck,
  MessageSquare,
  Eye,
  Bot
} from 'lucide-react';

const Kanban: React.FC = () => {
  const {
    contacts,
    addContact: onAddContact,
    updateContact: onUpdateContact,
    deleteContact: onDeleteContact,
    sendMessage: onSendMessage,
    sending,
  } = useContacts();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showMessageComposer, setShowMessageComposer] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Pipeline personalizado com workflow completo
  const columns = [
    { 
      status: 'new',
      title: '🟡 Novo Lead',
      color: 'border-blue-500 bg-blue-500/10', 
      icon: Users,
      description: 'Leads recém-importados do WhatsApp'
    },
    { 
      status: 'contacted',
      title: '🟠 Em Atendimento',
      color: 'border-yellow-500 bg-yellow-500/10', 
      icon: Phone,
      description: 'Primeiro contato realizado'
    },
    { 
      status: 'follow-up',
      title: '🔁 Follow-up',
      color: 'border-orange-500 bg-orange-500/10', 
      icon: Clock,
      description: 'Aguardando retorno'
    },
    { 
      status: 'waiting',
      title: '⏳ Aguardando Retorno',
      color: 'border-gray-500 bg-gray-500/10',
      icon: Clock,
      description: 'Sem resposta há mais de 24h'
    },
    { 
      status: 'scheduled',
      title: '📅 Agendamento',
      color: 'border-purple-500 bg-purple-500/10', 
      icon: Calendar,
      description: 'Visita agendada'
    },
    { 
      status: 'visit',
      title: '🚗 Visita',
      color: 'border-teal-500 bg-teal-500/10',
      icon: MapPin,
      description: 'Visita confirmada ou realizada'
    },
    { 
      status: 'negotiating',
      title: '📄 Proposta',
      color: 'border-indigo-500 bg-indigo-500/10', 
      icon: DollarSign,
      description: 'Negociação em andamento'
    },
    { 
      status: 'closed',
      title: '✅ Fechamento',
      color: 'border-green-500 bg-green-500/10', 
      icon: CheckCircle,
      description: 'Negócio concluído'
    }
  ];

  // Carregar leads do Supabase
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoadingLeads(true);
        const data = await leadsService.getAll();
        setLeads(data);
      } catch (error) {
        console.error('Erro ao carregar leads:', error);
      } finally {
        setLoadingLeads(false);
      }
    };

    fetchLeads();
  }, []);
  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags)));
  const propertyTypes = ['Residencial', 'Comercial', 'Casa', 'Apartamento', 'Terreno', 'Lançamento'];
  const clientProfiles = ['Quente', 'Morno', 'Frio', 'Investidor', 'Morador', 'Upgrade'];

  const getFilteredContacts = (status: ContactStatus | string) => {
    // Combinar contatos tradicionais com leads importados
    const allItems = [
      ...contacts.map(c => ({ ...c, source: 'manual' })),
      ...leads.map(l => ({
        id: l.id,
        name: l.name || 'Nome não informado',
        phone: l.phone,
        status: l.pipeline_stage,
        tags: l.tags || [],
        notes: l.notes || '',
        createdAt: l.created_at,
        lastContact: l.last_interaction_date,
        propertyInterest: '',
        budget: undefined,
        source: 'whatsapp'
      }))
    ];
    
    return allItems.filter(contact => {
      const matchesStatus = contact.status === status;
      const matchesTag = tagFilter === 'all' || contact.tags.includes(tagFilter);
      const matchesType = typeFilter === 'all' || contact.propertyInterest?.includes(typeFilter);
      return matchesStatus && matchesTag && matchesType;
    });
  };

  const getTotalValue = (status: ContactStatus | string) => {
    const statusContacts = getFilteredContacts(status);
    return statusContacts.reduce((sum, contact) => sum + (contact.budget || 0), 0);
  };

  const getConversionRate = (status: ContactStatus | string) => {
    const totalContacts = contacts.length;
    const statusContacts = getFilteredContacts(status).length;
    return totalContacts > 0 ? (statusContacts / totalContacts) * 100 : 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleSendMessage = (contact: Contact) => {
    setSelectedContact(contact);
    setShowMessageComposer(true);
  };

  const handleFormSave = (contactData: Omit<Contact, 'id' | 'createdAt'>) => {
    if (editingContact) {
      onUpdateContact(editingContact.id, contactData);
    } else {
      onAddContact(contactData);
    }
    setShowForm(false);
    setEditingContact(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingContact(undefined);
  };

  const handleStatusChange = (id: string, status: ContactStatus) => {
    onUpdateContact(id, { status, lastContact: new Date().toISOString() });
  };

  const getTotalPipelineValue = () => {
    return contacts.reduce((sum, contact) => sum + (contact.budget || 0), 0);
  };

  const getHotLeads = () => {
    return contacts.filter(c => c.tags.includes('Quente') || c.tags.includes('VIP')).length;
  };

  return (
    <Layout title="Pipeline de Vendas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Pipeline de Vendas</h1>
              <p className="text-slate-400">Visualize e gerencie seu funil de vendas completo</p>
            </div>
          </div>

          {/* Pipeline Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(getTotalPipelineValue())}</p>
                  <p className="text-slate-400 text-sm">Valor Total Pipeline</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{contacts.length}</p>
                  <p className="text-slate-400 text-sm">Total de Leads</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-3">
                <Thermometer className="h-8 w-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{getHotLeads()}</p>
                  <p className="text-slate-400 text-sm">Leads Quentes</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-3">
                <Star className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(getConversionRate('closed'))}%
                  </p>
                  <p className="text-slate-400 text-sm">Taxa Conversão</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Lead</span>
            </button>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Todos os perfis</option>
                {clientProfiles.map((profile) => (
                  <option key={profile} value={profile}>{profile}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Home className="h-4 w-4 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Todos os tipos</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8">
          {columns.map((column) => {
            const columnContacts = getFilteredContacts(column.status);
            const totalValue = getTotalValue(column.status);
            const conversionRate = getConversionRate(column.status);
            
            return (
              <div key={column.status} className={`rounded-2xl border-t-4 ${column.color} bg-slate-800/50 backdrop-blur-xl border border-slate-700/50`}>
                <div className="p-4">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <column.icon className="h-5 w-5 text-slate-300" />
                      <h2 className="font-bold text-white text-sm">{column.title}</h2>
                    </div>
                    <span className="text-xs font-medium text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                      {columnContacts.length}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-500 mb-4">{column.description}</p>

                  {/* Column Stats */}
                  {totalValue > 0 && (
                    <div className="mb-4 p-3 bg-slate-700/30 rounded-xl">
                      <p className="text-xs font-medium text-slate-400">Valor Total:</p>
                      <p className="text-sm font-bold text-green-400">{formatCurrency(totalValue)}</p>
                      <p className="text-xs text-slate-500 mt-1">{conversionRate.toFixed(1)}% do pipeline</p>
                    </div>
                  )}

                  {/* Contact Cards */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {columnContacts.map((contact) => (
                      <div key={contact.id} className="transform hover:scale-102 transition-transform">
                        <div className={`bg-slate-700/30 rounded-xl p-3 border border-slate-600/30 hover:border-slate-500/50 transition-all group ${
                          contact.source === 'whatsapp' ? 'border-l-4 border-l-green-400' : ''
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                                {contact.name}
                                {contact.source === 'whatsapp' && (
                                  <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                                    WhatsApp
                                  </span>
                                )}
                              </h4>
                              <p className="text-slate-400 text-xs">{contact.phone}</p>
                            </div>
                            <div className="flex space-x-1">
                              {contact.source === 'whatsapp' && (
                                <button
                                  onClick={() => {/* Ver histórico de mensagens */}}
                                  className="p-1 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                  title="Ver conversa WhatsApp"
                                >
                                  <MessageSquare className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                onClick={() => handleSendMessage(contact)}
                                className="p-1 text-green-400 hover:bg-green-500/10 rounded transition-colors"
                                title="Enviar mensagem"
                              >
                                <Phone className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleEditContact(contact)}
                                className="p-1 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                title="Editar"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => {/* Atribuir responsável */}}
                                className="p-1 text-purple-400 hover:bg-purple-500/10 rounded transition-colors"
                                title="Atribuir responsável"
                              >
                                <UserCheck className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Property Interest */}
                          {contact.propertyInterest && (
                            <div className="flex items-center space-x-1 mb-2">
                              <Home className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-300">{contact.propertyInterest}</span>
                            </div>
                          )}

                          {/* Budget */}
                          {contact.budget && (
                            <div className="flex items-center space-x-1 mb-2">
                              <DollarSign className="h-3 w-3 text-green-400" />
                              <span className="text-xs text-green-400 font-medium">
                                {formatCurrency(contact.budget)}
                              </span>
                            </div>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {contact.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  tag === 'Quente' ? 'bg-red-500/20 text-red-400' :
                                  tag === 'VIP' ? 'bg-yellow-500/20 text-yellow-400' :
                                  tag === 'Investidor' ? 'bg-purple-500/20 text-purple-400' :
                                  'bg-slate-500/20 text-slate-400'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                            {contact.tags.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-500/20 text-slate-400">
                                +{contact.tags.length - 2}
                              </span>
                            )}
                          </div>

                          {/* Status Selector */}
                          <select
                            value={contact.status}
                            onChange={(e) => handleStatusChange(contact.id, e.target.value as ContactStatus)}
                            className="w-full text-xs bg-slate-600/50 border border-slate-500/50 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="new">Novo Lead</option>
                            <option value="contacted">🟠 Em Atendimento</option>
                            <option value="follow-up">🔁 Follow-up</option>
                            <option value="waiting">⏳ Aguardando Retorno</option>
                            <option value="scheduled">📅 Agendamento</option>
                            <option value="visit">🚗 Visita</option>
                            <option value="negotiating">📄 Proposta</option>
                            <option value="closed">✅ Fechamento</option>
                          </select>

                          {/* Last Contact */}
                          {contact.lastContact && (
                            <p className="text-xs text-slate-500 mt-2">
                              Último contato: {new Date(contact.lastContact).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                          
                          {/* AI Classification */}
                          {contact.source === 'whatsapp' && (
                            <div className="mt-2 flex items-center space-x-1">
                              <Bot className="h-3 w-3 text-cyan-400" />
                              <span className="text-xs text-cyan-400">IA: Auto-classificado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {columnContacts.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <column.icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">Nenhum lead nesta fase</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pipeline Analytics */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-purple-400" />
            Análise do Pipeline
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {columns.map((column) => {
              const columnContacts = getFilteredContacts(column.status);
              const totalValue = getTotalValue(column.status);
              const conversionRate = getConversionRate(column.status);
              
              return (
                <div key={column.status} className="text-center bg-slate-700/30 rounded-xl p-4">
                  <div className={`w-12 h-12 rounded-xl ${column.color.replace('border-', 'bg-').replace('bg-blue-50', 'bg-blue-500').replace('bg-yellow-50', 'bg-yellow-500').replace('bg-orange-50', 'bg-orange-500').replace('bg-purple-50', 'bg-purple-500').replace('bg-indigo-50', 'bg-indigo-500').replace('bg-green-50', 'bg-green-500')} flex items-center justify-center mx-auto mb-3`}>
                    <column.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium text-white text-sm mb-1">{column.title}</h3>
                  <p className="text-xl font-bold text-white">{columnContacts.length}</p>
                  <p className="text-xs text-slate-400">{formatCurrency(totalValue)}</p>
                  <p className="text-xs text-slate-500">{conversionRate.toFixed(1)}%</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form Modal */}
        <ContactForm
          contact={editingContact}
          isOpen={showForm}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />

        {/* Message Composer Modal */}
        <MessageComposer
          isOpen={showMessageComposer}
          contact={selectedContact}
          onSend={onSendMessage}
          onClose={() => {
            setShowMessageComposer(false);
            setSelectedContact(undefined);
          }}
          sending={sending}
        />
      </div>
    </Layout>
  );
};

export default Kanban;