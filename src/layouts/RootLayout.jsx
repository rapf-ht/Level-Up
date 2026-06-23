import { useState } from "react";
import { Outlet, Link, NavLink, ScrollRestoration } from "react-router-dom";
import styles from "./RootLayout.module.css";
import ProfileCard from "../components/profile_card/ProfileCard";
import { useTheme } from "../contexts/ThemeContext";
import { useEffect } from "react";
import { MissionManager } from "../manager/MissionManager";

export default function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [player, setPlayer] = useState(MissionManager.getPlayerState());

  useEffect(() => {
    MissionManager.checkFailedDailies();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles["header-body"]}>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            className={`${styles["ham-line"]} ${menuOpen ? styles["ham-open"] : ""}`}
          ></span>
          <span
            className={`${styles["ham-line"]} ${menuOpen ? styles["ham-open"] : ""}`}
          ></span>
          <span
            className={`${styles["ham-line"]} ${menuOpen ? styles["ham-open"] : ""}`}
          ></span>
        </button>
        <nav
          className={`${styles.navbar} ${menuOpen ? styles["navbar-open"] : ""}`}
        >
          <Link className={styles["logo-header-link"]} to="/home">
            <img
              className={styles["logo-header"]}
              src="/logos/Logo_LevelUP_Mid.svg"
              alt="logo_lvl_up"
            />
          </Link>

          <NavLink
            to="/home"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `${styles["btn-navbar"]} ${styles["btn-navbar-home-mobile"]} ${isActive ? styles.btnActive : null} `
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/areas-da-vida/"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `${styles["btn-navbar"]} ${isActive ? styles.btnActive : null} `
            }
          >
            Áreas da Vida
          </NavLink>
          <NavLink
            to="/inventario"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `${styles["btn-navbar"]} ${isActive ? styles.btnActive : null} `
            }
          >
            Inventário
          </NavLink>
          <NavLink
            to="/bazar-magico"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `${styles["btn-navbar"]} ${isActive ? styles.btnActive : null} `
            }
          >
            Bazar Mágico
          </NavLink>
          <NavLink
            to="/tavern"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `${styles["btn-navbar"]} ${isActive ? styles.btnActive : null} `
            }
          >
            Taverna
          </NavLink>
        </nav>

        <nav className={styles.stats}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggleBtn}
            aria-label="Alternar Tema"
          >
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.22" x2="5.64" y2="17.8"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          <div className={styles["card-gc"]}>
            <img
              className={styles["coins-gc"]}
              src="/icons/Coin_icon.svg"
              alt=""
            />
            <p className={styles.gc}>{player.gold}</p>
          </div>
          <div className={styles["notification-card"]}>
            <img
              className={styles.bell}
              src="/icons/Bell_icon.svg"
              alt="bell_icon"
            />
          </div>
          <ProfileCard />
        </nav>
      </header>

      <main className={styles.main}>
        <ScrollRestoration />
        <Outlet />
      </main>

      <footer className={styles["footer-body"]}>
        <div className={styles.col1}>
          <div className={styles["logo-footer"]}>
            <Link to="/home">
              <img
                className={styles["logo-footer"]}
                src="/logos/Logo_Level_UP_Big.svg"
                alt="logo-lvlup"
              />
            </Link>
          </div>
          <p className={styles["footer-caption"]}>
            Plataforma organizacional gamificada <br />
            para grupos. Transforme suas tarefas em <br />
            missões e evolua junto com sua guilda.
          </p>
        </div>

        <div className={styles.columns}>
          <h3 className={styles["col-title"]}>Navegação</h3>
          <div className={styles["line-splitter"]}>
            <hr className={styles.line} />
          </div>
          <ul className={styles["col2-ul"]}>
            <li>
              <Link to="/inventario" className={styles["col-list"]}>
                Inventário
              </Link>
            </li>
            <li>
              <Link to="/bazar-magico" className={styles["col-list"]}>
                Bazar Mágico
              </Link>
            </li>
            <li>
              <Link to="/tavern" className={styles["col-list"]}>
                Taverna
              </Link>
            </li>
            <li>
              <Link to="/areas-da-vida" className={styles["col-list"]}>
                Áreas da Vida
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.columns}>
          <h3 className={styles["col-title"]}>Conta</h3>
          <div className={styles["line-splitter"]}>
            <hr className={styles.line} />
          </div>
          <ul className={styles["col3-ul"]}>
            <li>
              <Link to="/perfil" className={styles["col-list"]}>
                Meu Perfil
              </Link>
            </li>
            <li>
              <Link to="/configuracoes" className={styles["col-list"]}>
                Configurações
              </Link>
            </li>
            <li>
              <Link to="/estatisticas" className={styles["col-list"]}>
                Estatísticas
              </Link>
            </li>
            <li>
              <Link to="/sair" className={styles["col-list"]}>
                Sair
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.columns}>
          <h3 className={styles["col-title"]}>Suporte</h3>
          <div className={styles["line-splitter"]}>
            <hr className={styles.line} />
          </div>
          <ul className={styles["col4-ul"]}>
            <li>
              <Link to="/ajuda" className={styles["col-list"]}>
                Perguntas Frequentes
              </Link>
            </li>
            <li>
              <Link to="/ajuda" className={styles["col-list"]}>
                Reportar um problema
              </Link>
            </li>
            <li>
              <Link to="/ajuda" className={styles["col-list"]}>
                Solicitar funcionalidade
              </Link>
            </li>
            <li>
              <Link to="/contato" className={styles["col-list"]}>
                Contato
              </Link>
            </li>
          </ul>
        </div>
      </footer>
      <div className={styles["license-line"]}>
        <p className={styles["license"]}>@ 2026 Level-UP</p>
      </div>
      <footer className={styles.footerMobile}>
        <NavLink
          to="/tavern"
          className={({ isActive }) =>
            isActive ? styles.activeMobileLink : ""
          }
        >
          <div className={styles.btnFooterMobile}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 4H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2v4l4-4h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <path d="M18 9h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4h-3a2 2 0 0 1-2-2v-2" />
            </svg>

            <p>Taverna</p>
          </div>
        </NavLink>
        <NavLink
          to="/areas-da-vida"
          className={({ isActive }) =>
            isActive ? styles.activeMobileLink : ""
          }
        >
          <div className={styles.btnFooterMobile}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="4" y="4" width="6" height="6" rx="1.5" />
              <rect x="14" y="4" width="6" height="6" rx="1.5" />
              <rect x="14" y="14" width="6" height="6" rx="1.5" />
              <rect x="4" y="14" width="6" height="6" rx="1.5" />
            </svg>

            <p>Áreas</p>
          </div>
        </NavLink>
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? styles.activeMobileLink : ""
          }
        >
          <div className={styles.btnFooterMobile}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>

            <p>Home</p>
          </div>
        </NavLink>
        <NavLink
          to="/bazar-do-helio"
          className={({ isActive }) =>
            isActive ? styles.activeMobileLink : ""
          }
        >
          <div className={styles.btnFooterMobile}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 9l2-5h14l2 5" />
              <path d="M3 9h18" />
              <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
              <path d="M4 12v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8" />
            </svg>

            <p>Bazar</p>
          </div>
        </NavLink>
      </footer>
    </div>
  );
}
