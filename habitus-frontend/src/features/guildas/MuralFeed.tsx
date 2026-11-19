import { Heart, MessageCircle, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Avatar, Consulta } from '@/components/ui/kit';
import { useMural, usePublicarNoMural } from '@/hooks/queries';
import { tempoRelativo } from '@/lib/format';

/**
 * Mural da Guilda (RF07). `compacto` = visão da tela Início (cartões em linha, sem campo de entrada);
 * padrão = visão da tela Minha Guilda (campo "Compartilhe uma mensagem com sua guilda…" + lista).
 * RNF02: o timeout de 7 s está em services/grupos.ts.
 */
export function MuralFeed({ grupoId, compacto = false, limite }: { grupoId: number; compacto?: boolean; limite?: number }) {
  const q = useMural(grupoId);
  const publicar = usePublicarNoMural(grupoId);
  const [texto, setTexto] = useState('');

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    publicar.mutate(texto.trim(), { onSuccess: () => setTexto('') });
  }

  return (
    <>
      {!compacto && (
        <form className="input" onSubmit={enviar} style={{ marginBottom: 10 }}>
          <input aria-label="Mensagem para a guilda" placeholder="Compartilhe uma mensagem com sua guilda..." value={texto} onChange={(e) => setTexto(e.target.value)} />
          <button className="icon-btn" aria-label="Publicar" disabled={publicar.isPending}><Send size={18} color="var(--accent)" /></button>
        </form>
      )}
      <Consulta q={q} linhas={2}>
        {(posts) => (
          <ul className={compacto ? 'mural-compacto' : 'stack'}>
            {posts.slice(0, limite).map((p) => (
              <li key={p.id} className="card">
                <div className="row">
                  <Avatar nome={p.autor.nomeExibicao} src={p.autor.fotoPerfil} size={36} />
                  <div className="grow">
                    <b>{compacto ? `@${p.autor.nomeExibicao}` : p.autor.nomeExibicao}</b>
                    <small className="muted" style={{ marginLeft: 8 }}>{tempoRelativo(p.dataPostagem)}</small>
                  </div>
                </div>
                <p style={{ margin: '6px 0' }}>{p.conteudoTexto}</p>
                {p.destaque && (
                  <div className="destaque-post"><b>{p.destaque.titulo}</b><small>{p.destaque.subtitulo}</small></div>
                )}
                {!compacto && (
                  <div className="row muted" style={{ fontSize: 12 }}>
                    <span className="row" style={{ gap: 4 }}><Heart size={13} color="red" /> {p.curtidas ?? 0}</span>
                    <span className="row" style={{ gap: 4 }}><MessageCircle size={13} /> {p.comentarios ?? 0}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Consulta>
    </>
  );
}
