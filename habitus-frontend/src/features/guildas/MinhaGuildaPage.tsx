import { Copy, Crown, Flame, Lock, Megaphone, Star, Target, Users, Zap, BarChart3, Check } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { Icone } from '@/components/ui/icons';
import { Avatar, Consulta, Dialog, Panel, Progress, Stat } from '@/components/ui/kit';
import { useMinhaGuilda } from '@/hooks/queries';
import { fmtNumero } from '@/lib/format';
import { MuralFeed } from './MuralFeed';

/** Figma: "Minha Guilda" — RF03 (gestão de grupos/guildas) e RF07 (mural). */
export function MinhaGuildaPage() {
  const q = useMinhaGuilda();
  const [convite, setConvite] = useState(false);
  const [copiado, setCopiado] = useState(false);

  return (
    <Consulta q={q} linhas={4}>
      {({ grupo, membros, minhaContribuicao, niveis, estatisticas, desafiosAtivos }) => (
        <>
          <section className="banner">
            <span className="banner-icon" style={{ width: 100, height: 100 }}><Icone nome={grupo.icone} size={56} /></span>
            <div className="grow">
              <h1>{grupo.nome}</h1>
              <p className="muted">{grupo.descricao}</p>
              <div className="row wrap" style={{ marginTop: 8 }}>
                <span className="chip"><Users size={13} /> {grupo.totalMembros} membros</span>
                <span className="chip"><Crown size={13} /> Nível {grupo.nivelGrupo}</span>
                <span className="chip"><Star size={13} /> {fmtNumero(grupo.xpTotal)} / {fmtNumero(grupo.xpProximoNivel ?? 0)}</span>
              </div>
            </div>
            <div style={{ minWidth: 260 }}>
              <b>Sua contribuição</b>
              <div className="row"><Progress valor={minhaContribuicao.xp} total={minhaContribuicao.meta} className="grow dark" /><small>{minhaContribuicao.xp} / {minhaContribuicao.meta} XP</small></div>
            </div>
          </section>

          <div className="duas-colunas" style={{ gridTemplateColumns: '1fr 1.4fr' }}>
            <Panel titulo="Membros da guilda" icone={<Users />} acao={<span className="chip">{grupo.totalMembros} membros</span>}>
              <ul className="stack" style={{ gap: 6 }}>
                {membros.map((m, i) => (
                  <li key={m.id} className="card row">
                    <span className="pos">{i + 1}</span><Avatar nome={m.usuario.nomeExibicao} src={m.usuario.fotoPerfil} size={34} />
                    <b className="grow">{m.usuario.nomeExibicao} {m.papel === 'Líder' && <Crown size={14} color="#f5b301" />}</b>
                    <span className="tag grey">{m.papel}</span><span>{fmtNumero(m.pontuacaoSemanal)}</span>
                  </li>
                ))}
              </ul>
              {/* Entrar por código/convite está no escopo do relatório (seção 10) e DC.Grupo.codigoConvite */}
              <button type="button" className="btn btn-block" style={{ marginTop: 10 }} onClick={() => setConvite(true)}>Convidar membros +</button>
            </Panel>

            <Panel titulo="Progresso da guilda" icone={<BarChart3 />} acao={<select className="chip" aria-label="Período"><option>Esta semana</option></select>}>
              <div className="card">
                <div className="row"><Icone nome={grupo.icone} size={40} /><div className="grow"><b>Nível {grupo.nivelGrupo}</b><p className="muted" style={{ fontSize: 12 }}>{grupo.descricao}</p></div><small>{fmtNumero(grupo.xpTotal)} / {fmtNumero(grupo.xpProximoNivel ?? 0)} XP</small></div>
                <Progress valor={grupo.xpTotal} total={grupo.xpProximoNivel ?? 1} className="dark" />
                <ol className="niveis">
                  {niveis.map((n) => {
                    const feito = n.nivel < grupo.nivelGrupo, atual = n.nivel === grupo.nivelGrupo;
                    return <li key={n.nivel} className={atual ? 'atual' : ''}><span className={feito ? 'ok' : atual ? 'cur' : ''}>{feito ? <Check size={14} /> : atual ? n.nivel : <Lock size={12} />}</span><b>Nível {n.nivel}</b><small>{fmtNumero(n.xpNecessario)} XP</small></li>;
                  })}
                </ol>
              </div>
            </Panel>
          </div>

          <div className="tres-colunas">
            <Panel titulo="Desafios da Guilda" icone={<Target />} acao={<span className="chip">{desafiosAtivos.length} desafios ativos</span>}>
              <ul className="stack">{desafiosAtivos.map((d) => (
                <li key={d.id} className="card"><div className="row"><Icone nome={d.icone} /><b className="grow">{d.titulo}</b><span className="tag pink">Em andamento</span></div>
                  <small className="muted">{d.descricao}</small><div className="row"><Progress valor={d.membrosParticipando} total={d.totalMembros} className="grow" /><small>{Math.round((d.membrosParticipando / d.totalMembros) * 100)}%</small></div></li>))}
              </ul>
              <Link to={PATHS.desafios} className="btn btn-block" style={{ marginTop: 10, textDecoration: 'none' }}>Ver todos os desafios →</Link>
            </Panel>
            <Panel titulo="Mural da Guilda" icone={<Megaphone />}><MuralFeed grupoId={grupo.id} /></Panel>
            <Panel titulo="Estatística da Guilda" icone={<BarChart3 />}>
              <div className="stats-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <Stat icone={<Zap color="#f5a623" />} valor={estatisticas.tarefasConcluidasSemana} rotulo="Tarefas concluídas esta semana" cor="#fff" />
                <Stat icone={<Flame color="#f97316" />} valor={estatisticas.diasSequencia} rotulo="Dias de sequência da guilda" cor="#fff" />
                <Stat icone={<Users />} valor={estatisticas.membrosAtivosSemana} rotulo="Membros ativos na semana" cor="#fff" />
                <Stat icone={<Star color="#f5b301" fill="#f5b301" />} valor={fmtNumero(estatisticas.xpTotal)} rotulo="XP total da guilda" cor="#fff" />
              </div>
            </Panel>
          </div>

          {convite && (
            <Dialog titulo="Convidar membros" onFechar={() => setConvite(false)}>
              <p className="muted">Compartilhe o código de convite para que novos membros entrem na guilda.</p>
              <div className="input"><input readOnly value={grupo.codigoConvite ?? '—'} aria-label="Código de convite" />
                <button type="button" className="icon-btn" aria-label="Copiar código" onClick={() => { navigator.clipboard?.writeText(grupo.codigoConvite ?? ''); setCopiado(true); }}>{copiado ? <Check size={16} /> : <Copy size={16} />}</button></div>
            </Dialog>
          )}
        </>
      )}
    </Consulta>
  );
}
