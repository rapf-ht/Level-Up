import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

export default function SigninForm() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/home");
  }

  return (
    <div className={styles.split}>
      <section className={styles.brand}>
        <img src="/ui/logo.png" alt="Level Up" className={`${styles.brandLogo} pixel-img`} />
        <p className={styles.brandText}>Transforme suas tarefas em missões e evolua junto com sua guilda.</p>
        <div className={styles.brandHero}>
          <img src="/ui/hero.png" alt="" className="pixel-img" />
          <div className={styles.brandPoints}>
            <span style={{ color: "var(--xp-text)" }}><i style={{ background: "var(--xp)" }} />+10 XP POR MISSÃO</span>
            <span style={{ color: "var(--gold)" }}><i style={{ background: "var(--gold)" }} />OURO PARA O BAZAR</span>
            <span style={{ color: "var(--hp-text)" }}><i style={{ background: "var(--hp)" }} />NÃO PERCA SEU HP</span>
          </div>
        </div>
      </section>

      <section className={styles.formSide}>
        <form className={styles.signinForm} onSubmit={handleSubmit}>
          <div>
            <h1 className={styles.signinTitle}>Bem-vindo de volta, aventureiro</h1>
            <p className="lead">Entre para continuar sua jornada.</p>
          </div>
          <div className="field">
            <label htmlFor="li-email" className="field-label">EMAIL</label>
            <input id="li-email" className={`px-input ${styles.input}`} type="email" placeholder="voce@email.com" autoComplete="email" />
          </div>
          <div className="field">
            <div className={styles.passwordHead}>
              <label htmlFor="li-senha" className="field-label">SENHA</label>
              <Link to="/" className={styles.forgot}>Esqueci a senha</Link>
            </div>
            <input id="li-senha" className={`px-input ${styles.input}`} type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button type="submit" className={`btn btn-primary ${styles.submit}`}>Entrar</button>
          <p className={styles.switch}>Ainda não tem conta? <Link to="/signup">Criar personagem</Link></p>
        </form>
      </section>
    </div>
  );
}
