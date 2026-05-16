import { Outlet, Link, NavLink } from "react-router-dom";
import styles from "./RootLayout.module.css";
import ProfileCard from "../components/profile_card/ProfileCard";

export default function RootLayout() {
  return (
    <div className={styles.container}>

      <header className={styles['header-body']}>
        <nav className={styles.navbar}>
          <Link className={styles['logo-header-link']} to="/home">
            <img className={styles['logo-header']} src="/Logo_Level_UP_Mid.png" alt="logo_lvl_up" />
          </Link>
               
          <NavLink 
            to="/inventario" 
            className={({ isActive }) => `${styles['btn-navbar']} ${isActive ? styles.btnActive : null} `}
          >
              Inventário
          </NavLink>
          <NavLink 
            to="/bazar-magico" 
            className={({ isActive }) => `${styles['btn-navbar']} ${isActive ? styles.btnActive : null} `}
          >
              Bazar Mágico
          </NavLink>
          <NavLink 
            to="/taverna" 
            className={({ isActive }) => `${styles['btn-navbar']} ${isActive ? styles.btnActive : null} `}
          >
              Taverna
          </NavLink>
          <NavLink 
            to="/areas-da-vida" 
            className={({ isActive }) => `${styles['btn-navbar']} ${isActive ? styles.btnActive : null} `}
          >
              Áreas da Vida
          </NavLink>
        </nav>

        <nav className={styles.stats}>
          <div className={styles["card-gc"]}>
            <img className={styles['coins-gc']} src="" alt="" />
            <p className={styles.gc}>0</p>
          </div>
          <div className={styles['notification-icon']}>
            <img className={styles.bell} src="/bell.svg" alt="bell_icon" />
          </div>
          <ProfileCard />
        </nav>

      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles['footer-body']}>

        <div className={styles.col1}>
          <div className={styles['logo-footer']}>
            <Link to="/home">
              <img className={styles['logo-footer']} src="/Logo_Level_UP_Big.png" alt="logo-lvlup" />
            </Link>
          </div>
          <p className={styles['footer-caption']}>
            Plataforma organizacional gamificada <br /> 
            para grupos. Transforme suas tarefas em <br /> 
            missões e evolua junto com sua guilda.
          </p>
        </div>

        <div className={styles.columns}>
          <h3 className={styles['col-title']}>Navegação</h3>
          <div className={styles['line-splitter']}>
            <hr className={styles.line} />
          </div>
          <ul className={styles['col2-ul']}>
            <li><Link to="/inventario" className={styles['col-list']}>Inventário</Link></li>
            <li><Link to="/bazar-magico" className={styles['col-list']}>Bazar Mágico</Link></li>
            <li><Link to="/taverna" className={styles['col-list']}>Taverna</Link></li>
            <li><Link to="/areas-da-vida" className={styles['col-list']}>Áreas da Vida</Link></li>
          </ul>
        </div>

        <div className={styles.columns}>
          <h3 className={styles['col-title']}>Conta</h3>
          <div className={styles['line-splitter']}>
            <hr className={styles.line} />
          </div>
          <ul className={styles['col3-ul']}>
            <li><Link to="/perfil" className={styles['col-list']}>Meu Perfil</Link></li>
            <li><Link to="/configuracoes" className={styles['col-list']}>Configurações</Link></li>
            <li><Link to="/notificacoes" className={styles['col-list']}>Notificações</Link></li>
            <li><Link to="/estatisticas" className={styles['col-list']}>Estatísticas</Link></li>
            <li><Link to="/conquistas" className={styles['col-list']}>Conquistas</Link></li>
            <li><Link to="/sair" className={styles['col-list']}>Sair</Link></li>
          </ul>
        </div>

        <div className={styles.columns}>
          <h3 className={styles['col-title']}>Minha Guilda</h3>
          <div className={styles['line-splitter']}>
            <hr className={styles.line} />
          </div>
          <ProfileCard />
          <ProfileCard />
          <ProfileCard />
        </div>
      </footer>
      <div className={styles['license-line']}>
        <p className={styles['license']}>@ 2026 Level-UP</p>
      </div>
    </div>
    )
}