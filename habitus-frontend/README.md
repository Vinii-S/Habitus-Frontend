# Habitus — Frontend (React + TypeScript)

> Gerado com auxílio de IA. Revisão final por: ______________________

Frontend da rede social de hábitos gamificada **Habitus**, baseado na documentação do projeto e nas 17 telas do Figma.
Backend futuro: Python (FastAPI + SQLite). Enquanto ele não existe, o app usa dados simulados.

**Leia primeiro:** [docs/ARQUITETURA.md](docs/ARQUITETURA.md) — estrutura, rastreabilidade (fonte de cada tela/requisito) e **lacunas/conflitos** da documentação.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
```

Entrar com qualquer e-mail/senha (modo simulado).

| Comando | Função |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Verificação de tipos + build de produção |
| `npm run typecheck` | Só verificação de tipos |
| `npm test` | Testes (Vitest) |

## Backend

Copie `.env.example` para `.env`. Com `VITE_USE_MOCKS=false` o app chama `VITE_API_URL`.
Os caminhos da API estão em `src/api/endpoints.ts` e são **provisórios** (a documentação não define o contrato).
