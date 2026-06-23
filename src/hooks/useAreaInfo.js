import { useEffect } from "react";
import { useArea } from "../contexts/AreaContext";

export function useAreaInfo(title, icon, banner) {
  const { setAreaInfo } = useArea();

  useEffect(() => {
    setAreaInfo((prev) => ({ title, icon, banner: banner ?? prev.banner, }));
  }, [title, icon, banner]);
}