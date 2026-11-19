import { ImagePlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@/components/ui/kit';
import { useRecompensas } from '@/features/rewards/RewardContext';
import { useCheckIn } from '@/hooks/queries';
import { validarProva } from '@/lib/validarProva';
import type { Atividade } from '@/types/domain';

/**
 * UC003 — Anexar Comprovante (Proof of Work).
 *  passo 2: solicita imagem  → input de arquivo
 *  4a: formato/tamanho inválido → mensagem e volta ao passo 3
 *  6a: falha de upload → botão "Tentar novamente"
 *  passo 7: feedback visual de recompensa (RNF09) via RewardContext
 * RNF08: Início → "Fazer check-in" → escolher arquivo → confirmar  (≤ 4 cliques).
 * A prova é opcional porque o Diagrama de Classes define CheckIn—ProvaDeConclusao como 0..1.
 */
export function CheckInDialog({ atividade, arquivoInicial, onFechar }: { atividade: Atividade; arquivoInicial?: File; onFechar: () => void }) {
  const { anunciarXp, anunciarNivel } = useRecompensas();
  const mut = useCheckIn();
  const inputRef = useRef<HTMLInputElement>(null);
  const [arquivo, setArquivo] = useState<File | undefined>(arquivoInicial);
  const [erro, setErro] = useState('');
  const [previa, setPrevia] = useState<string>();

  useEffect(() => {
    if (!arquivo) return setPrevia(undefined);
    const url = URL.createObjectURL(arquivo);
    setPrevia(url);
    return () => URL.revokeObjectURL(url);
  }, [arquivo]);

  function escolher(f?: File) {
    if (!f) return;
    const v = validarProva(f);
    if (!v.ok) {
      setErro(v.motivo);
      setArquivo(undefined);
      return;
    }
    setErro('');
    setArquivo(f);
  }

  function confirmar() {
    setErro('');
    mut.mutate(
      { id: atividade.id, prova: arquivo },
      {
        onSuccess: (r) => {
          anunciarXp(r.xpGanho);
          if (r.subiuDeNivel && r.novoNivel) anunciarNivel(r.novoNivel);
          onFechar();
        },
        onError: () => setErro('Erro na transferência do arquivo. Tente reenviar.'),
      },
    );
  }

  return (
    <Dialog titulo={`Check-in: ${atividade.nome}`} onFechar={onFechar}>
      <p className="muted">Anexe uma foto como prova de conclusão (JPG ou PNG, até 10 MB).</p>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" hidden onChange={(e) => escolher(e.target.files?.[0])} />
      {previa ? <img src={previa} alt="Prévia da prova de conclusão" style={{ borderRadius: 8, maxHeight: 220, objectFit: 'cover' }} /> : null}
      <button type="button" className="btn btn-outline" onClick={() => inputRef.current?.click()}>
        <ImagePlus size={18} /> {arquivo ? 'Trocar imagem' : 'Anexar foto como prova'}
      </button>
      {erro && <p className="alert" role="alert">{erro}</p>}
      <div className="row between">
        <button type="button" className="btn btn-outline" onClick={onFechar}>Cancelar</button>
        <button type="button" className="btn btn-dark" onClick={confirmar} disabled={mut.isPending}>
          {mut.isPending ? 'Registrando…' : mut.isError ? 'Tentar novamente' : 'Confirmar check-in'}
        </button>
      </div>
    </Dialog>
  );
}
