import { CheckCircle2, ClipboardCheck, Clock, Image as ImageIcon, ListChecks, Menu, Plus, Target, Zap, BarChart3, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { Chips, Consulta, Panel, Progress, Stat } from '@/components/ui/kit';
import { usePainelTarefas } from '@/hooks/queries';
import { pct } from '@/lib/format';
import type { Atividade } from '@/types/domain';
import { CheckInDialog } from './CheckInDialog';
import { MiniCalendario } from './MiniCalendario';
import { TarefaItem } from './TarefaItem';

type Filtro = 'todas' | 'hoje' | 'andamento' | 'concluidas' | 'atrasadas';
const FILTROS = [
  { id: 'todas', rotulo: 'Todas' }, { id: 'hoje', rotulo: 'Hoje' }, { id: 'andamento', rotulo: 'Em andamento' },
  { id: 'concluidas', rotulo: 'Concluídas' }, { id: 'atrasadas', rotulo: 'Atrasadas' },
] as const;
const passa = (f: Filtro, a: Atividade) =>
  f === 'todas' || (f === 'hoje' && a.hoje) || (f === 'andamento' && a.status === 'Em andamento') ||
  (f === 'concluidas' && a.status === 'Concluída') || (f === 'atrasadas' && a.status === 'Atrasada');

/** Figma: "Minhas Tarefas" (RF05 — check-in de tarefas). */
export function MinhasTarefasPage() {
  const q = usePainelTarefas();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [alvo, setAlvo] = useState<Atividade>();

  return (
    <Consulta q={q} linhas={5}>
      {({ atividades, resumoSemana, metaSemanal }) => {
        const hoje = atividades.filter((a) => a.hoje);
        const feitasHoje = hoje.filter((a) => a.status === 'Concluída');
        const xpHoje = feitasHoje.reduce((s, a) => s + a.xpRecompensa, 0);
        const visiveis = atividades.filter((a) => passa(filtro, a));
        const secoes = [
          { titulo: 'Tarefas de hoje', itens: visiveis.filter((a) => a.hoje) },
          { titulo: 'Outras tarefas', itens: visiveis.filter((a) => !a.hoje) },
        ];
        return (
          <>
            <section className="banner" aria-label="Meu progresso de hoje">
              <span className="banner-icon"><ImageIcon /></span>
              <div className="grow">
                <h1>Meu progresso de hoje</h1>
                <p>Você concluiu {feitasHoje.length} de {hoje.length} tarefas</p>
                <div className="row"><Progress valor={feitasHoje.length} total={hoje.length} className="grow dark" rotulo="Progresso de hoje" /><strong>{pct(feitasHoje.length, hoje.length)}%</strong></div>
              </div>
              <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, minmax(110px,1fr))' }}>
                <Stat icone={<Zap color="#f5a623" />} valor={`${xpHoje} XP`} rotulo="Conquistados hoje" cor="#fff" />
                <Stat icone={<CheckCircle2 color="#fff" fill="#1fb87a" />} valor={feitasHoje.length} rotulo="Tarefas concluída" cor="#fff" />
                <Stat icone={<Target />} valor={hoje.length - feitasHoje.length} rotulo="Tarefas pendentes" cor="#fff" />
              </div>
              <Link to={PATHS.novaTarefa} className="btn btn-dark btn-lg" style={{ textDecoration: 'none' }}><Plus /> Criar tarefa</Link>
            </section>

            <div className="duas-colunas">
              <Panel>
                <Chips itens={FILTROS} valor={filtro} onChange={setFiltro} rotulo="Filtrar tarefas" />
                {secoes.map((s) => (
                  <div key={s.titulo} style={{ marginTop: 18 }}>
                    <h2 className="row" style={{ marginBottom: 8 }}><ClipboardCheck /> {s.titulo}</h2>
                    {s.itens.length === 0 ? <p className="state">Nenhuma tarefa neste filtro.</p> : (
                      <ul className="stack">{s.itens.map((a) => <TarefaItem key={a.id} a={a} onCheckIn={setAlvo} />)}</ul>
                    )}
                  </div>
                ))}
              </Panel>

              <aside className="stack">
                <Panel titulo="Calendário de Tarefas" icone={<CalendarDays />}><MiniCalendario /></Panel>
                <Panel titulo={<>Resumo da semana</>} icone={<BarChart3 />} acao={<span className="muted">{resumoSemana.intervalo}</span>}>
                  <div className="stats-row" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    <Stat icone={<Zap color="#f5a623" />} valor={`${resumoSemana.xp} XP`} rotulo="Conquistados" cor="#fff" />
                    <Stat icone={<CheckCircle2 color="#fff" fill="#1fb87a" />} valor={resumoSemana.concluidas} rotulo="Concluídas" cor="#fff" />
                    <Stat icone={<Clock />} valor={resumoSemana.emAndamento} rotulo="Em andamento" cor="#fff" />
                    <Stat icone={<Menu />} valor={resumoSemana.naoIniciadas} rotulo="Não iniciada" cor="#fff" />
                  </div>
                </Panel>
                <Panel titulo="Meta semanal" icone={<ListChecks />} acao={<span className="muted">{metaSemanal.feitas} / {metaSemanal.total} tarefas</span>}>
                  <p className="muted">{metaSemanal.descricao}</p>
                  <div className="row"><Progress valor={metaSemanal.feitas} total={metaSemanal.total} className="grow dark" rotulo="Meta semanal" /><strong>{pct(metaSemanal.feitas, metaSemanal.total)}%</strong></div>
                </Panel>
              </aside>
            </div>
            {alvo && <CheckInDialog atividade={alvo} onFechar={() => setAlvo(undefined)} />}
          </>
        );
      }}
    </Consulta>
  );
}
