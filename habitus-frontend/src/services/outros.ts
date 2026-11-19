/**
 * Serviços das telas menores. Mesmo padrão: se VITE_USE_MOCKS=false chama a API (caminhos provisórios
 * em src/api/endpoints.ts), senão usa src/mocks/db.ts.
 */
import { ENDPOINTS } from '@/api/endpoints';
import { http } from '@/api/http';
import { env } from '@/config/env';
import * as db from '@/mocks/db';
import type {
  Notificacao,
  PainelConquistas,
  PainelDesafios,
  PainelLoja,
  PainelProgresso,
  PeriodoRanking,
  PreferenciasNotificacao,
  ResumoRanking,
  Usuario,
} from '@/types/domain';

// ---- Ranking (RF08) ----
export async function obterRanking(periodo: PeriodoRanking): Promise<ResumoRanking> {
  if (!env.useMocks) return http<ResumoRanking>(ENDPOINTS.ranking(periodo));
  await db.delay();
  return db.rankingPorPeriodo(periodo);
}

// ---- Desafios / Conquistas / Progresso ----
export async function obterDesafios(): Promise<PainelDesafios> {
  if (!env.useMocks) return http<PainelDesafios>(ENDPOINTS.desafios);
  await db.delay();
  return db.painelDesafios;
}
export async function obterConquistas(): Promise<PainelConquistas> {
  if (!env.useMocks) return http<PainelConquistas>(ENDPOINTS.conquistas);
  await db.delay();
  return db.painelConquistas;
}
export async function obterProgresso(): Promise<PainelProgresso> {
  if (!env.useMocks) return http<PainelProgresso>(ENDPOINTS.progresso);
  await db.delay();
  return db.painelProgresso;
}

// ---- Loja ----
export async function obterLoja(): Promise<PainelLoja> {
  if (!env.useMocks) return http<PainelLoja>(ENDPOINTS.loja.painel);
  await db.delay();
  return db.painelLoja();
}
export async function resgatarRecompensa(id: number): Promise<void> {
  if (!env.useMocks) return http<void>(ENDPOINTS.loja.resgatar(id), { method: 'POST' });
  await db.delay(400);
  const r = db.recompensas.find((x) => x.id === id);
  if (!r || r.resgatada) throw new Error('Recompensa indisponível');
  if (db.personagem.moedasOuro < r.precoMoedas) throw new Error('Pontos insuficientes');
  db.personagem.moedasOuro -= r.precoMoedas;
  r.resgatada = true;
  db.recentesAdd(r.titulo);
}

// ---- Notificações ----
export async function listarNotificacoes(): Promise<Notificacao[]> {
  if (!env.useMocks) return http<Notificacao[]>(ENDPOINTS.notificacoes.listar);
  await db.delay();
  return [...db.notificacoes];
}
export async function marcarTodasComoLidas(): Promise<void> {
  if (!env.useMocks) return http<void>(ENDPOINTS.notificacoes.marcarTodasLidas, { method: 'POST' });
  await db.delay(100);
  db.notificacoes.forEach((n) => (n.lida = true));
}

// ---- Perfil / Configurações ----
export async function obterPerfil(): Promise<Usuario> {
  if (!env.useMocks) return http<Usuario>(ENDPOINTS.perfil.obter);
  await db.delay();
  return { ...db.usuario };
}
export async function atualizarPerfil(dados: Partial<Usuario>): Promise<Usuario> {
  if (!env.useMocks) return http<Usuario>(ENDPOINTS.perfil.atualizar, { method: 'PATCH', body: dados });
  await db.delay(300);
  Object.assign(db.usuario, dados);
  return { ...db.usuario };
}
export async function obterPrefsNotificacao(): Promise<PreferenciasNotificacao> {
  if (!env.useMocks) return http<PreferenciasNotificacao>(ENDPOINTS.configuracoes.notificacoes);
  await db.delay(100);
  return { ...db.prefsNotificacao };
}
export async function salvarPrefsNotificacao(p: PreferenciasNotificacao): Promise<void> {
  if (!env.useMocks) return http<void>(ENDPOINTS.configuracoes.notificacoes, { method: 'PUT', body: p });
  await db.delay(100);
  Object.assign(db.prefsNotificacao, p);
}
