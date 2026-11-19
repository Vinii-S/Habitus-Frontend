import { AtSign, Calendar, Lock, Mail, UserRound } from 'lucide-react';
import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { Logo } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { useAuth } from './AuthContext';

/** Heurística PROVISÓRIA: o Figma mostra "Força da Senha: Boa", mas não define a regra. */
function forcaSenha(s: string): { nivel: 0 | 1 | 2 | 3 | 4; rotulo: string } {
  let pontos = 0;
  if (s.length >= 8) pontos++;
  if (/[a-z]/.test(s) && /[A-Z]/.test(s)) pontos++;
  if (/\d/.test(s)) pontos++;
  if (/[^A-Za-z0-9]/.test(s)) pontos++;
  const nivel = (s ? Math.max(1, pontos) : 0) as 0 | 1 | 2 | 3 | 4;
  return { nivel, rotulo: ['', 'Fraca', 'Média', 'Boa', 'Forte'][nivel] };
}

function Campo({ id, rotulo, icone, erro, children }: { id: string; rotulo: string; icone: ReactNode; erro?: string; children: ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id}>{rotulo}</label>
      <div className="input">{icone}{children}</div>
      {erro && <span className="field-error" role="alert">{erro}</span>}
    </div>
  );
}

/** Figma: "Crie sua conta" — campos: nome completo, nome de usuário, e-mail, data de nascimento, senha, confirmação. */
export function CadastroPage() {
  const { cadastrar } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ nomeCompleto: '', nomeExibicao: '', email: '', dataNascimento: '', senha: '', confirma: '', aceite: false });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);
  const forca = useMemo(() => forcaSenha(f.senha), [f.senha]);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.nomeCompleto.trim()) er.nomeCompleto = 'Informe seu nome completo.';
    if (!f.nomeExibicao.trim()) er.nomeExibicao = 'Informe um nome de usuário.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Informe um e-mail válido.';
    if (!f.dataNascimento) er.dataNascimento = 'Informe a data de nascimento.';
    if (f.senha.length < 8) er.senha = 'A senha deve ter ao menos 8 caracteres.'; // mínimo: suposição (não documentado)
    if (f.senha !== f.confirma) er.confirma = 'As senhas não coincidem.';
    if (!f.aceite) er.aceite = 'É necessário aceitar os Termos de Uso e a Política de Privacidade.';
    setErros(er);
    if (Object.keys(er).length) return;
    setEnviando(true);
    try {
      await cadastrar({ nomeCompleto: f.nomeCompleto.trim(), nomeExibicao: f.nomeExibicao.trim(), email: f.email.trim(), dataNascimento: f.dataNascimento, senha: f.senha });
      nav(PATHS.inicio, { replace: true });
    } catch {
      setErroGeral('Não foi possível criar a conta. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthLayout>
      <Logo />
      <h1>Crie sua conta</h1>
      <form className="stack" onSubmit={enviar} noValidate>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
          <Campo id="nome" rotulo="Nome completo" icone={<UserRound size={18} />} erro={erros.nomeCompleto}>
            <input id="nome" autoComplete="name" placeholder="Ex: Ronald Jose Santos" value={f.nomeCompleto} onChange={set('nomeCompleto')} />
          </Campo>
          <Campo id="usuario" rotulo="Nome de usuario" icone={<AtSign size={18} />} erro={erros.nomeExibicao}>
            <input id="usuario" autoComplete="username" placeholder="Ex: Ronald" value={f.nomeExibicao} onChange={set('nomeExibicao')} />
          </Campo>
        </div>
        <Campo id="email" rotulo="Email" icone={<Mail size={18} />} erro={erros.email}>
          <input id="email" type="email" autoComplete="email" placeholder="Ex: ronald@gmail.com" value={f.email} onChange={set('email')} />
        </Campo>
        <Campo id="nasc" rotulo="Data de nascimento" icone={<Calendar size={18} />} erro={erros.dataNascimento}>
          <input id="nasc" type="date" value={f.dataNascimento} onChange={set('dataNascimento')} />
        </Campo>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
          <Campo id="senha" rotulo="Senha" icone={<Lock size={18} />} erro={erros.senha}>
            <input id="senha" type="password" autoComplete="new-password" placeholder="****************" value={f.senha} onChange={set('senha')} />
          </Campo>
          <Campo id="confirma" rotulo="Confirma Senha" icone={<Lock size={18} />} erro={erros.confirma}>
            <input id="confirma" type="password" autoComplete="new-password" placeholder="****************" value={f.confirma} onChange={set('confirma')} />
          </Campo>
        </div>
        <div className="strength" aria-live="polite">
          <span>Força da Senha</span>
          <div className="progress"><span style={{ width: `${forca.nivel * 25}%`, background: forca.nivel >= 3 ? 'var(--ok)' : forca.nivel === 2 ? 'var(--warn)' : 'var(--danger)' }} /></div>
          <span style={{ color: 'var(--ok)', minWidth: 40 }}>{forca.rotulo}</span>
        </div>
        {erroGeral && <p className="alert" role="alert">{erroGeral}</p>}
        <button className="btn btn-primary btn-lg btn-block" disabled={enviando}>{enviando ? 'Criando…' : 'Criar Conta'}</button>
        <label className="row" style={{ fontSize: 13 }}>
          <input type="checkbox" checked={f.aceite} onChange={(e) => setF((s) => ({ ...s, aceite: e.target.checked }))} />
          <span>Li e concordo com os <a href="#termos">Termos de Uso</a> e a <a href="#privacidade">Política de Privacidade</a>.</span>
        </label>
        {erros.aceite && <span className="field-error" role="alert">{erros.aceite}</span>}
        <div className="divider">Já tem uma conta? <Link to={PATHS.entrar}>Faça login</Link></div>
      </form>
    </AuthLayout>
  );
}
