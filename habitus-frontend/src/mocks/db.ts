/**
 * Dados simulados, transcritos das telas do Figma (Telas-Engenharia/*.jpeg), para que o frontend
 * funcione sem backend. NÃO são dados reais. Inconsistências entre telas (ex.: progresso das tarefas
 * na tela Início × Minhas Tarefas; nível/XP da guilda Invictus em Explorar × Minha Guilda) foram
 * resolvidas escolhendo UMA versão — ver docs/ARQUITETURA.md, seção 5.
 *
 * Remover este diretório quando VITE_USE_MOCKS=false for o padrão.
 */
import type {
  Atividade,
  CheckIn,
  Conquista,
  DetalheAtividade,
  DetalheGuilda,
  Desafio,
  Grupo,
  MembroGrupo,
  Notificacao,
  PainelConquistas,
  PainelDesafios,
  PainelLoja,
  PainelProgresso,
  PainelTarefas,
  Personagem,
  PostagemMural,
  Recompensa,
  ResumoRanking,
  LinhaRanking,
  Usuario,
  PreferenciasNotificacao,
  PeriodoRanking,
} from '@/types/domain';

export const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
let seq = 1000;
const nextId = () => ++seq;

// ---------- Usuário e personagem (tela Perfil / Sidebar) ----------
export const usuario: Usuario = {
  id: 1,
  nomeCompleto: 'Ronald Barbosa',
  nomeExibicao: 'Ronald',
  email: 'ronald@gmail.com',
  dataNascimento: '2006-07-12',
  genero: 'Masculino',
  bio: 'Em busca de uma vida mais produtiva e equilibrada. Foco, consistência e progresso diário!',
};

export const personagem: Personagem = {
  id: 1,
  nivel: 4,
  xpAtual: 2430,
  xpProximoNivel: 3000,
  moedasOuro: 2430, // tela Loja: "2.430 pontos disponíveis" (relação pontos × moedasOuro × XP é lacuna)
  forca: 0,
  intelecto: 0,
  constituicao: 0,
};

// ---------- Atividades (tela Minhas Tarefas) ----------
const base = (a: Partial<Atividade> & Pick<Atividade, 'id' | 'nome' | 'descricao' | 'categoria' | 'xpRecompensa' | 'status' | 'progresso' | 'hoje'>): Atividade => ({
  frequencia: 'Diária',
  statusAtiva: true,
  duracaoEstimadaMin: 30,
  ...a,
});

export const atividades: Atividade[] = [
  base({ id: 1, nome: 'Ler livro', descricao: 'Ler algumas páginas do livro e manter o hábito de leitura.', categoria: 'Leitura', xpRecompensa: 100, status: 'Concluída', progresso: 100, hoje: true, meta: '30 minutos por dia' }),
  base({ id: 2, nome: 'Ir para academia', descricao: 'Realizar o treino do dia e manter a rotina de exercícios.', categoria: 'Saúde', xpRecompensa: 150, status: 'Em andamento', progresso: 50, hoje: true }),
  base({ id: 3, nome: 'Estudar', descricao: 'Revisar os principais conteúdos e se preparar para a próxima prova.', categoria: 'Estudos', xpRecompensa: 25, status: 'Em andamento', progresso: 25, hoje: true }),
  base({ id: 4, nome: 'Beber água', descricao: 'Manter a hidratação ao longo do dia.', categoria: 'Saúde', xpRecompensa: 125, status: 'Não iniciada', progresso: 0, hoje: false }),
  base({ id: 5, nome: 'Meditar', descricao: 'Praticar meditação uma vez por dia', categoria: 'Bem-estar', xpRecompensa: 75, status: 'Não iniciada', progresso: 0, hoje: false }),
  base({ id: 6, nome: 'Dormir bem', descricao: 'Ter pelo menos 8 horas de sono', categoria: 'Saúde', xpRecompensa: 100, status: 'Não iniciada', progresso: 0, hoje: false }),
];

export const resumoSemana: PainelTarefas['resumoSemana'] = { intervalo: '1 - 7 out', xp: 520, concluidas: 5, emAndamento: 2, naoIniciadas: 1 };
export const metaSemanal: PainelTarefas['metaSemanal'] = { descricao: 'Complete pelo menos 7 tarefas essa semana.', feitas: 5, total: 7 };

