/**
 * Funções de validação de dados
 * Todas retornam string com mensagem de erro ou null se válido
 */

/**
 * Valida formato de telefone brasileiro
 * Aceita: (XX) 9XXXX-XXXX ou (XX) XXXXX-XXXX
 * @param telefone - Telefone a ser validado
 * @returns Mensagem de erro ou null se válido
 */
export const validatePhone = (telefone: string): string | null => {
  const phoneRegex = /^\(\d{2}\)\s9?\d{4}-\d{4}$/;

  if (!telefone || telefone.trim() === '') {
    return 'Telefone é obrigatório';
  }

  if (!phoneRegex.test(telefone)) {
    return 'Formato inválido. Use: (XX) 9XXXX-XXXX';
  }

  return null;
};

/**
 * Valida formato de email
 * @param email - Email a ser validado
 * @returns Mensagem de erro ou null se válido
 */
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === '') {
    return null; // Email é opcional
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }

  return null;
};

/**
 * Valida nome (mínimo 3 caracteres)
 * @param nome - Nome a ser validado
 * @returns Mensagem de erro ou null se válido
 */
export const validateName = (nome: string): string | null => {
  if (!nome || nome.trim() === '') {
    return 'Nome é obrigatório';
  }

  if (nome.trim().length < 3) {
    return 'Nome deve ter pelo menos 3 caracteres';
  }

  return null;
};

/**
 * Valida data de aniversário (não pode ser futura)
 * Formato esperado: MM-DD
 * @param aniversario - Data do aniversário
 * @returns Mensagem de erro ou null se válido
 */
export const validateBirthday = (aniversario: string): string | null => {
  if (!aniversario || aniversario.trim() === '') {
    return null; // Aniversário é opcional
  }

  const dateRegex = /^\d{2}-\d{2}$/;

  if (!dateRegex.test(aniversario)) {
    return 'Formato inválido. Use: MM-DD';
  }

  const [month, day] = aniversario.split('-').map(Number);

  if (month < 1 || month > 12) {
    return 'Mês inválido (1-12)';
  }

  if (day < 1 || day > 31) {
    return 'Dia inválido (1-31)';
  }

  return null;
};

/**
 * Formata telefone para padrão brasileiro
 * Remove tudo exceto números e formata
 * @param telefone - Telefone a ser formatado
 * @returns Telefone formatado
 */
export const formatPhone = (telefone: string): string => {
  // Remove tudo exceto números
  const numbers = telefone.replace(/\D/g, '');

  // Se tem 11 dígitos (com 9)
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }

  // Se tem 10 dígitos (sem 9)
  if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }

  return telefone;
};

/**
 * Verifica se telefone já existe na lista de contatos
 * @param telefone - Telefone a verificar
 * @param contacts - Lista de contatos
 * @param excludeId - ID do contato a excluir da verificação (para edição)
 * @returns true se telefone já existe
 */
export const phoneExists = (
  telefone: string,
  contacts: Array<{ id: string; telefone: string }>,
  excludeId?: string
): boolean => {
  return contacts.some(
    (c) => c.telefone === telefone && c.id !== excludeId
  );
};

/**
 * Valida limite de caracteres
 * @param text - Texto a validar
 * @param maxLength - Limite máximo de caracteres
 * @returns Mensagem de erro ou null se válido
 */
export const validateMaxLength = (text: string, maxLength: number): string | null => {
  if (text.length > maxLength) {
    return `Máximo de ${maxLength} caracteres (${text.length}/${maxLength})`;
  }
  return null;
};
