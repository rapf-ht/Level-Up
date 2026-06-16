import { createContext, useContext, useState } from "react";

const AreaContext = createContext(null);

export function AreaProvider({ children }) {
  const [areaInfo, setAreaInfo] = useState({
    title: "Áreas da Vida",
    icon: "🎯",
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
