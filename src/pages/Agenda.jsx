import { useState } from "react";
import styles from "./Agenda.module.css";
import { MissoesList } from "../components/MissoesList";

const WEEK_DAYS = ["S", "T", "Q", "Q", "S", "S", "D"];

export default function Agenda() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const monthName = new Date(year, month)
    .toLocaleString("pt-BR", { month: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const startOffset = (firstDay + 6) % 7;

  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: prevDays - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  while (cells.length < 42) {
    cells.push({ day: cells.length - daysInMonth - startOffset + 1, current: false });
  }

  const isToday = (cell) =>
    cell.current && cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <>
      <section className={`panel ${styles.card}`}>
        <div className={styles.head}>
          <button type="button" className={styles.nav} onClick={prevMonth} aria-label="Mês anterior">‹</button>
          <h2 className={styles.month}>{monthName} {year}</h2>
          <button type="button" className={styles.nav} onClick={nextMonth} aria-label="Próximo mês">›</button>
        </div>
        <div className={styles.grid}>
          {WEEK_DAYS.map((day, i) => (
            <div key={i} className={styles.weekDay}>{day}</div>
          ))}
          {cells.map((cell, i) => (
            <div
              key={i}
              className={`${styles.cell} ${cell.current ? "" : styles.other} ${isToday(cell) ? styles.today : ""}`}
            >
              {cell.day}
            </div>
          ))}
        </div>
      </section>
      <MissoesList categoryFilter="agenda" />
    </>
  );
}
