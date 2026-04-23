import '../styles/signin.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom'

export default function SigninForm() {
  return (
    <div className="container-fluid signin-wrapper">
      <div className="row justify-content-center align-items-center min-vh-100">

        <div className="col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3">
          <div className="signin-form">

            <h4 className="text-warning fw-bold text-center mb-4">
              🧙 Bem-vindo, Aventureiro(a)
            </h4>

            <div className="mb-3">
              <label htmlFor="signin-email" className="form-label title-label">Email:</label>
              <input
                type="email"
                className="form-control"
                id="signin-email"
                placeholder="Digite seu email"
                aria-describedby="emailDisclaimer"
              />
              <span id="emailDisclaimer" className="span-disclaimer">
                Nós nunca compartilhamos seu email com ninguém
              </span>
            </div>

            <div className="mb-4">
              <label htmlFor="signin-password" className="form-label title-label">Senha:</label>
              <input
                type="password"
                className="form-control"
                id="signin-password"
                placeholder="Digite sua senha"
              />
              <span className="span-disclaimer">
                Mínimo 8 caracteres, letras maiúsculas e minúsculas
              </span>
            </div>

            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-warning fw-bold">
                ⚔ Entrar
              </button>
            </div>

            <div className="text-center">
              <Link to="/signup" className="icon-link icon-link-hover text-warning small">
                Não tenho cadastro
                <svg xmlns="http://www.w3.org/2000/svg" className="bi" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}