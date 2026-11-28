import { useState } from "react";
import styles from "./MissoesList.module.css";
import { MissionManager, dayKey } from "../manager/MissionManager";
import { useGameData } from "../hooks/useGameData";
import { DIFFICULTIES, MISSION_TYPES } from "../data/missions";
import { MissionModal } from "./MissionModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { PlusIcon } from "./PixelIcons";
import { EmptyState } from "./EmptyState";

const TABS = [
  { key: "todas", label: "Ativas", art: "quadro", empty: "Seu quadro ainda está vazio. Use o botão Nova missão para criar a primeira." },
  { key: "habito", label: "Hábitos", art: "broto", empty: "Nenhum hábito nesta área. Comece com algo simples, como beber água ou alongar." },
  { key: "diaria", label: "Diárias", art: "quadro", empty: "Nenhuma diária nesta área. Diárias se repetem todos os dias e ajudam a criar uma rotina." },
  { key: "afazer", label: "Afazeres", art: "quadro", empty: "Nenhum afazer pendente nesta área." },
  { key: "concluidos", label: "Concluídos", art: "trofeu", empty: "Os afazeres concluídos aparecem aqui." },
];

function formatDay(key) {
  return new Date(`${key}T12:00:00`).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }).replace(".", "");
}

function dueText(mission) {
  if (!mission.dueDate) return null;
  const today = dayKey();
  if (mission.dueDate < today) return { text: `Atrasado desde ${formatDay(mission.dueDate)}`, late: true };
  if (mission.dueDate === today) return { text: "Vence hoje", late: true };
  return { text: `Prazo: ${formatDay(mission.dueDate)}`, late: false };
}

export function MissoesList({ categoryFilter = null }) {
  const { missions } = useGameData();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);

  const inArea = categoryFilter ? missions.filter((m) => m.category === categoryFilter) : missions;
  const active = inArea.filter((m) => !(m.type === "afazer" && m.status === "completed"));
  const lists = {
    todas: active,
    habito: active.filter((m) => m.type === "habito"),
    diaria: active.filter((m) => m.type === "diaria"),
    afazer: active.filter((m) => m.type === "afazer"),
    concluidos: inArea
      .filter((m) => m.type === "afazer" && m.status === "completed")
      .sort((a, b) => (b.doneAt ?? "").localeCompare(a.doneAt ?? "")),
  };
  const visible = lists[activeTab.key];

  function complete(mission) {
    MissionManager.completeMission(mission.id);
    window.dispatchEvent(new Event("playerStateUpdated"));
  }

  function remove() {
    MissionManager.deleteMission(removing.id);
    setRemoving(null);
    window.dispatchEvent(new Event("playerStateUpdated"));
  }

  return (
    <section aria-label="Quadro de missões" className={styles.wrap}>
      <div role="tablist" aria-label="Filtrar missões" className={`tabs ${styles.tabs}`}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab.key === tab.key}
            className="tab"
            onClick={() => setActiveTab(tab)}
          >
            {tab.label} ({lists[tab.key].length})
          </button>
        ))}
      </div>

      <div className={`board ${styles.board}`}>
        {visible.length === 0 ? (
          <div className={`notice ${styles.empty}`}>
            <EmptyState art={activeTab.art}>{activeTab.empty}</EmptyState>
          </div>
        ) : (
          <ul className={styles.list}>
            {visible.map((mission) => {
              const type = MISSION_TYPES[mission.type];
              const difficulty = DIFFICULTIES[mission.difficulty] ?? DIFFICULTIES.facil;
              const doneToday = MissionManager.isDoneToday(mission);
              const timesToday = mission.type === "habito" ? MissionManager.timesDoneToday(mission) : 0;
              const due = mission.type === "afazer" && mission.status !== "completed" ? dueText(mission) : null;
              const inputId = `missao-${mission.id}`;
              const canCheck = mission.type !== "habito" && !doneToday;

              return (
                <li key={mission.id} className={`notice ${styles.note}`}>
                  <div className={styles.top}>
                    <span className={`badge ${type.badge}`}>{type.label}</span>
                    <span className={styles.difficulty}>{difficulty.label}</span>
                  </div>

                  {canCheck ? (
                    <label htmlFor={inputId} className={styles.title}>{mission.title}</label>
                  ) : (
                    <span className={`${styles.title} ${mission.type === "habito" ? "" : styles.titleOff}`}>{mission.title}</span>
                  )}

                  {due && <span className={`${styles.due} ${due.late ? styles.dueLate : ""}`}>{due.text}</span>}
                  {mission.type === "habito" && timesToday > 0 && (
                    <span className={styles.count}>Hoje: {timesToday} {timesToday === 1 ? "vez" : "vezes"}</span>
                  )}
                  {mission.type === "diaria" && !doneToday && (
                    <span className={styles.risk}>Se não for cumprida hoje, custa {difficulty.hpLoss} de HP</span>
                  )}

                  <div className={styles.footer}>
                    <span className={styles.rewards}>
                      <span className="reward-xp">+{difficulty.xp} XP</span>
                      <span className="reward-gold">+{difficulty.gold} G</span>
                    </span>
                    {mission.type === "habito" ? (
                      <button type="button" className={`btn btn-sm btn-primary ${styles.plus}`} onClick={() => complete(mission)}>
                        <PlusIcon size={12} />
                        Fiz agora
                      </button>
                    ) : canCheck ? (
                      <span className={styles.check}>
                        <input id={inputId} type="checkbox" className="px-check" checked={false} onChange={() => complete(mission)} />
                        <span aria-hidden="true">{mission.type === "diaria" ? "Feito hoje" : "Concluir"}</span>
                      </span>
                    ) : null}
                  </div>

                  <div className={styles.manage}>
                    <button type="button" onClick={() => setEditing(mission)}>Editar</button>
                    <button type="button" onClick={() => setRemoving(mission)}>Apagar</button>
                  </div>

                  {mission.type === "diaria" && doneToday && <span className="stamp stamp-ok">FEITA HOJE</span>}
                  {mission.type === "afazer" && mission.status === "completed" && <span className="stamp stamp-ok">CUMPRIDA</span>}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <MissionModal key={editing?.id} isOpen={Boolean(editing)} mission={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={Boolean(removing)}
        title={removing ? `Apagar "${removing.title}"?` : ""}
        confirmLabel="Apagar missão"
        danger
        onCancel={() => setRemoving(null)}
        onConfirm={remove}
      >
        <p>A missão sairá do quadro, mas o XP e o ouro que você já ganhou com ela continuam com você.</p>
      </ConfirmDialog>
    </section>
  );
}
