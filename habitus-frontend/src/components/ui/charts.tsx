/**
 * Gráficos em SVG puro (sem biblioteca) — o Dashboard (funcionalidade 10) usa apenas 3 tipos:
 * linha (Evolução de XP), rosca com segmentos (Distribuição de atividades) e rosca de percentual
 * (Progresso da guilda no desafio). Ao surgirem gráficos mais complexos, avaliar uma biblioteca.
 */
const CORES = ['#3b82f6', '#34d399', '#facc15', '#a78bfa', '#f472b6', '#fb923c'];

export function DonutSeries({ itens, centro, rotuloCentro, tamanho = 120 }: { itens: { rotulo: string; pct: number }[]; centro?: string | number; rotuloCentro?: string; tamanho?: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  let acumulado = 0;
  return (
    <div className="row" style={{ gap: 18 }}>
      <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" role="img" aria-label="Distribuição de atividades">
        {itens.map((i, idx) => {
          const len = (i.pct / 100) * c;
          const el = <circle key={i.rotulo} cx="50" cy="50" r={r} fill="none" stroke={CORES[idx % CORES.length]} strokeWidth="14" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-acumulado} transform="rotate(-90 50 50)" />;
          acumulado += len;
          return el;
        })}
        {centro !== undefined && <text x="50" y="52" textAnchor="middle" fontSize="16" fontWeight="700" fill="currentColor">{centro}</text>}
        {rotuloCentro && <text x="50" y="63" textAnchor="middle" fontSize="7" fill="currentColor">{rotuloCentro}</text>}
      </svg>
      <ul className="stack" style={{ gap: 4, fontSize: 12 }}>
        {itens.map((i, idx) => (
          <li key={i.rotulo} className="row" style={{ gap: 8 }}><span style={{ width: 9, height: 9, borderRadius: '50%', background: CORES[idx % CORES.length] }} />{i.rotulo}<b style={{ marginLeft: 'auto', paddingLeft: 12 }}>{i.pct}%</b></li>
        ))}
      </ul>
    </div>
  );
}

export function DonutPct({ pct, tamanho = 110 }: { pct: number; tamanho?: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" role="img" aria-label={`${pct}%`}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--track)" strokeWidth="10" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--accent)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 50 50)" />
      <text x="50" y="57" textAnchor="middle" fontSize="20" fontWeight="700" fill="currentColor">{pct}%</text>
    </svg>
  );
}

export function LinhaXp({ pontos }: { pontos: { data: string; xp: number }[] }) {
  const W = 300, H = 120, pad = 22;
  const max = Math.max(...pontos.map((p) => p.xp), 1) * 1.1;
  const x = (i: number) => pad + (i * (W - pad * 2)) / Math.max(pontos.length - 1, 1);
  const y = (v: number) => H - pad - (v / max) * (H - pad * 2);
  const d = pontos.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.xp)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Evolução de XP nos últimos 30 dias">
      <path d={`${d} L${x(pontos.length - 1)},${H - pad} L${x(0)},${H - pad} Z`} fill="var(--info)" opacity="0.12" />
      <path d={d} fill="none" stroke="var(--info)" strokeWidth="2" />
      {pontos.map((p, i) => <g key={p.data}><circle cx={x(i)} cy={y(p.xp)} r="3" fill="var(--info)" /><text x={x(i)} y={H - 6} textAnchor="middle" fontSize="7" fill="var(--muted)">{p.data}</text></g>)}
    </svg>
  );
}
