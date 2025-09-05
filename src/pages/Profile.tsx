import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Save,
  Camera,
  MapPin,
  Calendar
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    company: '',
    location: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        position: user.position || '',
        company: user.company || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Atualizar dados do usuário
      if (updateUser) {
        updateUser({
          ...user!,
          ...formData
        });
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Meu Perfil">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Meu Perfil
          </h1>
          <p className="text-slate-400">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <User className="h-16 w-16 text-white" />
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-colors">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{formData.name || 'Usuário'}</h3>
              <p className="text-slate-400 mb-4">{formData.position || 'Cargo não informado'}</p>
              
              <div className="space-y-2 text-sm text-slate-300">
                {formData.company && (
                  <div className="flex items-center justify-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{formData.company}</span>
                  </div>
                )}
                {formData.location && (
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{formData.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Membro desde 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Informações Pessoais</h2>
              
              {success && (
                <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <p className="text-green-400 text-center font-medium">
                    ✅ Perfil atualizado com sucesso!
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone and Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Telefone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Cargo/Função
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Gestor de Vendas"
                      />
                    </div>
                  </div>
                </div>

                {/* Company and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nome da empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Localização
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="São Paulo, SP"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Sobre você
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Conte um pouco sobre você e sua experiência..."
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;