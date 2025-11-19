import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useCRMStore } from '../store/useCRMStore';
import Card from '../components/ui/Card';
import Badge, { StatusBadge } from '../components/ui/Badge';
import {
  Users,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Cake,
  Send,
  Target,
  Phone
} from 'lucide-react';
import { formatRelativeTime, isToday, isInactive } from '../utils/formatters';

/**
 * Página Dashboard com métricas e visão geral
 */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { contacts } = useCRMStore();

  /**
   * Calcula estatísticas do dashboard
   */
  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today
      .getDate()
      .toString()
      .padStart(2, '0')}`;

    // Total de leads
    const totalLeads = contacts.length;

    // Mensagens enviadas hoje (simular baseado no histórico)
    const messagesToday = contacts.reduce((total, contact) => {
      const todayMessages = contact.historico.filter((msg) => {
        const msgDate = new Date(msg.data);
        return (
          msg.tipo === 'enviada' &&
          msgDate.toDateString() === today.toDateString()
        );
      });
      return total + todayMessages.length;
    }, 0);

    // Taxa de conversão (fechados / total)
    const closedLeads = contacts.filter((c) => c.status === 'fechado').length;
    const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0;

    // Clientes inativos (> 7 dias sem contato)
    const inactiveCount = contacts.filter((c) => isInactive(c.ultimoContato)).length;

    // Aniversariantes do dia
    const birthdaysToday = contacts.filter((c) => isToday(c.aniversario));

    // Por status
    const byStatus = {
      novo: contacts.filter((c) => c.status === 'novo').length,
      negociacao: contacts.filter((c) => c.status === 'negociacao').length,
      proposta: contacts.filter((c) => c.status === 'proposta').length,
      fechado: closedLeads,
      perdido: contacts.filter((c) => c.status === 'perdido').length
    };

    return {
      totalLeads,
      messagesToday,
      conversionRate,
      inactiveCount,
      birthdaysToday,
      byStatus
    };
  }, [contacts]);

  /**
   * Contatos recentes (últimos 5)
   */
  const recentContacts = useMemo(() => {
    return [...contacts]
      .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
      .slice(0, 5);
  }, [contacts]);

  return (
    <MainLayout>
      <div className="max-w-[1920px] mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Visão geral do seu CRM WhatsApp Pro</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total de Leads */}
          <Card className="group hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/contacts')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total de Leads</p>
                <h3 className="text-3xl font-bold text-white">{stats.totalLeads}</h3>
                <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Ver todos
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-blue-400" />
              </div>
            </div>
          </Card>

          {/* Mensagens Enviadas Hoje */}
          <Card className="group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Mensagens Hoje</p>
                <h3 className="text-3xl font-bold text-white">{stats.messagesToday}</h3>
                <p className="text-xs text-slate-400 mt-2">Enviadas com sucesso</p>
              </div>
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Send className="w-7 h-7 text-green-400" />
              </div>
            </div>
          </Card>

          {/* Taxa de Conversão */}
          <Card className="group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Taxa de Conversão</p>
                <h3 className="text-3xl font-bold text-white">{stats.conversionRate.toFixed(1)}%</h3>
                <p className="text-xs text-slate-400 mt-2">{stats.byStatus.fechado} fechados</p>
              </div>
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-purple-400" />
              </div>
            </div>
          </Card>

          {/* Clientes Inativos */}
          <Card className="group hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/agenda')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Clientes Inativos</p>
                <h3 className="text-3xl font-bold text-white">{stats.inactiveCount}</h3>
                <p className="text-xs text-orange-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Requer atenção
                </p>
              </div>
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle className="w-7 h-7 text-orange-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Aniversariantes do Dia + Funil */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Aniversariantes */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cake className="w-5 h-5 text-pink-400" />
                  <h3 className="text-lg font-bold text-white">Aniversariantes Hoje</h3>
                </div>
                <Badge variant="info">{stats.birthdaysToday.length}</Badge>
              </div>
            }
            padding="none"
          >
            {stats.birthdaysToday.length > 0 ? (
              <div className="divide-y divide-slate-700/50">
                {stats.birthdaysToday.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 hover:bg-slate-700/20 transition-colors cursor-pointer"
                    onClick={() => navigate('/messages')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{contact.nome}</p>
                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3" />
                          {contact.telefone}
                        </p>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-sm rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        Enviar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Cake className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Nenhum aniversariante hoje</p>
              </div>
            )}
          </Card>

          {/* Funil de Vendas */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Funil de Vendas</h3>
              </div>
            }
            className="lg:col-span-2"
          >
            <div className="space-y-4">
              {/* Novo Lead */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-slate-300">Novo Lead</span>
                  </div>
                  <span className="text-lg font-bold text-white">{stats.byStatus.novo}</span>
                </div>
                <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalLeads > 0 ? (stats.byStatus.novo / stats.totalLeads) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              {/* Em Negociação */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-slate-300">Em Negociação</span>
                  </div>
                  <span className="text-lg font-bold text-white">{stats.byStatus.negociacao}</span>
                </div>
                <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalLeads > 0 ? (stats.byStatus.negociacao / stats.totalLeads) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              {/* Proposta Enviada */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <span className="text-sm text-slate-300">Proposta Enviada</span>
                  </div>
                  <span className="text-lg font-bold text-white">{stats.byStatus.proposta}</span>
                </div>
                <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalLeads > 0 ? (stats.byStatus.proposta / stats.totalLeads) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              {/* Fechado */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-slate-300">Fechado</span>
                  </div>
                  <span className="text-lg font-bold text-white">{stats.byStatus.fechado}</span>
                </div>
                <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalLeads > 0 ? (stats.byStatus.fechado / stats.totalLeads) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contatos Recentes */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Contatos Recentes</h3>
              </div>
              <button
                onClick={() => navigate('/contacts')}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          }
          padding="none"
        >
          <div className="divide-y divide-slate-700/50">
            {recentContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 hover:bg-slate-700/20 transition-colors cursor-pointer"
                onClick={() => navigate('/contacts')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {contact.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{contact.nome}</p>
                      <p className="text-sm text-slate-400">{contact.telefone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={contact.status} />
                    <p className="text-xs text-slate-500">
                      {formatRelativeTime(contact.dataCriacao)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
