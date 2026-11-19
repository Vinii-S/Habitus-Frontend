/**
 * Modelos de domínio do frontend.
 *
 * ORIGEM DOS CAMPOS (ver docs/ARQUITETURA.md, seção 5):
 *  - [DC]  = Diagrama de Classes HABITUS.png
 *  - [UC]  = Casos De Uso Detalhados.pdf
 *  - [FIG] = Telas Figma (Telas-Engenharia/*.jpeg) — campo visto na tela mas AUSENTE do Diagrama de Classes.
 *
 * Os nomes seguem o Diagrama de Classes (camelCase). Se o backend FastAPI usar outro
 * formato (ex.: snake_case), a conversão deve ser feita em src/api (ainda não definida na documentação).
 */

// ---------- Usuário / Personagem ----------
export interface Usuario {
  id: number; // [DC]
  nomeCompleto: string; // [DC]
  nomeExibicao: string; // [DC]
  email: string; // [DC]
  dataNascimento?: string; // [DC] ISO yyyy-mm-dd
  genero?: string; // [DC]
  bio?: string; // [DC] (tela Perfil: limite 200 caracteres)
  fotoPerfil?: string; // [DC]
  fotoCapa?: string; // [DC]
  // senhaHash existe no [DC], mas nunca trafega para o frontend.
}

export interface Personagem {
  id: number; // [DC]
  nivel: number; // [DC]
  xpAtual: number; // [DC]
  xpProximoNivel: number; // [DC]
  moedasOuro: number; // [DC]
  forca: number; // [DC]
  intelecto: number; // [DC]
  constituicao: number; // [DC]
}

/** Resumo exibido na Sidebar (Figma: avatar, nome, "Nível 4 · Explorador", barra de XP). */
export interface PerfilResumo {
  usuario: Usuario;
  personagem: Personagem;
}

// ---------- Atividades (tarefas / hábitos) ----------
export type Frequencia = 'Diária' | 'Semanal' | 'Mensal' | 'Personalizada'; // [FIG] Criar tarefa, passo 3
export type CategoriaAtividade =
  | 'Estudos'
  | 'Saúde'
  | 'Bem-estar'
  | 'Produtividade'
  | 'Leitura'
  | 'Vida pessoal'
  | 'Outros'; // [FIG] Criar tarefa, passo 2
export type StatusTarefa = 'Concluída' | 'Em andamento' | 'Não iniciada' | 'Atrasada'; // [FIG] Minhas Tarefas

export interface Atividade {
  id: number; // [DC]
  nome: string; // [DC][UC001]
  descricao: string; // [DC][UC001]
  frequencia: Frequencia; // [DC]
  atributoRPG?: string; // [DC] — sem campo correspondente nas telas
  dificuldade?: string; // [DC] — sem campo correspondente nas telas
  xpRecompensa: number; // [DC] (telas: "+ 100 XP")
  statusAtiva: boolean; // [DC]
  dataFim?: string; // [DC][UC001: "data final da atividade"] — sem campo na tela Criar tarefa
  categoria: CategoriaAtividade; // [FIG]
  meta?: string; // [FIG] ex.: "Ler 50 páginas por semana"
  duracaoEstimadaMin?: number; // [FIG] ex.: 30 minutos
  lembrete?: { ativo: boolean; horario: string }; // [FIG] ex.: 19:00
  status: StatusTarefa; // [FIG]
  progresso: number; // [FIG] 0–100. Regra de cálculo NÃO documentada (lacuna).
  hoje: boolean; // [FIG] separa "Tarefas de hoje" de "Outras tarefas" — critério não documentado (lacuna).
}

export interface PainelTarefas {
  atividades: Atividade[];
  resumoSemana: { intervalo: string; xp: number; concluidas: number; emAndamento: number; naoIniciadas: number }; // [FIG]
  metaSemanal: { descricao: string; feitas: number; total: number }; // [FIG] "5 / 7 tarefas · 70%"
}

export interface ProvaDeConclusao {
  id: number; // [DC]
  urlImagem: string; // [DC]
  tamanhoArquivo: number; // [DC]
  tipoArquivo: string; // [DC]
}

export interface CheckIn {
  id: number; // [DC]
  atividadeId: number;
  dataHora: string; // [DC]
  statusValidacao: string; // [DC] — valores possíveis não documentados
  xpGanho: number; // [DC]
  sequenciaStreak: number; // [DC]
  minutos?: number; // [FIG] Detalhes da tarefa: "30 minutos"
  realizada: boolean; // [FIG] histórico mostra "Não realizada"
  prova?: ProvaDeConclusao; // [DC] 0..1
}

