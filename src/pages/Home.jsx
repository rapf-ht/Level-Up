import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { MissionManager } from "../manager/MissionManager";
import { useGameData } from "../hooks/useGameData";
import { getArea, MISSION_TYPES } from "../data/areas";
import { getProfile } from "../data/profile";
import { MissionModal } from "../components/MissionModal";
import { PlayerBars } from "../components/PixelBar";
import { CheckIcon, PlusIcon } from "../components/PixelIcons";

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

function greeting(date) {
  const hour = date.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function formatDate(date) {
  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" }).split("-")[0];
  const day = date.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
  return `${weekday} · ${day}`.toUpperCase();
}

function isToday(iso) {
  return Boolean(iso) && new Date(iso).toDateString() === new Date().toDateString();
}

function complete(id) {
  MissionManager.completeMission(id);
  window.dispatchEvent(new Event("playerStateUpdated"));
}

function MissionRow({ mission }) {
  const area = getArea(mission.category);
  const done = mission.status === "completed";
  const inputId = `home-${mission.id}`;
  return (
    <li className={styles.row}>
      <input
        id={inputId}
        type="checkbox"
        className="px-check"
        checked={done}
        disabled={done}
        onChange={() => complete(mission.id)}
      />
      <label htmlFor={inputId} className={styles.rowText}>
        <span className={`${styles.rowTitle} ${done ? styles.rowDone : ""}`}>{mission.title}</span>
        <span className={`${styles.rowMeta} ${done ? styles.rowMetaDone : ""}`}>
          <span className="dot" style={{ "--area": area.color }} />
          {area.label.toUpperCase()}
          <span className={styles.desktopOnly}> · {MISSION_TYPES[mission.type]?.label.toUpperCase()}</span>
        </span>
      </label>
      {done ? (
        <span className={styles.rowDoneTag}>CONCLUÍDA</span>
      ) : (
        <>
          <span className="reward-xp">
            +{mission.xpReward}<span className={styles.desktopOnly}> XP</span>
          </span>
          <span className={`reward-gold ${styles.desktopOnlyFlex}`}>
            <img src="/ui/coin.svg" alt="" width="14" height="14" className="pixel-img" />+{mission.goldReward}
          </span>
        </>
      )}
    </li>
  );
}

export default function Home() {
  const { player, missions } = useGameData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profile = getProfile();
  const now = new Date();
  const streak = MissionManager.getStreak();

  const pending = missions.filter((m) => m.status === "pending");
  const doneToday = missions.filter((m) => m.status === "completed" && isToday(m.completedAt));
  const list = [...pending, ...doneToday];

  const lead =
    pending.length === 0
      ? "Nenhuma missão pendente. Crie uma para ganhar XP e ouro."
      : `${pending.length} ${pending.length === 1 ? "missão" : "missões"} para hoje. Complete todas para manter a sequência.`;

  const newMission = (
    <button type="button" className={`btn btn-primary ${styles.newMission}`} onClick={() => setIsModalOpen(true)}>
      <PlusIcon size={14} />
      Nova missão
    </button>
  );

  return (
    <div className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">{formatDate(now)}</p>
          <h1 className="title">{greeting(now)}, {profile.name}</h1>
          <p className={`lead ${styles.lead}`}>{lead}</p>
        </div>
        <div className={styles.desktopAction}>{newMission}</div>
      </section>

      <div className={styles.grid}>
        <section className={`panel ${styles.hero}`}>
          <div className={styles.heroTop}>
            <div className={styles.portrait}>
              <img src="/ui/hero.png" alt={`Personagem ${profile.playerClass}`} className="pixel-img" />
            </div>
            <div className={styles.heroInfo}>
              <h2 className={`h2 ${styles.heroName}`}>{profile.name}</h2>
              <span className="meta">NÍVEL {player.level} · {profile.playerClass.toUpperCase()}</span>
            </div>
          </div>
          <div className={styles.heroBars}>
            <PlayerBars player={player} />
          </div>

          <div className={styles.streak}>
            <div className={styles.streakHead}>
              <span className="meta">SEQUÊNCIA</span>
              <span className="meta">{streak.current} {streak.current === 1 ? "DIA" : "DIAS"} · RECORDE {streak.record}</span>
            </div>
            <div className={styles.streakDays}>
              {streak.week.map((day, i) => (
                <div key={i} className={styles.streakDay}>
                  <span
                    className={`${styles.streakBox} ${day.done ? styles.streakDone : ""} ${day.today && !day.done ? styles.streakToday : ""}`}
                  >
                    {day.done && <CheckIcon size={10} />}
                  </span>
                  <span className={`${styles.streakLabel} ${day.today ? styles.streakLabelToday : ""}`}>{WEEK_DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <Link to="/inventario" className={styles.heroLink}>Abrir inventário →</Link>
        </section>

        <section className={`panel ${styles.missions}`}>
          <div className={styles.missionsHead}>
            <h2 className={`h2 ${styles.missionsTitle}`}>Missões de hoje</h2>
            <span className="meta">
              {doneToday.length} / {list.length}<span className={styles.desktopOnly}> FEITAS</span>
            </span>
          </div>
          {list.length === 0 ? (
            <p className={`empty ${styles.emptyList}`}>Crie sua primeira missão para começar a evoluir.</p>
          ) : (
            <ul>
              {list.map((mission) => (
                <MissionRow key={mission.id} mission={mission} />
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className={styles.mobileAction}>{newMission}</div>
      <MissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
