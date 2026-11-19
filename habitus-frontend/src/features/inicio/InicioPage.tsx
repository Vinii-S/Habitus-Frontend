import { ArrowRight, Camera, Check, ClipboardCheck, Megaphone, Trophy, Users } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { Icone, ICONE_CATEGORIA } from '@/components/ui/icons';
import { Avatar, Consulta, Panel, Progress } from '@/components/ui/kit';
import { tituloDoNivel } from '@/config/regras';
import { useRecompensas } from '@/features/rewards/RewardContext';
import { MuralFeed } from '@/features/guildas/MuralFeed';
import { useCheckIn, useConquistas, useMinhaGuilda, usePainelTarefas, useRanking, useResumoPerfil } from '@/hooks/queries';
import { fmtNumero } from '@/lib/format';
import { validarProva } from '@/lib/validarProva';
import type { Atividade } from '@/types/domain';

/**
 * Cartão de tarefa do Início. RNF08: "Check-in com anexo de foto" em ≤ 4 cliques a partir do painel:
 *   1) Anexar foto  2) escolher arquivo  3) Fazer check-in  (3 cliques).
 */
function TarefaHoje({ a }: { a: Atividade }) {
  const ref = useRef<HTMLInputElement>(null);
  const [arquivo, setArquivo] = useState<File>();
  const [erro, setErro] = useState('');
  const mut = useCheckIn();
  const { anunciarXp, anunciarNivel } = useRecompensas();
  const concluida = a.status === 'Concluída';

  function escolher(f?: File) {
    if (!f) return;
    const v = validarProva(f);
    if (!v.ok) return setErro(v.motivo);
    setErro('');
    setArquivo(f);
  }
  function checkIn() {
    mut.mutate({ id: a.id, prova: arquivo }, {
      onSuccess: (r) => { anunciarXp(r.xpGanho); if (r.subiuDeNivel && r.novoNivel) anunciarNivel(r.novoNivel); setArquivo(undefined); },
      onError: () => setErro('Falha no envio. Tente novamente.'),
    });
  }
  return (
    <li className="card tarefa-home">
      <div className="row"><span className="tarefa-icone"><Icone nome={ICONE_CATEGORIA[a.categoria]} size={26} /></span>
        <div className="grow"><b style={{ fontSize: 16 }}>{a.nome}</b><p className="muted" style={{ fontSize: 12 }}>{a.descricao}</p></div>
        <div style={{ textAlign: 'right' }}><span className={`tag ${concluida ? 'ok' : 'pink'}`}>{a.status}</span><div><b>+ {a.xpRecompensa} XP</b></div></div>
      </div>
      <div className="row"><Progress valor={a.progresso} className="grow" /><span>{a.progresso} %</span></div>
      <div className="row">
        <input ref={ref} type="file" accept="image/jpeg,image/png" hidden onChange={(e) => escolher(e.target.files?.[0])} />
        <button type="button" className="btn btn-outline btn-sm grow" disabled={concluida} onClick={() => ref.current?.click()}>
          <Camera size={14} /> {arquivo ? arquivo.name : 'Anexar foto como prova do check-in'}
        </button>
        {concluida
          ? <button type="button" className="btn btn-outline btn-sm" disabled><Check size={14} /> Check-in realizado</button>
          : <button type="button" className="btn btn-dark btn-sm" onClick={checkIn} disabled={mut.isPending}>{mut.isPending ? 'Enviando…' : 'Fazer check-in'}</button>}
      </div>
      {erro && <p className="alert" role="alert">{erro}</p>}
    </li>
  );
}

