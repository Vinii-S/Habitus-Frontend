import { ENDPOINTS } from '@/api/endpoints';
import { http } from '@/api/http';
import { env } from '@/config/env';
import * as db from '@/mocks/db';
import type { Credenciais, NovoCadastro, PerfilResumo, Sessao } from '@/types/domain';

/** Caso de uso "Fazer Login" / RF01. */
export async function entrar(c: Credenciais): Promise<Sessao> {
  if (!env.useMocks) return http<Sessao>(ENDPOINTS.auth.login, { method: 'POST', body: c });
  await db.delay();
  return { token: 'mock-token', usuario: { ...db.usuario, email: c.email } };
}

/** Caso de uso "Criar Conta" / RF01. Campos conforme a tela "Crie sua conta". */
export async function cadastrar(n: NovoCadastro): Promise<Sessao> {
  if (!env.useMocks) return http<Sessao>(ENDPOINTS.auth.cadastro, { method: 'POST', body: n });
  await db.delay();
  // Mock: o novo usuário passa a ser o "usuário atual" para Sidebar/mural refletirem o cadastro.
  const usuario = { id: db.nextId(), nomeCompleto: n.nomeCompleto, nomeExibicao: n.nomeExibicao, email: n.email, dataNascimento: n.dataNascimento };
  Object.assign(db.usuario, usuario, { genero: undefined, bio: undefined });
  return { token: 'mock-token', usuario };
}

/** Dados da Sidebar (avatar, nível, barra de XP). */
export async function obterPerfilResumo(): Promise<PerfilResumo> {
  if (!env.useMocks) return http<PerfilResumo>(ENDPOINTS.auth.perfilResumo);
  await db.delay(100);
  return { usuario: db.usuario, personagem: db.personagem };
}
