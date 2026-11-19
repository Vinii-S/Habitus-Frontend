import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { registrarTokenGetter } from '@/api/http';
import * as auth from '@/services/auth';
import type { Credenciais, NovoCadastro, Sessao } from '@/types/domain';

/**
 * ⚠️ Onde guardar o token (memória, localStorage, cookie httpOnly) NÃO está definido na documentação.
 * Placeholder: sessionStorage. Decidir junto ao backend FastAPI antes de produção.
 */
const CHAVE = 'habitus.sessao';

interface AuthCtx {
  sessao: Sessao | null;
  entrar: (c: Credenciais) => Promise<void>;
  cadastrar: (n: NovoCadastro) => Promise<void>;
  sair: () => void;
}
const Ctx = createContext<AuthCtx | null>(null);

function ler(): Sessao | null {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE) ?? 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(ler);

  useEffect(() => {
    registrarTokenGetter(() => sessao?.token ?? null);
    if (sessao) sessionStorage.setItem(CHAVE, JSON.stringify(sessao));
    else sessionStorage.removeItem(CHAVE);
  }, [sessao]);

  const entrar = useCallback(async (c: Credenciais) => setSessao(await auth.entrar(c)), []);
  const cadastrar = useCallback(async (n: NovoCadastro) => setSessao(await auth.cadastrar(n)), []);
  const sair = useCallback(() => setSessao(null), []);

  const valor = useMemo(() => ({ sessao, entrar, cadastrar, sair }), [sessao, entrar, cadastrar, sair]);
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth fora do AuthProvider');
  return c;
}
