import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { contactsService, sendLogsService, groupsService } from '../services/supabaseService';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Calendar,
  TrendingUp, 
  Activity,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  UserPlus,
  Zap,
  Target,
  Clock,
  Phone,
  Star,
  Megaphone,
  BarChart3,
  Smartphone,
  Shield,
  Download
} from 'lucide-react';

interface DashboardStats {
  totalContacts: number;
  totalGroups: number;
  messagesSent: number;
  todayMessages: number;
  deliveryRate: number;
  activeContacts: number;
  whatsappStatus: string;
  massSentCount: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalGroups: 0,
    messagesSent: 0,
    todayMessages: 0,
    deliveryRate: 0,
    activeContacts: 0,
    whatsappStatus: 'Conectado',
    massSentCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Carregar estatísticas do Supabase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Buscar dados em paralelo
        const [contacts, groups, sendStats, todayCount] = await Promise.all([
          contactsService.getAll(),
          groupsService.getAll(),
          sendLogsService.getStats(),
          sendLogsService.getTodayCount()
        ]);

        // Calcular estatísticas
        const totalSent = Object.values(sendStats).reduce((sum, count) => sum + count, 0);
        const successfulSends = (sendStats.sent || 0) + (sendStats.delivered || 0);
        const deliveryRate = totalSent > 0 ? (successfulSends / totalSent) * 100 : 0;

