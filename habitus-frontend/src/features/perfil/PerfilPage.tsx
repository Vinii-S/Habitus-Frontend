import { Crown, Flame, Pencil, Plus, Target, Trophy, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, Consulta, Stat } from '@/components/ui/kit';
import { BIO_MAX_CARACTERES, tituloDoNivel } from '@/config/regras';
import { useAtualizarPerfil, useMinhaGuilda, usePerfil, useProgresso, useResumoPerfil } from '@/hooks/queries';
import type { Usuario } from '@/types/domain';

/** Figma: "Meu perfil" — RF04 (gestão de perfil). Campos = DC.Usuario (nomeCompleto, nomeExibicao, dataNascimento, genero, bio). */
export function PerfilPage() {
  const q = usePerfil();
  const resumo = useResumoPerfil();
  const guilda = useMinhaGuilda();
  const progresso = useProgresso();
  const salvar = useAtualizarPerfil();
  const [editando, setEditando] = useState(false);
  const [f, setF] = useState<Partial<Usuario>>({});
  const [msg, setMsg] = useState('');

  useEffect(() => { if (q.data) setF(q.data); }, [q.data]);

  const set = (k: keyof Usuario) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }));
  const ro = !editando;

  function enviar() {
    if (!f.nomeCompleto?.trim() || !f.nomeExibicao?.trim()) return setMsg('Nome completo e nome de exibição são obrigatórios.');
    salvar.mutate(f, { onSuccess: () => { setEditando(false); setMsg('Perfil atualizado.'); }, onError: () => setMsg('Não foi possível salvar.') });
  }

  return (
    <Consulta q={q} linhas={3}>
      {(u) => (
        <>
          <section className="perfil-capa">
            <div className="capa" style={u.fotoCapa ? { backgroundImage: `url(${u.fotoCapa})` } : undefined}>
              <button type="button" className="btn btn-sm" disabled title="Upload de capa não especificado">Alterar capa</button>
            </div>
            <div className="identidade">
              <span className="avatar-grande"><Avatar nome={u.nomeExibicao} src={u.fotoPerfil} size={120} /><button type="button" className="mais" disabled aria-label="Alterar foto"><Plus size={14} /></button></span>
              <h2 className="row" style={{ gap: 8 }}>{u.nomeCompleto} <Pencil size={14} /></h2>
              <div className="row">
                {resumo.data && <span className="chip"><Crown size={12} /> Nível {resumo.data.personagem.nivel} - {tituloDoNivel(resumo.data.personagem.nivel)}</span>}
                {guilda.data && <span className="chip">{guilda.data.grupo.nome}</span>}
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="row between">
              <div className="row"><UserRound size={30} /><div><h2>Dados pessoais</h2><p className="muted">Mantenha suas informações atualizadas.</p></div></div>
              {editando
                ? <div className="row"><button type="button" className="btn btn-outline" onClick={() => { setEditando(false); setF(u); }}>Cancelar</button><button type="button" className="btn btn-dark" onClick={enviar} disabled={salvar.isPending}>Salvar</button></div>
                : <button type="button" className="btn btn-outline" onClick={() => { setMsg(''); setEditando(true); }}><Pencil size={14} /> Editar informações</button>}
            </div>
            {msg && <p className={`alert ${msg.startsWith('Perfil') ? 'ok' : ''}`} role="status" style={{ marginTop: 8 }}>{msg}</p>}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', marginTop: 12 }}>
              <div className="field"><label htmlFor="nc" className="muted">Nome Completo</label><div className="input"><input id="nc" readOnly={ro} value={f.nomeCompleto ?? ''} onChange={set('nomeCompleto')} /></div></div>
              <div className="field"><label htmlFor="ne" className="muted">Nome de Exibição (Público)</label><div className="input"><input id="ne" readOnly={ro} value={f.nomeExibicao ?? ''} onChange={set('nomeExibicao')} /></div></div>
              <div className="field"><label htmlFor="dn" className="muted">Data de Nascimento</label><div className="input"><input id="dn" type="date" readOnly={ro} value={f.dataNascimento ?? ''} onChange={set('dataNascimento')} /></div></div>
              <div className="field"><label htmlFor="ge" className="muted">Gênero</label><div className="input"><input id="ge" readOnly={ro} value={f.genero ?? ''} onChange={set('genero')} /></div></div>
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <label htmlFor="bio" className="muted">Bio</label>
              <div className="input" style={{ alignItems: 'flex-start' }}><textarea id="bio" rows={2} maxLength={BIO_MAX_CARACTERES} readOnly={ro} value={f.bio ?? ''} onChange={set('bio')} style={{ resize: 'none' }} /><small className="muted" style={{ alignSelf: 'flex-end' }}>{(f.bio ?? '').length}/{BIO_MAX_CARACTERES}</small></div>
            </div>
          </section>

          <Consulta q={progresso} linhas={1}>
            {({ totais }) => (
              <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <Stat icone={<Target color="#2f80ed" />} valor={totais.tarefasConcluidas} rotulo="Tarefas concluídas" cor="#c5e6ff" />
                <Stat icone={<Flame color="#f97316" />} valor={totais.diasSequencia} rotulo="Dias de sequência" cor="#ffe1cc" />
                <Stat icone={<Trophy color="#7c3aed" />} valor={totais.conquistas} rotulo="Conquistas desbloqueadas" cor="#e5dcfb" />
              </div>
            )}
          </Consulta>
        </>
      )}
    </Consulta>
  );
}
