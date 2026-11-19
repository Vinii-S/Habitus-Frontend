import { useRouteError } from 'react-router-dom';

/**
 * Tela de erro de rota. Caso típico em desenvolvimento: o servidor Vite foi encerrado com a aba aberta e
 * o carregamento sob demanda da página falha ("Failed to fetch dynamically imported module").
 */
export function ErroRota() {
  const erro = useRouteError();
  const falhaDeCarregamento = erro instanceof TypeError && /dynamically imported module/i.test(erro.message);
  return (
    <div className="state" role="alert" style={{ maxWidth: 480, margin: '80px auto' }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Não foi possível carregar esta página</h1>
      <p>
        {falhaDeCarregamento
          ? 'A conexão com o servidor foi perdida. Verifique se o servidor está rodando (npm run dev) ou sua conexão e tente novamente.'
          : 'Ocorreu um erro inesperado.'}
      </p>
      <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => location.assign('/')}>
        Recarregar
      </button>
    </div>
  );
}
