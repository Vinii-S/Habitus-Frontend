export const env = {
  apiUrl: (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, ''),
  /** Padrão: true, pois o backend (FastAPI + SQLite, RNF04) ainda não existe. */
  useMocks: (import.meta.env.VITE_USE_MOCKS ?? 'true') !== 'false',
};
