import { BarChart3, Calendar, Check, CheckCircle2, Crown, Target, Trophy, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { DonutSeries, LinhaXp } from '@/components/ui/charts';
import { Consulta, Panel, Progress, Stat } from '@/components/ui/kit';
import { useProgresso } from '@/hooks/queries';
import { fmtNumero } from '@/lib/format';

/** Figma: "Progresso e Níveis" — funcionalidade 10 (Dashboard de Estatísticas) + funcionalidade 1 (evolução). */
export function ProgressoPage() {
  const q = useProgresso();
  return (
    <Consulta q={q} linhas={4}>
      {(p) => (
        <>
          <section className="banner"><span className="banner-icon"><BarChart3 size={44} /></span><div><h1>Progresso e Níveis</h1><p className="muted">Sua jornada e evolução. Complete tarefas, ganhe XP e alcance novos níveis.</p></div></section>

          <div className="duas-colunas" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <section className="nivel-hero">
              <span className="hex" aria-label={`Nível ${p.nivel}`}>{p.nivel}</span>
              <div><h2>Nível {p.nivel}</h2><b>{p.tituloNivel}</b><p style={{ fontSize: 11 }}>Disciplina hoje, grandes resultados amanhã.</p>
                <Progress valor={p.xpAtual} total={p.xpProximoNivel} className="dark" /><small>{fmtNumero(p.xpAtual)} / {fmtNumero(p.xpProximoNivel)} XP</small></div>
            </section>
            <Panel titulo="Próximo nível" icone={<Users />}>
              <div className="row"><span className="hex cinza">{p.proximoNivel.nivel}</span>
                <div><b>{p.proximoNivel.titulo}</b><p className="muted" style={{ fontSize: 12 }}>“{p.proximoNivel.frase}”</p></div></div>
              <ul className="stack muted" style={{ gap: 4, marginTop: 8, fontSize: 12 }}>{p.proximoNivel.beneficios.map((b) => <li key={b} className="row" style={{ gap: 6 }}><CheckCircle2 size={14} />{b}</li>)}</ul>
            </Panel>
          </div>

          <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <Stat icone={<Zap color="#f5a623" />} valor={fmtNumero(p.totais.xpTotal)} rotulo="Total acumulado" cor="#fdf0c9" />
            <Stat icone={<CheckCircle2 color="#fff" fill="#1fb87a" />} valor={p.totais.tarefasConcluidas} rotulo="Tarefas concluídas" cor="#c9f3dd" />
            <Stat icone={<Calendar color="#2f80ed" />} valor={p.totais.diasSequencia} rotulo="Dias de sequência" cor="#d8e4ff" />
            <Stat icone={<Trophy color="#7c3aed" />} valor={p.totais.conquistas} rotulo="Conquistas desbloqueadas" cor="#e5dcfb" />
          </div>

          <Panel titulo="Sua jornada de níveis" icone={<Crown />}>
            <p className="muted" style={{ marginTop: -8 }}>Veja o que você já conquistou e o que ainda está por vir!</p>
            <ol className="jornada">
              {p.jornada.map((j) => (
                <li key={j.nivel} className={j.alcancado ? 'ok' : ''}><span className={`hex mini ${j.nivel === p.nivel ? 'atual' : j.alcancado ? '' : 'cinza'}`}>{j.nivel}</span><b>{j.titulo}</b>{j.alcancado ? <Check size={14} color="var(--ok)" /> : <span className="circulo" />}<small>{j.descricao}</small></li>
              ))}
            </ol>
          </Panel>

          <div className="tres-colunas">
            <Panel titulo="Evolução de XP" icone={<BarChart3 />} acao={<select className="chip" aria-label="Período"><option>Últimos 30 dias</option></select>}><LinhaXp pontos={p.evolucaoXp} /></Panel>
            <Panel titulo="Distribuição de atividades" icone={<BarChart3 />}><DonutSeries itens={p.distribuicao} centro={p.totais.tarefasConcluidas} rotuloCentro="tarefas" /></Panel>
            <Panel titulo={`Metas do nível ${p.nivel}`} icone={<Target />}>
              <ul className="stack" style={{ gap: 8 }}>{p.metasDoNivel.map((m) => (
                <li key={m.texto}><div className="row between" style={{ fontSize: 12 }}><span className="row" style={{ gap: 6 }}><CheckCircle2 size={14} color="var(--muted)" />{m.texto}</span><small className="muted">{fmtNumero(m.atual)}/{fmtNumero(m.total)}</small></div><Progress valor={m.atual} total={m.total} thin /></li>))}</ul>
              <Link to={PATHS.conquistas} style={{ fontSize: 12 }}>Ver conquistas →</Link>
            </Panel>
          </div>
        </>
      )}
    </Consulta>
  );
}
