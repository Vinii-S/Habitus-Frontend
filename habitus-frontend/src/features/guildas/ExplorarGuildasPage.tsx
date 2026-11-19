import { Filter, ListChecks, Plus, Star, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Icone } from '@/components/ui/icons';
import { Consulta, Dialog, Panel } from '@/components/ui/kit';
import { CATEGORIAS } from '@/config/regras';
import { useGuildas } from '@/hooks/queries';
import { fmtNumero } from '@/lib/format';
import type { CategoriaAtividade, FiltroGuildas, Grupo } from '@/types/domain';

const CHIPS: CategoriaAtividade[] = ['Estudos', 'Saúde', 'Produtividade', 'Leitura', 'Vida pessoal'];
const CORES = ['#7aa5c7', '#d98a6c', '#8c8f94', '#c98d6e', '#5b8f6a', '#6b7b8c', '#b79d78', '#c6a6a0', '#4b2c7a'];

/** Figma: "Explorar Guildas" (RF03). "Criar Guilda" e "Ver detalhes → entrar" não têm tela/fluxo no Figma ou nos casos de uso (lacuna). */
export function ExplorarGuildasPage() {
  const [busca, setBusca] = useState('');
  const [ordenarPor, setOrdenar] = useState<NonNullable<FiltroGuildas['ordenarPor']>>('membros');
  const [cats, setCats] = useState<CategoriaAtividade[]>([]);
  const [nivelMin, setNivelMin] = useState(0);
  const [membrosMin, setMembrosMin] = useState(0);
  const [aplicado, setAplicado] = useState({ nivelMin: 0, membrosMin: 0 });
  const [detalhe, setDetalhe] = useState<Grupo>();
  const q = useGuildas({ busca, ordenarPor });

  const alternar = (c: CategoriaAtividade) => setCats((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const filtrar = useMemo(() => (l: Grupo[]) => l.filter((g) => (!cats.length || cats.some((c) => g.categorias.includes(c))) && g.nivelGrupo >= aplicado.nivelMin && g.totalMembros >= aplicado.membrosMin), [cats, aplicado]);

  return (
    <>
      <section className="banner">
        <span className="banner-icon"><Users size={44} /></span>
        <div className="grow"><h1>Explorar Guildas</h1><p className="muted">Acompanhe seu progresso e veja os destaques da comunidade.</p></div>
        <button type="button" className="btn btn-dark btn-lg" disabled title="Fluxo de criação de guilda ainda não detalhado (RF03 / DC.Grupo.criarGrupo)"><Plus /> Criar Guilda</button>
      </section>

      <div className="duas-colunas" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <Panel>
          <div className="row between wrap">
            <div className="chips">
              <button type="button" className="chip" aria-pressed={!cats.length} style={!cats.length ? { background: 'var(--info)', color: '#fff' } : undefined} onClick={() => setCats([])}>Todas</button>
              {CHIPS.map((c) => <button key={c} type="button" className="chip" aria-pressed={cats.includes(c)} style={cats.includes(c) ? { background: 'var(--info)', color: '#fff' } : undefined} onClick={() => alternar(c)}>{c}</button>)}
            </div>
            <label className="row" style={{ fontSize: 12 }}>Ordenar por:
              <select className="chip" value={ordenarPor} onChange={(e) => setOrdenar(e.target.value as typeof ordenarPor)}>
                <option value="membros">Mais membros</option><option value="nivel">Maior nível</option><option value="xp">Mais XP</option>
              </select></label>
          </div>
          <Consulta q={q} linhas={4}>
            {(lista) => {
              const itens = filtrar(lista);
              return itens.length === 0 ? <p className="state">Nenhuma guilda encontrada com esses filtros.</p> : (
                <ul className="guildas-grid">
                  {itens.map((g) => (
                    <li key={g.id} className="guilda-card">
                      <div className="capa" style={{ background: CORES[(g.id - 1) % CORES.length] }}><span className="emblema"><Icone nome={g.icone} size={30} /></span></div>
                      <div className="corpo">
                        <b>{g.nome}</b><small className="muted">{g.descricao}</small>
                        <div className="row wrap" style={{ gap: 4, justifyContent: 'center' }}>{g.categorias.map((c, i) => <span key={c} className={`tag ${['', 'purple', 'ok'][i % 3]}`}>{c}</span>)}</div>
                        <div className="row" style={{ justifyContent: 'center', fontSize: 11, gap: 14 }}>
                          <span><Users size={11} /> {g.totalMembros} Membros</span><span><Star size={11} /> Nível {g.nivelGrupo}</span><span>{fmtNumero(g.xpTotal)} XP</span>
                        </div>
                      </div>
                      <button type="button" className="ver-detalhes" onClick={() => setDetalhe(g)}>Ver detalhes</button>
                    </li>
                  ))}
                </ul>
              );
            }}
          </Consulta>
        </Panel>

        <aside className="stack">
          <Panel titulo="Buscar Guilda" icone={<ListChecks />}>
            <div className="input"><input placeholder="Nome da guilda ou palavra-chave..." aria-label="Buscar guilda" value={busca} onChange={(e) => setBusca(e.target.value)} /></div>
            <form className="card stack" style={{ marginTop: 10 }} onSubmit={(e) => { e.preventDefault(); setAplicado({ nivelMin, membrosMin }); }}>
              <b className="row"><Filter size={16} /> FILTRO</b>
              <fieldset style={{ border: 0, padding: 0 }}><legend className="muted" style={{ fontSize: 12 }}>CATEGORIA</legend>
                <div className="row wrap" style={{ fontSize: 11 }}>{CATEGORIAS.map((c) => <label key={c} className="row" style={{ gap: 4 }}><input type="checkbox" checked={cats.includes(c)} onChange={() => alternar(c)} />{c}</label>)}</div></fieldset>
              {/* Opções de "Nível de guilda" e "Membros" não constam no Figma (só o texto-padrão); faixas abaixo são provisórias. */}
              <label className="field"><b style={{ fontSize: 12 }}>Nível de guilda</b><div className="input"><select value={nivelMin} onChange={(e) => setNivelMin(Number(e.target.value))}><option value={0}>Qualquer nível</option>{[2, 3, 4, 5].map((n) => <option key={n} value={n}>Nível {n}+</option>)}</select></div></label>
              <label className="field"><b style={{ fontSize: 12 }}>Membros</b><div className="input"><select value={membrosMin} onChange={(e) => setMembrosMin(Number(e.target.value))}><option value={0}>Qualquer quantidade</option><option value={5}>5+</option><option value={10}>10+</option></select></div></label>
              <button className="btn btn-primary btn-block">Aplicar Filtro</button>
            </form>
          </Panel>
          <Panel titulo="Guilda em destaque" icone={<Users size={16} />}>
            <Consulta q={q} linhas={2}>{(l) => (
              <ul className="stack" style={{ gap: 4 }}>{l.slice(0, 4).map((g) => <li key={g.id} className="row"><Icone nome={g.icone} /><div className="grow"><b>{g.nome}</b><small className="muted" style={{ display: 'block' }}>{g.totalMembros} Membros · Nível {g.nivelGrupo}</small></div></li>)}</ul>
            )}</Consulta>
          </Panel>
        </aside>
      </div>

      {detalhe && (
        <Dialog titulo={detalhe.nome} onFechar={() => setDetalhe(undefined)}>
          <p>{detalhe.descricao}</p>
          <p className="muted">{detalhe.totalMembros} membros · Nível {detalhe.nivelGrupo} · {fmtNumero(detalhe.xpTotal)} XP</p>
          <p className="muted" style={{ fontSize: 12 }}>Entrar na guilda (por código ou convite) ainda não tem fluxo definido na documentação.</p>
        </Dialog>
      )}
    </>
  );
}
