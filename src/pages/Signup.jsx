import '../styles/signup.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function SignupForm() {
  return (
    <div className="container-fluid signup-wrapper">
      <div className="row justify-content-center align-items-center min-vh-100">

        <div className="col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3">
          <div className="signup-form">
            
            <div className="title-signup">
              <h4 className="text-warning fw-bold text-center mt-2">
                📜 Toda lenda começou de algum lugar...
              </h4>
              <h4 className="text-warning fw-bold text-center mb-3">
                A sua começa aqui 📜
              </h4>
              <div className="choose-class">
                <h6 className="text-choice mb-0">
                  Escolha sua classe para começar a aventura:
                </h6>
              </div>
              
              <div className="d-flex justify-content-center gap-3 mt-2">
                <button className="btn btn-outline-warning btn-sm btn-choice">Guerreiro ⚔️</button>
                <button className="btn btn-outline-warning btn-sm btn-choice">Mago 🔮</button>
                <button className="btn btn-outline-warning btn-sm btn-choice">Ladino 🏹</button>
              </div>
            
            </div>

            <div className="mb-3">
              <label htmlFor="signup-email" className="form-label title-label">Email:</label>
              <input
                type="email"
                className="form-control"
                id="signup-email"
                placeholder="Digite seu email"
                aria-describedby="emailDisclaimer"
              />
              <span id="emailDisclaimer" className="form-text span-disclaimer">
                Nós nunca compartilhamos seu email com ninguém
              </span>
            </div>

            <div className="mb-4 signup-passwords">
              <label htmlFor="signup-password" className="form-label title-label">Criar senha:</label>
              <input
                type="password"
                className="form-control"
                id="signup-password"
                placeholder="Digite sua senha"
              />

              <span className="form-text span-disclaimer">
                Mínimo 8 caracteres, letras maiúsculas e minúsculas
              </span>

              <label htmlFor="signup-confirm-password" className="form-label title-label mt-3">
                Confirmar Senha:
              </label>
              <input
                type="password"
                className="form-control"
                id="signup-password"
                placeholder="Digite sua senha novamente"
              />
            </div>

            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-warning fw-bold">
                ⚔ Começar sua jornada ⚔
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}