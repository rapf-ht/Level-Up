import { useEffect, useState } from "react";
import styles from "./GameEffects.module.css";

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
          <img src="/ui/hero.png" alt="" className={`${styles.damageHero} pixel-img`} />
          <div>
            <p className={styles.damageAmount}>-{current.amount} HP</p>
            <p className={styles.note}>Você não concluiu suas diárias de ontem.</p>
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
          <img
            src="/ui/hero.png"
            alt=""
            className={`${isLevelUp ? styles.heroJump : styles.heroFall} pixel-img`}
          />
        </div>
        {isLevelUp ? (
          <>
            <p className={styles.kicker}>VOCÊ SUBIU DE NÍVEL</p>
            <h2 id="game-effect-title" className={styles.level}>Nível {current.level}</h2>
            <p className={styles.note}>HP restaurado e 50 de ouro de bônus.</p>
          </>
        ) : (
          <>
            <p className={`${styles.kicker} ${styles.kickerDanger}`}>SEU HP ACABOU</p>
            <h2 id="game-effect-title" className={styles.level}>Você caiu</h2>
            <p className={styles.note}>O XP do nível atual foi zerado e você perdeu 25% do ouro. Seu HP foi restaurado.</p>
          </>
        )}
        <button type="button" className="btn btn-primary" onClick={close} autoFocus>
          Continuar
        </button>
      </div>
    </div>
  );
}
