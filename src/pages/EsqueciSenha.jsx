import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Auth.module.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Por enquanto só a tela: o envio do e-mail depende do backend.
export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setError("Digite um e-mail válido, como voce@email.com.");
      return;
    }
    setError("");
    setSentTo(value);
  }

  return (
    <div className={styles.single}>
      <Link to="/" className={styles.singleLogoLink}>
        <img src="/ui/logo.png" alt="Level Up" className={`${styles.singleLogo} pixel-img`} />
      </Link>

      <div className={`panel ${styles.signupForm} ${styles.narrow}`}>
        {sentTo ? (
          <div role="status" className={styles.sent}>
            <img src="/ui/pergaminho.png" alt="" className={`${styles.sentIcon} pixel-img`} />
            <h1 className={styles.signupTitle}>Confira seu e-mail</h1>
            <p className="lead">
              Se existir uma conta com <strong>{sentTo}</strong>, enviamos um link para criar uma nova senha. O link é válido por 1 hora.
            </p>
            <p className={styles.hint}>Não recebeu? Verifique a caixa de spam ou tente novamente em alguns minutos.</p>
            <div className={styles.sentActions}>
              <Link to="/entrar" className={`btn btn-primary ${styles.submit}`}>Voltar para entrar</Link>
              <button type="button" className="btn" onClick={() => setSentTo(null)}>Usar outro e-mail</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className={styles.stack}>
            <div>
              <h1 className={styles.signupTitle}>Esqueceu a senha?</h1>
              <p className="lead">Digite o e-mail da sua conta. Enviaremos um link para você criar uma nova senha.</p>
            </div>
            <div className="field">
              <label htmlFor="es-email" className="field-label">E-mail</label>
              <input
                id="es-email"
                className={`px-input ${styles.input}`}
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "es-erro" : undefined}
              />
              {error && <p id="es-erro" className="field-error">{error}</p>}
            </div>
            <button type="submit" className={`btn btn-primary ${styles.submit}`}>Enviar link</button>
            <p className={styles.switch}>Lembrou a senha? <Link to="/entrar">Entrar</Link></p>
          </form>
        )}
      </div>
    </div>
  );
}
