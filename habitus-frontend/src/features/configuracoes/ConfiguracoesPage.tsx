import { Bell, ChevronRight, Database, HelpCircle, Link2, Lock, Palette, Settings, ShieldCheck, SlidersHorizontal, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { Avatar, Consulta, Panel, Toggle } from '@/components/ui/kit';
import { tituloDoNivel } from '@/config/regras';
import { CORES_DESTAQUE, useAparencia, type Tema } from '@/features/settings/AparenciaContext';
import { useMinhaGuilda, usePerfil, usePrefsNotificacao, useResumoPerfil, useSalvarPrefsNotificacao } from '@/hooks/queries';
import type { PreferenciasNotificacao } from '@/types/domain';

const ROTULOS: { k: keyof PreferenciasNotificacao; t: string; d: string }[] = [
  { k: 'tarefas', t: 'Tarefas e lembretes', d: 'Receba notificações sobre prazos e tarefas.' },
  { k: 'progresso', t: 'Progresso e níveis', d: 'Notificações sobre seu progresso.' },
  { k: 'conquistas', t: 'Conquistas', d: 'Seja avisado quando desbloquear conquistas.' },
  { k: 'desafios', t: 'Desafios', d: 'Atualizações sobre desafios.' },
  { k: 'guilda', t: 'Guilda', d: 'Novidades e atividades da sua guilda.' },
  { k: 'sistema', t: 'Sistema', d: 'Avisos e novidades do app.' },
];
const K_PREFS = 'habitus.prefsApp';

/**
 * Figma: "Configurações". Implementado de verdade: Notificações (service), Aparência (tema/cor).
 * Preferências do app (lembrete diário, início da semana): só localStorage — o relatório declara
 * "O sistema não enviará e-mails de lembrete diários" fora do escopo, então a semântica é uma lacuna.
 * Sem fluxo definido (botões desativados): senha, 2FA, integrações (Google/Discord/Strava), exportar/excluir dados, ajuda.
 */
export function ConfiguracoesPage() {
  const perfil = usePerfil();
  const resumo = useResumoPerfil();
  const guilda = useMinhaGuilda();
  const prefs = usePrefsNotificacao();
  const salvar = useSalvarPrefsNotificacao();
  const { tema, setTema, cor, setCor } = useAparencia();
  const [app, setApp] = useState({ lembrete: '08:00', semana: 'Segunda-feira' });
  useEffect(() => { try { setApp((a) => ({ ...a, ...JSON.parse(localStorage.getItem(K_PREFS) ?? '{}') })); } catch { /* ignora */ } }, []);
  const salvaApp = (n: typeof app) => { setApp(n); try { localStorage.setItem(K_PREFS, JSON.stringify(n)); } catch { /* ignora */ } };

  const desativado = (txt: string) => ({ disabled: true, title: 'Fluxo ainda não especificado na documentação', 'aria-label': txt });

  return (
    <div className="duas-colunas" style={{ gridTemplateColumns: '2fr 1fr' }}>
      <div className="stack">
        <section className="banner"><span className="banner-icon"><Settings size={44} /></span><div><h1>Configurações</h1><p className="muted">Personalize sua conta, preferências e notificações.</p></div></section>

        <Consulta q={perfil} linhas={1}>{(u) => (
          <Panel titulo="Perfil e conta" icone={<User />}><div className="row"><Avatar nome={u.nomeExibicao} src={u.fotoPerfil} size={52} /><div className="grow"><b>{u.nomeExibicao}</b><p className="muted" style={{ fontSize: 12 }}>{u.email}</p><small className="muted">Líder da guilda {guilda.data?.grupo.nome}</small></div><Link to={PATHS.perfil} className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>Editar perfil</Link></div></Panel>
        )}</Consulta>

        <Panel titulo="Notificações" icone={<Bell />}>
          <p className="muted" style={{ marginTop: -8 }}>Escolha sobre o que você quer ser notificado.</p>
          <Consulta q={prefs} linhas={2}>{(p) => (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
              {ROTULOS.map(({ k, t, d }) => (
                <div key={k} className="row"><div className="grow"><b>{t}</b><p className="muted" style={{ fontSize: 11 }}>{d}</p></div><Toggle rotulo={t} marcado={p[k]} onChange={(v) => salvar.mutate({ ...p, [k]: v })} /></div>
              ))}
            </div>
          )}</Consulta>
        </Panel>

        <Panel titulo="Privacidade e segurança" icone={<ShieldCheck />}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
            <button type="button" className="card row between" {...desativado('Alterar senha')}><span className="row"><Lock size={18} /><span><b>Alterar senha</b><br /><small className="muted">Atualize sua senha de acesso.</small></span></span><ChevronRight size={14} /></button>
            <button type="button" className="card row between" {...desativado('Autenticação em duas etapas')}><span><b>Autenticação em duas etapas</b><br /><small className="muted">Mais segurança para sua conta.</small></span><small>Desativada</small></button>
          </div>
        </Panel>

        <Panel titulo="Aparência" icone={<Palette />}>
          <p className="muted" style={{ marginTop: -8 }}>Personalize o visual do aplicativo.</p>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
            <div><b>Tema</b><p className="muted" style={{ fontSize: 11 }}>Escolha entre tema claro, escuro ou seguir o sistema.</p>
              <div className="segmentado" role="radiogroup" aria-label="Tema">{(['claro', 'escuro', 'sistema'] as Tema[]).map((t) => <button key={t} role="radio" aria-selected={tema === t} aria-checked={tema === t} type="button" onClick={() => setTema(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}</div></div>
            <div><b>Cor de destaque</b><p className="muted" style={{ fontSize: 11 }}>Escolha a cor principal dos elementos.</p>
              <div className="row" role="radiogroup" aria-label="Cor de destaque">{CORES_DESTAQUE.map((c) => <button key={c.id} role="radio" aria-checked={cor === c.id} aria-label={c.id} type="button" className={`cor ${cor === c.id ? 'sel' : ''}`} style={{ background: c.hex }} onClick={() => setCor(c.id)} />)}</div></div>
          </div>
        </Panel>

        <Panel titulo="Preferências do aplicativo" icone={<SlidersHorizontal />}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
            <label><b>Lembretes diários</b><p className="muted" style={{ fontSize: 11 }}>Defina um horário para receber seu resumo do dia.</p><div className="input"><select value={app.lembrete} onChange={(e) => salvaApp({ ...app, lembrete: e.target.value })}>{['06:00', '07:00', '08:00', '09:00', '12:00', '18:00', '20:00'].map((h) => <option key={h}>{h}</option>)}</select></div></label>
            <label><b>Início da semana</b><p className="muted" style={{ fontSize: 11 }}>Escolha o primeiro dia da semana.</p><div className="input"><select value={app.semana} onChange={(e) => salvaApp({ ...app, semana: e.target.value })}>{['Domingo', 'Segunda-feira'].map((h) => <option key={h}>{h}</option>)}</select></div></label>
          </div>
        </Panel>
      </div>

      <aside className="stack" style={{ paddingTop: 0 }}>
        <Panel titulo="Resumo da conta" icone={<User />}>
          <dl className="resumo">
            <dt>Nome</dt><dd>{perfil.data?.nomeExibicao ?? '—'}</dd>
            <dt>E-mail</dt><dd>{perfil.data?.email ?? '—'}</dd>
            <dt>Cargo</dt><dd>Líder</dd>
            <dt>Guilda</dt><dd>{guilda.data?.grupo.nome ?? '—'}</dd>
            <dt>Nível atual</dt><dd>{resumo.data ? `Nível ${resumo.data.personagem.nivel} - ${tituloDoNivel(resumo.data.personagem.nivel)}` : '—'}</dd>
            <dt>Membro desde</dt><dd>12 de ago. de 2026</dd>
          </dl>
        </Panel>
        <Panel titulo="Integrações" icone={<Link2 />}>
          <ul className="stack" style={{ gap: 8 }}>{[['Google', 'Sincronize tarefas e calendário.'], ['Discord', 'Receba notificações do discord.'], ['Strava', 'Importe suas atividades físicas.']].map(([n, d]) => (
            <li key={n} className="row"><div className="grow"><b>{n}</b><br /><small className="muted">{d}</small></div><button type="button" className="btn btn-outline btn-sm" {...desativado(`Conectar ${n}`)}>Conectar</button></li>))}</ul>
        </Panel>
        <Panel titulo="Dados e privacidade" icone={<Database />}>
          <button type="button" className="btn btn-block" {...desativado('Exportar meus dados')}>Exportar meus dados</button>
          <button type="button" className="btn btn-block btn-danger" style={{ marginTop: 6 }} {...desativado('Excluir minha conta')}>Excluir minha conta</button>
        </Panel>
        <Panel titulo="Ajuda e suporte" icone={<HelpCircle />}>
          <ul className="stack" style={{ gap: 6 }}><li><a href="#ajuda">Central de ajuda</a></li><li><a href="#feedback">Enviar feedback</a></li><li><a href="#problema">Reportar um problema</a></li></ul>
        </Panel>
      </aside>
    </div>
  );
}
