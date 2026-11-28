import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { saveProfile } from "../data/profile";
import { CLASSES } from "../data/classes";
import { ClassIcon } from "../components/ClassIcon";

export default function SignupForm() {
  const navigate = useNavigate();
  const [playerClass, setPlayerClass] = useState(CLASSES[0].name);
  const [name, setName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    saveProfile({ playerClass, ...(name.trim() ? { name: name.trim() } : {}) });
    navigate("/home");
  }

  return (
    <div className={styles.single}>
      <Link to="/" className={styles.singleLogoLink}>
        <img src="/ui/logo.png" alt="Level Up" className={`${styles.singleLogo} pixel-img`} />
      </Link>

      <form className={`panel ${styles.signupForm}`} onSubmit={handleSubmit}>
        <div>
          <h1 className={styles.signupTitle}>Toda lenda começa em algum lugar</h1>
          <p className="lead">Escolha sua classe e crie sua conta.</p>
        </div>

        <fieldset>
          <legend className={`field-label ${styles.legend}`}>Classe</legend>
          <div className={styles.classes}>
            {CLASSES.map((item) => {
              const selected = playerClass === item.name;
              return (
                <label key={item.name} className={`${styles.classCard} ${selected ? styles.classSelected : ""}`}>
                  <input
                    type="radio"
                    name="classe"
                    className="sr-only"
                    checked={selected}
                    onChange={() => setPlayerClass(item.name)}
                  />
                  <ClassIcon playerClass={item} />
                  <span className={styles.className}>{item.name}</span>
                  <span className={styles.classDescription}>{item.description}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="cd-nome" className="field-label">Nome do personagem</label>
          <input
            id="cd-nome"
            className={`px-input ${styles.input}`}
            type="text"
            placeholder="Nome que aparecerá na guilda"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="cd-email" className="field-label">E-mail</label>
          <input id="cd-email" className={`px-input ${styles.input}`} type="email" placeholder="voce@email.com" autoComplete="email" />
        </div>
        <div className={styles.passwords}>
          <div className={`field ${styles.password}`}>
            <label htmlFor="cd-senha" className="field-label">Senha</label>
            <input id="cd-senha" className={`px-input ${styles.input}`} type="password" placeholder="••••••••" autoComplete="new-password" aria-describedby="cd-dica" />
          </div>
          <div className={`field ${styles.password}`}>
            <label htmlFor="cd-senha2" className="field-label">Confirmar senha</label>
            <input id="cd-senha2" className={`px-input ${styles.input}`} type="password" placeholder="••••••••" autoComplete="new-password" />
          </div>
          <p id="cd-dica" className={styles.hint}>Mínimo de 8 caracteres, com letras maiúsculas e minúsculas.</p>
        </div>

        <button type="submit" className={`btn btn-primary ${styles.submit}`}>Começar aventura</button>
        <p className={styles.switch}>Já tem conta? <Link to="/entrar">Entrar</Link></p>
      </form>
    </div>
  );
}
