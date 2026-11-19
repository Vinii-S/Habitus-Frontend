import { BarChart3, Flame, Plus, Shield, Target, Trophy, Users, Zap } from 'lucide-react';
import { useState } from 'react';
import { DonutPct } from '@/components/ui/charts';
import { Icone } from '@/components/ui/icons';
import { Avatar, Chips, Consulta, Panel, Progress } from '@/components/ui/kit';
import { useDesafios } from '@/hooks/queries';
import type { Desafio } from '@/types/domain';

type Aba = 'ativos' | 'proximos' | 'concluidos' | 'todos';
const ABAS = [{ id: 'ativos', rotulo: 'Desafios ativos' }, { id: 'proximos', rotulo: 'Próximos desafios' }, { id: 'concluidos', rotulo: 'Desafios Concluídos' }, { id: 'todos', rotulo: 'Todos os desafios' }] as const;
const CAPAS = ['#4b4a44', '#3a2e24', '#5d7a8c', '#c97b4a', '#6b5a4a', '#7b9a5a'];

function CartaoDesafio({ d }: { d: Desafio }) {
  return (
    <li className="desafio-card">
      <div className="capa" style={{ background: CAPAS[d.id % CAPAS.length] }}>
        <span className="tag grey">{d.diasRestantes !== undefined ? `${d.diasRestantes} dias restantes` : `começa em ${d.comecaEmDias} dias`}</span>
      </div>
      <div className="corpo stack" style={{ gap: 6 }}>
        <b>{d.titulo}</b><small className="muted">{d.descricao}</small>
        {d.situacao === 'ativo' && <div><div className="row"><Progress valor={d.membrosParticipando} total={d.totalMembros} thin className="grow" /></div><small className="muted">{d.membrosParticipando}/{d.totalMembros} Membros</small></div>}
        <button type="button" className="btn btn-outline btn-sm btn-block" disabled title="Tela de detalhes do desafio não existe no Figma">{d.situacao === 'ativo' ? 'Ver detalhes' : 'Ver Desafio'}</button>
        <div className="row wrap" style={{ gap: 6 }}>{d.tags.map((t, i) => <span key={t} className={`tag ${i ? 'cyan' : 'ok'}`}>{t}</span>)}<span className="tag xp">+ {d.xp} XP</span></div>
      </div>
    </li>
  );
}

/**
 * Figma: "Desafios da guilda". Desafios NÃO existem no Diagrama de Classes nem nos casos de uso —
 * entidade, regras e endpoints precisam ser definidos (lacuna). "Criar desafio" e "Participar" ficam
 * desativados por não haver fluxo especificado.
 */
export function DesafiosPage() {
  const q = useDesafios();
  const [aba, setAba] = useState<Aba>('ativos');
  return (
    <Consulta q={q} linhas={4}>
      {(p) => (
        <>
          <section className="banner">
            <span className="banner-icon"><Target size={48} /></span>
            <div className="grow"><h1>Desafios da guilda</h1><p className="muted">Acompanhe seu progresso e veja os destaques da comunidade.</p></div>
            <button type="button" className="btn btn-dark btn-lg" disabled title="Fluxo não especificado"><Plus /> Criar desafio</button>
          </section>
          <div className="duas-colunas" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <Panel>
              <Chips itens={ABAS} valor={aba} onChange={setAba} rotulo="Filtrar desafios" />
              <section className="card row" style={{ margin: '12px 0' }}>
                <span className="banner-icon" style={{ background: '#fdf0c9', width: 110, height: 110 }}><Trophy size={56} color="#f5b301" /></span>
                <div className="grow stack" style={{ gap: 4 }}>
                  <div className="row"><Trophy size={18} /><b>Desafio da semana</b><span className="tag grey">{p.destaque.diasRestantes} dias restantes</span></div>
                  <h2>{p.destaque.titulo}</h2><small className="muted">{p.destaque.descricao}</small>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <b style={{ fontSize: 20 }}>{p.destaque.membrosParticipando}/{p.destaque.totalMembros}</b><div className="muted" style={{ fontSize: 11 }}>Membros participantes</div>
                  <div className="row" style={{ justifyContent: 'center', gap: 2 }}>{p.participantes.slice(0, 3).map((x) => <Avatar key={x.nome} nome={x.nome} size={20} />)}<span className="tag grey">+3</span></div>
                  <button type="button" className="btn btn-dark btn-sm" disabled style={{ marginTop: 8 }}>Participar do desafio</button>
                </div>
              </section>
              {(aba === 'ativos' || aba === 'todos') && <><h3>Desafios ativos</h3><ul className="desafios-grid">{p.ativos.map((d) => <CartaoDesafio key={d.id} d={d} />)}</ul></>}
              {(aba === 'proximos' || aba === 'todos') && <><h3 style={{ marginTop: 14 }}>Próximos desafios</h3><ul className="desafios-grid">{p.proximos.map((d) => <CartaoDesafio key={d.id} d={d} />)}</ul></>}
              {(aba === 'concluidos' || aba === 'todos') && <><h3 style={{ marginTop: 14 }}>Desafios concluídos</h3><ul className="stack">{p.historico.filter((h) => aba === 'todos' || h.situacao === 'concluido').map((h) => <li key={h.id} className="card row"><Icone nome={h.icone} /><b>{h.titulo}</b></li>)}</ul></>}
            </Panel>
            <aside className="stack">
              <Panel titulo="Progresso da guilda no desafio atual" icone={<BarChart3 />}>
                <div className="row"><DonutPct pct={p.progressoGuilda.pct} /><div className="grow"><b className="muted">{p.progressoGuilda.membros} de {p.progressoGuilda.total} membros participando</b><Progress valor={p.progressoGuilda.membros} total={p.progressoGuilda.total} className="dark" /></div></div>
                <div className="row between" style={{ marginTop: 8 }}><span className="row" style={{ gap: 4 }}><Zap size={14} color="#f5a623" /> +{p.progressoGuilda.xp} XP</span><span className="row" style={{ gap: 4 }}><Flame size={14} color="#f97316" /> {p.progressoGuilda.diasRestantes} dias restante</span><span className="row" style={{ gap: 4 }}><Users size={14} /> {p.progressoGuilda.membros}</span></div>
              </Panel>
              <Panel titulo="Ranking dos participantes" icone={<BarChart3 />}>
                <ul className="stack" style={{ gap: 4 }}>{p.participantes.map((x) => <li key={x.nome} className={`row card ${x.posicao === 1 ? 'destaque' : ''}`}><span className="pos">{x.posicao}</span><Avatar nome={x.nome} size={20} />{x.nome}</li>)}</ul>
              </Panel>
              <Panel titulo="Histórico de desafio" icone={<Shield size={16} />}>
                <ul className="stack" style={{ gap: 6 }}>{p.historico.map((h) => <li key={h.id} className="row"><Icone nome={h.icone} /><div><b>{h.titulo}</b><small style={{ display: 'block', color: h.situacao === 'concluido' ? 'var(--ok)' : 'var(--muted)' }}>● {h.situacao === 'concluido' ? 'Concluído' : 'Não concluído'}</small></div></li>)}</ul>
              </Panel>
            </aside>
          </div>
        </>
      )}
    </Consulta>
  );
}