export const historicoLerLivro: CheckIn[] = [
  { id: 1, atividadeId: 1, dataHora: '2026-10-04T19:42:00', statusValidacao: 'validado', xpGanho: 100, sequenciaStreak: 5, minutos: 30, realizada: true },
  { id: 2, atividadeId: 1, dataHora: '2026-10-04T19:42:00', statusValidacao: 'nao-realizada', xpGanho: 0, sequenciaStreak: 0, realizada: false },
  { id: 3, atividadeId: 1, dataHora: '2026-10-04T19:42:00', statusValidacao: 'validado', xpGanho: 100, sequenciaStreak: 4, minutos: 35, realizada: true },
  { id: 4, atividadeId: 1, dataHora: '2026-10-04T19:42:00', statusValidacao: 'validado', xpGanho: 100, sequenciaStreak: 3, minutos: 30, realizada: true },
  { id: 5, atividadeId: 1, dataHora: '2026-10-04T19:42:00', statusValidacao: 'validado', xpGanho: 100, sequenciaStreak: 2, minutos: 40, realizada: true },
];

export const detalheDe = (a: Atividade): DetalheAtividade => ({
  atividade: a,
  semana: [
    { rotulo: 'Seg', data: '29/09', feito: true },
    { rotulo: 'Ter', data: '30/09', feito: true },
    { rotulo: 'Qua', data: '01/10', feito: true },
    { rotulo: 'Qui', data: '02/10', feito: true },
    { rotulo: 'Sex', data: '03/10', feito: true },
    { rotulo: 'Sáb', data: '04/10', feito: false },
    { rotulo: 'Dom', data: '05/10', feito: false },
  ],
  diasFeitos: 5,
  estatisticas: { conclusoesTotais: 12, taxaConclusao: 71, sequenciaAtual: 5, melhorSequencia: 12 },
  historico: historicoLerLivro.map((h) => ({ ...h, atividadeId: a.id })),
  motivacao: 'Ler é uma ótima maneira de aprender coisas novas e melhorar a concentração. Tente separar pelo menos 30 minutos do seu dia para ler algo que goste, seja um livro físico, digital ou até um audiobook. O importante é criar o hábito e seguir no seu ritmo.',
  citacao: 'Não importa quantas páginas você lê, mas sim continuar lendo.',
});

export function nova(a: Omit<Atividade, 'id' | 'xpRecompensa' | 'statusAtiva' | 'status' | 'progresso' | 'hoje'>): Atividade {
  const criada: Atividade = { ...a, id: nextId(), xpRecompensa: 100, statusAtiva: true, status: 'Não iniciada', progresso: 0, hoje: false };
  atividades.push(criada);
  return criada;
}

// ---------- Guildas ----------
const U = (id: number, nomeExibicao: string) => ({ id, nomeExibicao });
const membro = (id: number, nome: string, papel: MembroGrupo['papel'], xp: number): MembroGrupo => ({ id, papel, pontuacaoSemanal: xp, usuario: U(id, nome) });

const guildaBase = (g: Pick<Grupo, 'id' | 'nome' | 'totalMembros' | 'nivelGrupo' | 'xpTotal' | 'icone'> & Partial<Grupo>): Grupo => ({
  descricao: 'Juntos tornamos hoje melhor que ontem',
  categorias: ['Produtividade', 'Estudos', 'Vida pessoal'],
  ...g,
});

export const invictus: Grupo = guildaBase({ id: 1, nome: 'Invictus', totalMembros: 7, nivelGrupo: 5, xpTotal: 5505, xpProximoNivel: 7500, icone: 'escudo', descricao: 'Juntos tornando hoje melhor que ontem!', codigoConvite: 'INVICTUS' });

