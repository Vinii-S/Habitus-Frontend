import { describe, expect, it } from 'vitest';
import { validarProva } from './validarProva';

describe('validarProva (UC003 4a / RNF06)', () => {
  it('aceita JPG e PNG dentro do limite', () => {
    expect(validarProva({ type: 'image/jpeg', size: 1024 }).ok).toBe(true);
    expect(validarProva({ type: 'image/png', size: 10 * 1024 * 1024 }).ok).toBe(true);
  });

  it('rejeita tipos diferentes de JPG/PNG', () => {
    const r = validarProva({ type: 'application/pdf', size: 100 });
    expect(r.ok).toBe(false);
  });

  it('rejeita arquivos acima de 10 MB', () => {
    const r = validarProva({ type: 'image/png', size: 10 * 1024 * 1024 + 1 });
    expect(r.ok).toBe(false);
  });
});
