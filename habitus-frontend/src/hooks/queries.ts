/**
 * Hooks de dados (TanStack Query = "estado do servidor"). Centralizados aqui para tornar as chaves
 * de cache visíveis; ao crescer, dividir por feature (features/<nome>/queries.ts).
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ativ from '@/services/atividades';
import * as auth from '@/services/auth';
import * as grupos from '@/services/grupos';
import * as o from '@/services/outros';
import type { FiltroGuildas, NovaAtividade, PeriodoRanking, PreferenciasNotificacao, Usuario } from '@/types/domain';

export const chaves = {
  resumo: ['perfil-resumo'] as const,
  tarefas: ['tarefas'] as const,
  tarefa: (id: number) => ['tarefa', id] as const,
  guilda: ['minha-guilda'] as const,
  guildas: (f: FiltroGuildas) => ['guildas', f] as const,
  mural: (id: number) => ['mural', id] as const,
  ranking: (p: PeriodoRanking) => ['ranking', p] as const,
  desafios: ['desafios'] as const,
  conquistas: ['conquistas'] as const,
  progresso: ['progresso'] as const,
  loja: ['loja'] as const,
  notificacoes: ['notificacoes'] as const,
  perfil: ['perfil'] as const,
  prefs: ['prefs-notificacao'] as const,
};

export const useResumoPerfil = () => useQuery({ queryKey: chaves.resumo, queryFn: auth.obterPerfilResumo });
export const usePainelTarefas = () => useQuery({ queryKey: chaves.tarefas, queryFn: ativ.obterPainelTarefas });
export const useDetalheTarefa = (id: number) => useQuery({ queryKey: chaves.tarefa(id), queryFn: () => ativ.obterDetalheAtividade(id) });
export const useMinhaGuilda = () => useQuery({ queryKey: chaves.guilda, queryFn: grupos.obterMinhaGuilda });
export const useGuildas = (f: FiltroGuildas) => useQuery({ queryKey: chaves.guildas(f), queryFn: () => grupos.explorarGuildas(f), placeholderData: (p) => p });
export const useMural = (grupoId: number) => useQuery({ queryKey: chaves.mural(grupoId), queryFn: () => grupos.listarMural(grupoId), enabled: grupoId > 0 });
export const useRanking = (p: PeriodoRanking) => useQuery({ queryKey: chaves.ranking(p), queryFn: () => o.obterRanking(p) });
export const useDesafios = () => useQuery({ queryKey: chaves.desafios, queryFn: o.obterDesafios });
export const useConquistas = () => useQuery({ queryKey: chaves.conquistas, queryFn: o.obterConquistas });
export const useProgresso = () => useQuery({ queryKey: chaves.progresso, queryFn: o.obterProgresso });
export const useLoja = () => useQuery({ queryKey: chaves.loja, queryFn: o.obterLoja });
export const useNotificacoes = () => useQuery({ queryKey: chaves.notificacoes, queryFn: o.listarNotificacoes });
export const usePerfil = () => useQuery({ queryKey: chaves.perfil, queryFn: o.obterPerfil });
export const usePrefsNotificacao = () => useQuery({ queryKey: chaves.prefs, queryFn: o.obterPrefsNotificacao });

// ---- Mutações ----
export function useCriarAtividade() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (n: NovaAtividade) => ativ.criarAtividade(n), onSuccess: () => qc.invalidateQueries({ queryKey: chaves.tarefas }) });
}
export function useExcluirAtividade() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => ativ.excluirAtividade(id), onSuccess: () => qc.invalidateQueries({ queryKey: chaves.tarefas }) });
}
/** UC003 / RF05 / RF06 — após o check-in atualiza tarefas, nível (Sidebar), mural, ranking e progresso. */
export function useCheckIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, prova }: { id: number; prova?: File }) => ativ.fazerCheckIn(id, prova),
    onSuccess: () => {
      for (const k of [chaves.tarefas, chaves.resumo, chaves.guilda, chaves.progresso, ['tarefa'], ['mural'], ['ranking']]) qc.invalidateQueries({ queryKey: k });
    },
  });
}
export function usePublicarNoMural(grupoId: number) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (t: string) => grupos.publicarNoMural(grupoId, t), onSuccess: () => qc.invalidateQueries({ queryKey: chaves.mural(grupoId) }) });
}
export function useResgatar() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => o.resgatarRecompensa(id), onSuccess: () => { qc.invalidateQueries({ queryKey: chaves.loja }); qc.invalidateQueries({ queryKey: chaves.resumo }); } });
}
export function useMarcarTodasLidas() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: o.marcarTodasComoLidas, onSuccess: () => qc.invalidateQueries({ queryKey: chaves.notificacoes }) });
}
export function useAtualizarPerfil() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: Partial<Usuario>) => o.atualizarPerfil(d), onSuccess: () => { qc.invalidateQueries({ queryKey: chaves.perfil }); qc.invalidateQueries({ queryKey: chaves.resumo }); } });
}
export function useSalvarPrefsNotificacao() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: PreferenciasNotificacao) => o.salvarPrefsNotificacao(p), onSuccess: () => qc.invalidateQueries({ queryKey: chaves.prefs }) });
}
