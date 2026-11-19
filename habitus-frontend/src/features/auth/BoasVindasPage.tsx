import { ArrowRight, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { Logo } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { SocialLogin } from './SocialLogin';

/** Figma: tela "Bem-vindo(a)!" — Entrar / Criar conta / social. */
export function BoasVindasPage() {
  return (
    <AuthLayout variante="paisagem">
      <Logo />
      <h1 style={{ fontSize: 24 }}>Bem-vindo(a)!</h1>
      <p className="muted" style={{ textAlign: 'center' }}>Entre na sua conta ou crie uma nova para começar a sua jornada.</p>
      <Link to={PATHS.entrar} className="btn btn-primary btn-lg row between" style={{ textDecoration: 'none' }}>
        <span className="row"><UserRound size={20} /> Entrar</span><ArrowRight size={18} />
      </Link>
      <Link to={PATHS.cadastrar} className="btn btn-soft btn-lg row between" style={{ textDecoration: 'none' }}>
        <span className="row"><UserRound size={20} /> Criar conta</span><ArrowRight size={18} />
      </Link>
      <SocialLogin />
    </AuthLayout>
  );
}
