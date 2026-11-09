import { useEffect, useState } from "react";
import { MissionManager } from "../manager/MissionManager";

function read() {
  return {
    player: MissionManager.getPlayerState(),
    missions: MissionManager.getMissions(),
  };
}

export function useGameData() {
  const [data, setData] = useState(read);

  useEffect(() => {
    const sync = () => setData(read());
    sync();
    window.addEventListener("playerStateUpdated", sync);
    return () => window.removeEventListener("playerStateUpdated", sync);
  }, []);

  return data;
}