export const guildasExplorar: Grupo[] = [
  guildaBase({ id: 1, nome: 'Invictus', totalMembros: 7, nivelGrupo: 3, xpTotal: 835, icone: 'escudo' }),
  guildaBase({ id: 2, nome: 'Foco total', totalMembros: 5, nivelGrupo: 2, xpTotal: 835, icone: 'flor' }),
  guildaBase({ id: 3, nome: 'Mente livre', totalMembros: 9, nivelGrupo: 3, xpTotal: 835, icone: 'cerebro' }),
  guildaBase({ id: 4, nome: 'Evollution', totalMembros: 6, nivelGrupo: 3, xpTotal: 835, icone: 'foguete' }),
  guildaBase({ id: 5, nome: 'Rotina saudável', totalMembros: 4, nivelGrupo: 3, xpTotal: 835, icone: 'arvore', categorias: ['Saúde', 'Estudos', 'Vida pessoal'] }),
  guildaBase({ id: 6, nome: 'Produtivos', totalMembros: 14, nivelGrupo: 3, xpTotal: 835, icone: 'grafico' }),
  guildaBase({ id: 7, nome: 'Disciplina diária', totalMembros: 5, nivelGrupo: 3, xpTotal: 235, icone: 'livro', categorias: ['Leitura', 'Estudos', 'Vida pessoal'] }),
  guildaBase({ id: 8, nome: 'Equilíbrio', totalMembros: 5, nivelGrupo: 3, xpTotal: 835, icone: 'balanca', categorias: ['Bem-estar', 'Estudos', 'Vida pessoal'] }),
  guildaBase({ id: 9, nome: 'SUN', totalMembros: 11, nivelGrupo: 3, xpTotal: 835, icone: 'jogo', categorias: ['Produtividade', 'Estudos', 'Outros'] }),
];

export const desafiosGuilda: Desafio[] = [
  { id: 20, titulo: 'Ler juntos', descricao: 'Atingir 500 páginas somadas na semana', membrosParticipando: 5, totalMembros: 7, tags: ['Leitura'], xp: 200, situacao: 'ativo', icone: 'livro', diasRestantes: 4 },
  { id: 21, titulo: 'Rotina ativa', descricao: 'Completar 500 tarefas de exercício físico', membrosParticipando: 3, totalMembros: 7, tags: ['Saúde'], xp: 200, situacao: 'ativo', icone: 'halter', diasRestantes: 4 },
];

export const detalheGuilda: DetalheGuilda = {
  grupo: invictus,
  membros: [membro(1, 'Ronald', 'Líder', 2315), membro(2, 'Ícaro', 'Membro', 1890), membro(3, 'Pedro', 'Membro', 1240), membro(4, 'Rennyson', 'Membro', 940)],
  minhaContribuicao: { xp: 240, meta: 300 },
  niveis: [
    { nivel: 1, xpNecessario: 100 },
    { nivel: 2, xpNecessario: 300 },
    { nivel: 3, xpNecessario: 1000 },
    { nivel: 4, xpNecessario: 2500 },
    { nivel: 5, xpNecessario: 5000 },
    { nivel: 6, xpNecessario: 7500 },
    { nivel: 7, xpNecessario: 10000 },
  ],
  estatisticas: { tarefasConcluidasSemana: 47, diasSequencia: 12, membrosAtivosSemana: 7, xpTotal: 835 },
  desafiosAtivos: desafiosGuilda,
};

// ---------- Mural ----------
const ago = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
export const mural: PostagemMural[] = [
  { id: 1, conteudoTexto: 'Conseguimos o nível 3 da guilda! 🎉 +200XP para todos os membros!', dataPostagem: ago(1), tipoEvento: 'conquista', autor: U(2, 'Ícaro'), destaque: { titulo: 'Nível 3 alcançado! 🎉', subtitulo: 'Guilda os Invictus' } },
  { id: 2, conteudoTexto: 'Mais um dia de progresso 😎 Boa sorte a todos', dataPostagem: ago(1.5), tipoEvento: 'mensagem', autor: U(1, 'Ronald'), destaque: { titulo: 'Que todos tenham uma manhã feliz', subtitulo: 'Guilda os Invictus' } },
  { id: 3, conteudoTexto: 'Consegui terminar a minha meta de leitura essa semana! 📚', dataPostagem: ago(2), tipoEvento: 'mensagem', autor: U(2, 'Ícaro'), curtidas: 4, comentarios: 2 },
  { id: 4, conteudoTexto: 'Bora focar no próximo desafio! 💪', dataPostagem: ago(5), tipoEvento: 'mensagem', autor: U(3, 'Pedro'), curtidas: 3, comentarios: 1 },
];
export const publicarNoMural = (conteudoTexto: string): PostagemMural => {
  const p: PostagemMural = { id: nextId(), conteudoTexto, dataPostagem: new Date().toISOString(), tipoEvento: 'mensagem', autor: U(usuario.id, usuario.nomeExibicao), curtidas: 0, comentarios: 0 };
  mural.unshift(p);
  return p;
};

