import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { MissionManager, dayKey } from "../manager/MissionManager";
import { useGameData } from "../hooks/useGameData";
import { getArea } from "../data/areas";
import { DIFFICULTIES, MISSION_TYPES } from "../data/missions";
import { getProfile } from "../data/profile";
import { MissionModal } from "../components/MissionModal";
import { PlayerBars } from "../components/PixelBar";
import { CheckIcon, PlusIcon } from "../components/PixelIcons";
import { Avatar } from "../components/Avatar";
import { EmptyState } from "../components/EmptyState";
import { ItemManager } from "../manager/ItemManager";

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
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${day}`;
}

function complete(id) {
  MissionManager.completeMission(id);
  window.dispatchEvent(new Event("playerStateUpdated"));
}

function MissionRow({ mission }) {
  const area = getArea(mission.category);
  const reward = DIFFICULTIES[mission.difficulty] ?? DIFFICULTIES.facil;
  const done = MissionManager.isDoneToday(mission);
  const late = mission.type === "afazer" && mission.dueDate && mission.dueDate < dayKey();
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
          {area.label}, {MISSION_TYPES[mission.type].label.toLowerCase()}
          {late && !done && <span className={styles.late}>, atrasado</span>}
        </span>
      </label>
      {done ? (
        <span className={styles.rowDoneTag}>Feita</span>
      ) : (
        <>
          <span className="reward-xp">
            +{reward.xp}<span className={styles.desktopOnly}> XP</span>
          </span>
          <span className={`reward-gold ${styles.desktopOnlyFlex}`}>
            <img src="/ui/coin.svg" alt="" width="14" height="14" className="pixel-img" />+{reward.gold}
          </span>
        </>
      )}
    </li>
  );
}

function HabitButton({ habit }) {
  const times = MissionManager.timesDoneToday(habit);
  const reward = DIFFICULTIES[habit.difficulty] ?? DIFFICULTIES.facil;
  return (
    <li>
      <button
        type="button"
        className={styles.habit}
        onClick={() => complete(habit.id)}
        aria-label={`Registrar ${habit.title}, mais ${reward.xp} XP. Feito ${times} ${times === 1 ? "vez" : "vezes"} hoje.`}
      >
        <span className={styles.habitPlus} aria-hidden="true"><PlusIcon size={12} /></span>
        <span className={styles.habitName}>{habit.title}</span>
        {times > 0 && <span className={styles.habitCount} aria-hidden="true">{times}x</span>}
      </button>
    </li>
  );
}

export default function Home() {
  const { player, missions } = useGameData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profile = getProfile();
  const now = new Date();
  const streak = MissionManager.getStreak();
  const today = dayKey();

  // Para hoje: todas as diárias e os afazeres que vencem hoje ou já venceram
  const dailies = missions.filter((m) => m.type === "diaria");
  const dueTodos = missions.filter((m) => m.type === "afazer" && m.status !== "completed" && m.dueDate && m.dueDate <= today);
  const doneTodosToday = missions.filter((m) => m.type === "afazer" && m.status === "completed" && m.doneAt && dayKey(m.doneAt) === today && m.dueDate);
  const list = [...dailies, ...dueTodos, ...doneTodosToday].sort(
    (a, b) => Number(MissionManager.isDoneToday(a)) - Number(MissionManager.isDoneToday(b))
  );
  const doneToday = list.filter((m) => MissionManager.isDoneToday(m)).length;
  const pending = list.length - doneToday;
  const habits = missions.filter((m) => m.type === "habito");
  const undatedTodos = missions.filter((m) => m.type === "afazer" && m.status !== "completed" && !m.dueDate).length;

  const lead =
    missions.length === 0
      ? "Comece com metas pequenas: uma diária de 5 minutos já faz diferença."
      : pending === 0
        ? "Você cumpriu tudo o que havia para hoje. Para ganhar mais XP, registre um hábito."
        : `${pending} ${pending === 1 ? "missão aguarda" : "missões aguardam"} você hoje. Cumpra as diárias para proteger seu HP.`;

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
          <p className={styles.date}>{formatDate(now)}</p>
          <h1 className="title">{greeting(now)}, {profile.name}</h1>
          <p className={`lead ${styles.lead}`}>{lead}</p>
        </div>
        <div className={styles.desktopAction}>{newMission}</div>
      </section>

      <div className={styles.grid}>
        <section className={`frame ${styles.hero}`}>
          <div className={styles.heroTop}>
            <div className={styles.portrait}>
              <Avatar equipped={ItemManager.getEquipped()} size={84} label={`Seu personagem, ${profile.playerClass}`} />
            </div>
            <div className={styles.heroInfo}>
              <h2 className={`h2 ${styles.heroName}`}>{profile.name}</h2>
              <span className="meta">{profile.playerClass} de nível {player.level}</span>
            </div>
          </div>
          <div className={styles.heroBars}>
            <PlayerBars player={player} />
          </div>

          <div className={styles.streak}>
            <div className={styles.streakHead}>
              <span className="meta">Sequência</span>
              <span className="meta">{streak.current} {streak.current === 1 ? "dia" : "dias"}, recorde de {streak.record}</span>
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

          <Link to="/inventario" className={styles.heroLink}>Abrir inventário</Link>
        </section>

        <section className={`panel ${styles.missions}`}>
          <div className={styles.missionsHead}>
            <h2 className={`h2 ${styles.missionsTitle}`}>Para hoje</h2>
            <span className="meta">
              {doneToday} de {list.length}<span className={styles.desktopOnly}> feitas</span>
            </span>
          </div>
          {list.length === 0 ? (
            <EmptyState art="quadro" compact size={56} className={styles.emptyList}>Nenhuma missão para hoje. Crie uma diária: ela se repete todos os dias e ajuda a criar um hábito.</EmptyState>
          ) : (
            <ul>
              {list.map((mission) => (
                <MissionRow key={mission.id} mission={mission} />
              ))}
            </ul>
          )}
          {undatedTodos > 0 && (
            <p className={styles.more}>
              E {undatedTodos} {undatedTodos === 1 ? "afazer sem prazo" : "afazeres sem prazo"} no <Link to="/areas-da-vida">quadro de missões</Link>.
            </p>
          )}
        </section>

        <section className={`panel ${styles.habits}`} aria-labelledby="home-habitos">
          <div className={styles.missionsHead}>
            <h2 id="home-habitos" className={`h2 ${styles.missionsTitle}`}>Hábitos</h2>
            <span className="meta">Toque para registrar</span>
          </div>
          {habits.length === 0 ? (
            <EmptyState art="broto" compact size={56} className={styles.emptyList}>Nenhum hábito ainda. Crie um em Nova missão, como beber água, alongar ou ler algumas páginas.</EmptyState>
          ) : (
            <ul className={styles.habitList}>
              {habits.map((habit) => (
                <HabitButton key={habit.id} habit={habit} />
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
