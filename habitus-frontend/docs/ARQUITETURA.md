# Habitus — Arquitetura do Frontend (React)

> **Gerado com auxílio de IA. Revisão final por: ______________________**
> Este documento e o código foram produzidos com apoio de IA a partir da pasta `FIGMA`. A IA pode errar
> (números, regras, nomes). Toda afirmação aqui deve ser conferida contra as fontes listadas abaixo por um
> integrante da equipe **antes** de ser usada como decisão de projeto.

## 0. Fontes usadas e códigos de referência

Nada neste documento vem de fora desta pasta. Os códigos abaixo são usados em toda a rastreabilidade.

| Código | Arquivo | Conteúdo usado |
|---|---|---|
| **[REL]** | `relatorio_engenharia_software.pdf` (7 p.) | Resumo, funcionalidades e prioridades (§7), RF01–RF08 e RNF01–RNF10 (§8), tecnologias (§9), escopo (§10) |
| **[EQP]** | `Equipe e Projeto (1).pdf` | Descrição do sistema e lista das 10 funcionalidades |
| **[UC]** | `Casos De Uso Detalhados.pdf` | UC001 Cadastrar Atividade, UC002 Interagir no Chat, UC003 Anexar Comprovante |
| **[DCU]** | `Diagrama Caso de Uso HABITUS (1) (1).jpg` | Atores (Membro, Líder/Admin do grupo, Sistema) e casos de uso |
| **[DC]** | `Diagrama de Classes HABITUS.png` | Entidades, atributos e relacionamentos |
| **[FIG]** | `Telas-Engenharia/*.jpeg` (17 imagens) | Telas (tabela da seção 3) |
| **[PRM]** | `prompt_final.txt` | Instruções desta tarefa |

`Telas-Engenharia.zip` contém as mesmas telas da pasta extraída (não foi aberto separadamente).

## 1. Visão geral e decisões de tecnologia

Aplicação web (REL §3.2), SPA em React + TypeScript que consome futuramente uma API **FastAPI + SQLite** (REL §9, RNF04).

**O que a documentação define:** React, TypeScript, HTML, CSS (REL §9); backend Python/FastAPI/SQLite (REL §9); layout responsivo (RNF01); imagens sob demanda (RNF03); animação de XP (RNF09).

**O que a documentação NÃO define e foi escolhido por mim como recomendação técnica** (precisa de aprovação da equipe):

| Escolha | Papel | Motivo |
|---|---|---|
| Vite | Build/dev server | Padrão atual para SPA React sem SSR |
| React Router 7 | Rotas (uma por tela do Figma) + code splitting por rota | Ajuda RNF02/RNF03 |
| TanStack Query | "Estado do servidor": cache, loading, erro, invalidação após mutações | Evita duplicar fetch em `useEffect`; troca mock→API sem mexer nas telas |
| lucide-react | Ícones | Os ícones do Figma não foram exportados |
| Vitest | Testes unitários | Só há um teste (validação da prova de conclusão) |
| CSS puro com variáveis | Estilo | Sem biblioteca de UI; tokens em um arquivo |

Gráficos são SVG feito à mão (3 tipos: linha, rosca, rosca de %).

## 2. Estrutura de pastas

```
habitus-frontend/
  docs/ARQUITETURA.md          (este arquivo)
  src/
    app/                       paths.ts (rotas = telas do Figma), router.tsx (lazy por rota), providers.tsx
    api/                       http.ts (cliente fetch único), endpoints.ts (TODOS os caminhos, provisórios)
    config/                    env.ts (VITE_API_URL, VITE_USE_MOCKS), regras.ts (limites citando a fonte)
    types/domain.ts            modelos TypeScript, cada campo marcado [DC] / [UC] / [FIG]
    services/                  funções de dados: auth, atividades, grupos, outros (ranking, loja, etc.)
    mocks/db.ts                dados transcritos das telas (só até existir backend)
    hooks/queries.ts           hooks do TanStack Query + mutações + chaves de cache
    components/
      layout/                  AppLayout (Sidebar+Topbar+Rodapé), AuthLayout
      ui/                      kit.tsx (Progress, Avatar, Stat, Banner, Panel, Chips, Toggle, Dialog, Consulta),
                               charts.tsx, icons.tsx
    features/                  uma pasta por área (telas + componentes próprios)
      auth/ inicio/ tarefas/ guildas/ desafios/ ranking/ perfil/ conquistas/
      progresso/ loja/ notificacoes/ configuracoes/ rewards/ settings/
    lib/                       format.ts, validarProva.ts (+ teste)
    styles/                    tokens.css, base.css, components.css, layout.css, paginas.css
```

