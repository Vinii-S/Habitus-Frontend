import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/** Tela Configurações › Aparência: Tema (Claro/Escuro/Sistema) e Cor de destaque (6 opções). */
export type Tema = 'claro' | 'escuro' | 'sistema';
export const CORES_DESTAQUE = [
  { id: 'roxo', hex: '#5f0a72' },
  { id: 'azul', hex: '#2f80ed' },
  { id: 'verde', hex: '#1fb87a' },
  { id: 'amarelo', hex: '#f5a623' },
  { id: 'rosa', hex: '#e84a9a' },
  { id: 'vermelho', hex: '#e5484d' },
] as const;

interface Ctx { tema: Tema; setTema: (t: Tema) => void; cor: string; setCor: (id: string) => void }
const C = createContext<Ctx | null>(null);
const K = 'habitus.aparencia';

function ler(): { tema: Tema; cor: string } {
  try {
    return { tema: 'claro', cor: 'roxo', ...JSON.parse(localStorage.getItem(K) ?? '{}') };
  } catch {
    return { tema: 'claro', cor: 'roxo' };
  }
}

export function AparenciaProvider({ children }: { children: ReactNode }) {
  const [{ tema, cor }, set] = useState(ler);

  useEffect(() => {
    const aplicar = () => {
      const escuro = tema === 'escuro' || (tema === 'sistema' && matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.dataset.tema = escuro ? 'escuro' : 'claro';
    };
    aplicar();
    const mq = matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', aplicar);
    return () => mq.removeEventListener('change', aplicar);
  }, [tema]);

  useEffect(() => {
    const hex = CORES_DESTAQUE.find((c) => c.id === cor)?.hex ?? CORES_DESTAQUE[0].hex;
    document.documentElement.style.setProperty('--accent', hex);
    localStorage.setItem(K, JSON.stringify({ tema, cor }));
  }, [tema, cor]);

  const v = useMemo(() => ({ tema, cor, setTema: (t: Tema) => set((s) => ({ ...s, tema: t })), setCor: (c: string) => set((s) => ({ ...s, cor: c })) }), [tema, cor]);
  return <C.Provider value={v}>{children}</C.Provider>;
}

export const useAparencia = () => {
  const c = useContext(C);
  if (!c) throw new Error('useAparencia fora do AparenciaProvider');
  return c;
};
