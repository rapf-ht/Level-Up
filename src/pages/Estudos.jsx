import { useState, useEffect, useRef } from "react";
import estudosStyles from "./Estudos.module.css";
import AreasDaVidaLayout from "../layouts/AreasDaVidaLayout";
import { MissoesList } from "../components/MissoesList";
import { useAreaInfo } from "../hooks/useAreaInfo";
 
const modoPomodoro = [
  { key: "pomodoro", label: "Pomodoro", seconds: 25 * 60 },
  { key: "short", label: "Pausa curta", seconds: 5 * 60 },
  { key: "long", label: "Pausa longa", seconds: 15 * 60 },
];
 
const estudosMissions = [
  { id: 1, title: "Estudar JavaScript por 1 hora", tags: ["Estudo", "Diário"], xp: 50, done: false },
  { id: 2, title: "Estudar Biologia por 1 hora", tags: ["Estudo", "Diário"], xp: 50, done: false },
  { id: 3, title: "Revisar anotações", tags: ["Revisão"], xp: 50, done: false },
  { id: 4, title: "Criar mapa mental sobre banco de dados", tags: ["Exercício"], xp: 50, done: false },
  { id: 5, title: "Fazer prova antiga", tags: ["Exercício", "Diário"], xp: 50, done: false },
];
 
export default function Estudos() {
  const [activeMode, setActiveMode] = useState(modoPomodoro[0]);
  const [remaining, setRemaining] = useState(modoPomodoro[0].seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
 
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);
 
  function setMode(mode) {
    setActiveMode(mode);
    setRemaining(mode.seconds);
    setRunning(false);
  }
 
  function reset() { setRemaining(activeMode.seconds); setRunning(false); }
  function stop() { setRemaining(0); setRunning(false); }
 
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  useAreaInfo("Área de Estudos", "📚");
 
  return (
    <>
      <div className={estudosStyles.pomodoroCard}>
        <div className={estudosStyles.pomodoroTabs}>
          {modoPomodoro.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m)}
              className={`${estudosStyles.pomTab} ${activeMode.key === m.key ? estudosStyles.pomTabActive : ""}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className={estudosStyles.timerRow}>
          <span className={estudosStyles.timerDisplay}>{mm}:{ss}</span>
          <div className={estudosStyles.timerControls}>
            <button className={estudosStyles.startBtn} onClick={() => setRunning((r) => !r)}>
              {running ? "Pause" : "Start"}
            </button>
            <button className={estudosStyles.iconBtn} onClick={reset}>🔄</button>
            <button className={estudosStyles.iconBtn} onClick={stop}>⏹️</button>
          </div>
        </div>
      </div>
      <MissoesList
        initialMissions={estudosMissions}
        headerExtra={
          <button className={estudosStyles.newBtn}>+ Nova Missão</button>
        }
      />
    </>
  );
}