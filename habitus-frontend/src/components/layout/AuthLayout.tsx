import { BarChart3, CheckCircle2, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { Logo } from './AppLayout';

/**
 * Casca das telas públicas. Painel esquerdo: texto do Figma sobre um degradê provisório
 * (as ilustrações — personagem e paisagem — não foram exportadas do Figma).
 */
export function AuthLayout({ children, variante = 'claro' }: { children: ReactNode; variante?: 'claro' | 'paisagem' }) {
  return (
    <div className="auth">
      {variante === 'claro' ? (
        <aside className="auth-hero claro">
          <Logo />
          <h2>Pequenas ações,<br />grandes conquistas.</h2>
          <ul>
            <li><span className="ico"><CheckCircle2 /></span><div><strong>Organize</strong><br />suas tarefas e hábitos de forma simples.</div></li>
            <li><span className="ico"><BarChart3 /></span><div><strong>Evolua</strong><br />acompanhe seu progresso e ganhe recompensas.</div></li>
            <li><span className="ico"><Users /></span><div><strong>Conquiste</strong><br />participe de guildas e alcance novos níveis.</div></li>
          </ul>
        </aside>
      ) : (
        <aside className="auth-hero">
          <h2>Hábitos de hoje,<br /><span style={{ color: '#d6b8ff' }}>conquistas de amanhã.</span></h2>
          <p>Transforme pequenas ações em grandes resultados.</p>
        </aside>
      )}
      <section className="auth-form"><div className="auth-card">{children}</div></section>
    </div>
  );
}