Por que assim: `features/` agrupa por funcionalidade (cada item da lista de [EQP]); `services/` + `api/` isolam o backend para que trocar mock por FastAPI altere só essas camadas; `types/domain.ts` espelha o [DC].
Quando uma `features/<x>` crescer, mover os hooks de `hooks/queries.ts` para dentro dela.

## 3. Telas do Figma → rotas → código

| Tela [FIG] (arquivo `WhatsApp Image 2026-10-19 at …`) | Rota | Código | Requisito |
|---|---|---|---|
| Bem-vindo(a)! (`21.12.01.jpeg`) | `/` | `auth/BoasVindasPage` | RF01 |
| Login (`21.12.01 (1)`) | `/entrar` | `auth/LoginPage` | RF01, UC "Fazer Login" [DCU] |
| Crie sua conta (`21.11.58 (3)`) | `/cadastrar` | `auth/CadastroPage` | RF01, UC "Criar Conta" [DCU] |
| Início (`21.12.00 (3)`) | `/inicio` | `inicio/InicioPage` | RF05, RF06, RF07, RF08, RNF08 |
| Minhas Tarefas (`21.11.57`) | `/tarefas` | `tarefas/MinhasTarefasPage` | RF05 |
| Criar tarefa (`21.11.59 (2)`) | `/tarefas/nova` | `tarefas/CriarTarefaPage` | UC001 |
| Detalhes da tarefa (`21.12.00`) | `/tarefas/:id` | `tarefas/DetalheTarefaPage` | RF05 |
| Minha Guilda (`21.12.01 (3)`) | `/guilda` | `guildas/MinhaGuildaPage` | RF03, RF07 |
| Explorar Guildas (`21.12.00 (2)`) | `/guildas` | `guildas/ExplorarGuildasPage` | RF03 |
| Desafios da guilda (`21.11.59 (3)`) | `/desafios` | `desafios/DesafiosPage` | só no Figma |
| Ranking (`21.11.58 (2)`) | `/ranking` | `ranking/RankingPage` | RF08 |
| Meu perfil (`21.12.00 (1)`) | `/perfil` | `perfil/PerfilPage` | RF04 |
| Conquistas (`21.11.59 (1)`) | `/conquistas` | `conquistas/ConquistasPage` | só no Figma |
| Progresso e Níveis (`21.11.58`) | `/progresso` | `progresso/ProgressoPage` | Funcionalidade 10 [EQP] |
| Loja de Prêmios (`21.12.01 (2)`) | `/loja` | `loja/LojaPage` | Funcionalidade 7 [EQP] |
| Notificações (`21.11.58 (1)`) | `/notificacoes` | `notificacoes/NotificacoesPage` | só no Figma |
| Configurações (`21.11.59`) | `/configuracoes` | `configuracoes/ConfiguracoesPage` | só no Figma |

Navegação lateral, cabeçalho ("Olá, Ronald!", busca, sino, avatar) e rodapé são comuns a todas as telas autenticadas do Figma → `components/layout/AppLayout`.
Todas as rotas autenticadas ficam atrás de `ProtectedRoute` (pré-condição "usuário autenticado" em UC001–UC003).

## 4. Fluxo de dados

```
Tela (features/*)
  └─ hook (hooks/queries.ts, TanStack Query)        cache, loading, erro, invalidação
       └─ service (services/*.ts)                   if (env.useMocks) mocks/db.ts  else  api/http.ts
            └─ api/http.ts + api/endpoints.ts       fetch → FastAPI   (Bearer token — suposição)
Estado global: AuthContext (sessão) · AparenciaContext (tema/cor) · RewardContext (toasts de XP/nível)
```

