import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { saveProfile } from "../data/profile";

const px = (x, y, w, h, fill) => ({ x, y, w, h, fill });

const CLASSES = [
  {
    name: "Guerreiro",
    description: "Mais HP, ideal para rotinas puxadas",
    icon: [px(8, 0, 2, 1, "#e9e4da"), px(7, 1, 2, 1, "#e9e4da"), px(6, 2, 2, 1, "#e9e4da"), px(5, 3, 2, 1, "#e9e4da"), px(4, 4, 2, 1, "#e9e4da"), px(1, 5, 1, 1, "#e9c46a"), px(3, 5, 2, 1, "#e9e4da"), px(2, 6, 2, 1, "#e9c46a"), px(1, 7, 2, 1, "#8a5f2c"), px(3, 7, 1, 1, "#e9c46a"), px(0, 8, 2, 1, "#8a5f2c"), px(0, 9, 1, 1, "#8a5f2c")],
  },
  {
    name: "Mago",
    description: "Mais XP em missões de estudo",
    icon: [px(6, 0, 3, 1, "#c58be0"), px(5, 1, 1, 1, "#c58be0"), px(6, 1, 3, 2, "#e3c4f2"), px(9, 1, 1, 2, "#c58be0"), px(6, 3, 3, 1, "#c58be0"), px(5, 4, 1, 1, "#8a5f2c"), px(4, 5, 1, 1, "#8a5f2c"), px(3, 6, 1, 1, "#8a5f2c"), px(2, 7, 1, 1, "#8a5f2c"), px(1, 8, 1, 1, "#8a5f2c"), px(0, 9, 1, 1, "#8a5f2c")],
  },
  {
    name: "Ladino",
    description: "Mais ouro por missão concluída",
    icon: [px(2, 0, 2, 1, "#8a5f2c"), px(4, 1, 1, 1, "#8a5f2c"), px(5, 2, 1, 2, "#8a5f2c"), px(6, 4, 1, 2, "#8a5f2c"), px(5, 6, 1, 2, "#8a5f2c"), px(4, 8, 1, 1, "#8a5f2c"), px(2, 9, 2, 1, "#8a5f2c"), px(2, 1, 1, 8, "#e9e4da"), px(0, 5, 9, 1, "#7cc47a"), px(9, 4, 1, 3, "#7cc47a")],
  },
];

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
          <p className="eyebrow">PASSO 1 DE 1</p>
          <h1 className={styles.signupTitle}>Toda lenda começa em algum lugar</h1>
          <p className="lead">Escolha sua classe e crie sua conta.</p>
        </div>

        <fieldset>
          <legend className={`field-label ${styles.legend}`}>CLASSE</legend>
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
                  <svg width="40" height="40" viewBox="0 0 10 10" shapeRendering="crispEdges" aria-hidden="true">
                    {item.icon.map((r, i) => (
                      <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
                    ))}
                  </svg>
                  <span className={styles.className}>{item.name}</span>
                  <span className={styles.classDescription}>{item.description}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="cd-nome" className="field-label">NOME DO PERSONAGEM</label>
          <input
            id="cd-nome"
            className={`px-input ${styles.input}`}
            type="text"
            placeholder="Como a guilda vai te chamar"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="cd-email" className="field-label">EMAIL</label>
          <input id="cd-email" className={`px-input ${styles.input}`} type="email" placeholder="voce@email.com" autoComplete="email" />
        </div>
        <div className={styles.passwords}>
          <div className={`field ${styles.password}`}>
            <label htmlFor="cd-senha" className="field-label">SENHA</label>
            <input id="cd-senha" className={`px-input ${styles.input}`} type="password" placeholder="••••••••" autoComplete="new-password" aria-describedby="cd-dica" />
          </div>
          <div className={`field ${styles.password}`}>
            <label htmlFor="cd-senha2" className="field-label">CONFIRMAR SENHA</label>
            <input id="cd-senha2" className={`px-input ${styles.input}`} type="password" placeholder="••••••••" autoComplete="new-password" />
          </div>
          <p id="cd-dica" className={styles.hint}>Mínimo de 8 caracteres, com letras maiúsculas e minúsculas.</p>
        </div>

        <button type="submit" className={`btn btn-primary ${styles.submit}`}>Começar aventura</button>
        <p className={styles.switch}>Já tem conta? <Link to="/">Entrar</Link></p>
      </form>
    </div>
  );
}
