import '../styles/header.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Header() {
    return (
        <header className="header">
            <div className="container">
                <div className="row">
                    <div className='col-12 d-flex align-items-center justify-content-between w-100'>
                        
                        <div className="d-flex align-items-center gap-3">

                            <img src="./assets/levelup_logo.png" alt="logo_site" className="logo" />
                            <ul className="nav col-7 d-flex align-items-center gap-3">
                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page" href="#">Tarefas</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Inventário</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Bazar Mágico</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Taverna</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Desafios</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Ajuda</a>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="d-flex align-items-center gap-2">

                            <ul className="nav col-3 d-flex justify-content-end">
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Moeda</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Notificação</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Login</a>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </header>
    )
}