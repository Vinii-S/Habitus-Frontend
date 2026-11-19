/**
 * ⚠️ CAMINHOS PROVISÓRIOS.
 * A documentação (relatório, casos de uso, diagramas) NÃO define o contrato da API FastAPI.
 * Este arquivo concentra todos os caminhos para que, quando o backend publicar o contrato
 * (OpenAPI do FastAPI), apenas este arquivo precise ser ajustado.
 * Cada chave corresponde a uma funcionalidade que existe nas telas do Figma.
 */
export const ENDPOINTS = {
  auth: {
    login: '/auth/login', // RF01 / caso de uso "Fazer Login"
    cadastro: '/auth/cadastro', // RF01 / caso de uso "Criar Conta"
    perfilResumo: '/perfil/resumo',
  },
  atividades: {
    painel: '/atividades', // RF05 — Minhas Tarefas
    criar: '/atividades', // UC001 — Cadastrar Atividade
    detalhe: (id: number) => `/atividades/${id}`,
    checkIn: (id: number) => `/atividades/${id}/checkins`, // RF05 + RF06 (multipart com prova)
    excluir: (id: number) => `/atividades/${id}`,
  },
  perfil: {
    obter: '/perfil',
    atualizar: '/perfil',
  },
  grupos: {
    minha: '/grupos/minha', // RF03
    explorar: '/grupos',
    mural: (grupoId: number) => `/grupos/${grupoId}/mural`, // RF07
    publicar: (grupoId: number) => `/grupos/${grupoId}/mural`,
  },
  ranking: (periodo: string) => `/ranking?periodo=${periodo}`, // RF08
  desafios: '/desafios', // só nas telas do Figma
  conquistas: '/conquistas', // só nas telas do Figma
  progresso: '/progresso', // funcionalidade 10 — Dashboard de Estatísticas
  loja: {
    painel: '/loja', // funcionalidade 7
    resgatar: (id: number) => `/loja/${id}/resgatar`,
  },
  notificacoes: {
    listar: '/notificacoes', // só nas telas do Figma
    marcarTodasLidas: '/notificacoes/ler-todas',
  },
  configuracoes: {
    notificacoes: '/configuracoes/notificacoes',
  },
} as const;
