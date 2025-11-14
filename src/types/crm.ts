/**
 * Tipos de dados do CRM WhatsApp Pro
 * Seguindo as melhores práticas de TypeScript
 */

/**
 * Status possíveis de um contato no funil de vendas
 */
export type ContactStatus = 'novo' | 'negociacao' | 'proposta' | 'fechado' | 'perdido';

/**
 * Níveis de prioridade de um contato
 */
export type ContactPriority = 'alta' | 'media' | 'baixa';

/**
 * Tipos de mensagem (enviada ou recebida)
 */
export type MessageType = 'enviada' | 'recebida';

/**
 * Tipos de mídia suportados
 */
export type MediaType = 'imagem' | 'pdf';

/**
 * Interface para mídia anexada em mensagem
 */
export interface IMedia {
  tipo: MediaType;
  url: string;
  nome: string;
}

/**
 * Interface para mensagem individual
 */
export interface IMessage {
  id: string;
  texto: string;
  data: string;
  tipo: MessageType;
  midia?: IMedia;
}

/**
 * Interface principal de Contato
 */
export interface IContact {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  status: ContactStatus;
  prioridade: ContactPriority;
  tags: string[];
  dataCriacao: string;
  ultimoContato: string;
  aniversario?: string;
  observacoes?: string;
  historico: IMessage[];
}

/**
 * Interface para usuário autenticado
 */
export interface IUser {
  username: string;
  isAuthenticated: boolean;
  loginTime: string;
}

/**
 * Interface para template de mensagem
 */
export interface IMessageTemplate {
  id: string;
  nome: string;
  texto: string;
  variaveis: string[];
  categoria: 'saudacao' | 'followup' | 'proposta' | 'aniversario';
}

/**
 * Interface para filtros de contatos
 */
export interface IContactFilters {
  busca: string;
  status: ContactStatus | 'todos';
  tags: string[];
  prioridade: ContactPriority | 'todos';
}

/**
 * Interface para estatísticas do dashboard
 */
export interface IDashboardStats {
  totalLeads: number;
  mensagensHoje: number;
  taxaConversao: number;
  clientesInativos: number;
  porStatus: Record<ContactStatus, number>;
}

/**
 * Dados extraídos automaticamente de mensagens
 */
export interface IExtractedData {
  nome?: string;
  telefone?: string;
  bairro?: string;
  tipoImovel?: string;
  valor?: string;
}
