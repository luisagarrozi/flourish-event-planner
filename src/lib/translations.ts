export const translations = {
  // Navigation
  dashboard: "Painel",
  tasks: "Tarefas",
  budget: "Orçamento",
  guestList: "Lista de Convidados",
  timeline: "Cronograma",
  vendors: "Fornecedores",
  settings: "Configurações",
  logout: "Sair",
  mainNavigation: "Navegação Principal",

  // App Title
  weddingPlanner: "Planejador de Casamento",
  pro: "Pro",

  // Events
  events: "Eventos",
  myEvents: "Meus Eventos",
  newEvent: "Novo Evento",
  createEvent: "Criar Evento",
  noEventsYet: "Você ainda não tem eventos.",
  viewDetails: "Ver detalhes",
  brideName: "Nome da Noiva",
  groomName: "Nome do Noivo",
  date: "Data",
  location: "Local",
  budgetLabel: "Orçamento",
  cancel: "Cancelar",
  save: "Salvar",

  // Dashboard
  weddingPlannerDashboard: "Painel do Planejador de Casamento",
  welcomeToYourWeddingPlanningCentralHub: "Bem-vindo ao seu centro de planejamento de casamento",
  welcomeToYourWeddingPlanner: "Bem-vindo ao seu Planejador de Casamento!",
  welcomeDescription: "Vamos começar definindo a data do seu casamento nas configurações abaixo. Isso nos ajudará a criar uma linha do tempo personalizada para você.",
  daysUntilWedding: "Dias até o Casamento",
  tasksCompleted: "Tarefas Concluídas",
  guestsRSVPd: "Convidados Confirmados",
  weddingInformation: "Informações do Casamento",
  clearAllData: "Limpar Todos os Dados",
  enterCoupleNamesAndWeddingDate: "Digite os nomes dos noivos e a data do casamento.",
  bridesName: "Nome da Noiva",
  enterBridesName: "Digite o nome da noiva",
  groomsName: "Nome do Noivo",
  enterGroomsName: "Digite o nome do noivo",
  weddingDate: "Data do Casamento",
  saveAllInformation: "Salvar Todas as Informações",
  recentTasks: "Tarefas Recentes",
  addTask: "Adicionar Tarefa",
  due: "Vencimento",

  // Tasks
  keepTrackOfYourWeddingPlanningProgress: "Acompanhe o progresso do planejamento do seu casamento",
  totalTasks: "Total de Tarefas",
  completed: "Concluídas",
  remaining: "Pendentes",
  allTasks: "Todas as Tarefas",
  high: "alta",
  medium: "média",
  low: "baixa",
  notStarted: "Não iniciado",
  used: "usado",
  organization: "Organização",
  searchTasksPlaceholder: "Buscar tarefas...",
  title: "Título",
  priority: "Prioridade",
  category: "Categoria",

  // Budget
  trackYourWeddingExpensesAndStayOnBudget: "Acompanhe suas despesas de casamento e mantenha-se no orçamento",
  totalBudget: "Orçamento Total",
  amountSpent: "Valor Gasto",
  budgetOverview: "Visão Geral do Orçamento",
  budgetUsed: "Orçamento Utilizado",
  budgetBreakdown: "Detalhamento do Orçamento",
  ofTotalBudget: "do orçamento total",

  // Guests
  manageYourWeddingGuestListAndRSVPs: "Gerencie sua lista de convidados e confirmações de presença",
  addGuest: "Adicionar Convidado",
  totalGuests: "Total de Convidados",
  attending: "Confirmados",
  pending: "Pendentes",
  declined: "Recusaram",
  allGuests: "Todos os Convidados",
  firstName: "Nome",
  lastName: "Sobrenome",
  name: "Nome",
  status: "Status",

  // Vendors
  addVendor: "Adicionar Fornecedor",
  phone: "Telefone",

  // Categories
  venue: "Local",
  invitations: "Convites",
  attire: "Vestimenta",
  photography: "Fotografia",
  catering: "Buffet",
  entertainment: "Entretenimento",
  flowers: "Flores",
  musicDJ: "Música/DJ",
  miscellaneous: "Diversos",

  // Task Titles
  bookWeddingVenue: "Reservar local do casamento",
  sendSaveTheDates: "Enviar save the dates",
  orderWeddingDress: "Encomendar vestido de noiva",
  bookPhotographer: "Reservar fotógrafo",
  chooseWeddingCake: "Escolher bolo de casamento",
  bookDJBand: "Reservar DJ/Banda",

  // Not Found
  pageNotFound: "Página não encontrada",
  oopsPageNotFound: "Ops! Página não encontrada",
  returnToHome: "Voltar ao Início",

  // Search
  search: "Pesquisar...",

  // RSVP Status
  unknown: "Desconhecido",

  // Currency (Brazilian Real)
  currency: "R$",

  // Authentication
  login: "Entrar",
  signUp: "Criar Conta",
  email: "Email",
  password: "Senha",
  loading: "Carregando...",
  loginToSeeEvents: "Faça login para ver seus eventos",
  alreadyHaveAccount: "Já tem uma conta? Entrar",
  noAccount: "Não tem conta? Criar conta",
  accountCreated: "Conta Criada!",
  checkEmailToActivate: "Verifique seu email para ativar sua conta.",
  ok: "OK",
  notSpecified: "Não especificado",
} as const;

export type TranslationKey = keyof typeof translations;

export const t = (key: TranslationKey): string => {
  return translations[key] || key;
};
