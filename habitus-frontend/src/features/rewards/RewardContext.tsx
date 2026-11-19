import { Sparkles, Trophy } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { fmtNumero } from '@/lib/format';

/**
 * RNF09: "Sempre que o usuário ganhar XP ou subir no ranking da guilda, o frontend em React deve
 * exibir uma notificação ou animação visual na tela para reforçar a gamificação."
 * UC003 passo 7: "feedback visual de recompensa (XP/Nível)".
 */
interface Aviso { id: number; tipo: 'xp' | 'nivel' | 'ranking'; texto: string }
interface Ctx { anunciarXp: (xp: number) => void; anunciarNivel: (nivel: number) => void; anunciarRanking: (posicao: number) => void }
const C = createContext<Ctx | null>(null);
let n = 0;

export function RewardProvider({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  const push = useCallback((tipo: Aviso['tipo'], texto: string) => {
    const id = ++n;
    setAvisos((a) => [...a, { id, tipo, texto }]);
    setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), 3600);
  }, []);

  const v = useMemo<Ctx>(
    () => ({
      anunciarXp: (xp) => push('xp', `+${fmtNumero(xp)} XP`),
      anunciarNivel: (nivel) => push('nivel', `Você subiu para o Nível ${nivel}!`),
      anunciarRanking: (pos) => push('ranking', `Você subiu para a posição #${pos} no ranking!`),
    }),
    [push],
  );

  return (
    <C.Provider value={v}>
      {children}
      <div className="rewards" role="status" aria-live="polite">
        {avisos.map((a) => (
          <div key={a.id} className={`reward ${a.tipo === 'xp' ? '' : 'nivel'}`}>
            {a.tipo === 'xp' ? <Sparkles size={20} /> : <Trophy size={20} />}
            {a.texto}
          </div>
        ))}
      </div>
    </C.Provider>
  );
}

export const useRecompensas = () => {
  const c = useContext(C);
  if (!c) throw new Error('useRecompensas fora do RewardProvider');
  return c;
};
