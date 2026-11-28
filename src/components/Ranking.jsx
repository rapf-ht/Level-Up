import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Ranking.module.css";
import { getRanking } from "../data/players";
import { Avatar } from "./Avatar";
import { ItemManager } from "../manager/ItemManager";

const SCOPES = [
  { key: "global", label: "Todos" },
  { key: "amigos", label: "Amigos" },
];

export function Ranking() {
  const [scope, setScope] = useState("global");
  const players = getRanking({ friendsOnly: scope === "amigos" });

  return (
    <section aria-label="Ranking" className={`panel ${styles.ranking}`}>
      <div className={styles.head}>
        <h2 className="h2">Mais XP na temporada</h2>
        <div role="radiogroup" aria-label="Quem aparece no ranking" className={styles.scopes}>
          {SCOPES.map((item) => (
            <button
              key={item.key}
              type="button"
              role="radio"
              aria-checked={scope === item.key}
              className={`${styles.scope} ${scope === item.key ? styles.scopeOn : ""}`}
              onClick={() => setScope(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <ol className={styles.list}>
        {players.map((player, index) => (
          <li key={player.id} className={`${styles.row} ${player.me ? styles.me : ""}`}>
            <span className={`${styles.place} ${styles[`place${index + 1}`] ?? ""}`}>{index + 1}</span>
            <span className={`slot ${styles.portrait}`}>
              <Avatar equipped={player.me ? ItemManager.getEquipped() : player.equipped} size={40} />
            </span>
            <span className={styles.who}>
              <Link to={`/jogador/${player.id}`} className={styles.name}>
                {player.name}{player.me && <span className={styles.you}> (você)</span>}
              </Link>
              <span className={styles.detail}>{player.playerClass} de nível {player.level}</span>
            </span>
            <span className={styles.xp}>{player.xp.toLocaleString("pt-BR")} XP</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
