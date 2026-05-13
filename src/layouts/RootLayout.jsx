import { Outlet, Link, NavLink } from "react-router-dom";
import styles from "./RootLayout.module.css";

export default function RootLayout() {
  return (
    <div className={styles.container}>
        
      <header className={styles['header-body']}>
        <div className={styles.logo}>
          <Link to="/home">
            <img src="/Logo_Level_UP_Mid.png" alt="logo_lvl_up" />
          </Link>
        </div>
          
        <nav className={styles.navbar}>
          <ul className={styles['list-btns']}>
            <li><Link to="/home">Inventário</Link></li>
            <li><Link to="/home">Bazar Mágico</Link></li>
            <li><Link to="/home">Taverna</Link></li>
            <li><Link to="/home">Áreas da Vida</Link></li>
          </ul>
                   
          <div className={styles.stats}>
            <div className={styles.coins}>
              <img src="" alt="" />
                <p className={styles.gc}>0</p>
            </div>
            <div className={styles['notification-icon']}>
              <img src="" alt="" />
            </div>
            <div className={styles['pfp-card']}>
              <img src="" alt="" />
              <p className={styles.username}>Username</p>
              <div className={styles['xp-bar']}></div>
            </div>
          </div>

        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles['footer-body']}>

        <div className={styles.col1}>
          <div className={styles['logo-footer']}>
            <Link to="/home">
              <img src="/Logo_Level_UP_BIG.png" alt="logo-lvlup" />
            </Link>
          </div>
          <p className={styles['footer-caption']}>
            Plataforma organizacional gamificada <br /> 
            para grupos. Transforme suas tarefas em <br /> 
            missões e evolua junto com sua guilda.
          </p>
        </div>

        <div className={styles.col2}>
          <h3 className={styles['col-navegation']}>Navegação</h3>
          <div className={styles['line-splitter']}>
            <hr className={styles.line} />
          </div>
          <ul className={styles['col2-ul']}>
            <li><Link to="/home" className={styles['col2-list']}>Inventário</Link></li>
            <li><Link to="/home" className={styles['col2-list']}>Bazar Mágico</Link></li>
            <li><Link to="/home" className={styles['col2-list']}>Taverna</Link></li>
            <li><Link to="/home" className={styles['col2-list']}>Áreas da Vida</Link></li>
          </ul>
        </div>

        <div className={styles.col3}>
          <h3 className={styles['col-account']}>Conta</h3>
          <div className={styles['line-splitter']}>
            <hr className={styles.line} /> //Linha divisória entre o título e os links
          </div>
          <ul className={styles['col3-ul']}>
            <li><Link to="/home" className={styles['col3-list']}>Meu Perfil</Link></li>
            <li><Link to="/home" className={styles['col3-list']}>Configurações</Link></li>
            <li><Link to="/home" className={styles['col3-list']}>Notificações</Link></li>
            <li><Link to="/home" className={styles['col3-list']}>Estatísticas</Link></li>
            <li><Link to="/home" className={styles['col3-list']}>Conquistas</Link></li>
            <li><Link to="/home" className={styles['col3-list']}>Sair</Link></li>
          </ul>
        </div>

        <div className={styles.col4}>
          <h3 className={styles['col-guild']}>Minha Guilda</h3>
          <div className={styles['line-splitter']}>
            <hr className={styles.line} />
          </div>
          <div className={styles['pfp-card']}>
            <img src="" alt="" />
            <p className={styles.username}>Username</p>
            <div className={styles['xp-bar']}></div>
          </div>
          <div className={styles['pfp-card']}>
            <img src="" alt="" />
            <p className={styles.username}>Username</p>
            <div className={styles['xp-bar']}></div>
          </div>
          <div className={styles['pfp-card']}>
            <img src="" alt="" />
            <p className={styles.username}>Username</p>
            <div className={styles['xp-bar']}></div>
          </div>
        </div>
        <div className={styles['license-line']}>
          <p className={styles['license']}>@ 2026 Level-UP</p>
        </div>
      </footer>
    </div>
    )
}