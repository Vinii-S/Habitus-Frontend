import { ENDPOINTS } from '@/api/endpoints';
import { http } from '@/api/http';
import { env } from '@/config/env';
import { ORCAMENTO_CHECKIN_MS } from '@/config/regras';
import * as db from '@/mocks/db';
import type { DetalheAtividade, NovaAtividade, PainelTarefas, ResultadoCheckIn } from '@/types/domain';

export async function obterPainelTarefas(): Promise<PainelTarefas> {
  if (!env.useMocks) return http<PainelTarefas>(ENDPOINTS.atividades.painel);
  await db.delay();
  return { atividades: [...db.atividades], resumoSemana: db.resumoSemana, metaSemanal: db.metaSemanal };
}

export async function obterDetalheAtividade(id: number): Promise<DetalheAtividade> {
  if (!env.useMocks) return http<DetalheAtividade>(ENDPOINTS.atividades.detalhe(id));
  await db.delay();
  const a = db.atividades.find((x) => x.id === id);
  if (!a) throw new Error('Tarefa não encontrada');
  return db.detalheDe(a);
}

/** UC001 — Cadastrar Atividade. O backend valida o limite de atividades ativas (fluxo 6a). */
export async function criarAtividade(n: NovaAtividade) {
  if (!env.useMocks) return http<{ id: number }>(ENDPOINTS.atividades.criar, { method: 'POST', body: n });
  await db.delay();
  return db.nova({ ...n, descricao: n.descricao ?? '', frequencia: n.frequencia, duracaoEstimadaMin: n.duracaoEstimadaMin });
}

export async function excluirAtividade(id: number) {
  if (!env.useMocks) return http<void>(ENDPOINTS.atividades.excluir(id), { method: 'DELETE' });
  await db.delay();
  const i = db.atividades.findIndex((a) => a.id === id);
  if (i >= 0) db.atividades.splice(i, 1);
}

/**
 * UC003 — Anexar Comprovante / RF05 + RF06. Envia multipart quando há prova.
 * O cálculo de XP e nível acontece no backend (RF02, RNF07: ≤ 2000 ms).
 */
export async function fazerCheckIn(atividadeId: number, prova?: File): Promise<ResultadoCheckIn> {
  if (!env.useMocks) {
    const fd = new FormData();
    if (prova) fd.append('prova', prova);
    return http<ResultadoCheckIn>(ENDPOINTS.atividades.checkIn(atividadeId), { method: 'POST', formData: fd, timeoutMs: ORCAMENTO_CHECKIN_MS * 5 });
  }
  await db.delay(600);
  const a = db.atividades.find((x) => x.id === atividadeId);
  if (!a) throw new Error('Tarefa não encontrada');
  a.status = 'Concluída';
  a.progresso = 100;
  const xpAntes = db.personagem.xpAtual;
  db.personagem.xpAtual += a.xpRecompensa;
  const subiuDeNivel = xpAntes < db.personagem.xpProximoNivel && db.personagem.xpAtual >= db.personagem.xpProximoNivel;
  const checkIn = {
    id: db.nextId(), atividadeId, dataHora: new Date().toISOString(), statusValidacao: 'validado',
    xpGanho: a.xpRecompensa, sequenciaStreak: 1, realizada: true,
    prova: prova ? { id: db.nextId(), urlImagem: URL.createObjectURL(prova), tamanhoArquivo: prova.size, tipoArquivo: prova.type } : undefined,
  };
  const postagem = prova ? db.publicarNoMural(`Concluí “${a.nome}”! +${a.xpRecompensa} XP`) : undefined; // UC003 pós-condição
  return { checkIn, xpGanho: a.xpRecompensa, subiuDeNivel, novoNivel: subiuDeNivel ? db.personagem.nivel + 1 : undefined, postagem };
}
