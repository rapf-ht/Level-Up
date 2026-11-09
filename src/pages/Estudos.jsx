import { useState, useEffect, useRef } from "react";
import styles from "./Estudos.module.css";
import { MissoesList } from "../components/MissoesList";

const MODES = [
  { key: "pomodoro", label: "Pomodoro", seconds: 25 * 60 },
  { key: "short", label: "Pausa curta", seconds: 5 * 60 },
  { key: "long", label: "Pausa longa", seconds: 15 * 60 },
];

export default function Estudos() {
  const [activeMode, setActiveMode] = useState(MODES[0]);
  const [remaining, setRemaining] = useState(MODES[0].seconds);
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

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <>
      <section className="panel">
        <div role="tablist" aria-label="Modo do temporizador" className={`tabs ${styles.tabs}`}>
          {MODES.map((mode) => (
            <button
              key={mode.key}
              type="button"
              role="tab"
              aria-selected={activeMode.key === mode.key}
              className="tab"
              onClick={() => setMode(mode)}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <div className={styles.timer}>
          <span className={styles.display} role="timer">{minutes}:{seconds}</span>
          <div className={styles.controls}>
            <button type="button" className="btn btn-primary" onClick={() => setRunning((value) => !value)}>
              {running ? "Pausar" : "Iniciar"}
            </button>
            <button type="button" className="btn" onClick={reset}>Reiniciar</button>
            <button type="button" className="btn" onClick={stop}>Parar</button>
          </div>
        </div>
      </section>
      <MissoesList categoryFilter="estudos" />
    </>
  );
}
