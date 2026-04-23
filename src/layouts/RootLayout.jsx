import { Outlet, Link, NavLink } from "react-router-dom";
import styles from "./RootLayout.module.css";

export default function RootLayout() {
  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <Link to="/">
          <img src="../../public/logo1.png" alt="Logo" width={64} />
        </Link>
        <h1>LEVEL UP</h1>
        <Link to="/" className={styles.btnProfile}>
          <img
            src="../../public/icons-mobile/profile-icon.png"
            alt="Profile"
            width={64}
          />
        </Link>
        <nav className={styles.navbar}>
          <NavLink
            to="/tarefas"
            className={({ isActive }) =>
              `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`
            }
          >
            Tarefas
          </NavLink>
          <NavLink
            to="/Inventario"
            className={({ isActive }) =>
              `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`
            }
          >
            Inventario
          </NavLink>
          <NavLink
            to="/Bazar do Hélio"
            className={({ isActive }) =>
              `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`
            }
          >
            Bazar do Hélio
          </NavLink>
          <NavLink
            to="/Taverna"
            className={({ isActive }) =>
              `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`
            }
          >
            Taverna
          </NavLink>
          <NavLink
            to="/Desafios"
            className={({ isActive }) =>
              `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`
            }
          >
            Desafios
          </NavLink>
          <NavLink
            to="/Ajuda"
            className={({ isActive }) =>
              `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`
            }
          >
            Ajuda
          </NavLink>
          <NavLink
            to="/Notificação"
            className={({ isActive }) =>
              `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`
            }
          >
            Notificação
          </NavLink>
          <NavLink
            to="/Login"
            className={({ isActive }) =>
              `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`
            }
          >
            Login
          </NavLink>
        </nav>
      </header>

      <main className={styles.conteudoPrincipal}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 Meu App. Todos os direitos reservados.</p>
      </footer>
      <footer className={styles.footerMobile}>
        <Link to="/Taverna">
          <div className={styles.btnFooterMobile}>
            <img
              src="../../public/icons-mobile/social-icon.png"
              alt="Taverna"
              width={40}
            />
            <p>Taverna</p>
          </div>
        </Link>
        <Link to="/Categorias">
          <div className={styles.btnFooterMobile}>
            <img
              src="../../public/icons-mobile/category-icon.png"
              alt="Categorias"
              width={40}
            />
            <p>Categorias</p>
          </div>
        </Link>
        <Link to="/">
          <div className={styles.btnFooterMobile}>
            <img
              src="../../public/icons-mobile/home-icon.png"
              alt="Home"
              width={40}
            />
            <p>Home</p>
          </div>
        </Link>
        <Link to="/Bazar do Hélio">
          <div className={styles.btnFooterMobile}>
            <img
              src="../../public/icons-mobile/store-icon.png"
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
