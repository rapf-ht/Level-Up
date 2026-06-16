import { useEffect } from "react";
import { useArea } from "../contexts/AreaContext";

export function useAreaInfo(title, icon) {
  const { setAreaInfo } = useArea();

  useEffect(() => {
    setAreaInfo({ title, icon });
  }, [title, icon]);
}