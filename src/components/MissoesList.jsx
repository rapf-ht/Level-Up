import { useState, useEffect } from "react";
import styles from "./MissoesList.module.css";
import { MissionManager } from "../manager/MissionManager";

const tabs = ["Ativas", "Concluídas", "Falhadas"];

export function MissoesList({ categoryFilter = null, headerExtra }) {
  const [activeTab, setActiveTab] = useState("Ativas");
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const load = () => {
      const loadedMissions = categoryFilter
        ? MissionManager.getMissionsByCategory(categoryFilter)
        : MissionManager.getMissions();
      setMissions(loadedMissions);
    };

    load();
    window.addEventListener("playerStateUpdated", load);
    return () => window.removeEventListener("playerStateUpdated", load);
  }, [categoryFilter]);

  function handleCompleteMission(id) {
    MissionManager.completeMission(id);
    window.dispatchEvent(new Event("playerStateUpdated"));
  }

  const visible = missions.filter((m) => {
    if (activeTab === "Ativas") return m.status === "pending";
    if (activeTab === "Concluídas") return m.status === "completed";
    if (activeTab === "Falhadas") return m.status === "failed";
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
              className={`${styles.checkbox} ${mission.status === "completed" ? styles.checkboxDone : ""}`}
              onClick={() => handleCompleteMission(mission.id)}
              disabled={mission.status === "completed" || mission.status === "failed"}
            >
              {mission.status === "completed" && "✓"}
              {mission.status === "failed" && "✗"}
            </button>
            <div className={styles.missionInfo}>
              <span
                className={`${styles.missionTitle} ${mission.status === "completed" ? styles.missionDone : ""} ${mission.status === "failed" ? styles.missionFailed : ""}`}
              >
                {mission.title}
              </span>
              <div className={styles.missionTags}>
                <span>{mission.type.toUpperCase()}</span>
                <span className={styles.separator}>|</span>
                <span>{mission.category}</span>
              </div>
            </div>
            <span className={styles.xpBadge}>{mission.xpReward} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}