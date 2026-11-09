import { Link, useRouteError } from "react-router-dom";

export default function NotFound() {
  const error = useRouteError();

  if (error) {
    console.error(error);
  }

  return (
    <div className="page" style={{ alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "60vh" }}>
      <p className="eyebrow">ERRO 404</p>
      <h1 className="title">Caminho não encontrado</h1>
      <p className="lead">Esta página não existe ou ocorreu um erro ao abri-la.</p>
      <Link to="/home" className="btn btn-primary">Voltar ao início</Link>
    </div>
  );
}