// ---------- Ranking ----------
const L = (posicao: number, nome: string, guilda: string, icone: string, xp: number, tarefas: number, seq: number): LinhaRanking => ({
  posicao, usuario: U(posicao, nome), guilda: { nome: guilda, icone }, xp, tarefas, sequenciaDias: seq,
});
export const rankingSemanal: ResumoRanking = {
  periodo: 'semanal',
  reiniciaEmDias: 5,
  linhas: [
    L(1, 'Ronald', 'Invictus', 'escudo', 2315, 12, 5),
    L(2, 'Ícaro', 'Invictus', 'escudo', 1890, 10, 4),
    L(3, 'Pedro', 'Invictus', 'escudo', 1240, 8, 3),
    L(4, 'Bianca', 'Foco total', 'flor', 1150, 7, 2),
    L(5, 'Rennyson', 'Invictus', 'escudo', 940, 6, 3),
    L(6, 'Ana Clara', 'Mente livre', 'cerebro', 780, 5, 2),
    L(7, 'Carlos', 'Evollution', 'foguete', 620, 3, 1),
  ],
  minhaPosicao: { posicao: 1, xp: 2315, deltaXp: 335, tarefas: 12, metaSemanalPct: 100, sequenciaDias: 5 },
  porGuilda: [
    { posicao: 1, guilda: { nome: 'Invictus', icone: 'escudo' }, xp: 5505, maxXp: 7500 },
    { posicao: 2, guilda: { nome: 'Foco total', icone: 'flor' }, xp: 3240, maxXp: 7500 },
    { posicao: 3, guilda: { nome: 'Mente livre', icone: 'cerebro' }, xp: 2640, maxXp: 7500 },
    { posicao: 4, guilda: { nome: 'Evollution', icone: 'foguete' }, xp: 1960, maxXp: 7500 },
  ],
  conquistasDoRanking: [
    { titulo: 'Top 1 da semana', descricao: 'Líder durante 7 dias' },
    { titulo: 'Sequência imbatível', descricao: '30 dias seguidos' },
    { titulo: 'Mestre das tarefas', descricao: '100 tarefas concluídas' },
  ],
};
// Telas só mostram o período "Semanal" preenchido; Geral/Mensal reutilizam a mesma massa (lacuna).
export const rankingPorPeriodo = (p: PeriodoRanking): ResumoRanking => ({ ...rankingSemanal, periodo: p });

