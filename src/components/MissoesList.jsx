import { useState } from "react";
import styles from "./MissoesList.module.css";

const tabs = ["Ativas", "Concluídas", "Disponíveis"];

export function MissoesList({ initialMissions = [], headerExtra }) {
  const [activeTab, setActiveTab] = useState("Ativas");
  const [missions, setMissions] = useState(
    initialMissions.map((m) => ({ ...m }))
  );

  function toggleMission(id) {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );
  }

  const visible = missions.filter((m) => {
    if (activeTab === "Ativas") return !m.done;
    if (activeTab === "Concluídas") return m.done;
    return true;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Missões</h2>
        {headerExtra}
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {visible.length === 0 && (
          <p className={styles.empty}>Nenhuma missão aqui. Crie uma nova!</p>
        )}
        {visible.map((mission) => (
          <div key={mission.id} className={styles.missionCard}>
            <button
              className={`${styles.checkbox} ${mission.done ? styles.checkboxDone : ""}`}
              onClick={() => toggleMission(mission.id)}
              aria-label={`Marcar ${mission.title} como ${mission.done ? "não concluída" : "concluída"}`}
            >
              {mission.done && "✓"}
            </button>
            <div className={styles.missionInfo}>
              <span
                className={`${styles.missionTitle} ${mission.done ? styles.missionDone : ""}`}
              >
                {mission.title}
              </span>
              <div className={styles.missionTags}>
                {mission.tags.map((tag, i) => (
                  <span key={tag}>
                    {i > 0 && <span className={styles.separator}>|</span>}
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className={styles.xpBadge}>{mission.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}