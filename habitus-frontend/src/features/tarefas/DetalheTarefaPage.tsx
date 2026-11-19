import { ArrowLeft, Calendar, CheckCircle2, Clock, FileText, Flame, Quote, Target, Trash2, Trophy, XCircle, Zap, BarChart3, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { Icone, ICONE_CATEGORIA } from '@/components/ui/icons';
import { Consulta, Dialog, Progress, Stat } from '@/components/ui/kit';
import { useDetalheTarefa, useExcluirAtividade } from '@/hooks/queries';
import { CheckInDialog } from './CheckInDialog';

/** Figma: "Detalhes da tarefa". Botões "Editar tarefa/descrição" existem no Figma, mas não há fluxo de edição definido (UC) — ficam desativados. */
export function DetalheTarefaPage() {
  const id = Number(useParams().id);
  const q = useDetalheTarefa(id);
  const excluir = useExcluirAtividade();
  const nav = useNavigate();
  const [checkin, setCheckin] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  return (
    <div className="panel">
      <Link to={PATHS.tarefas} className="row" style={{ color: 'inherit', fontSize: 13 }}><ArrowLeft size={16} /> Voltar para Minhas Tarefas</Link>
      <h1 style={{ margin: '6px 0 14px' }}>Detalhes da tarefa</h1>
      <Consulta q={q} linhas={4}>
        {({ atividade: a, semana, diasFeitos, estatisticas: s, historico, motivacao, citacao }) => (
          <div className="duas-colunas">
            <div className="stack">
              <section className="card stack">
                <div className="row">
                  <span className="tarefa-icone"><Icone nome={ICONE_CATEGORIA[a.categoria]} size={28} /></span>
                  <div className="grow"><h2>{a.nome}</h2><p className="muted" style={{ fontSize: 12 }}>{a.descricao}</p></div>
                  <span className="tag pink">{a.categoria}</span>
                  <button type="button" className="btn btn-outline btn-sm" disabled title="Edição de tarefa não especificada nos casos de uso">Editar tarefa</button>
                </div>
                <div className="stats-row">
                  <Stat icone={<Zap color="#f5a623" />} valor={`+ ${a.xpRecompensa} XP`} rotulo="por conclusão" cor="#fff" />
                  <Stat icone={<Target />} valor="Meta" rotulo={a.meta ?? '—'} cor="#fff" />
                  <Stat icone={<Calendar />} valor="Frequência" rotulo={a.frequencia} cor="#fff" />
                  <Stat icone={<Clock />} valor="Tempo estimado" rotulo={a.duracaoEstimadaMin ? `${a.duracaoEstimadaMin} minutos` : '—'} cor="#fff" />
                </div>
              </section>

              <section className="card stack">
                <div className="row between">
                  <div><h3 className="row"><ClipboardCheck /> Progresso dessa semana</h3><p className="muted" style={{ fontSize: 12 }}>Você fez {diasFeitos} de 7 dias. Continue assim!</p></div>
                  <div style={{ textAlign: 'right' }}><strong style={{ fontSize: 24 }}>{Math.round((diasFeitos / 7) * 100)}%</strong><p className="muted" style={{ fontSize: 11 }}>da meta semanal</p></div>
                </div>
                <ol className="semana">
                  {semana.map((d) => (
                    <li key={d.rotulo}>{d.feito ? <CheckCircle2 color="#fff" fill="#1fb87a" /> : <span className="circulo" />}<b>{d.rotulo}</b><small>{d.data}</small></li>
                  ))}
                </ol>
                <div className="row"><Progress valor={diasFeitos} total={7} className="grow dark" /><span>{diasFeitos} / 7 dias</span>
                  <button type="button" className="btn btn-dark" disabled={a.status === 'Concluída'} onClick={() => setCheckin(true)}>Fazer check-in</button></div>
              </section>

              <section className="card stack">
                <h3 className="row"><BarChart3 /> Estatísticas</h3>
                <div className="stats-row">
                  <Stat icone={<Zap color="#f5a623" />} valor={s.conclusoesTotais} rotulo="Conclusões Totais" cor="#fff" />
                  <Stat icone={<Target />} valor={`${s.taxaConclusao}%`} rotulo="Taxa de Conclusão (últimos 7 dias)" cor="#fff" />
                  <Stat icone={<Flame color="#f97316" />} valor={`${s.sequenciaAtual} dias`} rotulo="Sequência atual" cor="#fff" />
                  <Stat icone={<Trophy color="#eab308" />} valor={s.melhorSequencia} rotulo="Melhor sequência" cor="#fff" />
                </div>
              </section>

              <section className="card stack">
                <div className="row between"><h3 className="row"><FileText /> Descrição e motivação</h3><button type="button" className="btn btn-outline btn-sm" disabled>Editar descrição</button></div>
                <p className="muted">{motivacao}</p>
                {citacao && <p className="citacao"><Quote size={14} /> “{citacao}”</p>}
              </section>
              <div><button type="button" className="btn btn-danger" onClick={() => setConfirmar(true)}><Trash2 size={16} /> Excluir tarefa</button></div>
            </div>

            <aside className="card stack" style={{ alignSelf: 'start' }}>
              <h3 className="row"><BarChart3 /> Histórico de check-ins</h3>
              <ul className="stack" style={{ gap: 10 }}>
                {historico.map((h) => (
                  <li key={h.id} className="historico">
                    <div><b>{new Date(h.dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</b>
                      <small className="muted" style={{ display: 'block' }}>{new Date(h.dataHora).toLocaleDateString('pt-BR', { weekday: 'long' })} - {new Date(h.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small></div>
                    <span className="row" style={{ gap: 6 }}>{h.realizada ? <CheckCircle2 color="#fff" fill="#1fb87a" size={18} /> : <XCircle color="#fff" fill="#888" size={18} />}{h.realizada ? `${h.minutos} minutos` : 'Não realizada'}</span>
                    <b>+ {h.xpGanho} XP</b>
                  </li>
                ))}
              </ul>
            </aside>

            {checkin && <CheckInDialog atividade={a} onFechar={() => setCheckin(false)} />}
            {confirmar && (
              <Dialog titulo="Excluir tarefa" onFechar={() => setConfirmar(false)}>
                <p>Tem certeza de que deseja excluir “{a.nome}”? Esta ação não pode ser desfeita.</p>
                <div className="row between">
                  <button type="button" className="btn btn-outline" onClick={() => setConfirmar(false)}>Cancelar</button>
                  <button type="button" className="btn btn-danger" disabled={excluir.isPending} onClick={() => excluir.mutate(a.id, { onSuccess: () => nav(PATHS.tarefas) })}>Excluir</button>
                </div>
              </Dialog>
            )}
          </div>
        )}
      </Consulta>
    </div>
  );
}
