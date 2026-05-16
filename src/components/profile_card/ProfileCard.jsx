import { Link } from "react-router-dom";
import styles from "./ProfileCard.module.css";

export default function ProfileCard() {
  return (
    <div className={styles['profile-card']}>
        <Link to="/inventario">
          <img className={styles.pfp} src="/Logo_Level_UP_Favicon.png" alt="pfp" />
        </Link>
        <div className={styles['pfp-info']}>
          <p className={styles.username}>Username</p>
          <div className={styles['xp-bar-fill']}></div>
        </div>
    </div>
  );
}