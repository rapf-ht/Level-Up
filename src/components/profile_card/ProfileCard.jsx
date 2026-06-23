import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./ProfileCard.module.css";
import { MissionManager } from "../../manager/MissionManager";

export default function ProfileCard() {
  const [player, setPlayer] = useState(MissionManager.getPlayerState());

  useEffect(() => {
    const updateVisuals = () => setPlayer(MissionManager.getPlayerState());
    window.addEventListener('playerStateUpdated', updateVisuals);
    
    return () => window.removeEventListener('playerStateUpdated', updateVisuals);
  }, []);

  const xpNeeded = player.level * 100;
  const xpPercent = Math.min((player.xp / xpNeeded) * 100, 100);

  return (
    <div className={styles['profile-card']}>
        <Link to="/inventario">
          <img className={styles.pfp} src="/logos/Logo_LevelUp_Favicon.svg" alt="pfp" />
        </Link>
        <div className={styles['pfp-info']}>
          <p className={styles.username}>Lvl {player.level}</p>
          
          <div className={styles['xp-bar-bg']}>
            <div 
              className={styles['xp-bar-fill']} 
              style={{ width: `${xpPercent}%` }}
            ></div>
          </div>

        </div>
    </div>
  );
}