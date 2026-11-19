import { Award, Bell, BarChart3, CheckCircle2, ChevronRight, Filter, MessageCircle, Settings, Shield, Target, Users, Zap, MoreHorizontal } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { Consulta, Panel } from '@/components/ui/kit';
import { useMarcarTodasLidas, useNotificacoes } from '@/hooks/queries';
import type { Notificacao, TipoNotificacao } from '@/types/domain';

const TIPOS: TipoNotificacao[] = ['Tarefas', 'Guilda', 'Conquistas', 'Níveis', 'Desafios', 'Sistema'];
const ICONE: Record<TipoNotificacao, ReactNode> = {
  Tarefas: <CheckCircle2 color="#fff" fill="#1fb87a" />, Guilda: <Users color="#2f80ed" />, Conquistas: <Award color="#7c3aed" />,
  Níveis: <BarChart3 color="#f5a623" />, Desafios: <Target color="#e5484d" />, Sistema: <Settings />,
};

function Item({ n }: { n: Notificacao }) {
  const nav = useNavigate();
  return (
    <li className={`notif ${n.lida ? '' : 'nao-lida'}`}>
      <span className="notif-ico">{n.titulo.includes('mensagem') ? <MessageCircle color="#2f80ed" /> : n.titulo.includes('Lembrete') ? <Zap color="#f97316" /> : ICONE[n.tipo]}</span>
      <div className="grow"><b>{n.titulo}</b><p className="muted" style={{ fontSize: 12 }}>{n.texto}</p><small className="muted">✓ {n.quando}</small></div>
      {n.xp && <span className={`tag ${n.xp.guilda ? 'ok' : 'xp'}`}>⚡ +{n.xp.valor} XP{n.xp.guilda ? ' (guilda)' : ''}</span>}
      {n.acao && <button type="button" className="btn btn-primary btn-sm" onClick={() => nav(n.acao!.to)}>{n.acao.rotulo}</button>}
      {!n.lida && <span className="ponto" aria-label="Não lida" />}
      <MoreHorizontal size={16} /><ChevronRight size={16} />
    </li>
  );
}

/** Figma: "Notificações". Entidade e endpoints não constam no Diagrama de Classes (lacuna). */
export function NotificacoesPage() {
  const q = useNotificacoes();
  const lerTodas = useMarcarTodasLidas();
  const [tipos, setTipos] = useState<TipoNotificacao[]>(TIPOS);
  const alternar = (t: TipoNotificacao) => setTipos((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  const todas = tipos.length === TIPOS.length;

  return (
    <>
      <section className="banner">
        <span className="banner-icon"><Bell size={44} /></span>
        <div className="grow"><h1>Notificações</h1><p className="muted">Aqui você acompanha tudo o que acontece na sua jornada!</p></div>
        <button type="button" className="btn btn-sm" onClick={() => lerTodas.mutate()} disabled={lerTodas.isPending}>Marcar todas como lidas</button>
      </section>
      <Consulta q={q} linhas={5}>
        {(lista) => {
          const visiveis = lista.filter((n) => tipos.includes(n.tipo));
          const naoLidas = lista.filter((n) => !n.lida);
          return (
            <div className="duas-colunas" style={{ gridTemplateColumns: '2fr 1fr' }}>
              <div className="stack">
                <div className="chips purple" role="tablist" aria-label="Tipo">
                  <button role="tab" aria-selected={todas} type="button" className="chip" onClick={() => setTipos(TIPOS)}>Todas</button>
                  {TIPOS.map((t) => <button key={t} role="tab" aria-selected={!todas && tipos.length === 1 && tipos[0] === t} type="button" className="chip" onClick={() => setTipos([t])}>{t}</button>)}
                </div>
                <ul className="notifs">{visiveis.map((n) => <Item key={n.id} n={n} />)}</ul>
                {visiveis.length === 0 && <p className="state">Nenhuma notificação.</p>}
              </div>
              <aside className="stack">
                <Panel titulo="Filtro de notificação" icone={<Filter size={18} />}>
                  <ul className="stack" style={{ gap: 8 }}>
                    <li><label className="row"><input type="checkbox" checked={todas} onChange={() => setTipos(todas ? [] : TIPOS)} /> Todas</label></li>
                    {TIPOS.map((t) => <li key={t}><label className="row"><input type="checkbox" checked={tipos.includes(t)} onChange={() => alternar(t)} /> {t}</label></li>)}
                  </ul>
                </Panel>
                <Panel titulo="Ações rápidas" icone={<Zap size={18} />}>
                  <button type="button" className="btn btn-block row between" onClick={() => lerTodas.mutate()}><span>✓ Marcar todas como lidas</span><ChevronRight size={14} /></button>
                  <Link to={PATHS.configuracoes} className="btn btn-block row between" style={{ textDecoration: 'none' }}><span><Settings size={14} /> Configurar notificações</span><ChevronRight size={14} /></Link>
                </Panel>
                <Panel titulo="Notificações não lidas" icone={<Shield size={18} />} acao={<span className="badge">{naoLidas.length}</span>}>
                  <ul className="stack" style={{ gap: 6 }}>{naoLidas.map((n) => <li key={n.id} className="card row"><span className="grow"><b style={{ fontSize: 12 }}>{n.titulo}</b><small className="muted" style={{ display: 'block' }}>{n.quando}</small></span><span className="ponto" /></li>)}</ul>
                </Panel>
              </aside>
            </div>
          );
        }}
      </Consulta>
    </>
  );
}
