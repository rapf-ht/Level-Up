import { Link, useRouteError } from 'react-router-dom';

export default function NotFound() {
  const error = useRouteError();
  
  if (error) {
    console.error(error); 
  }

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>Oops! 😢</h1>
      <p>Desculpe, a página que você procura não existe ou ocorreu um erro.</p>
      
      <p style={{ color: 'gray' }}>
        <i>{error?.statusText || error?.message || "404 - Página não encontrada"}</i>
      </p>

      <Link to="/" style={{ marginTop: '20px', display: 'inline-block' }}>
        Voltar para a Página Inicial
      </Link>
    </div>
  );
}