import { useState } from "react";
import agendaStyles from "./Agenda.module.css";
import AreasDaVidaLayout from "../layouts/AreasDaVidaLayout";
import { MissoesList } from "../components/MissoesList";
import { useAreaInfo } from "../hooks/useAreaInfo";

const WEEK_DAYS_CAL = ["S", "T", "Q", "Q", "S", "S", "D"];

const agendaMissions = [
  {
    id: 1,
    title: "Organizar agenda semanal",
    tags: ["Semanal"],
    xp: 50,
    done: false,
  },
  {
    id: 2,
    title: "Revisar compromissos",
    tags: ["Diário"],
    xp: 50,
    done: false,
  },
];

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
  for (let i = startOffset - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  while (cells.length < 42)
    cells.push({
      day: cells.length - daysInMonth - startOffset + 1,
      current: false,
    });

  useAreaInfo("Área da Agenda", "📅");

  return (
    <>
      <div className={agendaStyles.calendarCard}>
        <div className={agendaStyles.calHeader}>
          <button className={agendaStyles.navBtn} onClick={prevMonth}>
            ‹
          </button>
          <span className={agendaStyles.monthLabel}>
            {monthName} {year}
          </span>
          <button className={agendaStyles.navBtn} onClick={nextMonth}>
            ›
          </button>
        </div>
        <div className={agendaStyles.calGrid}>
          {WEEK_DAYS_CAL.map((d, i) => (
            <div key={i} className={agendaStyles.weekDay}>
              {d}
            </div>
          ))}
          {cells.map((cell, i) => (
            <div
              key={i}
              className={`${agendaStyles.calCell}
                ${!cell.current ? agendaStyles.otherMonth : ""}
                ${cell.current && cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? agendaStyles.todayCell : ""}`}
            >
              {cell.day}
            </div>
          ))}
        </div>
      </div>
      <MissoesList initialMissions={agendaMissions} />
    </>
  );
}
