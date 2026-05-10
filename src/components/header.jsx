import '../styles/header.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Header() {
    return (
        <div className="container">
            <header className="header-body">
                <div className="logo">
                    <Link to="/home">
                        <img src="/Logo_Level_UP_Mid.png" alt="logo_lvl_up" />
                    </Link>
                </div>
                <nav className="navbar">
                    
                    <ul className="list-btns">
                        <li><Link to="/home">Inventário</Link></li>
                        <li><Link to="/home">Bazar Mágico</Link></li>
                        <li><Link to="/home">Taverna</Link></li>
                        <li><Link to="/home">Áreas da Vida</Link></li>
                    </ul>
                    
                    <div className="stats">
                        <div className="coins">
                            <img src="" alt="" />
                            <p className="gc">0</p>
                        </div>
                        <div className="notification-icon">
                            <img src="" alt="" />
                        </div>
                        <div className="pfp-card">
                            <img src="" alt="" />
                            <p className="username">Username</p>
                            <div className="xp-bar"></div>
                        </div>
                    </div>

                </nav>
            </header>
        </div>
    )
}