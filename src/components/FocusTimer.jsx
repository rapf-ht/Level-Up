import { useEffect, useRef, useState } from "react";
import styles from "./FocusTimer.module.css";

const MODES = [
  { key: "foco", label: "Foco", seconds: 25 * 60, done: "Sessão concluída: 25 minutos de foco. Agora faça uma pausa." },
  { key: "curta", label: "Pausa curta", seconds: 5 * 60, done: "Pausa encerrada. Que tal começar mais uma sessão?" },
  { key: "longa", label: "Pausa longa", seconds: 15 * 60, done: "Pausa encerrada. Quando quiser, comece a próxima sessão." },
];

// Modo foco (técnica Pomodoro): 25 minutos numa missão só, depois uma pausa.
export function FocusTimer() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(MODES[0]);
  const [remaining, setRemaining] = useState(MODES[0].seconds);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setMessage(mode.done);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  function choose(next) {
    setMode(next);
    setRemaining(next.seconds);
    setRunning(false);
    setMessage("");
  }

  function toggle() {
    if (remaining === 0) setRemaining(mode.seconds);
    setMessage("");
    setRunning((value) => !value);
  }

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <section className={`panel ${styles.focus}`}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>Modo foco</h2>
          <p className={styles.lead}>Está difícil começar? Escolha uma missão e concentre-se apenas nela por 25 minutos.</p>
        </div>
        <button type="button" className="btn btn-sm" aria-expanded={open} aria-controls="modo-foco" onClick={() => setOpen(!open)}>
          {open ? "Esconder" : running ? `${minutes}:${seconds}` : "Abrir"}
        </button>
      </div>

      {open && (
        <div id="modo-foco" className={styles.body}>
          <div role="tablist" aria-label="Tipo de sessão" className={`tabs ${styles.tabs}`}>
            {MODES.map((item) => (
              <button key={item.key} type="button" role="tab" aria-selected={mode.key === item.key} className="tab" onClick={() => choose(item)}>
                {item.label}
              </button>
            ))}
          </div>
          <div className={styles.timer}>
            <span className={styles.display} role="timer" aria-live="off">{minutes}:{seconds}</span>
            <div className={styles.controls}>
              <button type="button" className="btn btn-primary" onClick={toggle}>{running ? "Pausar" : "Começar"}</button>
              <button type="button" className="btn" onClick={() => choose(mode)}>Recomeçar</button>
            </div>
          </div>
        </div>
      )}
      <p role="status" className={message ? styles.message : "sr-only"}>{message}</p>
    </section>
  );
}
