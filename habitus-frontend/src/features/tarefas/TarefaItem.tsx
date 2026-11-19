import { Check, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { Icone, ICONE_CATEGORIA } from '@/components/ui/icons';
import { Progress } from '@/components/ui/kit';
import type { Atividade, StatusTarefa } from '@/types/domain';

const COR_STATUS: Record<StatusTarefa, string> = { Concluída: 'ok', 'Em andamento': 'pink', 'Não iniciada': 'grey', Atrasada: 'pink' };

/** Linha de tarefa — usada em "Minhas Tarefas" (Figma). */
export function TarefaItem({ a, onCheckIn }: { a: Atividade; onCheckIn: (a: Atividade) => void }) {
  const concluida = a.status === 'Concluída';
  return (
    <li className="card tarefa">
      <span className="tarefa-icone"><Icone nome={ICONE_CATEGORIA[a.categoria]} size={26} /></span>
      <div className="grow">
        <div className="row between">
          <Link to={PATHS.tarefa(a.id)} style={{ color: 'inherit', fontWeight: 600, fontSize: 16 }}>{a.nome}</Link>
          <div className="row" style={{ gap: 8 }}>
            <span className={`tag ${COR_STATUS[a.status]}`}>{a.status}</span>
            <strong>+ {a.xpRecompensa} XP</strong>
            <Link to={PATHS.tarefa(a.id)} className="icon-btn" aria-label={`Detalhes de ${a.nome}`}><MoreHorizontal size={16} /></Link>
          </div>
        </div>
        <div className="row" style={{ gap: 14 }}>
          <div className="grow">
            <p className="muted" style={{ fontSize: 12 }}>{a.descricao}</p>
            <div className="row"><Progress valor={a.progresso} className="grow" rotulo={`Progresso de ${a.nome}`} /><span style={{ minWidth: 38 }}>{a.progresso}%</span></div>
          </div>
          {concluida ? (
            <button type="button" className="btn btn-outline" disabled style={{ minWidth: 130 }}><Check size={16} /> Concluído</button>
          ) : (
            <button type="button" className="btn btn-dark" style={{ minWidth: 130 }} onClick={() => onCheckIn(a)}>Fazer check-in</button>
          )}
        </div>
      </div>
    </li>
  );
}
