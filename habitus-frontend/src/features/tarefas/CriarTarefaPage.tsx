import { Clock, Eye, Lightbulb, ListChecks, Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { Icone, ICONE_CATEGORIA } from '@/components/ui/icons';
import { Progress, Toggle } from '@/components/ui/kit';
import { CATEGORIAS, LIMITE_EXEMPLO_ATIVIDADES_ATIVAS } from '@/config/regras';
import { useCriarAtividade, usePainelTarefas } from '@/hooks/queries';
import type { CategoriaAtividade, Frequencia } from '@/types/domain';

const FREQUENCIAS: Frequencia[] = ['Diária', 'Semanal', 'Mensal', 'Personalizada'];

/** Dicas e exemplos: textos exatamente como aparecem no Figma (conteúdo estático da tela). */
const DICAS = [
  ['Seja específico', 'Quanto mais clara a tarefa, maiores as chances de sucesso.'],
  ['Comece pequeno', 'Metas realistas ajudam na consistência.'],
  ['Defina um bom valor de XP', 'Tarefas simples podem valer entre 50 e 100 XP.'],
  ['Use lembretes', 'Ative notificações para não esquecer.'],
  ['Acompanhe seu progresso', 'Veja sua evolução na tela de Minhas Tarefas.'],
];
const EXEMPLOS: { nome: string; descricao: string; categoria: CategoriaAtividade; xp: number }[] = [
  { nome: 'Ler livro', descricao: 'Ler 30 minutos por dia.', categoria: 'Leitura', xp: 100 },
  { nome: 'Ir para academia', descricao: 'Realizar o treino do dia.', categoria: 'Saúde', xp: 150 },
  { nome: 'Meditar', descricao: 'Meditar por 10 minutos.', categoria: 'Bem-estar', xp: 80 },
  { nome: 'Beber água', descricao: 'Beber 2 litros de água.', categoria: 'Saúde', xp: 50 },
];

/** Figma: "Criar tarefa" (5 passos) — UC001 Cadastrar Atividade. */
export function CriarTarefaPage() {
  const nav = useNavigate();
  const { data } = usePainelTarefas();
  const criar = useCriarAtividade();
  const [f, setF] = useState({ nome: '', descricao: '', categoria: 'Estudos' as CategoriaAtividade, frequencia: 'Diária' as Frequencia, meta: '', duracao: 30, lembrete: false, horario: '19:00' });
  const [erros, setErros] = useState<string[]>([]);

  const ativas = data?.atividades.filter((a) => a.statusAtiva).length ?? 0;
  const limiteAtingido = ativas >= LIMITE_EXEMPLO_ATIVIDADES_ATIVAS; // UC001 fluxo 6a (valor "ex: 10")

  function enviar(e: FormEvent) {
    e.preventDefault();
    const er: string[] = [];
    if (!f.nome.trim()) er.push('Informe o nome da tarefa.'); // UC001 fluxo 4a: indicar campos a corrigir
    if (limiteAtingido) er.push('Limite de atividades ativas atingido. Para criar uma nova meta, conclua, arquive ou exclua um hábito antigo.');
    setErros(er);
    if (er.length) return;
    criar.mutate(
      { nome: f.nome.trim(), descricao: f.descricao.trim(), categoria: f.categoria, frequencia: f.frequencia, meta: f.meta.trim() || undefined, duracaoEstimadaMin: f.duracao, lembrete: { ativo: f.lembrete, horario: f.horario } },
      { onSuccess: () => nav(PATHS.tarefas), onError: () => setErros(['Não foi possível cadastrar a atividade. Tente novamente.']) },
    );
  }

  return (
    <form className="panel" onSubmit={enviar} noValidate>
      <h1>Criar tarefa</h1>
      <p className="muted" style={{ marginBottom: 14 }}>Defina uma nova tarefa, escolha como ela funciona e comece a evoluir!</p>
      <div className="duas-colunas">
        <div className="stack">
          <fieldset className="passo"><legend><i>1</i> Informações Básicas <small className="muted">Dê um nome e uma breve descrição para sua tarefa.</small></legend>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="field"><label htmlFor="nome">Nome da tarefa</label><div className="input"><input id="nome" placeholder="Ex: Ler Livro" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} /></div></div>
              <div className="field"><label htmlFor="desc">Descrição (opcional)</label><div className="input"><input id="desc" placeholder="Ex: Ler pelo menos 30 minutos por dia para criar o hábito de leitura." value={f.descricao} onChange={(e) => setF({ ...f, descricao: e.target.value })} /></div></div>
            </div>
          </fieldset>

          <fieldset className="passo"><legend><i>2</i> Categorias <small className="muted">Escolha a categoria que melhor representar sua tarefa.</small></legend>
            <div className="cats" role="radiogroup" aria-label="Categoria">
              {CATEGORIAS.map((c) => (
                <button key={c} type="button" role="radio" aria-checked={f.categoria === c} className="cat" onClick={() => setF({ ...f, categoria: c })}>
                  <Icone nome={ICONE_CATEGORIA[c]} size={24} />{c}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="passo"><legend><i>3</i> Frequência <small className="muted">Com que frequência você quer realizar essa tarefa?</small></legend>
            <div className="cats" role="radiogroup" aria-label="Frequência">
              {FREQUENCIAS.map((q) => (
                <button key={q} type="button" role="radio" aria-checked={f.frequencia === q} className="cat" onClick={() => setF({ ...f, frequencia: q })}>{q}</button>
              ))}
            </div>
          </fieldset>

          <fieldset className="passo"><legend><i>4</i> Meta e duração <small className="muted">Defina uma meta para te manter motivado.</small></legend>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="field"><label htmlFor="meta">Meta (opcional)</label><div className="input"><input id="meta" placeholder="Ex: Ler 50 páginas por semana" value={f.meta} onChange={(e) => setF({ ...f, meta: e.target.value })} /></div></div>
              <div className="field"><label htmlFor="dur">Duração estimada (minutos)</label><div className="input"><Clock size={18} /><input id="dur" type="number" min={1} value={f.duracao} onChange={(e) => setF({ ...f, duracao: Number(e.target.value) })} /></div></div>
            </div>
          </fieldset>

          <fieldset className="passo"><legend><i>5</i> Lembretes (opcional) <small className="muted">Ative lembretes para não esquecer.</small></legend>
            <div className="row between">
              <div className="row"><Toggle marcado={f.lembrete} onChange={(v) => setF({ ...f, lembrete: v })} rotulo="Ativar lembrete" /> Ativar lembrete</div>
              <div className="row"><label htmlFor="hr">Horário do lembrete</label><div className="input" style={{ minHeight: 36 }}><input id="hr" type="time" value={f.horario} disabled={!f.lembrete} onChange={(e) => setF({ ...f, horario: e.target.value })} /></div></div>
            </div>
          </fieldset>

          {erros.length > 0 && <ul className="alert" role="alert">{erros.map((e) => <li key={e}>{e}</li>)}</ul>}
          <div className="row between">
            <Link to={PATHS.tarefas} className="btn btn-outline btn-lg" style={{ textDecoration: 'none', minWidth: 160 }}>Cancelar</Link>
            <button className="btn btn-dark btn-lg" style={{ minWidth: 200 }} disabled={criar.isPending}><Plus /> {criar.isPending ? 'Criando…' : 'Criar tarefa'}</button>
          </div>
        </div>

        <aside className="stack">
          <section className="card">
            <h3 className="row"><Eye /> Pré-visualização</h3>
            <p className="muted" style={{ fontSize: 12 }}>Veja como sua tarefa ficará na lista.</p>
            <div className="card row" style={{ background: 'var(--card-muted)', marginTop: 8 }}>
              <span className="tarefa-icone"><Icone nome={ICONE_CATEGORIA[f.categoria]} size={24} /></span>
              <div className="grow">
                <div className="row between"><strong>{f.nome || 'Ler livro'}</strong><span className="tag pink">{f.frequencia}</span></div>
                <p className="muted" style={{ fontSize: 12 }}>{f.descricao || 'Ler pelo menos 30 minutos por dia para criar o hábito de leitura.'}</p>
                <div className="row"><Progress valor={0} className="grow" /><span>0%</span><strong>+ 100 XP</strong></div>
              </div>
            </div>
          </section>
          <section className="card">
            <h3 className="row"><Lightbulb /> Dicas para criar uma boa tarefa</h3>
            <ul className="stack" style={{ gap: 8, marginTop: 8 }}>{DICAS.map(([t, d]) => <li key={t}><strong style={{ fontSize: 12 }}>{t}</strong><p className="muted" style={{ fontSize: 11 }}>{d}</p></li>)}</ul>
          </section>
          <section className="card">
            <h3 className="row"><ListChecks /> Exemplos de tarefas</h3>
            <ul className="stack" style={{ gap: 6, marginTop: 8 }}>
              {EXEMPLOS.map((x) => (
                <li key={x.nome} className="row between">
                  <div><strong style={{ fontSize: 12 }}>{x.nome}</strong><p className="muted" style={{ fontSize: 11 }}>{x.descricao}</p></div>
                  <span className="tag purple">Diária</span><span style={{ fontSize: 12 }}>+ {x.xp} XP</span>
                  <button type="button" className="icon-btn" aria-label={`Usar exemplo ${x.nome}`} onClick={() => setF({ ...f, nome: x.nome, descricao: x.descricao, categoria: x.categoria })}><Plus size={16} /></button>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </form>
  );
}
