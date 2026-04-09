// src/components/SignupForm.jsx
import '../styles/signup.css'

export default function SignupForm() {
  return (
    <div className="container">
      {
        <form>
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Email</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            <div id="emailHelp" class="form-text">Nós nunca compartilhamos seu email com ninguém</div>
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Senha</label>
            <input type="password" class="form-control" id="exampleInputPassword1" />
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
        </form>
      }
    </div>
  )
}