Exemplo — check-in com prova (UC003 / RF05 / RF06):
`Fazer check-in` → (opcional) escolher imagem → `validarProva` (JPG/PNG, ≤ 10 MB) → `useCheckIn` → `fazerCheckIn()` (multipart) →
sucesso: invalida tarefas, nível da Sidebar, guilda, progresso, mural e ranking; `RewardContext` mostra "+N XP" (RNF09).
O cálculo de XP/nível é do backend (RF02, RNF07); o frontend só exibe.

## 5. Lacunas e conflitos encontrados (leitura obrigatória)

Pelo critério do [PRM] (não inventar), cada item abaixo é algo que os materiais **não** definem ou definem de forma contraditória.
Coluna "Tratamento" = o que o código faz hoje; **todos precisam de decisão humana.**

### 5.1 Conflitos entre fontes

| # | Conflito | Tratamento atual |
|---|---|---|
| C1 | Chat: [REL §10] diz "O grupo não terá um chat privado", mas [UC] UC002 e [DCU] têm "Interagir no Chat". O Figma não tem tela de chat (só campo de mensagem no Mural da Guilda e a notificação "Nova mensagem da guilda"). | Chat (UC002) **não implementado**; mural com publicação de texto implementado. |
| C2 | Itens consumíveis: [REL §10] exclui "compra de itens consumíveis"; [DCU] tem "Usar itens consumível" e [DC] tem `ItemConsumivel` (funcionalidade 10 de [REL] é "Futura"). Sem tela no Figma. | Apenas o conceito no modelo; **sem UI**. |
| C3 | Prova de conclusão: [UC] UC003 cita "ex.: JPG/PNG, máx. 5 MB"; [REL] RNF06 exige 10 MB e .jpg/.png. | Adotado RNF06 (10 MB) em `config/regras.ts`. |
| C4 | Lembretes: [REL §10] "não enviará e-mails de lembrete diários", mas o Figma tem "Lembretes diários", "Tarefas e lembretes" e passo 5 "Lembretes" em Criar tarefa. | UI feita; horário salvo só no navegador. Semântica pendente. |
| C5 | Moeda: [DC] `Personagem.moedasOuro`; a Loja do Figma fala em "pontos" e mostra 2.430 — o mesmo valor do XP total. Não está dito se pontos = XP gasto, ouro ou outra coisa. | Tipo usa `moedasOuro`; texto da UI usa "pontos". |
| C6 | Campos de Atividade: [DC]/[UC001] têm `dataFim`, `dificuldade`, `atributoRPG`, `xpRecompensa`. O formulário do Figma não tem nenhum desses; tem categoria, meta, duração e lembrete (que não estão no [DC]). A dica do Figma "Defina um bom valor de XP" não tem campo. | Formulário segue o Figma; `xpRecompensa` fica 100 (exibido na prévia) e o backend deve decidir. |
| C7 | Prioridade × Figma: Ranking/Ligas e Streaks são "Futura" em [REL §7], mas há tela completa de Ranking. Punição Compartilhada ("Futura") não tem tela. | Ranking implementado conforme o Figma; punição não implementada. |
| C8 | Vocabulário: Grupo ([DC]) × Guilda (Figma, RF03 "grupos/guildas"); Atividade ([DC]) × Tarefa/Hábito/Meta ([UC], Figma). | Tipos seguem o [DC]; textos da interface seguem o Figma. |

### 5.2 Telas/fluxos com requisito mas sem tela (ou tela sem requisito)

