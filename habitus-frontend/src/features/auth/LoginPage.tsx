import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { Logo } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { useAuth } from './AuthContext';
import { SocialLogin } from './SocialLogin';

/**
 * Figma: tela de login. NOTA: no Figma o título desta tela está como "Crie sua conta" (parece cópia
 * da tela de cadastro); aqui foi usado "Entre na sua conta". Confirmar com o design.
 */
export function LoginPage() {
  const { entrar } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as { state?: { de?: string } };
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ver, setVer] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro('');
    if (!email.trim() || !senha) return setErro('Informe e-mail e senha.');
    setEnviando(true);
    try {
      await entrar({ email: email.trim(), senha });
      nav(loc.state?.de ?? PATHS.inicio, { replace: true });
    } catch {
      setErro('Não foi possível entrar. Verifique seus dados e tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthLayout>
      <Logo />
      <h1>Entre na sua conta</h1>
      <form className="stack" onSubmit={enviar} noValidate style={{ gap: 18 }}>
        <div className="field">
          <label htmlFor="email">Endereço de e-mail</label>
          <div className="input"><Mail size={18} /><input id="email" type="email" autoComplete="email" placeholder="Ex: ronald@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        </div>
        <div className="field">
          <label htmlFor="senha">Senha</label>
          <div className="input">
            <Lock size={18} />
            <input id="senha" type={ver ? 'text' : 'password'} autoComplete="current-password" placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <button type="button" className="icon-btn" onClick={() => setVer((v) => !v)} aria-label={ver ? 'Ocultar senha' : 'Mostrar senha'}>{ver ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          {/* Recuperação de senha não está nos casos de uso: link sem fluxo definido. */}
          <a href="#esqueci" style={{ alignSelf: 'flex-end', fontSize: 13 }} onClick={(e) => e.preventDefault()}>Esqueceu sua senha?</a>
        </div>
        {erro && <p className="alert" role="alert">{erro}</p>}
        <button className="btn btn-primary btn-lg btn-block" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
        <Link to={PATHS.cadastrar} className="btn btn-soft btn-block" style={{ textDecoration: 'none' }}>Criar conta</Link>
      </form>
      <SocialLogin />
    </AuthLayout>
  );
}