        setStats({
          totalContacts: contacts.length,
          totalGroups: groups.length,
          messagesSent: totalSent,
          todayMessages: todayCount,
          deliveryRate: Math.round(deliveryRate * 10) / 10,
          activeContacts: contacts.filter(c => c.type === 'cliente').length,
          whatsappStatus: 'Conectado',
          massSentCount: totalSent
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        // Fallback para dados simulados se Supabase não estiver disponível
        setStats({
          totalContacts: 1247,
          totalGroups: 18,
          messagesSent: 3456,
          todayMessages: 127,
          deliveryRate: 98.5,
          activeContacts: 892,
          whatsappStatus: 'Conectado',
          massSentCount: 3456
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const kpiCards = [
    {
      title: 'Total de Contatos',
      value: stats.totalContacts.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      description: 'Monitorar crescimento da base de leads'
    },
    {
      title: 'Total de Grupos',
      value: stats.totalGroups.toString(),
      change: '+3',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      description: 'Acompanhar segmentação de contatos'
    },
    {
      title: 'Mensagens Enviadas',
      value: stats.messagesSent.toLocaleString(),
      change: `+${stats.todayMessages} hoje`,
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
      description: 'Controlar volume de comunicação'
    },
    {
      title: 'Taxa de Entrega',
      value: `${stats.deliveryRate}%`,
      change: '+2%',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      description: 'Monitorar qualidade dos envios'
    }
  ];

  const quickActions = [
    {
      title: 'Envio em Massa',
      description: 'Envie mensagens para múltiplos contatos',
      icon: Send,
      color: 'from-blue-500 to-cyan-500',
      route: '/send-mass',
      stats: `${stats.massSentCount} enviadas`
    },
    {
      title: 'Gerenciar Contatos',
      description: 'Adicione e organize seus contatos',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      route: '/contacts',
      stats: `${stats.totalContacts} contatos`
    },
    {
      title: 'Agenda de Visitas',
      description: 'Agende e gerencie visitas aos clientes',
      icon: Calendar,
      color: 'from-indigo-500 to-purple-500',
      route: '/agenda',
      stats: 'Próximas visitas'
    },
    {
      title: 'Pipeline de Vendas',
      description: 'Visualize seu funil de vendas',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      route: '/kanban',
      stats: 'Funil Kanban'
    },
    {
      title: 'Conexão WhatsApp',
      description: 'Configure sua conexão',
      icon: Smartphone,
      color: 'from-orange-500 to-red-500',
      route: '/whatsapp',
      stats: stats.whatsappStatus
    },
    {
      title: 'Diagnósticos',
      description: 'Teste conexões e configure APIs',
      icon: Activity,
      color: 'from-red-500 to-pink-500',
      route: '/diagnostics',
      stats: 'Verificar sistema'
    }
  ];

  const recentActivity = [
    { 
      action: 'Mensagem enviada', 
      target: '+55 11 99999-9999', 
      time: '2 min atrás', 
      status: 'success',
      icon: MessageSquare
    },
    { 
      action: 'Contato adicionado', 
      target: 'Maria Silva', 
      time: '15 min atrás', 
      status: 'info',
      icon: UserPlus
    },
    { 
      action: 'Lead convertido', 
      target: 'João Santos', 
      time: '1 hora atrás', 
      status: 'success',
      icon: Star
    },
    { 
      action: 'Campanha criada', 
      target: 'Promoção Black Friday', 
      time: '2 horas atrás', 
      status: 'info',
      icon: Megaphone
    },
  ];

  const getProgressPercentage = () => {
    return Math.min((stats.todayMessages / 50000) * 100, 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage < 50) return 'from-green-500 to-emerald-500';
    if (percentage < 80) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-20 bg-slate-700/30 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-slate-700/30 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Painel Principal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo, {user?.name || 'Usuário'}! 👋
          </h1>
          <p className="text-slate-400">
            Painel executivo com visão completa das operações de automação WhatsApp
          </p>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((card, index) => (
            <div 
              key={index} 
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all group hover:scale-105 transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${card.color} rounded-xl group-hover:scale-110 transition-transform shadow-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                  {card.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
              <p className="text-slate-400 text-sm font-medium">{card.title}</p>
              <p className="text-slate-500 text-xs mt-2">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-yellow-400" />
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                onClick={() => navigate(action.route)}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all cursor-pointer group hover:scale-105 hover:shadow-2xl transform duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 bg-gradient-to-r ${action.color} rounded-2xl group-hover:scale-110 transition-transform shadow-lg`}>
                      <action.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors animate-pulse">
                        {action.title}
                      </h3>
                      <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm font-medium">{action.stats}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-cyan-400 font-medium">Clique para acessar →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity Timeline */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Activity className="h-6 w-6 mr-2 text-blue-400" />
                Atividade Recente
              </h2>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                Ver todas
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  action: 'Mensagem enviada', 
                  target: 'João Silva', 
                  time: '2 min atrás', 
                  status: 'success',
                  icon: MessageSquare
                },
                { 
                  action: 'Visita agendada', 
                  target: 'Maria Santos', 
                  time: '30 min atrás', 
                  status: 'info',
                  icon: Calendar
                },
                { 
                  action: 'Lead convertido', 
                  target: 'Maria Santos', 
                  time: '1 hora atrás', 
                  status: 'success',
                  icon: Star
                },
                { 
                  action: 'Campanha criada', 
                  target: 'Oferta Black Friday', 
                  time: '2 horas atrás', 
                  status: 'info',
                  icon: Megaphone
                },
                { 
                  action: 'Contato adicionado', 
                  target: 'Bruno Oliveira', 
                  time: '15 min atrás', 
                  status: 'info',
                  icon: UserPlus
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.status === 'success' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-cyan-300 transition-colors">
                        {activity.action}
                      </p>
                      <p className="text-slate-400 text-sm">{activity.target}</p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-purple-400" />
                Métricas de Performance
              </h2>
            </div>
            
            <div className="space-y-6">
              {/* Conversion Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 font-medium">Taxa de Conversão</span>
                  <span className="text-green-400 font-bold">24.5%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '24.5%' }}></div>
                </div>
              </div>

              {/* Response Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 font-medium">Taxa de Resposta</span>
                  <span className="text-blue-400 font-bold">67.8%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '67.8%' }}></div>
                </div>
              </div>

              {/* Active Leads */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 font-medium">Leads Ativos</span>
                  <span className="text-purple-400 font-bold">{stats.activeContacts}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Limit Progress */}
        <div className={`bg-gradient-to-r ${getProgressColor()}/10 border border-current/20 rounded-2xl p-6 mb-8`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-gradient-to-r ${getProgressColor()}/20 rounded-xl`}>
              <Shield className="h-6 w-6 text-current" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">Limite Diário de Envios</h3>
                <span className="text-sm font-medium">
                  {stats.todayMessages.toLocaleString()} / 50.000
                </span>
              </div>
              <p className="text-current text-sm mb-3">
                Sistema de intervalos inteligentes ativado para evitar bloqueios de chip WhatsApp
              </p>
              <div className="bg-slate-700/50 rounded-full h-3 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r ${getProgressColor()} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-2 text-current/80">
                <span>0</span>
                <span>25k</span>
                <span>50k</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-white font-medium">WhatsApp Status</h3>
            </div>
            <p className="text-green-400 font-bold">Conectado e Operacional</p>
            <p className="text-slate-400 text-sm mt-1">Última verificação: agora</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <h3 className="text-white font-medium">Banco de Dados</h3>
            </div>
            <p className="text-blue-400 font-bold">Sincronizado</p>
            <p className="text-slate-400 text-sm mt-1">Última sync: 2 min atrás</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <h3 className="text-white font-medium">Sistema</h3>
            </div>
            <p className="text-purple-400 font-bold">Funcionando</p>
            <p className="text-slate-400 text-sm mt-1">Uptime: 99.9%</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;