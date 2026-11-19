import { UserRound, X } from 'lucide-react';
import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { pct } from '@/lib/format';

/** Barra de progresso (usada em tarefas, XP, guilda, desafios). */
export function Progress({ valor, total = 100, className = '', rotulo, thin }: { valor: number; total?: number; className?: string; rotulo?: string; thin?: boolean }) {
  const p = pct(valor, total);
  return (
    <div className={`progress ${thin ? 'thin' : ''} ${className}`} role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100} aria-label={rotulo}>
      <span style={{ width: `${p}%` }} />
    </div>
  );
}

export function Avatar({ nome, src, size = 32 }: { nome?: string; src?: string; size?: number }) {
  return (
    <span className="avatar" style={{ width: size, height: size }} title={nome}>
      {src ? <img src={src} alt={nome ?? ''} loading="lazy" /> : <UserRound size={size * 0.6} aria-hidden="true" />}
    </span>
  );
}

export function Stat({ icone, valor, rotulo, cor = '#fdf0c9' }: { icone: ReactNode; valor: ReactNode; rotulo: string; cor?: string }) {
  return (
    <div className="stat">
      <span className="stat-icon" style={{ background: cor }}>{icone}</span>
      <div>
        <strong>{valor}</strong>
        <span>{rotulo}</span>
      </div>
    </div>
  );
}

/** Cabeçalho de página: ícone + título + subtítulo + ação opcional (ex.: "Criar guilda"). */
export function Banner({ icone, titulo, subtitulo, acao }: { icone: ReactNode; titulo: string; subtitulo?: string; acao?: ReactNode }) {
  return (
    <section className="banner">
      <span className="banner-icon">{icone}</span>
      <div className="grow">
        <h1>{titulo}</h1>
        {subtitulo && <p className="muted">{subtitulo}</p>}
      </div>
      {acao}
    </section>
  );
}

export function Panel({ titulo, icone, acao, children, className = '' }: { titulo?: ReactNode; icone?: ReactNode; acao?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`panel ${className}`}>
      {titulo && (
        <div className="panel-title row between">
          <div className="row">
            {icone}
            <h2>{titulo}</h2>
          </div>
          {acao}
        </div>
      )}
      {children}
    </section>
  );
}

export function Chips<T extends string>({ itens, valor, onChange, rotulo, purple }: { itens: readonly { id: T; rotulo: string }[]; valor: T; onChange: (v: T) => void; rotulo: string; purple?: boolean }) {
  return (
    <div className={`chips ${purple ? 'purple' : ''}`} role="tablist" aria-label={rotulo}>
      {itens.map((i) => (
        <button key={i.id} role="tab" type="button" className="chip" aria-selected={valor === i.id} onClick={() => onChange(i.id)}>
          {i.rotulo}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ marcado, onChange, rotulo }: { marcado: boolean; onChange: (v: boolean) => void; rotulo: string }) {
  return <button type="button" role="switch" aria-checked={marcado} aria-label={rotulo} className="toggle" onClick={() => onChange(!marcado)} />;
}

export function Dialog({ titulo, onFechar, children }: { titulo: string; onFechar: () => void; children: ReactNode }) {
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="row between">
          <h3>{titulo}</h3>
          <button type="button" className="icon-btn" onClick={onFechar} aria-label="Fechar"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * Padroniza carregando/erro das consultas. RNF02 (≤ 7 s no mural) é tratado no cliente HTTP via timeout;
 * aqui o erro vira mensagem + botão de nova tentativa.
 */
export function Consulta<T>({ q, children, linhas = 3 }: { q: UseQueryResult<T>; children: (dados: T) => ReactNode; linhas?: number }) {
  if (q.isPending) {
    return (
      <div className="stack" aria-busy="true">
        {Array.from({ length: linhas }, (_, i) => <div key={i} className="skeleton" style={{ height: 56 }} />)}
      </div>
    );
  }
  if (q.isError) {
    return (
      <div className="state">
        <p>Não foi possível carregar os dados.</p>
        <button type="button" className="btn btn-outline" onClick={() => q.refetch()}>Tentar novamente</button>
      </div>
    );
  }
  return <>{children(q.data as T)}</>;
}
