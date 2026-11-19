import { CalendarPlus, Clock, Gift, HelpCircle, Star, Target } from 'lucide-react';
import { useState } from 'react';
import { Icone } from '@/components/ui/icons';
import { Consulta, Panel, Progress } from '@/components/ui/kit';
import { useLoja, useResgatar } from '@/hooks/queries';
import { fmtNumero } from '@/lib/format';
import type { CategoriaRecompensa } from '@/types/domain';

type Aba = 'Todas' | CategoriaRecompensa;
const ABAS: Aba[] = ['Todas', 'Personalização', 'Cupons', 'Benefícios', 'Exclusivos'];

/**
 * Figma: "Loja de Prêmios" — funcionalidade 7 (Loja de Recompensas Reais e Virtuais), DC.Recompensa.
 * ATENÇÃO: o relatório (seção 10) coloca "compra de itens consumíveis" fora do escopo do semestre,
 * mas a Loja é "Desejável" (seção 7) e tem tela no Figma — implementada a loja de recompensas.
 */
export function LojaPage() {
  const q = useLoja();
  const resgatar = useResgatar();
  const [aba, setAba] = useState<Aba>('Todas');
  const [erro, setErro] = useState('');

  return (
    <Consulta q={q} linhas={4}>
      {(p) => (
        <>
          <section className="banner">
            <span className="banner-icon"><Gift size={44} /></span>
            <div className="grow"><h1>Loja de Prêmios</h1><p className="muted">Troque seus pontos por recompensas e personalize sua jornada.</p></div>
            <div className="card row"><Star size={36} color="#f5b301" fill="#f5b301" /><div><b style={{ fontSize: 24 }}>{fmtNumero(p.pontosDisponiveis)}</b><br /><small className="muted">pontos disponíveis</small></div></div>
            <div className="card row"><Clock size={32} color="var(--info)" /><div><b style={{ fontSize: 24 }}>{p.resgatesRealizados}</b><br /><small className="muted">resgates realizados</small></div></div>
            {p.proximoPremio && <div className="card" style={{ minWidth: 190 }}><small className="muted">Próximo prêmio desejado</small><br /><b>{p.proximoPremio.titulo}</b><Progress valor={p.proximoPremio.atual} total={p.proximoPremio.total} thin /><small className="muted">{fmtNumero(p.proximoPremio.atual)} / {fmtNumero(p.proximoPremio.total)} pontos</small></div>}
          </section>

          <div className="chips purple" role="tablist" aria-label="Categorias">
            {ABAS.map((a) => <button key={a} role="tab" aria-selected={aba === a} type="button" className="chip chip-lg" onClick={() => setAba(a)}>{a}</button>)}
          </div>
          {erro && <p className="alert" role="alert">{erro}</p>}

          <ul className="loja-grid">
            {p.itens.filter((i) => aba === 'Todas' || i.categoria === aba).map((i) => {
              const insuf = !i.resgatada && p.pontosDisponiveis < i.precoMoedas;
              return (
                <li key={i.id} className="card produto">
                  <span className="img"><Icone nome={i.icone} size={44} /></span>
                  <b>{i.titulo}</b><small className="muted">{i.descricao}</small>
                  <div className="row between"><span className="row" style={{ gap: 6 }}><Star size={18} color="#f5b301" fill="#f5b301" /><b>{fmtNumero(i.precoMoedas)} pontos</b></span>
                    {i.resgatada ? <button type="button" className="btn btn-outline btn-sm" disabled>Resgatado</button>
                      : insuf ? <button type="button" className="btn btn-sm" disabled>Pontos Insuficientes</button>
                      : <button type="button" className="btn btn-primary btn-sm" disabled={resgatar.isPending}
                          onClick={() => { setErro(''); resgatar.mutate(i.id, { onError: (e) => setErro(e instanceof Error ? e.message : 'Falha ao resgatar.') }); }}>Resgatar</button>}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="duas-colunas" style={{ gridTemplateColumns: '1fr 1.4fr' }}>
            <Panel titulo="Resgates recentes" icone={<Clock size={18} />}>
              <ul className="stack" style={{ gap: 6 }}>{p.recentes.map((r) => <li key={r.titulo + r.data} className="card row"><CalendarPlus size={20} /><div className="grow"><b style={{ fontSize: 12 }}>{r.titulo}</b><small className="muted" style={{ display: 'block' }}>{r.data}</small></div><span className="tag ok">✓ Resgatado</span></li>)}</ul>
            </Panel>
            <Panel titulo="Como funciona?" icone={<HelpCircle size={18} />}>
              <ol className="como-funciona">
                <li><Target size={28} /><b>Complete tarefas</b><small>Realize suas tarefas diárias e evolua na sua jornada</small></li>
                <li><Star size={28} color="#f5b301" /><b>Ganhe XP</b><small>Acumule pontos (XP) com suas conquistas.</small></li>
                <li><Gift size={28} color="#ef4444" /><b>Troque por prêmios</b><small>Resgate recompensas incríveis e personalize sua experiência.</small></li>
              </ol>
            </Panel>
          </div>
        </>
      )}
    </Consulta>
  );
}
