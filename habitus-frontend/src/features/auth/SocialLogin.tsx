/**
 * Botões Google / Apple / Microsoft presentes nas telas de login. A documentação NÃO especifica login
 * social (RF01 fala apenas em "cadastro e login de usuário"), então ficam desativados até haver decisão.
 */
export function SocialLogin() {
  return (
    <>
      <div className="divider">ou</div>
      <div className="social">
        {['Google', 'Apple', 'Microsoft'].map((n) => (
          <button key={n} type="button" disabled title="Login social ainda não especificado na documentação" aria-label={`Entrar com ${n}`}>
            {n[0]}
          </button>
        ))}
      </div>
    </>
  );
}
