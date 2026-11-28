import { useSyncExternalStore } from "react";

// Preferência salva: "light", "dark" ou nenhuma (segue o sistema).
const STORAGE_KEY = "levelup-theme";
const BAR_COLOR = { dark: "#1a1612", light: "#e4d3aa" };
const media = window.matchMedia("(prefers-color-scheme: light)");
const listeners = new Set();

function readSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function systemTheme() {
  return media.matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = BAR_COLOR[theme];
}

function notify() {
  listeners.forEach((listener) => listener());
}

media.addEventListener("change", () => {
  if (!readSaved()) {
    applyTheme(systemTheme());
    notify();
  }
});

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Uma string, para o React comparar o "retrato" sem recriar objetos.
function getSnapshot() {
  return `${readSaved() ?? "system"}|${document.documentElement.dataset.theme === "light" ? "light" : "dark"}`;
}

/** preference: "light" | "dark" | "system" */
export function setThemePreference(preference) {
  try {
    if (preference === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // Sem localStorage a escolha vale só para esta visita.
  }
  applyTheme(preference === "system" ? systemTheme() : preference);
  notify();
}

export function useTheme() {
  const [preference, theme] = useSyncExternalStore(subscribe, getSnapshot).split("|");
  return {
    theme,
    preference,
    setPreference: setThemePreference,
    toggleTheme: () => setThemePreference(theme === "light" ? "dark" : "light"),
  };
}
