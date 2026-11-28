import { useState } from "react";
import styles from "./DeadlineCalendar.module.css";
import { dayKey } from "../manager/MissionManager";

const WEEK_DAYS = ["S", "T", "Q", "Q", "S", "S", "D"];

// Calendário do mês com os dias em que vencem afazeres.
export function DeadlineCalendar({ missions }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const due = new Map();
  missions
    .filter((m) => m.type === "afazer" && m.dueDate && m.status !== "completed")
    .forEach((m) => due.set(m.dueDate, [...(due.get(m.dueDate) ?? []), m.title]));

  const monthName = new Date(year, month).toLocaleString("pt-BR", { month: "long" }).replace(/^\w/, (c) => c.toUpperCase());

  function shift(amount) {
    const next = new Date(year, month + amount, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
  }

  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const todayKey = dayKey();

  return (
    <section className={`panel ${styles.card}`} aria-label="Prazos do mês">
      <div className={styles.head}>
        <h2 className={styles.title}>Prazos de {monthName.toLowerCase()} {year !== today.getFullYear() ? year : ""}</h2>
        <div className={styles.navs}>
          <button type="button" className={styles.nav} onClick={() => shift(-1)} aria-label="Mês anterior">‹</button>
          <button type="button" className={styles.nav} onClick={() => shift(1)} aria-label="Próximo mês">›</button>
        </div>
      </div>
      <div className={styles.grid}>
        {WEEK_DAYS.map((day, i) => (
          <div key={`h${i}`} className={styles.weekDay} aria-hidden="true">{day}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const key = dayKey(new Date(year, month, day));
          const titles = due.get(key);
          return (
            <div
              key={key}
              className={`${styles.cell} ${key === todayKey ? styles.today : ""} ${titles ? styles.has : ""} ${titles && key < todayKey ? styles.late : ""}`}
              title={titles ? titles.join("\n") : undefined}
              aria-label={titles ? `Dia ${day}: ${titles.join(", ")}` : undefined}
            >
              {day}
            </div>
          );
        })}
      </div>
    </section>
  );
}
