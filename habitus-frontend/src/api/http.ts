import { env } from '@/config/env';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detalhe?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let tokenGetter: () => string | null = () => null;
/** Registrado pelo AuthProvider — mantém o cliente HTTP desacoplado do React. */
export function registrarTokenGetter(fn: () => string | null) {
  tokenGetter = fn;
}

interface Opcoes {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  formData?: FormData; // upload da Prova de Conclusão (UC003)
  timeoutMs?: number;
  signal?: AbortSignal;
}

/**
 * Cliente HTTP único. O contrato da API FastAPI NÃO está na documentação:
 * a forma de autenticação (aqui: header Bearer) é uma suposição a confirmar com o backend.
 */
export async function http<T>(caminho: string, op: Opcoes = {}): Promise<T> {
  const { method = 'GET', body, formData, timeoutMs = 15000, signal } = op;
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = tokenGetter();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const timeout = AbortSignal.timeout(timeoutMs);
  const res = await fetch(`${env.apiUrl}${caminho}`, {
    method,
    headers,
    body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });

  if (!res.ok) {
    let detalhe: unknown;
    try {
      detalhe = await res.json();
    } catch {
      /* corpo vazio */
    }
    throw new ApiError(res.status, `Erro ${res.status} em ${caminho}`, detalhe);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
