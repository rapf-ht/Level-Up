import { useSyncExternalStore } from "react";
import { getAreas, subscribeAreas } from "../data/areas";

// Guarda o último resultado para devolver a mesma lista enquanto nada mudar.
let cachedRaw = null;
let cachedAreas = [];

function getSnapshot() {
  const raw = localStorage.getItem("areas");
  if (raw !== cachedRaw || cachedRaw === null) {
    cachedAreas = getAreas();
    cachedRaw = localStorage.getItem("areas");
  }
  return cachedAreas;
}

export function useAreas() {
  return useSyncExternalStore(subscribeAreas, getSnapshot);
}
