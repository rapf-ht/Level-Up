import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import styles from "./AreasDaVidaLayout.module.css";
import { MissionManager } from "../manager/MissionManager";
import { useGameData } from "../hooks/useGameData";
import { AREAS, getArea } from "../data/areas";
import { MissionModal } from "../components/MissionModal";
import { PixelBar } from "../components/PixelBar";
import { PlusIcon } from "../components/PixelIcons";

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

function compareWeeks(total, previous) {
  const difference = total - previous;
  if (difference > 0) return `${difference} a mais que a anterior`;
  if (difference < 0) return `${-difference} a menos que a anterior`;
  return "Igual à semana anterior";
}

export default function AreasDaVidaLayout() {
  const { player, missions } = useGameData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pathname } = useLocation();

  const area = getArea(pathname.split("/").filter(Boolean)[1]);
  const inArea = missions.filter((m) => m.category === area.value);
  const completed = inArea.filter((m) => m.status === "completed").length;
  const weekly = MissionManager.getWeeklyXp(area.value);
  const streak = MissionManager.getStreak();
  const highestDay = Math.max(...weekly.days, 1);
  const today = new Date().getDay();

  return (
    <div className={`page ${styles.page}`}>
      <aside className={styles.sidebar}>
        <h2 className={`meta ${styles.sidebarTitle}`}>ÁREAS DA VIDA</h2>
        <nav aria-label="Áreas" className={styles.areaNav}>
          {AREAS.map((item) => {
            const active = missions.filter((m) => m.category === item.value && m.status === "pending").length;
            return (
              <NavLink
                key={item.value}
                to={`/areas-da-vida/${item.value}`}
                className={({ isActive }) => `${styles.areaLink} ${isActive ? styles.areaActive : ""}`}
              >
                <span className={styles.areaDot} style={{ background: item.color }} />
                <span className={styles.areaName}>{item.label}</span>
                <span className={styles.areaCount}>{active}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className={styles.content}>
        <section className="page-head">
          <div>
            <p className="eyebrow">ÁREAS DA VIDA / {area.label.toUpperCase()}</p>
            <h1 className={`title ${styles.areaTitle}`}>
              <span className={styles.areaTitleDot} style={{ background: area.color }} />
              {area.label}
            </h1>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusIcon size={14} />
            Nova missão
          </button>
        </section>

        <section className={`panel ${styles.stats}`}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>CONCLUÍDAS</span>
            <span className={styles.statValue}>{completed}</span>
            <PixelBar kind="ok" value={completed} max={inArea.length} />
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>XP NA SEMANA</span>
            <span className={styles.statValue} style={{ color: "var(--xp-text)" }}>+{weekly.total}</span>
            <span className={styles.statNote}>{compareWeeks(weekly.total, weekly.previous)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>SEQUÊNCIA</span>
            <span className={styles.statValue} style={{ color: "var(--gold)" }}>
              {streak.current} {streak.current === 1 ? "dia" : "dias"}
            </span>
            <span className={styles.statNote}>Recorde: {streak.record} {streak.record === 1 ? "dia" : "dias"}</span>
          </div>
        </section>

        <Outlet />

        <section className={styles.bottom}>
          <div className={`panel ${styles.card}`}>
            <h2 className={styles.cardTitle}>XP da semana</h2>
            <div className={styles.chart}>
              {weekly.days.map((value, i) => (
                <div
                  key={i}
                  className={value > 0 ? styles.chartBar : styles.chartEmpty}
                  style={value > 0 ? { height: `${Math.max((value / highestDay) * 100, 12)}%` } : undefined}
                  title={`${value} XP`}
                />
              ))}
            </div>
            <div className={styles.chartDays}>
              {WEEK_DAYS.map((day, i) => (
                <span key={i} style={i === today ? { color: "var(--text)" } : undefined}>{day}</span>
              ))}
            </div>
          </div>
          <div className={`panel ${styles.card}`}>
            <h2 className={styles.cardTitle}>Seu HP</h2>
            <p className={styles.cardText}>Missões diárias não concluídas até a meia-noite custam HP. Mantenha a barra cheia.</p>
            <div className="bar-head">
              <span style={{ color: "var(--hp-text)" }}>HP</span>
              <span>{player.hp} / {player.maxHp}</span>
            </div>
            <PixelBar kind="hp" value={player.hp} max={player.maxHp} />
          </div>
        </section>
      </div>

      <MissionModal
        key={area.value}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={area.value}
      />
    </div>
  );
}
