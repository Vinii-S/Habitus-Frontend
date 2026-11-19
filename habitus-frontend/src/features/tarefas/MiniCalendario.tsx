/**
 * Figma "Calendário de Tarefas": o quadro aparece APENAS como retângulo cinza (placeholder),
 * sem definição de conteúdo. Implementado um calendário mensal simples; marcações de tarefas
 * dependem de definição de produto/API (lacuna).
 */
export function MiniCalendario() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const primeiro = new Date(ano, mes, 1).getDay();
  const dias = new Date(ano, mes + 1, 0).getDate();
  const celulas = [...Array(primeiro).fill(null), ...Array.from({ length: dias }, (_, i) => i + 1)];
  const titulo = hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return (
    <div className="cal" role="grid" aria-label={`Calendário de ${titulo}`}>
      <div className="cal-titulo">{titulo}</div>
      {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <span key={i} className="cal-dow">{d}</span>)}
      {celulas.map((d, i) => <span key={i} className={`cal-dia ${d === hoje.getDate() ? 'hoje' : ''}`}>{d}</span>)}
    </div>
  );
}
