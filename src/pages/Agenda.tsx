import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useContacts } from '../hooks/useContacts';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  Search
} from 'lucide-react';

interface Appointment {
  id: string;
  contact: {
    name: string;
    phone: string;
  };
  datetime: string;
  location: string;
  notes: string;
  status: 'confirmed' | 'cancelled' | 'rescheduled' | 'completed';
  createdAt: string;
}

const Agenda: React.FC = () => {
  const { contacts, loading: contactsLoading } = useContacts();
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      contact: { name: 'João Silva', phone: '11999887766' },
      datetime: '2024-01-20T14:00:00',
      location: 'Rua das Flores, 123 - Centro',
      notes: 'Interessado em apartamento de 2 quartos',
      status: 'confirmed',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      contact: { name: 'Maria Santos', phone: '11988776655' },
      datetime: '2024-01-20T16:30:00',
      location: 'Av. Principal, 456 - Jardins',
      notes: 'Visita para casa com quintal',
      status: 'confirmed',
      createdAt: '2024-01-15T11:00:00Z'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [contactSearch, setContactSearch] = useState('');
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  const [formData, setFormData] = useState({
    contactName: '',
    contactPhone: '',
    datetime: '',
    location: '',
    notes: ''
  });

  // Filtrar contatos por busca
  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.phone?.includes(contactSearch)
  );

  const handleContactSelect = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      setSelectedContact(contactId);
      setFormData({
        ...formData,
        contactName: contact.name || '',
        contactPhone: contact.phone || ''
      });
      setShowNewContactForm(false);
    }
  };

  const handleNewContact = () => {
    setSelectedContact('');
    setShowNewContactForm(true);
    setFormData({
      ...formData,
      contactName: '',
      contactPhone: ''
    });
  };

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'rescheduled': return <RotateCcw className="h-4 w-4 text-yellow-400" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'cancelled': return 'Cancelado';
      case 'rescheduled': return 'Remarcado';
      case 'completed': return 'Concluído';
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'rescheduled': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contactName.trim() || !formData.contactPhone.trim()) {
      alert('Nome e telefone do contato são obrigatórios');
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      contact: {
        name: formData.contactName,
        phone: formData.contactPhone
      },
      datetime: formData.datetime,
      location: formData.location,
      notes: formData.notes,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    setAppointments([...appointments, newAppointment]);
    setShowForm(false);
    setSelectedContact('');
    setContactSearch('');
    setShowNewContactForm(false);
    setFormData({
      contactName: '',
      contactPhone: '',
      datetime: '',
      location: '',
      notes: ''
    });
  };

  const handleStatusChange = (id: string, status: Appointment['status']) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.datetime.startsWith(selectedDate)
  );

  const todayAppointments = appointments.filter(apt => 
    apt.datetime.startsWith(new Date().toISOString().split('T')[0])
  );

  return (
    <Layout title="Agenda de Visitas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Agenda de Visitas
          </h1>
          <p className="text-slate-400">
            Gerencie seus agendamentos e visitas
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{todayAppointments.length}</p>
                <p className="text-slate-400 text-sm">Hoje</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </p>
                <p className="text-slate-400 text-sm">Confirmados</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
                <p className="text-slate-400 text-sm">Concluídos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <RotateCcw className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {appointments.filter(a => a.status === 'rescheduled').length}
                </p>
                <p className="text-slate-400 text-sm">Remarcados</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar and Controls */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Calendário</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nova Visita</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Selecionar Data
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-2">
                    {new Date(selectedDate).toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {filteredAppointments.length} agendamento(s)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-xl font-bold text-white mb-6">
                Agendamentos - {new Date(selectedDate).toLocaleDateString('pt-BR')}
              </h2>

              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-400 text-lg mb-4">
                    Nenhum agendamento para esta data
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
                  >
                    Agendar Primeira Visita
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <User className="h-5 w-5 text-blue-400 mt-1" />
                          <div>
                            <h3 className="text-white font-medium">{appointment.contact.name}</h3>
                            <p className="text-slate-400 text-sm">{appointment.contact.phone}</p>
                          </div>
                        </div>
                        
                        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs border ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span>{getStatusText(appointment.status)}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span>{new Date(appointment.datetime).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{appointment.location}</span>
                        </div>
                        
                        {appointment.notes && (
                          <div className="flex items-start space-x-2 text-sm text-slate-300">
                            <Eye className="h-4 w-4 text-slate-400 mt-0.5" />
                            <span>{appointment.notes}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {appointment.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(appointment.id, 'completed')}
                              className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded-lg transition-colors"
                            >
                              Concluir
                            </button>
                            <button
                              onClick={() => handleStatusChange(appointment.id, 'rescheduled')}
                              className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-3 py-1 rounded-lg transition-colors"
                            >
                              Remarcar
                            </button>
                            <button
                              onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                              className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-lg transition-colors"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Appointment Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Nova Visita</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Seleção de Contato */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Selecionar Contato
                  </label>
                  
                  {!showNewContactForm ? (
                    <div className="space-y-3">
                      {/* Search Contacts */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Buscar contato existente..."
                          value={contactSearch}
                          onChange={(e) => setContactSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Contact List */}
                      {contactSearch && (
                        <div className="max-h-32 overflow-y-auto bg-slate-700/30 rounded-xl border border-slate-600/30">
                          {filteredContacts.length > 0 ? (
                            filteredContacts.slice(0, 5).map((contact) => (
                              <button
                                key={contact.id}
                                type="button"
                                onClick={() => handleContactSelect(contact.id)}
                                className={`w-full text-left p-3 hover:bg-slate-600/50 transition-colors border-b border-slate-600/30 last:border-b-0 ${
                                  selectedContact === contact.id ? 'bg-blue-500/20' : ''
                                }`}
                              >
                                <p className="text-white font-medium">{contact.name}</p>
                                <p className="text-slate-400 text-sm">{contact.phone}</p>
                              </button>
                            ))
                          ) : (
                            <p className="p-3 text-slate-400 text-sm">Nenhum contato encontrado</p>
                          )}
                        </div>
                      )}

                      {/* Selected Contact Display */}
                      {selectedContact && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                          <p className="text-blue-400 text-sm">✅ Contato selecionado:</p>
                          <p className="text-white font-medium">{formData.contactName}</p>
                          <p className="text-slate-300 text-sm">{formData.contactPhone}</p>
                        </div>
                      )}

                      {/* New Contact Button */}
                      <button
                        type="button"
                        onClick={handleNewContact}
                        className="w-full p-3 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                      >
                        + Cadastrar novo contato
                      </button>
                    </div>
                  ) : (
                    /* New Contact Form */
                    <div className="space-y-3">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                        <p className="text-green-400 text-sm">📝 Cadastrando novo contato</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setShowNewContactForm(false)}
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      >
                        ← Voltar para busca de contatos
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    {showNewContactForm ? 'Nome do Novo Contato *' : 'Nome do Contato *'}
                  </label>
                  <input
                    type="text"
                    required={showNewContactForm}
                    disabled={selectedContact && !showNewContactForm}
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    className={`w-full px-4 py-3 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      selectedContact && !showNewContactForm 
                        ? 'bg-slate-600/30 cursor-not-allowed' 
                        : 'bg-slate-700/50'
                    }`}
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    {showNewContactForm ? 'Telefone do Novo Contato *' : 'Telefone *'}
                  </label>
                  <input
                    type="tel"
                    required={showNewContactForm}
                    disabled={selectedContact && !showNewContactForm}
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    className={`w-full px-4 py-3 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      selectedContact && !showNewContactForm 
                        ? 'bg-slate-600/30 cursor-not-allowed' 
                        : 'bg-slate-700/50'
                    }`}
                    placeholder="11999999999"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Data e Hora *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.datetime}
                    onChange={(e) => setFormData({...formData, datetime: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Local *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Endereço da visita"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Detalhes sobre a visita..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
                  >
                    Agendar Visita
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-slate-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-slate-500 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Agenda;