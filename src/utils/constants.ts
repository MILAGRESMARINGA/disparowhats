/**
 * Constantes do sistema CRM WhatsApp Pro
 */

import { ContactStatus, ContactPriority } from '../types/crm';

/**
 * Limites do sistema
 */
export const LIMITS = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_FILE_SIZE_IMAGE: 5 * 1024 * 1024, // 5MB
  MAX_FILE_SIZE_PDF: 10 * 1024 * 1024, // 10MB
  ITEMS_PER_PAGE: 10,
  MAX_TAGS_PER_CONTACT: 5
} as const;

/**
 * Status de contato com labels e cores
 */
export const CONTACT_STATUS: Record<ContactStatus, { label: string; color: string; bgColor: string }> = {
  novo: {
    label: 'Novo Lead',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30'
  },
  negociacao: {
    label: 'Em Negociação',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/30'
  },
  proposta: {
    label: 'Proposta Enviada',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/30'
  },
  fechado: {
    label: 'Fechado',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/30'
  },
  perdido: {
    label: 'Perdido',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/30'
  }
};

/**
 * Prioridades com labels e cores
 */
export const CONTACT_PRIORITY: Record<ContactPriority, { label: string; color: string; icon: string }> = {
  alta: {
    label: 'Alta',
    color: 'text-red-400',
    icon: '🔴'
  },
  media: {
    label: 'Média',
    color: 'text-yellow-400',
    icon: '🟡'
  },
  baixa: {
    label: 'Baixa',
    color: 'text-green-400',
    icon: '🟢'
  }
};

/**
 * Variáveis disponíveis para templates de mensagem
 */
export const MESSAGE_VARIABLES = [
  { key: '{nome}', label: 'Nome do contato' },
  { key: '{data}', label: 'Data atual' },
  { key: '{bairro}', label: 'Bairro' }
] as const;

/**
 * Formatos de arquivo aceitos
 */
export const ACCEPTED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  pdf: ['application/pdf']
} as const;

/**
 * Credenciais master do sistema
 */
export const MASTER_CREDENTIALS = {
  USERNAME: 'admin',
  PASSWORD: 'Master@2024'
} as const;

/**
 * Regex patterns para extração de dados
 */
export const EXTRACTION_PATTERNS = {
  // Nome: "Meu nome é X", "Eu sou X", "Me chamo X"
  nome: /(meu nome é|eu sou|me chamo|sou o|sou a)\s+([A-Za-zÀ-ÿ\s]+)/i,

  // Telefone: (XX) 9XXXX-XXXX ou variações
  telefone: /\(?\d{2}\)?\s?9?\d{4}-?\d{4}/g,

  // Bairro/Localização: "bairro X", "região X", "em X"
  bairro: /(bairro|região|em|no)\s+([A-Za-zÀ-ÿ\s]+)/i,

  // Tipo de imóvel
  tipoImovel: /(casa|apartamento|terreno|chácara|sobrado|kitnet|studio)/i,

  // Valor: R$ X, reais, mil, milhões
  valor: /R\$\s?\d+[.,]?\d*/g
} as const;
