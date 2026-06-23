import { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import styles from "./RootLayout.module.css";
import ProfileCard from "../components/profile_card/ProfileCard";
import { useTheme } from "../contexts/ThemeContext";

export default function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.container}>
      <header className={styles["header-body"]}>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            className={`${styles["ham-line"]} ${menuOpen ? styles["ham-open"] : null}`}
          ></span>
          <span
            className={`${styles["ham-line"]} ${menuOpen ? styles["ham-open"] : null}`}
          ></span>
          <span
            className={`${styles["ham-line"]} ${menuOpen ? styles["ham-open"] : null}`}
          ></span>
        </button>
        <nav className={styles.navbar}>
          <Link className={styles["logo-header-link"]} to="/home">
            <img
              className={styles["logo-header"]}
              src="/logos/Logo_LevelUP_Mid.svg"
              alt="logo_lvl_up"
            />
          </Link>

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
            to="/taverna"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `${styles["btn-navbar"]} ${isActive ? styles.btnActive : null} `
            }
          >
            Taverna
          </NavLink>
          <NavLink
            to="/areas-da-vida"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `${styles["btn-navbar"]} ${isActive ? styles.btnActive : null} `
            }
          >
            Áreas da Vida
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
            <p className={styles.gc}>0</p>
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
              <Link to="/taverna" className={styles["col-list"]}>
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
              <Link to="/notificacoes" className={styles["col-list"]}>
                Notificações
              </Link>
            </li>
            <li>
              <Link to="/estatisticas" className={styles["col-list"]}>
                Estatísticas
              </Link>
            </li>
            <li>
              <Link to="/conquistas" className={styles["col-list"]}>
                Conquistas
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
          <h3 className={styles["col-title"]}>Minha Guilda</h3>
          <div className={styles["line-splitter"]}>
            <hr className={styles.line} />
          </div>
          <ProfileCard />
          <ProfileCard />
          <ProfileCard />
        </div>
      </footer>
      <div className={styles["license-line"]}>
        <p className={styles["license"]}>@ 2026 Level-UP</p>
      </div>
      <footer className={styles.footerMobile}>
        <Link to="/Taverna">
          <div className={styles.btnFooterMobile}>
            <img src="/icons-mobile/social-icon.png" alt="Taverna" width={40} />
            <p>Taverna</p>
          </div>
        </Link>
        <Link to="/Categorias">
          <div className={styles.btnFooterMobile}>
            <img
              src="/icons-mobile/category-icon.png"
              alt="Categorias"
              width={40}
            />
            <p>Categorias</p>
          </div>
        </Link>
        <Link to="/">
          <div className={styles.btnFooterMobile}>
            <img src="/icons-mobile/home-icon.png" alt="Home" width={40} />
            <p>Home</p>
          </div>
        </Link>
        <Link to="/Bazar do Hélio">
          <div className={styles.btnFooterMobile}>
            <img
              src="/icons-mobile/store-icon.png"
              alt="Bazar do Hélio"
              width={40}
            />
            <p>Bazar</p>
          </div>
        </Link>
      </footer>
    </div>
  );
}