// ---------- Desafios ----------
const D = (d: Desafio): Desafio => d;
export const painelDesafios: PainelDesafios = {
  destaque: D({ id: 30, titulo: '7 dias de exercícios', descricao: 'Vamos nos movimentar juntos pelo menos 7 treinos essa semana', diasRestantes: 5, membrosParticipando: 7, totalMembros: 7, tags: ['Saúde', 'Semanal'], xp: 200, situacao: 'ativo', icone: 'trofeu' }),
  ativos: [
    D({ id: 31, titulo: '7 dias de exercício', descricao: 'Complete pelo menos 7 treinos nesta semana', diasRestantes: 5, membrosParticipando: 7, totalMembros: 7, tags: ['Saúde', 'Semanal'], xp: 200, situacao: 'ativo', icone: 'halter' }),
    D({ id: 32, titulo: 'Leitura coletiva', descricao: 'Ler 100 páginas até o fim dessa semana', diasRestantes: 5, membrosParticipando: 7, totalMembros: 7, tags: ['Saúde', 'Semanal'], xp: 200, situacao: 'ativo', icone: 'livro' }),
    D({ id: 33, titulo: 'Beber mais água', descricao: 'Bebe pelo menos 2 litros de água todos os dias', diasRestantes: 5, membrosParticipando: 7, totalMembros: 7, tags: ['Saúde', 'Semanal'], xp: 200, situacao: 'ativo', icone: 'agua' }),
  ],
  proximos: [
    D({ id: 34, titulo: 'Meditação', descricao: 'faz uma longa meditação para relaxar', comecaEmDias: 3, membrosParticipando: 0, totalMembros: 7, tags: ['Saúde', 'Semanal'], xp: 200, situacao: 'proximo', icone: 'meditar' }),
    D({ id: 35, titulo: 'Rotina produtiva', descricao: 'complete todas as suas tarefas', comecaEmDias: 5, membrosParticipando: 0, totalMembros: 7, tags: ['Saúde', 'Diário'], xp: 200, situacao: 'proximo', icone: 'grafico' }),
    D({ id: 36, titulo: 'Alimentação saudável', descricao: 'Comer uma refeição saudável por uma semana', comecaEmDias: 6, membrosParticipando: 0, totalMembros: 7, tags: ['Saúde', 'Semanal'], xp: 200, situacao: 'proximo', icone: 'fruta' }),
  ],
  historico: [
    D({ id: 37, titulo: '30 Dias de estudo', descricao: '', membrosParticipando: 7, totalMembros: 7, tags: [], xp: 0, situacao: 'concluido', icone: 'livro' }),
    D({ id: 38, titulo: 'Rotina matinal', descricao: '', membrosParticipando: 0, totalMembros: 7, tags: [], xp: 0, situacao: 'nao-concluido', icone: 'sol' }),
    D({ id: 39, titulo: 'Desafio da água', descricao: '', membrosParticipando: 0, totalMembros: 7, tags: [], xp: 0, situacao: 'nao-concluido', icone: 'agua' }),
  ],
  progressoGuilda: { pct: 100, membros: 7, total: 7, xp: 200, diasRestantes: 5 },
  participantes: [
    { posicao: 1, nome: 'Ronald' },
    { posicao: 2, nome: 'Ícaro' },
    { posicao: 3, nome: 'Pedro' },
    { posicao: 4, nome: 'Bianca' },
  ],
};

// ---------- Conquistas ----------
const C = (c: Conquista): Conquista => c;
export const painelConquistas: PainelConquistas = {
  desbloqueadas: 12,
  total: 32,
  porCategoria: { Tarefa: 10, Consistência: 8, Guilda: 6, Desafio: 5, Especial: 3 },
  recente: C({ id: 50, titulo: 'Mestre da leitura', descricao: 'Você leu 10 livros e mostrou que o conhecimento faz parte da sua rotina!', categoria: 'Tarefa', estado: 'desbloqueada', xp: 300, icone: 'livro' }),
  itens: [
    C({ id: 51, titulo: 'Sequência imbatível', descricao: 'Mantenha 30 dias seguidos de check-in', categoria: 'Consistência', estado: 'desbloqueada', xp: 500, desbloqueadaEm: '05 de out de 2026', icone: 'fogo' }),
    C({ id: 52, titulo: 'Foco total', descricao: 'Complete 50 treinos', categoria: 'Tarefa', estado: 'desbloqueada', xp: 250, desbloqueadaEm: '28 de set de 2026', icone: 'halter' }),
    C({ id: 53, titulo: 'Trabalho em equipe', descricao: 'Participe de 10 desafios da guilda', categoria: 'Guilda', estado: 'desbloqueada', xp: 400, desbloqueadaEm: '28 de set de 2026', icone: 'grupo' }),
    C({ id: 54, titulo: 'Mente da leitura', descricao: 'Leia 10 livros', categoria: 'Tarefa', estado: 'desbloqueada', xp: 125, desbloqueadaEm: '12 de set de 2026', icone: 'livro' }),
    C({ id: 55, titulo: 'Explorador', descricao: 'Conclua 5 tipos de desafios diferentes', categoria: 'Desafio', estado: 'desbloqueada', xp: 225, desbloqueadaEm: '7 de set de 2026', icone: 'estrela' }),
    C({ id: 56, titulo: 'Hidratação em dia', descricao: 'Beba 2 litros de água por 30 dias', categoria: 'Consistência', estado: 'em-progresso', progresso: { atual: 18, total: 30 }, xp: 250, desbloqueadaEm: '28 de set de 2026', icone: 'agua' }),
    C({ id: 57, titulo: 'Rotina matinal', descricao: 'Complete sua rotina matinal 30 vezes', categoria: 'Consistência', estado: 'em-progresso', progresso: { atual: 25, total: 30 }, xp: 450, icone: 'sol' }),
    C({ id: 58, titulo: 'Noites tranquilas', descricao: 'Durma às 23 horas 30 vezes', categoria: 'Consistência', estado: 'em-progresso', progresso: { atual: 13, total: 30 }, xp: 450, icone: 'lua' }),
    C({ id: 59, titulo: 'Desafiador', descricao: 'Complete 50 desafios da guilda', categoria: 'Desafio', estado: 'bloqueada', progresso: { atual: 0, total: 50 }, xp: 450, icone: 'alvo' }),
    C({ id: 60, titulo: 'Líder da guilda', descricao: 'Alcance nível máximo da guilda', categoria: 'Guilda', estado: 'bloqueada', progresso: { atual: 0, total: 1 }, xp: 1000, icone: 'coroa' }),
  ],
};

