import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ErroRota } from './ErroRota';
import { PATHS, type HandleRota } from './paths';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth/ProtectedRoute';

/** Carregamento por rota (code splitting) — contribui para o desempenho exigido em RNF02/RNF03. */
const pagina = (importar: () => Promise<Record<string, unknown>>, nome: string) => async () => ({
  Component: (await importar())[nome] as React.ComponentType,
});

const h = (handle: HandleRota) => handle;

const rotas = [
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: PATHS.boasVindas, lazy: pagina(() => import('@/features/auth/BoasVindasPage'), 'BoasVindasPage') },
      { path: PATHS.entrar, lazy: pagina(() => import('@/features/auth/LoginPage'), 'LoginPage') },
      { path: PATHS.cadastrar, lazy: pagina(() => import('@/features/auth/CadastroPage'), 'CadastroPage') },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: PATHS.inicio, handle: h({ subtitulo: 'Continue sua jornada e conquiste mais XP!' }), lazy: pagina(() => import('@/features/inicio/InicioPage'), 'InicioPage') },
          { path: PATHS.tarefas, handle: h({ subtitulo: 'Organize suas tarefas e evolua um dia de cada vez.' }), lazy: pagina(() => import('@/features/tarefas/MinhasTarefasPage'), 'MinhasTarefasPage') },
          { path: PATHS.novaTarefa, handle: h({ subtitulo: 'Crie uma tarefa nova e evolua um hábito de cada vez.' }), lazy: pagina(() => import('@/features/tarefas/CriarTarefaPage'), 'CriarTarefaPage') },
          { path: '/tarefas/:id', handle: h({ subtitulo: 'Crie uma tarefa nova e evolua um hábito de cada vez.' }), lazy: pagina(() => import('@/features/tarefas/DetalheTarefaPage'), 'DetalheTarefaPage') },
          { path: PATHS.minhaGuilda, handle: h({ subtitulo: 'Juntos somos mais fortes! Veja como está a sua guilda.' }), lazy: pagina(() => import('@/features/guildas/MinhaGuildaPage'), 'MinhaGuildaPage') },
          { path: PATHS.guildas, handle: h({ subtitulo: 'Encontre uma guilda que combina com você e evolua junto com outras pessoas!' }), lazy: pagina(() => import('@/features/guildas/ExplorarGuildasPage'), 'ExplorarGuildasPage') },
          { path: PATHS.desafios, handle: h({ subtitulo: 'Encontre uma guilda que combina com você e evolua junto com outras pessoas!' }), lazy: pagina(() => import('@/features/desafios/DesafiosPage'), 'DesafiosPage') },
          { path: PATHS.ranking, handle: h({ subtitulo: 'Veja que está se destacando e inspire-se para conquistar mais.' }), lazy: pagina(() => import('@/features/ranking/RankingPage'), 'RankingPage') },
          { path: PATHS.perfil, handle: h({ titulo: 'Meu perfil', subtitulo: 'Visualize e edite suas informações pessoais.' }), lazy: pagina(() => import('@/features/perfil/PerfilPage'), 'PerfilPage') },
          { path: PATHS.conquistas, handle: h({ subtitulo: 'Encontre uma guilda que combina com você e evolua junto com outras pessoas!' }), lazy: pagina(() => import('@/features/conquistas/ConquistasPage'), 'ConquistasPage') },
          { path: PATHS.progresso, handle: h({ subtitulo: 'Acompanhe sua evolução, seja seu nível e descubra o que vem pela frente!' }), lazy: pagina(() => import('@/features/progresso/ProgressoPage'), 'ProgressoPage') },
          { path: PATHS.loja, handle: h({ subtitulo: 'Troque seus pontos por recompensas e personalize sua jornada.' }), lazy: pagina(() => import('@/features/loja/LojaPage'), 'LojaPage') },
          { path: PATHS.notificacoes, handle: h({ subtitulo: 'Fique por dentro das novidades, atividades e conquistas.' }), lazy: pagina(() => import('@/features/notificacoes/NotificacoesPage'), 'NotificacoesPage') },
          { path: PATHS.configuracoes, handle: h({ subtitulo: 'Ajuste suas preferências e personalize sua experiência no Habitus.' }), lazy: pagina(() => import('@/features/configuracoes/ConfiguracoesPage'), 'ConfiguracoesPage') },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={PATHS.boasVindas} replace /> },
];

// Rota-raiz sem caminho: só serve para aplicar o errorElement a todas as telas.
export const router = createBrowserRouter([{ errorElement: <ErroRota />, children: rotas }]);
