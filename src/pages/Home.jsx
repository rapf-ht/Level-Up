import { Link, useRouteError } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
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
                <p>Avatar</p>
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