export interface EstatisticasAtividade {
  conclusoesTotais: number;
  taxaConclusao: number; // %
  sequenciaAtual: number;
  melhorSequencia: number;
} // [FIG] Detalhes da tarefa

export interface DetalheAtividade {
  atividade: Atividade;
  semana: { rotulo: string; data: string; feito: boolean }[]; // [FIG] Seg 29/09 … Dom 05/10
  diasFeitos: number;
  estatisticas: EstatisticasAtividade;
  historico: CheckIn[];
  motivacao?: string; // [FIG]
  citacao?: string; // [FIG] frase destacada em azul
}

export interface NovaAtividade {
  nome: string;
  descricao?: string;
  categoria: CategoriaAtividade;
  frequencia: Frequencia;
  meta?: string;
  duracaoEstimadaMin?: number;
  lembrete?: { ativo: boolean; horario: string };
}

export interface ResultadoCheckIn {
  checkIn: CheckIn;
  xpGanho: number;
  subiuDeNivel: boolean; // RNF09 / UC003 passo 7
  novoNivel?: number;
  postagem?: PostagemMural; // UC003 pós-condição: publicado no feed do grupo
}

// ---------- Grupos / Guildas ----------
export type PapelMembro = 'Líder' | 'Membro'; // [FIG] Minha guilda; [DC] MembroGrupo.papel é String

export interface MembroGrupo {
  id: number; // [DC]
  papel: PapelMembro; // [DC]
  dataEntrada?: string; // [DC]
  pontuacaoSemanal: number; // [DC] (tela: coluna de XP)
  usuario: Pick<Usuario, 'id' | 'nomeExibicao' | 'fotoPerfil'>;
}

export interface PostagemMural {
  id: number; // [DC]
  conteudoTexto: string; // [DC]
  dataPostagem: string; // [DC]
  tipoEvento: string; // [DC] ex.: mensagem, conquista (valores não documentados)
  autor: Pick<Usuario, 'id' | 'nomeExibicao' | 'fotoPerfil'>; // [DC] relação "autor"
  curtidas?: number; // [FIG] ♥
  comentarios?: number; // [FIG] 💬
  destaque?: { titulo: string; subtitulo?: string }; // [FIG] cartão roxo dentro do post (Início)
}

export interface Grupo {
  id: number; // [DC]
  nome: string; // [DC]
  descricao: string; // [DC] (telas: "Juntos tornamos hoje melhor que ontem!")
  codigoConvite?: string; // [DC]
  nivelGrupo: number; // [DC]
  categorias: CategoriaAtividade[]; // [FIG] Explorar guildas
  totalMembros: number; // [FIG]
  xpTotal: number; // [FIG]
  xpProximoNivel?: number; // [FIG] ex.: 5.505 / 7.500
  icone: string; // [FIG] chave do ícone — o contrato de imagem/ícone não está documentado
}

export interface NivelGuilda {
  nivel: number;
  xpNecessario: number;
} // [FIG] Minha guilda — "Progresso da guilda"

export interface EstatisticasGuilda {
  tarefasConcluidasSemana: number;
  diasSequencia: number;
  membrosAtivosSemana: number;
  xpTotal: number;
} // [FIG]

export interface DetalheGuilda {
  grupo: Grupo;
  membros: MembroGrupo[];
  minhaContribuicao: { xp: number; meta: number }; // [FIG] "Sua contribuição 240 / 300 XP"
  niveis: NivelGuilda[];
  estatisticas: EstatisticasGuilda;
  desafiosAtivos: Desafio[];
}

export interface FiltroGuildas {
  categoria?: CategoriaAtividade;
  busca?: string;
  ordenarPor?: 'membros' | 'nivel' | 'xp'; // [FIG] "Ordenar por: Mais membros"
}

// ---------- Ranking ----------
export type PeriodoRanking = 'geral' | 'semanal' | 'mensal'; // [FIG]

export interface LinhaRanking {
  posicao: number;
  usuario: Pick<Usuario, 'id' | 'nomeExibicao' | 'fotoPerfil'>;
  guilda: { nome: string; icone: string };
  xp: number;
  tarefas: number;
  sequenciaDias: number;
} // [FIG]

export interface RankingGuildaLinha {
  posicao: number;
  guilda: { nome: string; icone: string };
  xp: number;
  maxXp: number;
}

