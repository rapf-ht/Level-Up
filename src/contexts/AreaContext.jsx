import { createContext, useContext, useState } from "react";

const AreaContext = createContext(null);

export function AreaProvider({ children }) {
  const [areaInfo, setAreaInfo] = useState({
    title: "Áreas da Vida",
    icon: "🎯",
    banner: "/banners/default-banner.jpg",
  });
  return (
    <AreaContext.Provider value={{ areaInfo, setAreaInfo }}>
      {children}
    </AreaContext.Provider>
  );
}

export function useArea() {
  return useContext(AreaContext);
}
