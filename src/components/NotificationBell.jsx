import { useEffect, useRef, useState } from "react";
import styles from "./NotificationBell.module.css";
import { BellIcon } from "./PixelIcons";
import { EmptyState } from "./EmptyState";

const STORAGE_KEY = "notifications";
const MAX_ITEMS = 20;

// Transforma um evento do jogo (disparado como "gameEvent" na janela) em um aviso legível.
function describe(event) {
  if (event.type === "levelup") return { tone: "gold", text: `Você subiu para o nível ${event.level}.` };
  if (event.type === "damage") return { tone: "red", text: event.missed === 1 ? `Você não cumpriu 1 diária e perdeu ${event.amount} de HP.` : `Você não cumpriu ${event.missed ?? "algumas"} diárias e perdeu ${event.amount} de HP.` };
  if (event.type === "death" && event.levelLost) return { tone: "red", text: `Seu HP chegou a zero e você voltou para o nível ${event.level}. O HP já foi restaurado.` };
  if (event.type === "death") return { tone: "red", text: "Seu HP chegou a zero e seu XP foi zerado. O HP já foi restaurado." };
  return null;
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function formatWhen(iso) {
  const date = new Date(iso);
  const sameDay = date.toDateString() === new Date().toDateString();
  return sameDay
    ? `Hoje, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    : date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

export function NotificationBell() {
  const [items, setItems] = useState(load);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const unread = items.filter((item) => !item.read).length;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    function onGameEvent(event) {
      const info = describe(event.detail ?? {});
      if (!info) return;
      setItems((current) => [{ id: crypto.randomUUID(), at: new Date().toISOString(), read: false, ...info }, ...current].slice(0, MAX_ITEMS));
    }
    window.addEventListener("gameEvent", onGameEvent);
    return () => window.removeEventListener("gameEvent", onGameEvent);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    function onPointer(event) {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    }
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    if (!open && unread > 0) setItems((current) => current.map((item) => ({ ...item, read: true })));
    setOpen(!open);
  }

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <button
        type="button"
        aria-label={unread > 0 ? `Notificações, ${unread} ${unread === 1 ? "nova" : "novas"}` : "Notificações"}
        aria-expanded={open}
        aria-controls="painel-notificacoes"
        className={styles.bell}
        onClick={toggle}
      >
        <BellIcon />
        {unread > 0 && <span className={styles.count} aria-hidden="true">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div id="painel-notificacoes" className={`panel ${styles.panel}`}>
          <h2 className={styles.title}>Notificações</h2>
          {items.length === 0 ? (
            <EmptyState art="sino" compact size={44}>Nenhuma notificação por enquanto. Avisaremos quando você subir de nível ou perder HP.</EmptyState>
          ) : (
            <>
              <ul className={styles.list}>
                {items.map((item) => (
                  <li key={item.id} className={styles.item}>
                    <span className={`${styles.mark} ${styles[item.tone]}`} aria-hidden="true" />
                    <span className={styles.text}>
                      {item.text}
                      <span className={styles.when}>{formatWhen(item.at)}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <button type="button" className={styles.clear} onClick={() => setItems([])}>Limpar notificações</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
