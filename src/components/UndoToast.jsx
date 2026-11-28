import { useEffect, useState } from "react";
import styles from "./UndoToast.module.css";
import { MissionManager } from "../manager/MissionManager";
import { CheckIcon } from "./PixelIcons";

const VISIBLE_MS = 6000;

// Aviso que aparece depois de cumprir uma missão, com a opção de desfazer por alguns segundos.
export function UndoToast() {
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const onCompleted = (event) => setEntry(event.detail);
    window.addEventListener("missionCompleted", onCompleted);
    return () => window.removeEventListener("missionCompleted", onCompleted);
  }, []);

  useEffect(() => {
    if (!entry) return undefined;
    const timer = setTimeout(() => setEntry(null), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [entry]);

  if (!entry) return null;

  function undo() {
    MissionManager.undoCompletion(entry.id);
    setEntry(null);
  }

  return (
    <div role="status" className={`toast ${styles.toast}`}>
      <CheckIcon size={16} />
      <span className={styles.text}>
        Missão cumprida: {entry.title}. +{entry.xp} XP e +{entry.gold} de ouro.
      </span>
      <button type="button" className={styles.undo} onClick={undo}>Desfazer</button>
    </div>
  );
}
