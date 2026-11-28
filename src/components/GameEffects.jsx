import { useEffect, useState } from "react";
import styles from "./GameEffects.module.css";
import { Avatar } from "./Avatar";
import { ItemManager } from "../manager/ItemManager";

const AUTO_CLOSE = { levelup: 4500, damage: 3000 };
const SPARKS = Array.from({ length: 12 }, (_, i) => i);

export function GameEffects() {
  const [queue, setQueue] = useState([]);
  const current = queue[0];

  useEffect(() => {
    const onEvent = (event) => setQueue((items) => [...items, event.detail]);
    window.addEventListener("gameEvent", onEvent);
    return () => window.removeEventListener("gameEvent", onEvent);
  }, []);

  const close = () => setQueue((items) => items.slice(1));

  useEffect(() => {
    const delay = current && AUTO_CLOSE[current.type];
    if (!delay) return undefined;
    const timer = setTimeout(() => setQueue((items) => items.slice(1)), delay);
    return () => clearTimeout(timer);
  }, [current]);

  if (!current) return null;

  if (current.type === "damage") {
    return (
      <div className={styles.damage} role="status">
        <div className={styles.damageFlash} aria-hidden="true" />
        <div className={styles.damageCard}>
          <Avatar equipped={ItemManager.getEquipped()} size={64} className={styles.damageHero} />
          <div>
            <p className={styles.damageAmount}>-{current.amount} HP</p>
            <p className={styles.note}>{current.missed === 1 ? "Você não cumpriu 1 diária." : `Você não cumpriu ${current.missed ?? "algumas"} diárias.`}</p>
          </div>
        </div>
      </div>
    );
  }

  const isLevelUp = current.type === "levelup";

  return (
    <div className={styles.overlay} onClick={close}>
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-effect-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.stage} aria-hidden="true">
          {isLevelUp &&
            SPARKS.map((i) => (
              <span key={i} className={styles.spark} style={{ "--i": i }} />
            ))}
          <Avatar equipped={ItemManager.getEquipped()} size={150} className={isLevelUp ? styles.heroJump : styles.heroFall} />
        </div>
        {isLevelUp ? (
          <>
            <p className={styles.kicker}>Você subiu de nível!</p>
            <h2 id="game-effect-title" className={styles.level}>Nível {current.level}</h2>
            <p className={styles.note}>Seu HP foi restaurado e você ganhou 50 de ouro de bônus.</p>
          </>
        ) : (
          <>
            <p className={`${styles.kicker} ${styles.kickerDanger}`}>Seu HP chegou a zero</p>
            <h2 id="game-effect-title" className={styles.level}>Hora de recomeçar</h2>
            <p className={styles.note}>{current.levelLost ? `Você voltou para o nível ${current.level}` : "Seu XP foi zerado"}, e seu HP já foi restaurado. Cumpra suas diárias para recuperar o progresso.</p>
          </>
        )}
        <button type="button" className="btn btn-primary" onClick={close} autoFocus>
          Continuar
        </button>
      </div>
    </div>
  );
}
