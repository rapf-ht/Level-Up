import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { CustomCheckbox } from "../components/CustomCheckbox";
import { Calendar } from "../components/Calendar";
import { useState } from "react";

export default function Home() {
  let [showLayout, setShowLayout] = useState(true);

  let name = "Dev_Br";
  let level = 4;
  let xp = 40;
  let hp = 80;

  function alteraVisibilidade() {
    setShowLayout(!showLayout);
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.backgroundGif}>
        <button className={styles.btnHideUI} onClick={alteraVisibilidade}>
          {showLayout ? "Ocultar Interface" : "Mostrar Interface"}
        </button>
        <img className={styles.animatedAvatar} src="/avatar.png" alt="avatar" />
        <div
          className={`${styles.conteudoSeguro} ${!showLayout ? styles.conteudoOculto : ""}`}
        >
          {/* 1. PERFIL (Mobile) */}
          <div className={styles.avatarConatinerMobile}>
            <div className={styles.avatar}>
              <img src="/avatar-icon.png" alt="Avatar" width="130px" />
              <div className={styles.avatarStats}>
                <div className={styles.avatarStatsMobile}>
                  <p className={`${styles.highlightedText} ${styles.tittle}`}>
                    {name}
                  </p>
                  <p className={styles.highlightedText}>Level {level}</p>
                </div>
                <div className={styles.attributes}>
                  <div className={styles.attributesLine}>
                    <p className={styles.highlightedText}>HP</p>
                    <div
                      className={styles.attributesBar}
                      style={{ "--nivel-hp": `${hp}%` }}
                    >
                      <div className={styles.attributesBarHpFill}></div>
                    </div>
                    <p
                      className={`${styles.highlightedText} ${styles.attributesStats}`}
                    >
                      {hp}/100
                    </p>
                  </div>
                  <div className={styles.attributesLine}>
                    <p
                      className={`${styles.highlightedText} ${styles.xpColor}`}
                    >
                      XP
                    </p>
                    <div
                      className={styles.attributesBar}
                      style={{ "--nivel-xp": `${xp}%` }}
                    >
                      <div className={styles.attributesBarXpFill}></div>
                    </div>
                    <p
                      className={`${styles.highlightedText} ${styles.attributesStats}`}
                    >
                      {xp}/100
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1. PERFIL (Desktop) */}
          <div className={styles.avatarConatiner}>
            <div className={styles.avatar}>
              <img src="/avatar-icon.png" alt="Avatar" width="130px" />
              <div className={styles.avatarStats}>
                <p className={`${styles.highlightedText} ${styles.tittle}`}>
                  {name}
                </p>
                <p className={styles.highlightedText}>Level {level}</p>
              </div>
            </div>
            <div className={styles.attributes}>
              <div className={styles.attributesLine}>
                <p className={styles.highlightedText}>HP</p>
                <div
                  className={styles.attributesBar}
                  style={{ "--nivel-hp": `${hp}%` }}
                >
                  <div className={styles.attributesBarHpFill}></div>
                </div>
              </div>
              <div className={styles.attributesLine}>
                <p className={`${styles.highlightedText} ${styles.xpColor}`}>
                  XP
                </p>
                <div
                  className={styles.attributesBar}
                  style={{ "--nivel-xp": `${xp}%` }}
                >
                  <div className={styles.attributesBarXpFill}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. MISSÕES */}
          <div className={styles.goalsContainer}>
            <p className={`${styles.highlightedText} ${styles.tittle}`}>
              Tarefas do Dia
            </p>
            <div className={styles.goalsContainerLine}>
              <CustomCheckbox text={"Completar Missão Diária"} />
              <span className={styles.line} />
              <CustomCheckbox text={"Beber 2L de Água"} />
              <span className={styles.line} />
              <CustomCheckbox text={"Estudar 30min"} />
              <span className={styles.line} />
              <CustomCheckbox text={"Ir a academia"} />
            </div>
          </div>

          {/* 3. CALENDÁRIO */}
          <div className={styles.secondContainer}>
            <p className={`${styles.highlightedText} ${styles.tittle}`}>
              Calendário
            </p>
            <Calendar />
          </div>

          {/* 4. LOJA */}
          <div className={styles.thirdContainer}>
            <p
              className={`${styles.highlightedText} ${styles.tittle} ${styles.tittleStore}`}
            >
              Destaques da loja
            </p>
            <div className={styles.newItemsStore}>
              <div className={styles.newItem}>
                <img src="/pocao.png" alt="Poção de vida" />
                <p className={styles.text}>Poção de vida</p>
                <div className={styles.valueItem}>
                  <p className={styles.text}>50G</p>
                </div>
              </div>
              <div className={styles.newItem}>
                <img src="/escudo.png" alt="Escudo de madeira" />
                <p className={styles.text}>Escudo de madeira</p>
                <div className={styles.valueItem}>
                  <p className={styles.text}>200G</p>
                </div>
              </div>
              <div className={styles.newItem}>
                <img src="/espada_curta.png" alt="Espada curta" />
                <p className={styles.text}>Espada curta</p>
                <div className={styles.valueItem}>
                  <p className={styles.text}>350G</p>
                </div>
              </div>
              <div className={styles.newItem}>
                <img src="/pergaminho.png" alt="Pergaminho de XP" />
                <p className={styles.text}>Pergaminho de XP</p>
                <div className={styles.valueItem}>
                  <p className={styles.text}>150G</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
