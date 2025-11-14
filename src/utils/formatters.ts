/**
 * Funções utilitárias de formatação de dados
 */

/**
 * Formata data ISO para formato brasileiro
 * @param isoDate - Data em formato ISO
 * @returns Data formatada (DD/MM/YYYY HH:mm)
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Formata data ISO para formato de data simples
 * @param isoDate - Data em formato ISO
 * @returns Data formatada (DD/MM/YYYY)
 */
export const formatDateOnly = (isoDate: string): string => {
  const date = new Date(isoDate);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formata data para "tempo relativo" (ex: há 2 dias)
 * @param isoDate - Data em formato ISO
 * @returns String com tempo relativo
 */
export const formatRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays === 1) return 'ontem';
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} meses`;
  return `há ${Math.floor(diffDays / 365)} anos`;
};

/**
 * Verifica se hoje é aniversário do contato
 * @param aniversario - Data do aniversário no formato MM-DD
 * @returns true se hoje é aniversário
 */
export const isToday = (aniversario?: string): boolean => {
  if (!aniversario) return false;

  const today = new Date();
  const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const todayDay = today.getDate().toString().padStart(2, '0');
  const todayStr = `${todayMonth}-${todayDay}`;

  return aniversario === todayStr;
};

/**
 * Verifica se um contato está inativo (sem contato há mais de 7 dias)
 * @param ultimoContato - Data do último contato em ISO
 * @returns true se está inativo
 */
export const isInactive = (ultimoContato: string): boolean => {
  const lastContact = new Date(ultimoContato);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastContact.getTime()) / 86400000);

  return diffDays > 7;
};

/**
 * Formata valor monetário para formato brasileiro
 * @param value - Valor numérico
 * @returns Valor formatado (R$ X.XXX,XX)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata porcentagem
 * @param value - Valor decimal (0.5 = 50%)
 * @param decimals - Número de casas decimais
 * @returns Porcentagem formatada (50%)
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Trunca texto longo adicionando reticências
 * @param text - Texto a truncar
 * @param maxLength - Tamanho máximo
 * @returns Texto truncado
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Retorna iniciais do nome para avatar
 * @param nome - Nome completo
 * @returns Iniciais (máximo 2 letras)
 */
export const getInitials = (nome: string): string => {
  const parts = nome.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return nome.substring(0, 2).toUpperCase();
};

/**
 * Remove acentos de uma string
 * @param text - Texto com acentos
 * @returns Texto sem acentos
 */
export const removeAccents = (text: string): string => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
