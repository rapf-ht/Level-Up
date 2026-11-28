import { Link, useParams } from "react-router-dom";
import styles from "./Jogador.module.css";
import { ACHIEVEMENTS, getPlayer, getRanking } from "../data/players";
import { LockIcon, MedalIcon } from "../components/PixelIcons";
import { Avatar } from "../components/Avatar";
import { ItemManager } from "../manager/ItemManager";

const days = (n) => `${n} ${n === 1 ? "dia" : "dias"}`;

export default function Jogador() {
  const { id } = useParams();
  const player = getPlayer(id);

  if (!player) {
    return (
      <div className="page">
        <h1 className="title">Jogador não encontrado</h1>
        <p className="lead">Ninguém com o nome {id} passou pela Taverna. Confira o nome ou volte ao ranking.</p>
        <p><Link to="/tavern?aba=ranking" className="btn btn-outline">Ver ranking</Link></p>
      </div>
    );
  }

  const rank = getRanking().findIndex((p) => p.id === player.id) + 1;
  const earned = new Set(player.achievements);

  return (
    <div className={`page ${styles.page}`}>
      <section className={`frame ${styles.card}`}>
        <div className={styles.stage}>
          <Avatar equipped={player.me ? ItemManager.getEquipped() : player.equipped} size={200} label={`Personagem de ${player.name}`} />
        </div>
        <div className={styles.info}>
          <p className="eyebrow">{player.playerClass} de nível {player.level}</p>
          <h1 className="title">{player.name}</h1>
          <p className={styles.handle}>@{player.id}</p>
          <p className={styles.summary}>
            {rank}º lugar no ranking da Taverna, com {player.xp.toLocaleString("pt-BR")} XP. Já cumpriu {player.completed} missões
            e está há {days(player.streak)} sem falhar.
            {player.guild ? ` Faz parte de ${player.guild}.` : " Ainda não entrou em nenhuma guilda."}
          </p>
          <div className={styles.actions}>
            {player.me ? (
              <Link to="/inventario" className="btn btn-outline">Abrir meu inventário</Link>
            ) : (
              <button type="button" className="btn btn-outline" disabled={player.friend}>
                {player.friend ? "Vocês já são amigos" : "Adicionar amigo"}
              </button>
            )}
            <Link to="/tavern?aba=ranking" className="btn">Voltar ao ranking</Link>
          </div>
        </div>
      </section>

      <section className={`panel ${styles.trophies}`}>
        <div className={styles.trophiesHead}>
          <h2 className="h2">Conquistas</h2>
          <span className="meta">{earned.size} de {Object.keys(ACHIEVEMENTS).length}</span>
        </div>
        <ul className={styles.trophyGrid}>
          {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
            const has = earned.has(key);
            return (
              <li key={key} className={`${styles.trophy} ${has ? "" : styles.locked}`}>
                <span className={`slot ${has ? "" : "slot-empty"} ${styles.medal}`} data-equipped={has ? "true" : undefined}>
                  {has ? <MedalIcon size={28} /> : <LockIcon size={20} />}
                </span>
                <span className={styles.trophyText}>
                  <span className={styles.trophyName}>{achievement.title}</span>
                  <span className={styles.trophyNote}>{has ? achievement.description : "Ainda não desbloqueada."}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
