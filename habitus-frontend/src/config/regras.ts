import type { CategoriaAtividade } from '@/types/domain';

/**
 * Regras de negócio que o frontend precisa conhecer para validar/exibir.
 * Cada constante cita a fonte; o backend continua sendo a autoridade (RNF06, RNF07).
 */

/** RNF06: o backend restringe a 10 MB e .jpg/.png nas Provas de Conclusão.
 *  (UC003 cita "ex.: máx. 5MB" — conflito; adotado o RNF por ser requisito formal.) */
export const PROVA_TAMANHO_MAX_BYTES = 10 * 1024 * 1024;
export const PROVA_TIPOS_ACEITOS = ['image/jpeg', 'image/png'] as const;

/** UC001 fluxo 6a: "limite máximo (ex: 10 tarefas)" — valor apenas exemplificado na documentação. */
export const LIMITE_EXEMPLO_ATIVIDADES_ATIVAS = 10;

/** RNF02: postagens devem carregar em até 7 segundos. */
export const TIMEOUT_MURAL_MS = 7000;

/** RNF07: o cálculo de XP/nível leva no máximo 2000 ms após o check-in (orçamento do spinner). */
export const ORCAMENTO_CHECKIN_MS = 2000;

/** Tela Perfil: contador "68/200" na Bio. */
export const BIO_MAX_CARACTERES = 200;

/** Tela Criar tarefa, passo 2. */
export const CATEGORIAS: CategoriaAtividade[] = [
  'Estudos',
  'Saúde',
  'Bem-estar',
  'Produtividade',
  'Leitura',
  'Vida pessoal',
  'Outros',
];

/** Tela Progresso/Níveis — "Sua jornada de níveis". O Diagrama de Classes só guarda `nivel` (int). */
export const TITULOS_NIVEL: Record<number, string> = {
  1: 'Iniciante',
  2: 'Disciplinado',
  3: 'Dedicado',
  4: 'Explorador',
  5: 'Estrategista',
  6: 'Referência',
  7: 'Mestre',
  8: 'Lenda',
};
export const tituloDoNivel = (nivel: number) => TITULOS_NIVEL[nivel] ?? `Nível ${nivel}`;
