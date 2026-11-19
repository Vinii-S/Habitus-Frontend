import { Crown, Flame, Search, Star, Target, TrendingUp, Trophy, Users, Zap, List } from 'lucide-react';
import { useState } from 'react';
import { Icone } from '@/components/ui/icons';
import { Avatar, Consulta, Panel, Progress } from '@/components/ui/kit';
import { useMinhaGuilda, useRanking } from '@/hooks/queries';
import { fmtNumero } from '@/lib/format';
import type { PeriodoRanking } from '@/types/domain';

const PERIODOS: { id: PeriodoRanking; rotulo: string }[] = [{ id: 'geral', rotulo: 'Geral' }, { id: 'semanal', rotulo: 'Semanal' }, { id: 'mensal', rotulo: 'Mensal' }];

/**
 * Figma: "Ranking" — RF08 (Leaderboard), RankingGrupo [DC] (ligaAtual, dataUltimoReset), "Ligas Semanais".
 * O filtro "Todos os usuários" tem só o texto-padrão no Figma; "Minha guilda" é uma opção provisória.
 */
export function RankingPage() {
  const [periodo, setPeriodo] = useState<PeriodoRanking>('semanal');
  const [escopo, setEscopo] = useState<'todos' | 'guilda'>('todos');
  const [busca, setBusca] = useState('');
  const q = useRanking(periodo);
  const guilda = useMinhaGuilda();
  const nomeGuilda = guilda.data?.grupo.nome;

  return (
    <Consulta q={q} linhas={5}>
      {(r) => {
        const linhas = r.linhas.filter((l) => (escopo === 'todos' || l.guilda.nome === nomeGuilda) && l.usuario.nomeExibicao.toLowerCase().includes(busca.toLowerCase()));
        const [p1, p2, p3] = [r.linhas[0], r.linhas[1], r.linhas[2]];
        const eu = r.minhaPosicao;
        return (
          <>
            <section className="banner">
              <span className="banner-icon"><Trophy size={48} /></span>
              <div className="grow"><h1>Ranking</h1><p className="muted">Acompanhe seu progresso e veja os destaques da comunidade.</p></div>
              <div className="segmentado" role="tablist" aria-label="Período">
                {PERIODOS.map((x) => <button key={x.id} role="tab" aria-selected={periodo === x.id} type="button" onClick={() => setPeriodo(x.id)}>{x.rotulo}</button>)}
              </div>
              <select className="chip" aria-label="Escopo" value={escopo} onChange={(e) => setEscopo(e.target.value as typeof escopo)}><option value="todos">Todos os usuários</option><option value="guilda">Minha guilda</option></select>
            </section>

            <div className="duas-colunas" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
              <Panel titulo="Top 3 da semana" icone={<Crown />} acao={<span className="muted" style={{ fontSize: 11 }}>Reseta em {r.reiniciaEmDias} dias.</span>}>
                <p className="muted" style={{ marginTop: -8 }}>Usuários com mais XP conquistado nesta semana.</p>
                <div className="podio">
                  {[[p2, 2], [p1, 1], [p3, 3]].map(([l, pos]) => l && (
                    <div key={String(pos)} className={`degrau p${pos}`}><Avatar nome={(l as typeof p1).usuario.nomeExibicao} size={pos === 1 ? 56 : 46} /><b>{(l as typeof p1).usuario.nomeExibicao}</b><small>{fmtNumero((l as typeof p1).xp)} XP</small></div>
                  ))}
                </div>
              </Panel>
              <Panel titulo="Sua posição no ranking" icone={<Users />}>
                <div className="card row highlight"><Avatar size={52} /><div className="grow"><b style={{ fontSize: 18 }}># {eu.posicao}</b><div>Ronald</div><small className="muted">{fmtNumero(eu.xp)} XP esta semana.</small></div><Crown color="#f5b301" /></div>
                <div className="stats-row" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 8 }}>
                  <div className="card"><TrendingUp size={16} color="var(--ok)" /> <b>+{eu.deltaXp} XP</b><small className="muted" style={{ display: 'block' }}>em relação à semana passada</small></div>
                  <div className="card"><Zap size={16} color="#f5a623" /> <b>{eu.tarefas}</b><small className="muted" style={{ display: 'block' }}>tarefas concluídas</small></div>
                  <div className="card"><Target size={16} color="var(--info)" /> <b>{eu.metaSemanalPct}%</b><small className="muted" style={{ display: 'block' }}>meta semanal</small></div>
                  <div className="card"><Flame size={16} color="#f97316" /> <b>{eu.sequenciaDias}</b><small className="muted" style={{ display: 'block' }}>dias de sequência</small></div>
                </div>
              </Panel>

              <Panel titulo="Ranking completo" icone={<List />} acao={<div className="input" style={{ minHeight: 32 }}><input placeholder="Buscar usuário..." aria-label="Buscar usuário" value={busca} onChange={(e) => setBusca(e.target.value)} /><Search size={14} /></div>}>
                <table className="tabela"><thead><tr><th>#</th><th>Membro</th><th>Guilda</th><th>XP (semana)</th><th>Tarefas</th><th>Sequência</th></tr></thead>
                  <tbody>{linhas.map((l) => (
                    <tr key={l.posicao} className={l.posicao === eu.posicao ? 'destaque' : ''}>
                      <td><span className="pos">{l.posicao}</span></td>
                      <td><span className="row"><Avatar nome={l.usuario.nomeExibicao} size={26} />{l.usuario.nomeExibicao}{l.posicao === 1 && <Crown size={13} color="#f5b301" />}</span></td>
                      <td><span className="row" style={{ gap: 6 }}><Icone nome={l.guilda.icone} size={18} />{l.guilda.nome}</span></td>
                      <td>{fmtNumero(l.xp)} XP</td><td>{l.tarefas}</td><td><Flame size={12} color="#f97316" /> {l.sequenciaDias} {l.sequenciaDias === 1 ? 'dia' : 'dias'}</td>
                    </tr>))}</tbody></table>
                {linhas.length === 0 && <p className="state">Nenhum usuário encontrado.</p>}
              </Panel>
              <aside className="stack">
                <Panel titulo="Ranking por guilda" icone={<Users />}>
                  <ul className="stack" style={{ gap: 6 }}>{r.porGuilda.map((g) => <li key={g.posicao} className="card row"><span className="pos">{g.posicao}</span><Icone nome={g.guilda.icone} size={20} /><b>{g.guilda.nome}</b><Progress valor={g.xp} total={g.maxXp} thin className="grow" /><small>{fmtNumero(g.xp)}</small></li>)}</ul>
                </Panel>
                <Panel titulo="Conquistas do ranking" icone={<Star />}>
                  <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>{r.conquistasDoRanking.map((c) => <div key={c.titulo} className="card" style={{ fontSize: 10 }}><b>{c.titulo}</b><br /><span className="muted">{c.descricao}</span></div>)}</div>
                </Panel>
              </aside>
            </div>
          </>
        );
      }}
    </Consulta>
  );
}