/** Figma: "Início". Dados agregados por várias consultas independentes (perfil, tarefas, guilda, ranking, mural, conquistas). */
export function InicioPage() {
  const resumo = useResumoPerfil();
  const tarefas = usePainelTarefas();
  const guilda = useMinhaGuilda();
  const ranking = useRanking('semanal');
  const conquistas = useConquistas();

  return (
    <>
      <div className="duas-colunas" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <Consulta q={resumo} linhas={1}>
          {({ personagem: p }) => (
            <section className="banner">
              <span className="banner-icon" style={{ width: 110, height: 110 }}><Trophy size={44} /></span>
              <div className="grow">
                <h1>Nível {p.nivel} - {tituloDoNivel(p.nivel)}</h1>
                <p>Você está construindo grandes hábitos!</p>
                <p className="muted">Continue evoluindo e conquiste novos desafios</p>
                <div className="row"><Progress valor={p.xpAtual} total={p.xpProximoNivel} className="grow dark" /></div>
                <small>{fmtNumero(p.xpAtual)} / {fmtNumero(p.xpProximoNivel)}</small>
              </div>
              <Link to={PATHS.progresso} className="btn btn-outline" style={{ textDecoration: 'none', background: '#fff' }}>Ver meu progresso <ArrowRight size={14} /></Link>
            </section>
          )}
        </Consulta>
        <Consulta q={conquistas} linhas={1}>
          {({ recente }) => recente && (
            <section className="banner"><span className="banner-icon" style={{ background: '#e5dccb' }}><Trophy size={40} color="#f5b301" /></span>
              <div><h3>Conquista desbloqueada!</h3><p>{recente.titulo} · +{recente.xp} XP</p></div></section>
          )}
        </Consulta>
      </div>

      <div className="home-grid">
        <section className="stack">
          <h2 className="row"><ClipboardCheck /> Tarefas de hoje</h2>
          <Consulta q={tarefas} linhas={3}>
            {({ atividades }) => <ul className="stack">{atividades.filter((a) => a.hoje).map((a) => <TarefaHoje key={a.id} a={a} />)}</ul>}
          </Consulta>
        </section>

        <div className="stack">
          <Consulta q={guilda} linhas={2}>
            {({ grupo, membros, estatisticas }) => (
              <Panel titulo="Minha Guilda" icone={<Users />}>
                <div className="stack" style={{ alignItems: 'center', textAlign: 'center' }}>
                  <div className="row"><Icone nome={grupo.icone} size={36} /><div style={{ textAlign: 'left' }}><b>{grupo.nome}</b><p className="muted" style={{ fontSize: 12 }}>Juntos vamos mais longe !</p></div></div>
                  <div className="row" style={{ gap: 14 }}>{Array.from({ length: grupo.totalMembros }, (_, i) => <Avatar key={i} nome={membros[i]?.usuario.nomeExibicao} size={24} />)}</div>
                  <small className="muted">{grupo.totalMembros} membros</small>
                  <div style={{ width: '100%' }}><small>Progresso coletivo da guilda</small><Progress valor={grupo.xpTotal} total={grupo.xpProximoNivel ?? 1} /><small className="muted">{fmtNumero(grupo.xpTotal)} / {fmtNumero(grupo.xpProximoNivel ?? 0)} XP</small></div>
                  <Link to={PATHS.minhaGuilda} className="btn btn-block" style={{ textDecoration: 'none', color: 'var(--accent)', fontWeight: 600 }}>Acessar guilda <ArrowRight size={14} /></Link>
                  <small className="sr-only">{estatisticas.membrosAtivosSemana} membros ativos</small>
                </div>
              </Panel>
            )}
          </Consulta>
          <Consulta q={guilda} linhas={1}>{({ grupo }) => <Panel titulo="Mural da guilda" icone={<Megaphone />}><MuralFeed grupoId={grupo.id} compacto limite={2} /></Panel>}</Consulta>
        </div>

        <Consulta q={ranking} linhas={3}>
          {(r) => (
            <Panel titulo="Ranking" icone={<Trophy />} acao={<Link to={PATHS.ranking} style={{ fontSize: 11 }}>Ver ranking completo →</Link>}>
              <table className="tabela"><thead><tr><th>#</th><th>Membro</th><th style={{ textAlign: 'right' }}>XP</th></tr></thead>
                <tbody>{r.linhas.slice(0, 4).map((l) => (
                  <tr key={l.posicao} className={l.posicao === r.minhaPosicao.posicao ? 'destaque' : ''}>
                    <td><span className="pos">{l.posicao}</span></td><td><span className="row"><Avatar nome={l.usuario.nomeExibicao} size={24} />{l.usuario.nomeExibicao}</span></td><td style={{ textAlign: 'right' }}>{fmtNumero(l.xp)} XP</td>
                  </tr>))}</tbody></table>
            </Panel>
          )}
        </Consulta>
      </div>
    </>
  );
}
