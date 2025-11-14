import { IContact } from '../types/crm';

/**
 * Dados de exemplo (seed) para popular o CRM
 * 10 contatos fictícios com informações variadas
 */
export const SEED_CONTACTS: IContact[] = [
  {
    id: '1',
    nome: 'João Silva',
    telefone: '(11) 98765-4321',
    email: 'joao.silva@email.com',
    status: 'novo',
    prioridade: 'alta',
    tags: ['VIP', 'Indicação'],
    dataCriacao: '2024-11-10T10:00:00.000Z',
    ultimoContato: '2024-11-14T08:30:00.000Z',
    aniversario: '03-15',
    observacoes: 'Interessado em apartamento na Zona Sul',
    historico: [
      {
        id: 'm1',
        texto: 'Bom dia! Gostaria de informações sobre apartamentos.',
        data: '2024-11-14T08:30:00.000Z',
        tipo: 'recebida'
      },
      {
        id: 'm2',
        texto: 'Olá João! Temos ótimas opções. Qual faixa de preço você procura?',
        data: '2024-11-14T08:35:00.000Z',
        tipo: 'enviada'
      }
    ]
  },
  {
    id: '2',
    nome: 'Maria Santos',
    telefone: '(11) 97654-3210',
    email: 'maria.santos@email.com',
    status: 'negociacao',
    prioridade: 'alta',
    tags: ['Urgente', 'Corporativo'],
    dataCriacao: '2024-11-08T14:20:00.000Z',
    ultimoContato: '2024-11-13T16:45:00.000Z',
    aniversario: '07-22',
    observacoes: 'Precisa de imóvel comercial até dezembro',
    historico: [
      {
        id: 'm3',
        texto: 'Estou buscando um ponto comercial na região central',
        data: '2024-11-13T16:00:00.000Z',
        tipo: 'recebida'
      },
      {
        id: 'm4',
        texto: 'Temos várias opções! Posso agendar uma visita?',
        data: '2024-11-13T16:45:00.000Z',
        tipo: 'enviada'
      }
    ]
  },
  {
    id: '3',
    nome: 'Carlos Oliveira',
    telefone: '(21) 99876-5432',
    status: 'proposta',
    prioridade: 'media',
    tags: ['Financiamento'],
    dataCriacao: '2024-11-05T09:15:00.000Z',
    ultimoContato: '2024-11-12T11:20:00.000Z',
    aniversario: '12-10',
    observacoes: 'Aguardando aprovação do financiamento',
    historico: [
      {
        id: 'm5',
        texto: 'Consegui a pré-aprovação do banco!',
        data: '2024-11-12T11:20:00.000Z',
        tipo: 'recebida'
      }
    ]
  },
  {
    id: '4',
    nome: 'Ana Paula Costa',
    telefone: '(11) 96543-2109',
    email: 'ana.costa@email.com',
    status: 'fechado',
    prioridade: 'baixa',
    tags: ['Cliente Satisfeito'],
    dataCriacao: '2024-10-20T13:00:00.000Z',
    ultimoContato: '2024-11-10T10:00:00.000Z',
    aniversario: '05-18',
    observacoes: 'Compra concluída - apartamento 3 quartos',
    historico: [
      {
        id: 'm6',
        texto: 'Muito obrigada por tudo! Adorei o apartamento!',
        data: '2024-11-10T10:00:00.000Z',
        tipo: 'recebida'
      }
    ]
  },
  {
    id: '5',
    nome: 'Pedro Henrique Lima',
    telefone: '(11) 95432-1098',
    status: 'perdido',
    prioridade: 'baixa',
    tags: ['Preço Alto'],
    dataCriacao: '2024-11-01T15:30:00.000Z',
    ultimoContato: '2024-11-05T09:00:00.000Z',
    aniversario: '09-25',
    observacoes: 'Desistiu por questões financeiras',
    historico: [
      {
        id: 'm7',
        texto: 'Infelizmente não vou conseguir fechar negócio agora',
        data: '2024-11-05T09:00:00.000Z',
        tipo: 'recebida'
      }
    ]
  },
  {
    id: '6',
    nome: 'Fernanda Rodrigues',
    telefone: '(21) 98765-1234',
    email: 'fernanda.r@email.com',
    status: 'novo',
    prioridade: 'media',
    tags: ['Primeira Compra'],
    dataCriacao: '2024-11-12T11:00:00.000Z',
    ultimoContato: '2024-11-12T11:00:00.000Z',
    aniversario: '01-30',
    observacoes: 'Primeira vez comprando imóvel',
    historico: []
  },
  {
    id: '7',
    nome: 'Ricardo Alves',
    telefone: '(11) 94321-0987',
    status: 'negociacao',
    prioridade: 'alta',
    tags: ['VIP', 'Investidor'],
    dataCriacao: '2024-11-07T08:45:00.000Z',
    ultimoContato: '2024-11-14T09:15:00.000Z',
    aniversario: '04-12',
    observacoes: 'Investidor interessado em múltiplos imóveis',
    historico: [
      {
        id: 'm8',
        texto: 'Quero ver mais opções de investimento',
        data: '2024-11-14T09:15:00.000Z',
        tipo: 'recebida'
      }
    ]
  },
  {
    id: '8',
    nome: 'Juliana Martins',
    telefone: '(11) 93210-8765',
    email: 'ju.martins@email.com',
    status: 'proposta',
    prioridade: 'alta',
    tags: ['Urgente'],
    dataCriacao: '2024-11-06T16:20:00.000Z',
    ultimoContato: '2024-11-13T14:30:00.000Z',
    aniversario: '08-05',
    observacoes: 'Precisa mudar até janeiro',
    historico: [
      {
        id: 'm9',
        texto: 'Gostei muito do imóvel que você mostrou!',
        data: '2024-11-13T14:30:00.000Z',
        tipo: 'recebida'
      }
    ]
  },
  {
    id: '9',
    nome: 'Roberto Souza',
    telefone: '(21) 92109-8764',
    status: 'fechado',
    prioridade: 'media',
    tags: ['Cliente Satisfeito', 'Indicação'],
    dataCriacao: '2024-10-15T10:30:00.000Z',
    ultimoContato: '2024-11-08T15:00:00.000Z',
    aniversario: '11-14',
    observacoes: 'Compra finalizada - indicou 2 amigos',
    historico: [
      {
        id: 'm10',
        texto: 'Parabéns pelo excelente atendimento!',
        data: '2024-11-08T15:00:00.000Z',
        tipo: 'recebida'
      }
    ]
  },
  {
    id: '10',
    nome: 'Camila Ferreira',
    telefone: '(11) 91098-7653',
    email: 'camila.f@email.com',
    status: 'novo',
    prioridade: 'media',
    tags: ['WhatsApp'],
    dataCriacao: '2024-11-13T13:45:00.000Z',
    ultimoContato: '2024-11-13T13:45:00.000Z',
    aniversario: '06-28',
    observacoes: 'Contato via WhatsApp - interessada em casas',
    historico: [
      {
        id: 'm11',
        texto: 'Oi! Vi seu anúncio e gostaria de mais informações',
        data: '2024-11-13T13:45:00.000Z',
        tipo: 'recebida'
      }
    ]
  }
];
