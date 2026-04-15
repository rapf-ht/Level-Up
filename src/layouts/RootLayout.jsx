import { Outlet, Link, NavLink } from "react-router-dom";
import styles from "./RootLayout.module.css";

export default function RootLayout() {
  return (
    <div className={styles.layoutContainer}>
      <header>
        <nav className={styles.navbar}>
          <Link to="/">
            <img src="../../public/logo1.png" alt="Logo" />
          </Link>

          <NavLink
            to="/tarefas"
            className={({ isActive }) => `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`}
          >
            Tarefas
          </NavLink>
          <NavLink
            to="/Inventario"
            className={({ isActive }) => `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`}
          >
            Inventario
          </NavLink>
          <NavLink
            to="/Bazar do Hélio"
            className={({ isActive }) => `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`}
          >
            Bazar do Hélio
          </NavLink>
          <NavLink
            to="/Taverna"
            className={({ isActive }) => `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`}
          >
            Taverna
          </NavLink>
          <NavLink
            to="/Desafios"
            className={({ isActive }) => `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`}
          >
            Desafios
          </NavLink>
          <NavLink
            to="/Ajuda"
            className={({ isActive }) => `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`}
          >
            Ajuda
          </NavLink>
          <NavLink
            to="/Moeda"
            className={({ isActive }) => `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`}
          >
            Moeda
          </NavLink>
          <NavLink
            to="/Notificação"
            className={({ isActive }) => `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`}
          >
            Notificação
          </NavLink>
          <NavLink
            to="/Login"
            className={({ isActive }) => `${styles.btnNavbar} ${isActive ? styles.linkAtivo : ""}`}
          >
            Login
          </NavLink>
        </nav>
      </header>

      {/* 2. CONTEÚDO PRINCIPAL (Aqui a mágica acontece) */}
      <main className={styles.conteudoPrincipal}>
        {/* O <Outlet /> é substituído pelo componente da rota atual 
            (ex: <Home /> ou <Sobre />) */}
        <Outlet />
      </main>

      {/* 3. RODAPÉ */}
      <footer className={styles.footer}>
        <p>&copy; 2026 Meu App. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
