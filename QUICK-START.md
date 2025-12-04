# 🚀 Guia Rápido - CRM WhatsApp Pro

## 📦 Comandos Essenciais

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview
```

---

## 🔑 Credenciais

```
Usuário: admin
Senha: Master@2024
```

---

## 📁 Imports com Path Aliases

```tsx
// ✅ Use imports limpos
import Button from '@/components/ui/Button';
import { useCRMStore } from '@/store/useCRMStore';
import { formatDate } from '@/utils/formatters';

// ❌ Evite imports relativos
import Button from '../../../components/ui/Button';
```

---

## 🎨 Componentes Principais

### Button
```tsx
<Button variant="primary" size="md" loading={false}>
  Salvar
</Button>
```

### Input com Validação
```tsx
<Input
  label="Nome"
  error={errors.nome?.message}
  icon={<User />}
  required
/>
```

### Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Novo Contato"
>
  <ContactForm />
</Modal>
```

### Toast
```tsx
const { success, error } = useToast();

success('Contato salvo!');
error('Erro ao salvar');
```

### Dark Mode
```tsx
import { useUIStore } from '@/store/uiStore';

const { theme, toggleTheme } = useUIStore();
```

---

## 💾 Store Zustand

### Usar Store
```tsx
import { useCRMStore } from '@/store/useCRMStore';

function MyComponent() {
  const { contacts, addContact, updateContact } = useCRMStore();

  // Adicionar contato
  addContact({
    nome: 'João Silva',
    telefone: '(11) 98765-4321',
    status: 'novo',
    prioridade: 'alta',
    tags: [],
    ultimoContato: new Date().toISOString()
  });

  // Atualizar contato
  updateContact('id-123', {
    status: 'negociacao'
  });
}
```

### Filtrar Contatos
```tsx
const { getFilteredContacts, setFilters } = useCRMStore();

// Aplicar filtros
setFilters({
  busca: 'João',
  status: 'novo',
  prioridade: 'alta'
});

// Obter filtrados
const filtered = getFilteredContacts();
```

---

## 🤖 Extração de Dados

```tsx
import { ExtractionService } from '@/services/extractionService';

const message = "Meu nome é João, telefone (11) 98765-4321, bairro Jardins";

// Extrair tudo
const data = ExtractionService.extractAll(message);
// { nome: "João", telefone: "(11) 98765-4321", bairro: "Jardins" }

// Com confiança
const result = ExtractionService.extractWithConfidence(message);
// { data: {...}, confidence: 60, fieldsFound: 3 }
```

---

## 📝 Templates de Mensagem

```tsx
import { useMessageTemplate } from '@/hooks/useMessageTemplate';

const { processTemplate, availableVariables } = useMessageTemplate();

// Processar template
const message = processTemplate(
  "Olá {nome}! Hoje é {data}. Temos opções no {bairro}.",
  contact
);

// Variáveis disponíveis:
// {nome}   - Nome do contato
// {data}   - Data atual formatada
// {bairro} - Bairro das observações
```

---

## ⚡ Debounce para Performance

```tsx
import { useDebounce } from '@/hooks/useDebounce';

const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

useEffect(() => {
  // Só executa após 500ms de inatividade
  searchContacts(debouncedSearch);
}, [debouncedSearch]);
```

---

## 🎯 Validações

```tsx
import {
  validatePhone,
  validateEmail,
  validateName
} from '@/utils/validators';

// Validar telefone BR
const phoneError = validatePhone('(11) 98765-4321');
// null se válido, string com erro se inválido

// Validar email
const emailError = validateEmail('user@example.com');

// Validar nome
const nameError = validateName('João Silva');
```

---

## 📅 Formatação de Datas

```tsx
import {
  formatDate,
  formatRelativeTime,
  isToday,
  isInactive
} from '@/utils/formatters';

// Formatar data
formatDate('2024-01-15T10:00:00Z');
// "15/01/2024 10:00"

// Tempo relativo
formatRelativeTime('2024-01-10T10:00:00Z');
// "há 5 dias"

// Verificar aniversário hoje
isToday('01-15'); // true se hoje é 15 de janeiro

// Verificar inatividade
isInactive('2024-01-01T10:00:00Z'); // true se > 7 dias
```