// ---------- Notificações ----------
export const notificacoes: Notificacao[] = [
  { id: 1, tipo: 'Conquistas', titulo: 'Parabéns! Você desbloqueou uma nova conquista!', texto: 'Mestre da leitura - Você leu 10 livros e mostrou que o conhecimento faz parte da sua rotina!', quando: 'há 5 minutos', lida: true },
  { id: 2, tipo: 'Tarefas', titulo: 'Tarefa concluída!', texto: 'Ótimo trabalho! Você concluiu a tarefa “7 dias de exercícios”.', quando: 'há 12 minutos', lida: true, xp: { valor: 200 } },
  { id: 3, tipo: 'Guilda', titulo: 'Novo membro na guilda!', texto: 'Pedro entrou na guilda Invictus.', quando: 'há 1 hora', lida: true },
  { id: 4, tipo: 'Tarefas', titulo: 'Lembrete de tarefa', texto: 'Você ainda não concluiu sua tarefa de hoje: Ir a academia.', quando: 'há 2 horas', lida: false, acao: { rotulo: 'Ver tarefa', to: '/tarefas' } },
  { id: 5, tipo: 'Desafios', titulo: 'Novo desafio disponível!', texto: 'Participe do desafio “Rotina matinal” e ganhe +150 XP.', quando: 'há 4 horas', lida: true },
  { id: 6, tipo: 'Níveis', titulo: 'Você subiu de nível!', texto: 'Você agora é Nível 4 - Explorador.', quando: 'há 1 dia', lida: true, acao: { rotulo: 'Ver meu progresso', to: '/progresso' } },
  { id: 7, tipo: 'Desafios', titulo: 'Sua guilda completou um desafio!', texto: 'A guilda Invictus concluiu o desafio “7 dias de exercícios”.', quando: 'há 1 dia', lida: true, xp: { valor: 200, guilda: true } },
  { id: 8, tipo: 'Guilda', titulo: 'Nova mensagem da guilda', texto: 'Ícaro: “Bora manter o ritmo essa semana!”', quando: 'há 1 dia', lida: false },
  { id: 9, tipo: 'Sistema', titulo: 'Atualização no sistema', texto: 'Novos emblemas e personalização de perfil já estão disponíveis!', quando: 'há 2 dias', lida: false },
];

