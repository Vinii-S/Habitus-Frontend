const nf = new Intl.NumberFormat('pt-BR');
export const fmtNumero = (n: number) => nf.format(n);
export const fmtXp = (n: number) => `${nf.format(n)} XP`;
export const pct = (atual: number, total: number) =>
  total <= 0 ? 0 : Math.min(100, Math.round((atual / total) * 100));

/** "há 5 minutos", "há 2 horas", "há 1 dia" — formato visto nas telas de notificações e mural. */
export function tempoRelativo(iso: string, agora = Date.now()): string {
  const min = Math.max(0, Math.round((agora - new Date(iso).getTime()) / 60000));
  if (min < 60) return `há ${min} ${min === 1 ? 'minuto' : 'minutos'}`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} ${h === 1 ? 'hora' : 'horas'}`;
  const d = Math.round(h / 24);
  return `há ${d} ${d === 1 ? 'dia' : 'dias'}`;
}

export const fmtDataCurta = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