| # | Item | Situação |
|---|---|---|
| L1 | **Adicionar amigos** ([EQP] #3, [DCU], [DC] `amigoDe`) | Sem tela. Não implementado. |
| L2 | **Criar guilda / entrar por código** ([REL §10] está no escopo; [DCU] "Criar grupo") | Figma só tem o botão "+ Criar Guilda" (desativado) e "Ver detalhes" sem fluxo de entrada. Convite: modal mostra `codigoConvite`. |
| L3 | **Gerenciar grupo** (Líder/Admin: `promoverAdmin`, `removerMembro`) | Sem tela. |
| L4 | **Desafios, Conquistas, Notificações, nomes de nível (Iniciante…Lenda)** | Têm tela, mas **não existem** no [DC] nem nos casos de uso. Os tipos em `domain.ts` foram deduzidos só das telas. |
| L5 | Login social (Google/Apple/Microsoft), integrações (Google/Discord/Strava), 2FA, alterar senha, exportar dados, excluir conta, "Esqueceu sua senha?" | Aparecem no Figma, não nos requisitos. Botões presentes e **desativados**. |
| L6 | Editar tarefa / editar descrição / alterar capa e foto | Botões no Figma; fluxo não definido ([DC] só cita `editarAtividade()`). Desativados. |
| L7 | Telas de detalhe de desafio, de guilda, de conquista | Botões "Ver detalhes" sem tela. |
| L8 | Calendário de Tarefas | No Figma é só um retângulo cinza. Implementado calendário mensal simples **sem dados**. |
| L9 | Busca global do topo | Só o placeholder no Figma; sem comportamento definido. Campo existe e não faz nada. |

### 5.3 Regras que o frontend precisaria e não estão definidas

Fórmula de XP, streak e multiplicadores; XP por nível (só se vê 2.430/3.000 no nível 4); como se calcula o "% de progresso" de uma tarefa; critério que separa "Tarefas de hoje" de "Outras tarefas"; quando uma tarefa fica "Atrasada"; como funciona check-in em frequência semanal/mensal/personalizada; limite real de atividades ativas ([UC001] diz só "ex.: 10"); regra de força de senha (Figma mostra "Boa"); valores de `statusValidacao` e `tipoEvento`; janelas "Geral/Mensal" do Ranking; opções dos filtros "Nível de guilda" e "Membros"; opções do filtro "Todos os usuários".
Tratamento: os valores aparecem como constantes/heurísticas **marcadas como provisórias** em `config/regras.ts`, `CadastroPage` (força da senha), `CriarTarefaPage` (limite 10) e filtros.

### 5.4 Contrato com o backend

Não há: endpoints, formato JSON (camelCase do [DC] ou snake_case do Python), autenticação (JWT? sessão? cookie?), onde guardar o token, paginação, formato de erro, upload multipart.
Tratamento: todos os caminhos estão em `src/api/endpoints.ts` (provisórios); autenticação "Bearer" em `api/http.ts` é suposição; token em `sessionStorage` é placeholder (`AuthContext`).
Quando o FastAPI publicar o OpenAPI, ajustar **apenas** `endpoints.ts`, `http.ts` e (se necessário) um mapeador snake_case↔camelCase.

### 5.5 Design

O arquivo Figma (.fig / Dev Mode) **não** foi fornecido; só capturas JPEG (via WhatsApp). Consequências: cores e espaçamentos são **aproximados** (`styles/tokens.css`); logo, ilustrações, fotos de capa/avatar e ícones de guildas/conquistas **não** foram exportados — usei degradês e ícones genéricos (`components/ui/icons.tsx`, `AuthLayout`); a fonte não é identificável (usei pilha do sistema); só há layouts desktop (~1440×900) — o comportamento mobile (RNF01) foi **inferido** por mim.

### 5.6 Incoerências entre telas do Figma (e erros de texto)

- Invictus: nível 3 e 835 XP em Explorar Guildas × nível 5 e 5.505 XP em Minha Guilda/Ranking.
- Progresso das tarefas: Início (70% / Concluído / 90%) × Minhas Tarefas (100% / 50% / 25%) para as mesmas tarefas; "120 XP conquistados hoje" não bate com a tarefa concluída (+100 XP).
- Loja: "Resgatar" aparece ativo para itens de 3.000 e 2.500 pontos com saldo de 2.430. Implementei a regra lógica (só habilita com saldo suficiente).
- Tela de login com título "Crie sua conta" (usei "Entre na sua conta"); "Estratégia" onde o nível se chama "Estrategista"; "crie um nova", "somandas", "desadio" e textos sem acento ("Proximos", "Concluidos", "Historico") — corrigidos no texto; subtítulos de Desafios e Conquistas repetem a frase de Explorar Guildas (mantidos como no Figma).
- Categoria "Diversão" aparece numa guilda (SUN) mas não na lista de categorias.

## 6. Cobertura dos requisitos

| Requisito [REL] | Frontend | Situação |
|---|---|---|
| RF01 cadastro/login | `auth/*` | Telas e validação feitas; **backend simulado** |
| RF02 cálculo de pontuação | exibição de XP/nível | Cálculo é do backend |
| RF03 grupos/guildas | Minha Guilda, Explorar, convite | **Parcial** (L1–L3) |
| RF04 perfil | `PerfilPage` | Texto editável; foto/capa pendentes |
| RF05 check-in | Início, Minhas Tarefas, Detalhe | Feito |
| RF06 prova de conclusão | `CheckInDialog`, `InicioPage` | UI e validação feitas; **upload real não testado** |
| RF07 mural | `MuralFeed` | Ler e publicar texto |
| RF08 leaderboard | `RankingPage` | Feito (dados simulados) |
| RNF01 responsivo | `styles/layout.css`, `paginas.css` | Breakpoints 1200/1024/900/760/600; conferido em 800 px |
| RNF02 posts ≤ 7 s | `TIMEOUT_MURAL_MS` no cliente HTTP | Só vale com API real |
| RNF03 imagens sob demanda | `loading="lazy"` no Avatar; code splitting por rota | Feito (há poucas imagens hoje) |
| RNF04/05/10 | — | Backend |
| RNF06 10 MB / jpg-png | `lib/validarProva.ts` + teste | Feito no cliente (backend também valida) |
| RNF07 ≤ 2000 ms | — | Backend; o frontend só espera a resposta |
| RNF08 check-in com foto ≤ 4 cliques | Início: anexar → escolher → check-in (3) | Desenhado; **seletor de arquivo não foi exercitado no navegador** |
| RNF09 animação de XP/ranking | `RewardContext` | "+XP" e "subiu de nível" funcionam; "subiu no ranking" existe como função mas **nada a dispara** (não há dado do backend sobre mudança de posição) |

## 7. Conectar ao backend FastAPI

1. Copiar `.env.example` para `.env`; definir `VITE_API_URL` e `VITE_USE_MOCKS=false`.
2. Alinhar com o backend: autenticação, formato JSON e erros; ajustar `api/endpoints.ts` e `api/http.ts`.
3. Habilitar CORS no FastAPI para a origem do Vite (`http://localhost:5173`).
4. Implementar no backend os contratos que não existem no [DC] (Desafio, Conquista, Notificação, níveis) — ver L4.
5. Remover `src/mocks/` quando todas as chamadas estiverem reais.

## 8. O que foi verificado e o que não foi

**Verificado (nesta máquina):** `tsc` sem erros; `vitest` 3/3; `vite build` ok; no navegador (dados simulados): login → Início; as 14 rotas autenticadas renderizam sem erro de console; check-in sem foto atualiza tarefa, XP (2.430→2.580) e exibe "+150 XP"; layout a 800 px com menu recolhido.
Segunda rodada: **cadastro** (6 erros de campo vazio, senhas divergentes barradas, força de senha reage, sucesso cria sessão e vai ao Início); **Criar tarefa** (erro de nome vazio, prévia ao vivo, tarefa aparece em Minhas Tarefas); **prova de conclusão** (PDF e arquivo de 11 MB recusados com mensagem; PNG válido gera prévia; check-in conclui a tarefa, exibe "+100 XP" e publica no Mural da Guilda — pós-condição do UC003). Defeito encontrado e corrigido: o mock ignorava o usuário recém-cadastrado na Sidebar/mural.
**Limite de teste:** o arquivo foi injetado por script no `<input type="file">` (o seletor nativo do sistema não é controlável pela ferramenta); a lógica de validação e envio foi exercida, mas não o diálogo do SO.
**Não verificado:** limite de atividades ativas (UC001 6a) no navegador; tema escuro; navegação por teclado/leitor de tela; qualquer integração com backend; comparação pixel a pixel com o Figma.

## 9. Próximos passos sugeridos

1. Equipe decidir C1–C8 e L1–L9 (seções 5.1–5.2) — principalmente chat, amigos, criar/entrar em guilda.
2. Obter o arquivo Figma/Dev Mode e exportar assets e tokens.
3. Definir contrato OpenAPI com o backend (seção 5.4).
4. Definir as regras da seção 5.3.
