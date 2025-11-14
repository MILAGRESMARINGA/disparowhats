import { useMemo } from 'react';
import { IContact } from '../types/crm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Hook para processar templates de mensagem com variáveis
 *
 * Variáveis suportadas:
 * - {nome} - Nome do contato
 * - {data} - Data atual formatada
 * - {bairro} - Bairro/localização (se disponível nas observações)
 *
 * @example
 * ```tsx
 * const { processTemplate } = useMessageTemplate();
 *
 * const message = processTemplate(
 *   "Olá {nome}! Hoje é {data}",
 *   contact
 * );
 * ```
 */
export const useMessageTemplate = () => {
  /**
   * Processa template substituindo variáveis pelos valores do contato
   * @param template - Template com variáveis
   * @param contact - Contato com os dados
   * @returns Mensagem processada
   */
  const processTemplate = (template: string, contact: IContact): string => {
    let processed = template;

    // Substituir {nome}
    if (contact.nome) {
      processed = processed.replace(/{nome}/gi, contact.nome);
    }

    // Substituir {data}
    const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    processed = processed.replace(/{data}/gi, today);

    // Substituir {bairro} - extrair das observações se disponível
    const bairro = extractBairroFromNotes(contact.observacoes);
    if (bairro) {
      processed = processed.replace(/{bairro}/gi, bairro);
    } else {
      // Remover variável se não houver bairro
      processed = processed.replace(/{bairro}/gi, '[bairro não disponível]');
    }

    return processed;
  };

  /**
   * Gera preview do template com dados de exemplo
   * @param template - Template a visualizar
   * @returns Preview da mensagem
   */
  const generatePreview = (template: string): string => {
    const exampleContact: IContact = {
      id: 'preview',
      nome: 'João Silva',
      telefone: '(11) 98765-4321',
      status: 'novo',
      prioridade: 'media',
      tags: [],
      dataCriacao: new Date().toISOString(),
      ultimoContato: new Date().toISOString(),
      observacoes: 'Interessado em apartamento no bairro Jardins',
      historico: []
    };

    return processTemplate(template, exampleContact);
  };

  /**
   * Valida se o template contém variáveis válidas
   * @param template - Template a validar
   * @returns Array de variáveis inválidas (vazio se todas válidas)
   */
  const validateTemplate = (template: string): string[] => {
    const validVariables = ['{nome}', '{data}', '{bairro}'];
    const foundVariables = template.match(/\{[^}]+\}/gi) || [];

    return foundVariables.filter(
      (variable) => !validVariables.includes(variable.toLowerCase())
    );
  };

  /**
   * Lista todas as variáveis disponíveis com descrições
   */
  const availableVariables = useMemo(
    () => [
      {
        key: '{nome}',
        label: 'Nome do Contato',
        description: 'Substitui pelo nome completo do contato',
        example: 'João Silva'
      },
      {
        key: '{data}',
        label: 'Data Atual',
        description: 'Substitui pela data de hoje formatada',
        example: format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      },
      {
        key: '{bairro}',
        label: 'Bairro',
        description: 'Substitui pelo bairro extraído das observações',
        example: 'Jardins'
      }
    ],
    []
  );

  return {
    processTemplate,
    generatePreview,
    validateTemplate,
    availableVariables
  };
};

/**
 * Função auxiliar para extrair bairro das observações
 * @param observacoes - Observações do contato
 * @returns Bairro encontrado ou undefined
 */
function extractBairroFromNotes(observacoes?: string): string | undefined {
  if (!observacoes) return undefined;

  // Padrões para detectar bairro
  const patterns = [
    /bairro\s+([A-Za-zÀ-ÿ\s]+)/i,
    /região\s+([A-Za-zÀ-ÿ\s]+)/i,
    /\s+em\s+([A-Za-zÀ-ÿ]+)/i,
    /\s+no\s+([A-Za-zÀ-ÿ]+)/i
  ];

  for (const pattern of patterns) {
    const match = observacoes.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}
