import { Award, ArrowRight, LayoutGrid, Star } from 'lucide-react';
import { useState } from 'react';
import { Icone } from '@/components/ui/icons';
import { Consulta, Progress } from '@/components/ui/kit';
import { useConquistas } from '@/hooks/queries';
import { fmtNumero } from '@/lib/format';
import type { CategoriaConquista, Conquista } from '@/types/domain';

type Aba = 'Todas' | CategoriaConquista;
const ABAS: Aba[] = ['Todas', 'Tarefa', 'Consistência', 'Guilda', 'Desafio', 'Especial'];

function Cartao({ c }: { c: Conquista }) {
  const bloq = c.estado === 'bloqueada';
  return (
    <li className={`conquista ${bloq ? 'bloqueada' : ''}`}>
      <span className="selo"><Icone nome={c.icone} size={34} /></span>
      <b>{c.titulo}</b><small className="muted">{c.descricao}</small>
      {c.desbloqueadaEm && c.estado === 'desbloqueada' && <small className="ok-txt">● {c.desbloqueadaEm}</small>}
      <small className="xp">+ {fmtNumero(c.xp)} XP</small>
      {c.estado === 'em-progresso' && c.progresso && <small>{c.progresso.atual}/{c.progresso.total}</small>}
      {c.progresso && c.estado !== 'desbloqueada' && <Progress valor={c.progresso.atual} total={c.progresso.total} thin />}
      <span className={`estado ${c.estado}`}>{c.estado === 'desbloqueada' ? 'Desbloqueado' : c.estado === 'em-progresso' ? 'Em progresso' : 'Bloqueado'}</span>
    </li>
  );
}

/** Figma: "Conquistas" — só nas telas (sem classe no Diagrama de Classes). */
export function ConquistasPage() {
  const q = useConquistas();
  const [aba, setAba] = useState<Aba>('Todas');
  return (
    <Consulta q={q} linhas={4}>
      {(p) => (
        <>
          <section className="banner">
            <span className="banner-icon"><Award size={48} /></span>
            <div><h1>Conquistas</h1><p className="muted">Complete desafios, mantenha sua consistência e ganhe conquistas</p></div>
          </section>
          <section className="panel">
            <div className="duas-colunas" style={{ gridTemplateColumns: '1fr 1.4fr', marginBottom: 14 }}>
              <div className="card row"><span className="banner-icon" style={{ background: '#fdf0c9' }}><Award size={40} color="#f5a623" /></span>
                <div className="grow"><b style={{ fontSize: 22 }}>{p.desbloqueadas}</b> <b>Conquistas desbloqueadas</b><br /><small className="muted">de {p.total} conquistas</small><Progress valor={p.desbloqueadas} total={p.total} thin /></div></div>
              <div className="row wrap" role="tablist" aria-label="Categorias">
                {ABAS.map((a) => (
                  <button key={a} role="tab" aria-selected={aba === a} type="button" className={`cat-tile ${aba === a ? 'sel' : ''}`} onClick={() => setAba(a)}>
                    {a === 'Todas' ? <LayoutGrid size={22} /> : <Star size={22} />}<b>{a}</b><small>{a === 'Todas' ? p.total : p.porCategoria[a]}</small>
                  </button>))}
              </div>
            </div>
            {p.recente && (
              <section className="recente">
                <div><small>★ CONQUISTA RECENTE</small><h3>{p.recente.titulo}</h3><p>{p.recente.descricao}</p><span className="tag cyan">+ {p.recente.xp} XP</span></div>
                <button type="button" className="btn btn-sm" disabled>Ver detalhe <ArrowRight size={12} /></button>
              </section>
            )}
            <ul className="conquistas-grid">{p.itens.filter((c) => aba === 'Todas' || c.categoria === aba).map((c) => <Cartao key={c.id} c={c} />)}</ul>
          </section>
        </>
      )}
    </Consulta>
  );
}
