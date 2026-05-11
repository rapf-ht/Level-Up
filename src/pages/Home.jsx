import { Link, useRouteError } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  let name = "Dev_Br";
  let level = 4;
  return (
    <div className={styles.mainContainer}>
      <div className={styles.backgroundGif}>
        <div className={styles.conteudoSeguro}>
          <div className={styles.mobileInfoPerfil}>
            <h2>NOME / XP/ VIDA / GOLD</h2>
          </div>
          <div className={styles.firtContainer}>
            <div className={styles.avatarConatiner}>
              <div className={styles.avatar}>
                <img src="/avatar-icon.png" alt="Avatar" width="130px"/>
                <p className={`${styles.text} ${styles.tittle}`}>{name}</p>
                <p className={styles.text}>Level {level}</p>
              </div>
              <div className={styles.attributes}>
                <p>Atributos do avatar</p>
              </div>
            </div>
            <div className={styles.goalsContainer}>
              <p>Metas</p>
            </div>
          </div>

          <div className={styles.secondContainer}>
            <p>Calendário</p>
          </div>

          <div className={styles.thirdContainer}>
            <p>Prévia do que tem no Bazar do Hélio + o atalho a ela</p>
          </div>
        </div>
      </div>
    </div>
  );
}
