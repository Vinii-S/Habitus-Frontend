/** Rotas da aplicação — uma por tela do Figma (Telas-Engenharia). */
export const PATHS = {
  boasVindas: '/', // Figma: tela "Bem-vindo(a)!" (hábitos de hoje, conquistas de amanhã)
  entrar: '/entrar', // Figma: tela de login (e-mail/senha)
  cadastrar: '/cadastrar', // Figma: tela "Crie sua conta"
  inicio: '/inicio', // Figma: Início (dashboard)
  tarefas: '/tarefas', // Figma: Minhas Tarefas
  novaTarefa: '/tarefas/nova', // Figma: Criar tarefa
  tarefa: (id: number | string) => `/tarefas/${id}`, // Figma: Detalhes da tarefa
  minhaGuilda: '/guilda', // Figma: Minha Guilda
  guildas: '/guildas', // Figma: Explorar Guildas
  desafios: '/desafios', // Figma: Desafios da guilda
  ranking: '/ranking',
  perfil: '/perfil',
  conquistas: '/conquistas',
  progresso: '/progresso', // Figma: Progresso e Níveis
  loja: '/loja', // Figma: Loja de Prêmios
  notificacoes: '/notificacoes',
  configuracoes: '/configuracoes',
} as const;

export interface HandleRota {
  subtitulo?: string; // frase abaixo de "Olá, <nome>!" (copiada de cada tela)
  titulo?: string; // quando a tela não usa "Olá" (ex.: "Meu perfil")
}
