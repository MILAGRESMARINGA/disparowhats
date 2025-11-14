import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IContact, IMessageTemplate, IUser, IContactFilters } from '../types/crm';
import { SEED_CONTACTS } from '../utils/seedData';

/**
 * Estado global do CRM usando Zustand
 * Com persist para salvar dados no localStorage
 */
interface CRMState {
  // Estado
  contacts: IContact[];
  templates: IMessageTemplate[];
  user: IUser | null;
  filters: IContactFilters;

  // Ações - Contatos
  addContact: (contact: Omit<IContact, 'id' | 'dataCriacao' | 'historico'>) => void;
  updateContact: (id: string, updates: Partial<IContact>) => void;
  deleteContact: (id: string) => void;
  getContactById: (id: string) => IContact | undefined;
  getFilteredContacts: () => IContact[];

  // Ações - Filtros
  setFilters: (filters: Partial<IContactFilters>) => void;
  resetFilters: () => void;

  // Ações - Templates
  addTemplate: (template: Omit<IMessageTemplate, 'id'>) => void;
  deleteTemplate: (id: string) => void;

  // Ações - Usuário
  login: (username: string) => void;
  logout: () => void;

  // Ações - Dados
  resetData: () => void;
  exportData: () => string;
  importData: (data: string) => void;
}

/**
 * Filtros padrão
 */
const DEFAULT_FILTERS: IContactFilters = {
  busca: '',
  status: 'todos',
  tags: [],
  prioridade: 'todos'
};

/**
 * Store principal do CRM
 */
export const useCRMStore = create<CRMState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      contacts: SEED_CONTACTS,
      templates: [],
      user: null,
      filters: DEFAULT_FILTERS,

      /**
       * Adiciona um novo contato
       * @param contact - Dados do contato (sem id, dataCriacao e historico)
       */
      addContact: (contact) => {
        const newContact: IContact = {
          ...contact,
          id: crypto.randomUUID(),
          dataCriacao: new Date().toISOString(),
          historico: []
        };

        set((state) => ({
          contacts: [newContact, ...state.contacts]
        }));
      },

      /**
       * Atualiza um contato existente
       * @param id - ID do contato
       * @param updates - Campos a serem atualizados
       */
      updateContact: (id, updates) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id ? { ...contact, ...updates } : contact
          )
        }));
      },

      /**
       * Remove um contato
       * @param id - ID do contato a ser removido
       */
      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id)
        }));
      },

      /**
       * Busca um contato por ID
       * @param id - ID do contato
       * @returns Contato encontrado ou undefined
       */
      getContactById: (id) => {
        return get().contacts.find((contact) => contact.id === id);
      },

      /**
       * Retorna contatos filtrados baseado nos filtros ativos
       * @returns Array de contatos filtrados
       */
      getFilteredContacts: () => {
        const { contacts, filters } = get();
        let filtered = [...contacts];

        // Filtro de busca (nome ou telefone)
        if (filters.busca) {
          const searchLower = filters.busca.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.nome.toLowerCase().includes(searchLower) ||
              c.telefone.includes(searchLower)
          );
        }

        // Filtro de status
        if (filters.status !== 'todos') {
          filtered = filtered.filter((c) => c.status === filters.status);
        }

        // Filtro de prioridade
        if (filters.prioridade !== 'todos') {
          filtered = filtered.filter((c) => c.prioridade === filters.prioridade);
        }

        // Filtro de tags
        if (filters.tags.length > 0) {
          filtered = filtered.filter((c) =>
            filters.tags.some((tag) => c.tags.includes(tag))
          );
        }

        return filtered;
      },

      /**
       * Atualiza os filtros
       * @param filters - Filtros parciais a serem atualizados
       */
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters }
        }));
      },

      /**
       * Reseta os filtros para o padrão
       */
      resetFilters: () => {
        set({ filters: DEFAULT_FILTERS });
      },

      /**
       * Adiciona um novo template de mensagem
       * @param template - Dados do template (sem id)
       */
      addTemplate: (template) => {
        const newTemplate: IMessageTemplate = {
          ...template,
          id: crypto.randomUUID()
        };

        set((state) => ({
          templates: [...state.templates, newTemplate]
        }));
      },

      /**
       * Remove um template
       * @param id - ID do template a ser removido
       */
      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id)
        }));
      },

      /**
       * Faz login do usuário
       * @param username - Nome do usuário
       */
      login: (username) => {
        set({
          user: {
            username,
            isAuthenticated: true,
            loginTime: new Date().toISOString()
          }
        });
      },

      /**
       * Faz logout do usuário
       */
      logout: () => {
        set({ user: null });
      },

      /**
       * Reseta todos os dados para o estado inicial
       */
      resetData: () => {
        set({
          contacts: SEED_CONTACTS,
          templates: [],
          filters: DEFAULT_FILTERS
        });
      },

      /**
       * Exporta dados como JSON string
       * @returns String JSON com todos os dados
       */
      exportData: () => {
        const { contacts, templates } = get();
        return JSON.stringify({ contacts, templates }, null, 2);
      },

      /**
       * Importa dados de JSON string
       * @param data - String JSON com dados a serem importados
       */
      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({
            contacts: parsed.contacts || [],
            templates: parsed.templates || []
          });
        } catch (error) {
          console.error('[CRM] Erro ao importar dados:', error);
          throw new Error('Formato de dados inválido');
        }
      }
    }),
    {
      name: 'crm-whatsapp-pro',
      partialize: (state) => ({
        contacts: state.contacts,
        templates: state.templates,
        user: state.user
      })
    }
  )
);
