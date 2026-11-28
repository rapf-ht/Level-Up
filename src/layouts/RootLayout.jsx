import { useEffect } from "react";
import { Outlet, Link, NavLink, ScrollRestoration } from "react-router-dom";
import styles from "./RootLayout.module.css";
import { MissionManager } from "../manager/MissionManager";
import { useGameData } from "../hooks/useGameData";
import { GameEffects } from "../components/GameEffects";
import { useTheme } from "../hooks/useTheme";
import { NotificationBell } from "../components/NotificationBell";
import { UndoToast } from "../components/UndoToast";
import { BagIcon, GridIcon, HomeIcon, MoonIcon, MugIcon, SunIcon, UserIcon } from "../components/PixelIcons";

const MAIN_NAV = [
  { to: "/home", label: "Início" },
  { to: "/areas-da-vida", label: "Missões" },
  { to: "/inventario", label: "Inventário" },
  { to: "/bazar-magico", label: "Bazar" },
  { to: "/tavern", label: "Taverna" },
];

const MOBILE_NAV = [
  { to: "/home", label: "Início", Icon: HomeIcon },
  { to: "/areas-da-vida", label: "Missões", Icon: GridIcon },
  { to: "/bazar-magico", label: "Bazar", Icon: BagIcon },
  { to: "/inventario", label: "Inventário", Icon: UserIcon },
  { to: "/tavern", label: "Taverna", Icon: MugIcon },
];

export default function RootLayout() {
  const { player } = useGameData();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    MissionManager.checkFailedDailies();
  }, []);

  return (
    <div className={styles.shell}>
      <GameEffects />
      <UndoToast />
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/home" className={styles.logoLink}>
            <img src="/ui/logo.png" alt="Level Up" className={`${styles.logo} pixel-img`} />
          </Link>
          <nav aria-label="Principal" className={styles.nav}>
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navActive : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className={styles.status}>
            <div className={styles.gold}>
              <img src="/ui/coin.svg" alt="" className={`${styles.coin} pixel-img`} />
              <span className="sr-only">Ouro:</span>
              <span>{player.gold}</span>
            </div>
            <button
              type="button"
              aria-label={isLight ? "Mudar para o tema escuro" : "Mudar para o tema claro"}
              title={isLight ? "Tema escuro (masmorra)" : "Tema claro (pergaminho)"}
              className={styles.iconButton}
              onClick={toggleTheme}
            >
              {isLight ? <MoonIcon size={18} /> : <SunIcon size={20} />}
            </button>
            <NotificationBell />
            <Link to="/inventario" aria-label="Seu perfil" className={styles.avatar}>
              <img src="/ui/avatar.png" alt="" />
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <ScrollRestoration />
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <img src="/ui/logo.png" alt="Level Up" className={`${styles.footerLogo} pixel-img`} />
          <span>Projeto Integrador II</span>
        </div>
      </footer>

      <nav aria-label="Principal no celular" className={styles.mobileNav}>
        {MOBILE_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileActive : ""}`}
          >
            <item.Icon size={22} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
