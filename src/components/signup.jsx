// src/components/SignupForm.jsx
import '../styles/signup.css'
import 'bootstrap/dist/css/bootstrap.min.css'
export default function SignupForm() {
  return (
    <div className="container">
      <div className="col-12">
        <div className="col-8 d-flex justify-content-center align-items-center signup-form-box">
          <div className="signup-form">
            <div className="mb-3">
              <label for="exampleInputEmail1" className="d-flex justify-content form-label">Email:</label>
              <input 
              type="email" 
              className="form-control" 
              id="exampleInputEmail1"
              placeholder="Digite seu email:" 
              aria-describedby="emailHelp" 
              />
              <span id="emailDisclaimer" className="d-flex justify-content form-text">Nós nunca compartilhamos seu email com ninguém</span>
            </div>
            <div className="mb-3">
                <label for="exampleInputPassword" className="d-flex justify-content form-label">Senha:</label>
                <input 
                type="password" 
                className="form-control"
                placeholder="Digite sua senha:"
                id="exampleInputPassword" 
                />
                <span id="passwordDisclaimer" className="d-flex justify-content form-text">
                  A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números.
                </span>
            </div>
            <div className= "col-12 d-flex justify-content-center gap-4">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
            <div className= "col-12 d-flex justify-content-center gap-4 button-esqueci">
              <a class="icon-link icon-link-hover" href="#">
                <h6 id="signup">Não tenho cadastro</h6>
                <svg xmlns="http://www.w3.org/2000/svg" class="bi" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}