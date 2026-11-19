import {
  Award, BarChart3, Bell, ChevronDown, ChevronRight, Gift, Home, ListChecks, LogOut, Menu, PlusCircle,
  Search, Settings, Shield, Trophy, User, Users,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useMatches, useNavigate } from 'react-router-dom';
import { PATHS, type HandleRota } from '@/app/paths';
import { Avatar, Progress } from '@/components/ui/kit';
import { tituloDoNivel } from '@/config/regras';
import { useAuth } from '@/features/auth/AuthContext';
import { useNotificacoes, useResumoPerfil } from '@/hooks/queries';
import { fmtNumero } from '@/lib/format';

export function Logo() {
  return (
    <span className="logo">
      <svg width="34" height="30" viewBox="0 0 34 30" aria-hidden="true">
        <rect x="2" y="20" width="8" height="8" rx="4" fill="currentColor" />
        <rect x="13" y="10" width="8" height="18" rx="4" fill="currentColor" />
        <rect x="24" y="2" width="8" height="26" rx="4" fill="currentColor" />
      </svg>
      Habitus
    </span>
  );
}

const GRUPOS = [
  [
    { to: PATHS.inicio, rotulo: 'Início', Icone: Home },
    { to: PATHS.tarefas, rotulo: 'Minhas Tarefas', Icone: ListChecks },
    { to: PATHS.novaTarefa, rotulo: 'Criar Tarefa', Icone: PlusCircle },
  ],
  [
    { to: PATHS.minhaGuilda, rotulo: 'Minha Guilda', Icone: Users },
    { to: PATHS.guildas, rotulo: 'Explorar Guildas', Icone: Search },
    { to: PATHS.desafios, rotulo: 'Desafios', Icone: Shield },
    { to: PATHS.ranking, rotulo: 'Ranking', Icone: Trophy },
  ],
  [
    { to: PATHS.perfil, rotulo: 'Perfil', Icone: User },
    { to: PATHS.conquistas, rotulo: 'Conquistas', Icone: Award },
    { to: PATHS.progresso, rotulo: 'Progresso/Níveis', Icone: BarChart3 },
    { to: PATHS.loja, rotulo: 'Loja de Prêmios', Icone: Gift },
  ],
  [
    { to: PATHS.notificacoes, rotulo: 'Notificações', Icone: Bell },
    { to: PATHS.configuracoes, rotulo: 'Configurações', Icone: Settings },
  ],
];

function Sidebar({ aberta, fechar }: { aberta: boolean; fechar: () => void }) {
  const { sair } = useAuth();
  const { pathname } = useLocation();
  const { data } = useResumoPerfil();
  const p = data?.personagem;

  /** "Minhas Tarefas" também fica ativo no detalhe da tarefa (Figma: Detalhes da tarefa). */
  const ativo = (to: string) => (to === PATHS.tarefas ? pathname === to || /^\/tarefas\/\d+/.test(pathname) : pathname === to);

  return (
    <aside className={`sidebar ${aberta ? 'open' : ''}`} aria-label="Navegação principal">
      <Logo />
      <Link to={PATHS.perfil} className="user-card" onClick={fechar}>
        <Avatar nome={data?.usuario.nomeExibicao} src={data?.usuario.fotoPerfil} size={56} />
        <div className="grow">
          <div className="name row" style={{ gap: 4 }}>{data?.usuario.nomeCompleto ?? '…'} <ChevronRight size={14} /></div>
          {p && (
            <>
              <small>Nível {p.nivel} · <span className="muted">{tituloDoNivel(p.nivel)}</span></small>
              <Progress valor={p.xpAtual} total={p.xpProximoNivel} thin rotulo="XP até o próximo nível" />
              <div className="mini-xp">{fmtNumero(p.xpAtual)} / {fmtNumero(p.xpProximoNivel)} XP</div>
            </>
          )}
        </div>
      </Link>
      {GRUPOS.map((g, i) => (
        <nav key={i} className="nav-group">
          {g.map(({ to, rotulo, Icone }) => (
            <NavLink key={to} to={to} className={`nav-link ${ativo(to) ? 'active' : ''}`} onClick={fechar}>
              <Icone size={20} /> {rotulo}
            </NavLink>
          ))}
        </nav>
      ))}
      <div className="nav-group">
        <button type="button" className="nav-link danger" style={{ background: 'none', border: 0 }} onClick={sair}>
          <LogOut size={20} /> Sair
        </button>
      </div>
    </aside>
  );
}

function Topbar({ abrirMenu }: { abrirMenu: () => void }) {
  const { sessao, sair } = useAuth();
  const nav = useNavigate();
  const matches = useMatches();
  const handle = (matches[matches.length - 1]?.handle ?? {}) as HandleRota;
  const { data: notifs } = useNotificacoes();
  const [menu, setMenu] = useState(false);
  const temNaoLidas = notifs?.some((n) => !n.lida);

  return (
    <header className="topbar">
      <button type="button" className="icon-btn menu-btn" onClick={abrirMenu} aria-label="Abrir menu"><Menu /></button>
      <div className="greet">
        {handle.titulo ? <h1>{handle.titulo}</h1> : <h1>Olá, {sessao?.usuario.nomeExibicao}! <span aria-hidden="true">👋</span></h1>}
        {handle.subtitulo && <p className="muted">{handle.subtitulo}</p>}
      </div>
      {/* Busca global: o escopo (tarefas, guildas, membros) está no placeholder do Figma, mas o comportamento não foi especificado. */}
      <form className="input search" role="search" onSubmit={(e) => e.preventDefault()}>
        <Search size={16} />
        <input type="search" placeholder="Buscar tarefas, guildas, membros...." aria-label="Buscar" />
      </form>
      <button type="button" className="icon-btn" onClick={() => nav(PATHS.notificacoes)} aria-label="Notificações">
        <Bell />{temNaoLidas && <span className="dot" />}
      </button>
      <div style={{ position: 'relative' }}>
        <button type="button" className="icon-btn row" style={{ gap: 4 }} onClick={() => setMenu((m) => !m)} aria-haspopup="menu" aria-expanded={menu}>
          <Avatar nome={sessao?.usuario.nomeExibicao} src={sessao?.usuario.fotoPerfil} size={40} /><ChevronDown size={14} />
        </button>
        {menu && (
          <div className="menu" role="menu" onClick={() => setMenu(false)}>
            <Link to={PATHS.perfil} role="menuitem">Perfil</Link>
            <Link to={PATHS.configuracoes} role="menuitem">Configurações</Link>
            <button type="button" role="menuitem" onClick={sair}>Sair</button>
          </div>
        )}
      </div>
    </header>
  );
}

export function AppLayout() {
  const [aberta, setAberta] = useState(false);
  return (
    <div className="shell">
      <Sidebar aberta={aberta} fechar={() => setAberta(false)} />
      <div className="main">
        <Topbar abrirMenu={() => setAberta(true)} />
        <main className="content"><Outlet /></main>
        <footer className="footer">
          <span>Habitus · Gamificação que fortalece grupos de desenvolvimento</span>
          <nav aria-label="Rodapé">
            <a href="#termos">Termo de uso</a><a href="#privacidade">Privacidade</a><a href="#suporte">Suporte</a>
          </nav>
          <span>♡ Feito com propósito</span>
        </footer>
      </div>
    </div>
  );
}
