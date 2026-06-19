import { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import styles from "./RootLayout.module.css";
import ProfileCard from "../components/profile_card/ProfileCard";

export default function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false); // menuNavbarOpen é a função que altera o estado do menuNavbar
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
            to="/areas-da-vida/saude"
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
            to="/taverna"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `${styles["btn-navbar"]} ${isActive ? styles.btnActive : null} `
            }
          >
            Taverna
          </NavLink>
        </nav>

        <nav className={styles.stats}>
          <div className={styles["card-gc"]}>
            <img
              className={styles["coins-gc"]}
              src="/icons/Coin_icon.svg"
              alt=""
            />
            <p className={styles.gc}>1200</p>
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
