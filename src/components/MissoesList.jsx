import { useState } from "react";
import styles from "./MissoesList.module.css";
import { MissionManager } from "../manager/MissionManager";
import { useGameData } from "../hooks/useGameData";
import { MISSION_TYPES } from "../data/areas";

const TABS = [
  { key: "pending", label: "Ativas", empty: "Nenhuma missão ativa nesta área. Crie uma para ganhar XP e ouro." },
  { key: "completed", label: "Concluídas", empty: "Conclua uma missão para vê-la aqui." },
  { key: "failed", label: "Falhadas", empty: "Nenhuma missão falhada. Continue assim." },
];

function complete(id) {
  MissionManager.completeMission(id);
  window.dispatchEvent(new Event("playerStateUpdated"));
}

export function MissoesList({ categoryFilter = null }) {
  const { missions } = useGameData();
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const inArea = categoryFilter ? missions.filter((m) => m.category === categoryFilter) : missions;
  const count = (key) => inArea.filter((m) => m.status === key).length;
  const visible = inArea.filter((m) => m.status === activeTab.key);

  return (
    <section className="panel">
      <div role="tablist" aria-label="Filtrar missões" className={`tabs ${styles.tabs}`}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab.key === tab.key}
            className={`tab ${activeTab.key === tab.key ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.label} · {count(tab.key)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className={`empty ${styles.empty}`}>{activeTab.empty}</p>
      ) : (
        <ul className={styles.list}>
          {visible.map((mission) => {
            const type = MISSION_TYPES[mission.type] ?? MISSION_TYPES.daily;
            const pending = mission.status === "pending";
            const inputId = `area-${mission.id}`;
            return (
              <li key={mission.id} className={styles.row}>
                <input
                  id={inputId}
                  type="checkbox"
                  className="px-check"
                  checked={mission.status === "completed"}
                  disabled={!pending}
                  onChange={() => complete(mission.id)}
                />
                <label htmlFor={inputId} className={`${styles.title} ${pending ? "" : styles.titleOff}`}>
                  {mission.title}
                </label>
                <span className={`badge ${type.badge}`}>{type.label.toUpperCase()}</span>
                <span className={styles.rewards}>
                  <span className="reward-xp">+{mission.xpReward} XP</span>
                  <span className="reward-gold">+{mission.goldReward} G</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
