import { ENDPOINTS } from '@/api/endpoints';
import { http } from '@/api/http';
import { env } from '@/config/env';
import { TIMEOUT_MURAL_MS } from '@/config/regras';
import * as db from '@/mocks/db';
import type { DetalheGuilda, FiltroGuildas, Grupo, PostagemMural } from '@/types/domain';

/** RF03 — gestão de grupos/guildas ("Minha Guilda"). */
export async function obterMinhaGuilda(): Promise<DetalheGuilda> {
  if (!env.useMocks) return http<DetalheGuilda>(ENDPOINTS.grupos.minha);
  await db.delay();
  return db.detalheGuilda;
}

/** Tela "Explorar Guildas" — filtros: categoria, busca, ordenação. */
export async function explorarGuildas(f: FiltroGuildas = {}): Promise<Grupo[]> {
  if (!env.useMocks) {
    const q = new URLSearchParams();
    if (f.categoria) q.set('categoria', f.categoria);
    if (f.busca) q.set('busca', f.busca);
    if (f.ordenarPor) q.set('ordenarPor', f.ordenarPor);
    return http<Grupo[]>(`${ENDPOINTS.grupos.explorar}?${q}`);
  }
  await db.delay();
  let lista = db.guildasExplorar.filter((g) => !f.categoria || g.categorias.includes(f.categoria));
  if (f.busca) lista = lista.filter((g) => `${g.nome} ${g.descricao}`.toLowerCase().includes(f.busca!.toLowerCase()));
  const chave = { membros: 'totalMembros', nivel: 'nivelGrupo', xp: 'xpTotal' } as const;
  return [...lista].sort((a, b) => b[chave[f.ordenarPor ?? 'membros']] - a[chave[f.ordenarPor ?? 'membros']]);
}

/** RF07 — feed do Mural da Guilda. RNF02: carregar em até 7 s. */
export async function listarMural(grupoId: number): Promise<PostagemMural[]> {
  if (!env.useMocks) return http<PostagemMural[]>(ENDPOINTS.grupos.mural(grupoId), { timeoutMs: TIMEOUT_MURAL_MS });
  await db.delay(150);
  return [...db.mural];
}

export async function publicarNoMural(grupoId: number, conteudoTexto: string): Promise<PostagemMural> {
  if (!env.useMocks) return http<PostagemMural>(ENDPOINTS.grupos.publicar(grupoId), { method: 'POST', body: { conteudoTexto } });
  await db.delay(150);
  return db.publicarNoMural(conteudoTexto);
}