// ---------- Progresso ----------
export const painelProgresso: PainelProgresso = {
  nivel: 4,
  tituloNivel: 'Explorador',
  xpAtual: 2430,
  xpProximoNivel: 3000,
  proximoNivel: { nivel: 5, titulo: 'Estrategista', frase: 'Você transforma hábitos em resultados.', beneficios: ['Desbloqueia novos desafios da guilda', 'Acesso a emblemas exclusivos', 'Mais personalização de perfil'] },
  totais: { xpTotal: 2430, tarefasConcluidas: 128, diasSequencia: 34, conquistas: 12 },
  jornada: [
    { nivel: 1, titulo: 'Iniciante', descricao: 'Primeiros passos. Tudo começa aqui!', alcancado: true },
    { nivel: 2, titulo: 'Disciplinado', descricao: 'Construindo consistência.', alcancado: true },
    { nivel: 3, titulo: 'Dedicado', descricao: 'Você já faz acontecer.', alcancado: true },
    { nivel: 4, titulo: 'Explorador', descricao: 'Ampliando o seu potencial.', alcancado: true },
    { nivel: 5, titulo: 'Estrategista', descricao: 'Você transforma hábitos em resultados.', alcancado: false },
    { nivel: 6, titulo: 'Referência', descricao: 'Sua disciplina inspira outros.', alcancado: false },
    { nivel: 7, titulo: 'Mestre', descricao: 'Hábitos são parte de quem você é.', alcancado: false },
    { nivel: 8, titulo: 'Lenda', descricao: 'Você vive o seu propósito.', alcancado: false },
  ],
  evolucaoXp: [
    { data: '01/10', xp: 100 }, { data: '05/10', xp: 220 }, { data: '10/10', xp: 410 }, { data: '15/10', xp: 380 },
    { data: '20/10', xp: 620 }, { data: '25/10', xp: 650 }, { data: '30/10', xp: 800 },
  ],
  distribuicao: [
    { rotulo: 'Estudos', pct: 38 }, { rotulo: 'Saúde', pct: 24 }, { rotulo: 'Produtividade', pct: 18 },
    { rotulo: 'Leitura', pct: 12 }, { rotulo: 'Vida pessoal', pct: 8 },
  ],
  metasDoNivel: [
    { texto: 'Manter 30 dias de sequência', atual: 20, total: 30 },
    { texto: 'Concluir 10 desafios da guilda', atual: 6, total: 10 },
    { texto: 'Ganhar 3 novas conquistas', atual: 2, total: 3 },
    { texto: 'Alcançar 3.000 XP', atual: 2430, total: 3000 },
  ],
};

// ---------- Loja ----------
const R = (id: number, titulo: string, descricao: string, precoMoedas: number, categoria: Recompensa['categoria'], icone: string, resgatada = false): Recompensa => ({
  id, titulo, descricao, precoMoedas, categoria, icone, resgatada, tipo: categoria,
});
// A categoria de cada item NÃO aparece nas telas (só os filtros); o mapeamento abaixo é uma suposição.
export const recompensas: Recompensa[] = [
  R(1, 'Avatar exclusivo', 'Desbloqueie um avatar especial para o seu perfil Habitus.', 500, 'Personalização', 'avatar', true),
  R(2, 'Tema roxo premium', 'Deixe sua experiência ainda mais incrível com o tema roxo.', 3000, 'Personalização', 'tema'),
  R(3, 'Moldura de perfil', 'Destaque seu perfil com uma moldura espacial.', 800, 'Personalização', 'moldura'),
  R(4, 'Cupom de 10%', 'Ganhe 10% de desconto em parceiros.', 1000, 'Cupons', 'cupom', true),
  R(5, 'Dia bônus', 'Ganhe 1 dia extra de streak de tarefas.', 1200, 'Benefícios', 'calendario', true),
  R(6, 'Badge especial da guilda', 'Mostre seu apoio à sua guilda com um badge exclusivo.', 2500, 'Exclusivos', 'badge'),
  R(7, 'Plano de fundo raro', 'Desbloqueie um plano de fundo exclusivo para seu perfil.', 4000, 'Exclusivos', 'fundo'),
  R(8, 'Caixa surpresa', 'Uma recompensa misteriosa com itens exclusivos.', 5000, 'Exclusivos', 'caixa'),
];
const recentes: PainelLoja['recentes'] = [
  { titulo: 'Avatar exclusivo', data: '12 de abr de 2025' },
  { titulo: 'Cupom de 10%', data: '03 de abr de 2025' },
  { titulo: 'Dia bônus', data: '18 de mar de 2025' },
];
export const recentesAdd = (titulo: string) =>
  recentes.unshift({ titulo, data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) });
export const painelLoja = (): PainelLoja => ({
  pontosDisponiveis: personagem.moedasOuro,
  resgatesRealizados: 12 + (recentes.length - 3),
  proximoPremio: { titulo: 'Tema roxo premium', atual: personagem.moedasOuro, total: 3000 },
  itens: recompensas.map((r) => ({ ...r })),
  recentes: [...recentes],
});

// ---------- Configurações ----------
export const prefsNotificacao: PreferenciasNotificacao = { tarefas: true, progresso: true, conquistas: true, desafios: true, guilda: true, sistema: true };

export { nextId };
