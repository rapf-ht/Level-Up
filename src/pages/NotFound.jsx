import { Link, useRouteError } from "react-router-dom";

export default function NotFound() {
  const error = useRouteError();

  if (error) {
    console.error(error);
  }

  return (
    <div className="page" style={{ alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "60vh" }}>
            <h1 className="title">Página não encontrada</h1>
      <p className="lead">Talvez o link esteja errado ou a página tenha mudado de lugar.</p>
      <Link to="/home" className="btn btn-primary">Voltar ao início</Link>
    </div>
  );
}
