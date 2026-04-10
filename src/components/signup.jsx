// src/components/SignupForm.jsx
import '../styles/signup.css'
import 'bootstrap/dist/css/bootstrap.min.css'
export default function SignupForm() {
  return (
    <div className="container">
      <div className="col-12">
        <div className="mb-3">
          <label for="exampleInputEmail1" className="d-flex justify-content form-label">Email:</label>
          <input 
          type="email" 
          className="form-control" 
          id="exampleInputEmail1"
          placeholder="Digite seu email:" 
          aria-describedby="emailHelp" 
          />
          <div id="emailHelp" className="d-flex justify-content form-text">Nós nunca compartilhamos seu email com ninguém</div>
        </div>
        <div className="mb-3">
            <label for="exampleInputPassword1" className="d-flex justify-content form-label">Senha:</label>
            <input 
            type="password" 
            className="form-control"
            placeholder="Digite sua senha:"
            id="exampleInputPassword1" 
            />
        </div>
        <div className= "col-12 d-flex justify-content-center gap-4">
          <button type="submit" className="btn btn-primaryg">Login</button>
          <button type="submit" className="btn btn-primary">Não tenho cadastro</button>
        </div>
      </div>
    </div>
  )
}