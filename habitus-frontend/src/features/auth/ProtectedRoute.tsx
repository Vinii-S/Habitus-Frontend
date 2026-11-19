import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PATHS } from '@/app/paths';
import { useAuth } from './AuthContext';

/** Todos os casos de uso (UC001–UC003) têm como pré-condição "usuário autenticado". */
export function ProtectedRoute() {
  const { sessao } = useAuth();
  const loc = useLocation();
  return sessao ? <Outlet /> : <Navigate to={PATHS.entrar} replace state={{ de: loc.pathname }} />;
}

/** Telas públicas redirecionam para o Início quando já há sessão. */
export function PublicOnlyRoute() {
  const { sessao } = useAuth();
  return sessao ? <Navigate to={PATHS.inicio} replace /> : <Outlet />;
}
