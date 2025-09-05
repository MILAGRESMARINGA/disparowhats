import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import ImportadorCSV from '../components/ImportadorCSV';
import { useContacts } from '../hooks/useContacts';
import { 
  Plus, 
  Upload, 
  Search, 
  Filter,
  User,
  Phone,
  Mail,
  Tag,
  Edit3,
  Trash2,
  MessageSquare,
  MapPin
} from 'lucide-react';

const Contacts: React.FC = () => {
  const { 
    contacts, 
    addContact, 
    updateContact, 
    deleteContact, 
    loading 
  } = useContacts();
  const [showForm, setShowForm] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [editingContact, setEditingContact] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tags: '',
    notes: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Nome e telefone são obrigatórios');
      return;
    }

    const contactData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      status: 'new' as const,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      notes: formData.notes.trim(),
      propertyInterest: '',
      budget: undefined
    };

    if (editingContact) {
      updateContact(editingContact.id, contactData);
    } else {
      addContact(contactData);
    }

    handleCloseForm();
  };

  const handleEdit = (contact: any) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: '',
      tags: contact.tags.join(', '),
      notes: contact.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
      deleteContact(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      tags: '',
      notes: ''
    });
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const newContacts: any[] = [];
        
        lines.forEach((line, index) => {
          if (index === 0) return; // Skip header
          const [name, phone, email, tags, notes] = line.split(',').map(s => s.trim());
          
          if (name && phone) {
            newContacts.push({
              id: Date.now().toString() + index,
              name,
              phone,
              email: email || undefined,
              tags: tags ? tags.split(';').map(t => t.trim()) : [],
              notes: notes || undefined,
              createdAt: new Date().toISOString()
            });
          }
        });
        
        newContacts.forEach(contact => addContact(contact));
        alert(`${newContacts.length} contatos importados com sucesso!`);
      };
      reader.readAsText(file);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportLeads = (leads: any[]) => {
    leads.forEach(lead => {
      const contactData = {
        name: lead.nome,
        phone: lead.telefone,
        status: 'new' as const,
        tags: [lead.tag, lead.status, lead.intencao].filter(Boolean),
        notes: [
          lead.cidade && `Cidade: ${lead.cidade}`,
          lead.bairro && `Bairro: ${lead.bairro}`,
          lead.idade && `Idade: ${lead.idade} anos`,
          lead.observacoes
        ].filter(Boolean).join(' | '),
        propertyInterest: lead.intencao || '',
        budget: undefined
      };
      
      addContact(contactData);
    });
    
    alert(`${leads.length} leads importados e salvos no sistema!`);
  };

  if (loading) {
    return (
      <Layout title="Contatos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Carregando contatos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Contatos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Gerenciar Contatos
          </h1>
          <p className="text-slate-400">
            Adicione e gerencie seus contatos para campanhas
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Contato</span>
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCSVUpload}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={() => setShowImporter(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <Upload className="h-5 w-5" />
              <span>Importar Leads CSV</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar contatos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* CSV Format Info */}
        {showImporter && (
          <ImportadorCSV
            onImport={handleImportLeads}
            onClose={() => setShowImporter(false)}
          />
        )}

        {/* Contacts List */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400 text-lg mb-4">
              {searchTerm ? 'Nenhum contato encontrado' : 'Nenhum contato cadastrado'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Adicionar Primeiro Contato
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{contact.name || 'Nome não informado'}</h3>
                      <p className="text-slate-400 text-sm flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {contact.phone || 'Telefone não informado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {/* Implementar envio de mensagem */}}
                      className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                      title="Enviar mensagem"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {contact.property_interest && (
                  <div className="flex items-center text-slate-300 text-sm mb-2">
                    <MapPin className="h-3 w-3 mr-2" />
                    {contact.property_interest}
                  </div>
                )}

                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {contact.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {contact.notes && (
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                    {contact.notes}
                  </p>
                )}

                {/* Quick Actions */}
                <div className="flex space-x-2 mb-3">
                  <button className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-lg transition-colors">
                    Agendar Visita
                  </button>
                  <button className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-3 py-1 rounded-lg transition-colors">
                    Criar Lembrete
                  </button>
                </div>
                <div className="text-xs text-slate-500">
                  Criado em {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingContact ? 'Editar Contato' : 'Novo Contato'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="5511999999999"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Interesse Imobiliário
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Apartamento 2 quartos, Casa com quintal..."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Tags: cliente, vip, interessado (separadas por vírgula)"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
                  >
                    {editingContact ? 'Atualizar' : 'Salvar'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForm}
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

export default Contacts;