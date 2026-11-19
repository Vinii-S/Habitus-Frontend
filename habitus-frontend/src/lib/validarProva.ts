import { PROVA_TAMANHO_MAX_BYTES, PROVA_TIPOS_ACEITOS } from '@/config/regras';

export type ResultadoValidacao = { ok: true } | { ok: false; motivo: string };

/**
 * Validação de arquivo da Prova de Conclusão no cliente (UC003 fluxo 4a, RNF06).
 * É apenas conveniência de UX — o backend repete a validação (RNF06).
 */
export function validarProva(arquivo: { type: string; size: number }): ResultadoValidacao {
  if (!(PROVA_TIPOS_ACEITOS as readonly string[]).includes(arquivo.type)) {
    return { ok: false, motivo: 'Arquivo não suportado. Envie uma imagem JPG ou PNG.' };
  }
  if (arquivo.size > PROVA_TAMANHO_MAX_BYTES) {
    const mb = PROVA_TAMANHO_MAX_BYTES / (1024 * 1024);
    return { ok: false, motivo: `O arquivo ultrapassa o limite de ${mb} MB.` };
  }
  return { ok: true };
}