export interface ResumoRanking {
  periodo: PeriodoRanking;
  reiniciaEmDias: number; // [FIG] "Reseta em 5 dias" — ver RankingGrupo.dataUltimoReset [DC]
  linhas: LinhaRanking[];
  minhaPosicao: {
    posicao: number;
    xp: number;
    deltaXp: number;
    tarefas: number;
    metaSemanalPct: number;
    sequenciaDias: number;
  };
  porGuilda: RankingGuildaLinha[];
  conquistasDoRanking: { titulo: string; descricao: string }[];
}

// ---------- Desafios / Conquistas / Notificações (somente [FIG]; sem classe no [DC]) ----------
export interface Desafio {
  id: number;
  titulo: string;
  descricao: string;
  diasRestantes?: number;
  comecaEmDias?: number;
  membrosParticipando: number;
  totalMembros: number;
  tags: string[]; // ex.: Saúde, Semanal
  xp: number;
  situacao: 'ativo' | 'proximo' | 'concluido' | 'nao-concluido';
  icone: string;
}

export interface PainelDesafios {
  destaque: Desafio;
  ativos: Desafio[];
  proximos: Desafio[];
  historico: Desafio[];
  progressoGuilda: { pct: number; membros: number; total: number; xp: number; diasRestantes: number };
  participantes: { posicao: number; nome: string; fotoPerfil?: string }[];
}

export type CategoriaConquista = 'Tarefa' | 'Consistência' | 'Guilda' | 'Desafio' | 'Especial';
export interface Conquista {
  id: number;
  titulo: string;
  descricao: string;
  categoria: CategoriaConquista;
  estado: 'desbloqueada' | 'em-progresso' | 'bloqueada';
  progresso?: { atual: number; total: number };
  xp: number;
  desbloqueadaEm?: string;
  icone: string;
}
export interface PainelConquistas {
  desbloqueadas: number;
  total: number;
  porCategoria: Record<CategoriaConquista, number>;
  recente?: Conquista;
  itens: Conquista[];
}

export type TipoNotificacao = 'Tarefas' | 'Guilda' | 'Conquistas' | 'Níveis' | 'Desafios' | 'Sistema';
export interface Notificacao {
  id: number;
  tipo: TipoNotificacao;
  titulo: string;
  texto: string;
  quando: string; // texto relativo vindo do backend ("há 5 minutos")
  lida: boolean;
  acao?: { rotulo: string; to: string };
  xp?: { valor: number; guilda?: boolean };
}

// ---------- Progresso / Níveis ----------
export interface PainelProgresso {
  nivel: number;
  tituloNivel: string;
  xpAtual: number;
  xpProximoNivel: number;
  proximoNivel: { nivel: number; titulo: string; frase: string; beneficios: string[] };
  totais: { xpTotal: number; tarefasConcluidas: number; diasSequencia: number; conquistas: number };
  jornada: { nivel: number; titulo: string; descricao: string; alcancado: boolean }[];
  evolucaoXp: { data: string; xp: number }[];
  distribuicao: { rotulo: string; pct: number }[];
  metasDoNivel: { texto: string; atual: number; total: number }[];
}

// ---------- Loja ----------
export type CategoriaRecompensa = 'Personalização' | 'Cupons' | 'Benefícios' | 'Exclusivos'; // [FIG]
export interface Recompensa {
  id: number; // [DC]
  titulo: string; // [DC]
  descricao: string; // [DC]
  precoMoedas: number; // [DC] (tela mostra "pontos")
  tipo: string; // [DC]
  categoria: CategoriaRecompensa; // [FIG]
  resgatada: boolean; // [FIG] botão "Resgatado"
  icone: string;
}
export interface PainelLoja {
  pontosDisponiveis: number;
  resgatesRealizados: number;
  proximoPremio?: { titulo: string; atual: number; total: number };
  itens: Recompensa[];
  recentes: { titulo: string; data: string }[];
}

// ---------- Configurações ----------
export interface PreferenciasNotificacao {
  tarefas: boolean;
  progresso: boolean;
  conquistas: boolean;
  desafios: boolean;
  guilda: boolean;
  sistema: boolean;
}

// ---------- Autenticação ----------
export interface Sessao {
  token: string;
  usuario: Usuario;
}
export interface Credenciais {
  email: string;
  senha: string;
}
export interface NovoCadastro {
  nomeCompleto: string;
  nomeExibicao: string; // tela: "Nome de usuario"
  email: string;
  dataNascimento: string;
  senha: string;
}