---

## 🎨 Classes Tailwind para Dark Mode

```tsx
<div className="bg-slate-800 dark:bg-slate-900">
  <h1 className="text-white dark:text-slate-100">
    Título
  </h1>
  <p className="text-slate-400 dark:text-slate-300">
    Descrição
  </p>
</div>
```

---

## 📱 Layout Responsivo

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards responsivos */}
</div>

<div className="hidden lg:block">
  {/* Visível apenas em desktop */}
</div>

<div className="lg:hidden">
  {/* Visível apenas em mobile */}
</div>
```

---

## 🔄 Loading States

```tsx
import { ContactCardSkeleton } from '@/components/ui/Skeleton';

{loading ? (
  <ContactCardSkeleton />
) : (
  <ContactCard {...contact} />
)}
```

---

## 📊 Status e Badges

```tsx
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';

<StatusBadge status="novo" />
<StatusBadge status="negociacao" />
<StatusBadge status="fechado" />

<PriorityBadge priority="alta" />
<PriorityBadge priority="media" />
<PriorityBadge priority="baixa" />
```

---

## 🎭 Animações Framer Motion

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Clique
</motion.button>
```

---

## 📋 Criar Nova Página

```tsx
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';

const NovaPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-[1920px] mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Título da Página
          </h1>
          <p className="text-slate-400">Descrição</p>
        </div>

        <Card>
          {/* Conteúdo */}
        </Card>
      </div>
    </MainLayout>
  );
};

export default NovaPage;
```

---

## 🔧 Constantes do Sistema

```tsx
import {
  LIMITS,
  CONTACT_STATUS,
  CONTACT_PRIORITY,
  MESSAGE_VARIABLES
} from '@/utils/constants';

// Limites
LIMITS.MAX_MESSAGE_LENGTH    // 1000
LIMITS.MAX_FILE_SIZE_IMAGE   // 5MB
LIMITS.MAX_FILE_SIZE_PDF     // 10MB

// Status com cores
CONTACT_STATUS.novo.label    // "Novo Lead"
CONTACT_STATUS.novo.color    // "text-blue-400"

// Prioridades
CONTACT_PRIORITY.alta.label  // "Alta"
CONTACT_PRIORITY.alta.icon   // "🔴"
```

---

## 🧪 Dados de Teste

```tsx
import { SEED_CONTACTS } from '@/utils/seedData';

// 10 contatos de exemplo pré-carregados
console.log(SEED_CONTACTS);
```

---

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Arquivos Gerados
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   ├── vendor-react-[hash].js
│   └── vendor-supabase-[hash].js
```

### Hospedar
- **Vercel**: `vercel --prod`
- **Netlify**: Arraste pasta `dist/`
- **GitHub Pages**: Configure no repositório

---

## 📚 Referências Rápidas

### Documentação
- `PROMPT-COMPLETO.md` - Prompt detalhado completo
- `SYSTEM-OVERVIEW.md` - Visão geral da arquitetura
- `OPTIMIZED-FEATURES.md` - Features otimizadas
- `INTERFACE-GUIDE.md` - Guia da interface

### Estrutura de Pastas
```
src/
├── components/ui/     # Componentes reutilizáveis
├── components/layout/ # Layout (Sidebar, Header)
├── pages/            # Páginas da aplicação
├── hooks/            # Custom hooks
├── store/            # Zustand stores
├── services/         # Lógica de negócio
├── utils/            # Utilitários
└── types/            # Tipos TypeScript
```

---

## ✅ Checklist de Deploy

- [ ] `npm run build` sem erros
- [ ] Testar em mobile
- [ ] Testar dark mode
- [ ] Verificar performance (Lighthouse)
- [ ] Configurar variáveis de ambiente
- [ ] Testar todas as rotas
- [ ] Verificar loading states
- [ ] Testar formulários e validações

---

**Sistema pronto para uso! 🚀**
