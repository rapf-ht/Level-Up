import { useState, useEffect, useRef } from "react";
import estudosStyles from "./Estudos.module.css";
import { MissoesList } from "../components/MissoesList";
import { useAreaInfo } from "../hooks/useAreaInfo";

const modoPomodoro = [
  { key: "pomodoro", label: "Pomodoro", seconds: 25 * 60 },
  { key: "short", label: "Pausa curta", seconds: 5 * 60 },
  { key: "long", label: "Pausa longa", seconds: 15 * 60 },
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
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
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

  function reset() {
    setRemaining(activeMode.seconds);
    setRunning(false);
  }
  function stop() {
    setRemaining(0);
    setRunning(false);
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  useAreaInfo("Área de Estudos", "📚", "/banners/banner_estudos.png");

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
          <span className={estudosStyles.timerDisplay}>
            {mm}:{ss}
          </span>
          <div className={estudosStyles.timerControls}>
            <button
              className={estudosStyles.startBtn}
              onClick={() => setRunning((r) => !r)}
            >
              {running ? "Pause" : "Start"}
            </button>
            <button className={estudosStyles.iconBtn} onClick={reset}>
              🔄
            </button>
            <button className={estudosStyles.iconBtn} onClick={stop}>
              ⏹️
            </button>
          </div>
        </div>
      </div>
      <MissoesList categoryFilter="estudos" />
    </>
  );
}