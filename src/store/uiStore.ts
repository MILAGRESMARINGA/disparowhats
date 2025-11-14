import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Tema da aplicação
 */
export type Theme = 'light' | 'dark';

/**
 * Estado da interface do usuário
 */
interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  modalOpen: string | null;
  loading: boolean;

  // Ações
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Store para estado da UI
 * Com suporte a Dark Mode e controle de interface
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      modalOpen: null,
      loading: false,

      /**
       * Alterna entre tema claro e escuro
       */
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';

          // Atualizar classe no documento
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }

          return { theme: newTheme };
        });
      },

      /**
       * Define o tema manualmente
       * @param theme - Tema a ser aplicado
       */
      setTheme: (theme) => {
        set({ theme });

        // Atualizar classe no documento
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      /**
       * Alterna estado da sidebar (mobile)
       */
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      /**
       * Define estado da sidebar
       * @param open - Se a sidebar deve estar aberta
       */
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      /**
       * Abre um modal específico
       * @param modalId - ID do modal a abrir
       */
      openModal: (modalId) => {
        set({ modalOpen: modalId });
      },

      /**
       * Fecha o modal ativo
       */
      closeModal: () => {
        set({ modalOpen: null });
      },

      /**
       * Define estado de loading global
       * @param loading - Estado de loading
       */
      setLoading: (loading) => {
        set({ loading });
      }
    }),
    {
      name: 'crm-ui-settings',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
);

/**
 * Inicializa o tema ao carregar a aplicação
 */
export const initializeTheme = () => {
  const theme = useUIStore.getState().theme;

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
