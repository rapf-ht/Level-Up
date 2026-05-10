import "../styles/footer.css"

export default function Footer() {
    return (
        <div className="container">
            <footer className="footer-body">

                <div className="col1">
                    <div className="logo-footer">
                        <Link to="/home">
                            <img src="/Logo_Level_UP_BIG.png" alt="logo-lvlup" />
                        </Link>
                    </div>
                    <p className="footer-caption">
                        Plataforma organizacional gamificada <br /> 
                        para grupos. Transforme suas tarefas em <br /> 
                        missões e evolua junto com sua guilda.
                        </p>
                </div>

                <div className="col2">
                    <h3 className="col-navegation">Navegação</h3>
                    <div className="line-splitter">
                        <hr className="line" /> //Linha divisória entre o título e os links
                    </div>
                    <ul className="col2-ul">
                        <li><Link to="/home" className="col2-list">Inventário</Link></li>
                        <li><Link to="/home" className="col2-list">Bazar Mágico</Link></li>
                        <li><Link to="/home" className="col2-list">Taverna</Link></li>
                        <li><Link to="/home" className="col2-list">Áreas da Vida</Link></li>
                    </ul>
                </div>

                <div className="col3">
                    <h3 className="col-account">Conta</h3>
                    <div className="line-splitter">
                        <hr className="line" /> //Linha divisória entre o título e os links
                    </div>
                    <ul className="col3-ul">
                        <li><Link to="/home" className="col3-list">Meu Perfil</Link></li>
                        <li><Link to="/home" className="col3-list">Configurações</Link></li>
                        <li><Link to="/home" className="col3-list">Notificações</Link></li>
                        <li><Link to="/home" className="col3-list">Estatísticas</Link></li>
                        <li><Link to="/home" className="col3-list">Conquistas</Link></li>
                        <li><Link to="/home" className="col3-list">Sair</Link></li>
                    </ul>
                </div>

                <div className="col4">
                    <h3 className="col-guild">Minha Guilda</h3>
                    <div className="line-splitter">
                        <hr className="line" /> //Linha divisória entre o título e os links
                    </div>
                    <div className="pfp-card">
                            <img src="" alt="" />
                            <p className="username">Username</p>
                            <div className="xp-bar"></div>
                    </div>
                    <div className="pfp-card">
                            <img src="" alt="" />
                            <p className="username">Username</p>
                            <div className="xp-bar"></div>
                    </div>
                    <div className="pfp-card">
                            <img src="" alt="" />
                            <p className="username">Username</p>
                            <div className="xp-bar"></div>
                    </div>
                </div>
                <div className="license-line">
                    <p className="license">@ 2026 Level-UP</p>
                </div>
            </footer>
        </div>
    )
}