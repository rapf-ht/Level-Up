import styles from './Tavern.module.css';
import { useState } from 'react';

const gruposDemo = [
  { id: 1, nome: 'Nome do grupo', lider: 'usuario master' },
  { id: 2, nome: 'Nome do grupo', lider: 'usuario master' },
  { id: 3, nome: 'Nome do grupo', lider: 'usuario master' },
  { id: 4, nome: 'Nome do grupo', lider: 'usuario master' },
  { id: 5, nome: 'Nome do grupo', lider: 'usuario master' },
  { id: 6, nome: 'Nome do grupo', lider: 'usuario master' },
  { id: 7, nome: 'Nome do grupo', lider: 'usuario master' },
  { id: 8, nome: 'Nome do grupo', lider: 'usuario master' },
  { id: 9, nome: 'Nome do grupo', lider: 'usuario master' },
  { id: 10, nome: 'Nome do grupo', lider: 'usuario master' },
];

export default function Tavern() {
  const [abaAtiva, setAbaAtiva] = useState('grupo');
  const [busca, setBusca] = useState('');

  const gruposFiltrados = gruposDemo.filter(g =>
    g.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <img
          src="/taverna-banner.png"
          alt="Taverna RPG"
          className={styles['hero-img']}
        />
        <div className={styles['hero-overlay']} />
      </div>

      <div className={styles.content}>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${abaAtiva === 'grupo' ? styles['tab-active'] : ''}`}
            onClick={() => setAbaAtiva('grupo')}
          >
            Grupo
          </button>
          <button
            className={`${styles.tab} ${abaAtiva === 'mural' ? styles['tab-active'] : ''}`}
            onClick={() => setAbaAtiva('mural')}
          >
            Mural de missões
          </button>
          <button
            className={`${styles.tab} ${abaAtiva === 'amigos' ? styles['tab-active'] : ''}`}
            onClick={() => setAbaAtiva('amigos')}
          >
            Amigos
          </button>
        </div>

        {abaAtiva === 'grupo' && (
          <div className={styles['aba-grupo']}>

            <div className={styles['action-bar']}>
              <div className={styles['search-wrap']}>
                <svg className={styles['search-icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  className={styles['search-input']}
                  placeholder="Buscar grupo..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />
              </div>
              <div className={styles['action-btns']}>
                <button className={styles['btn-criar']}>
                  <span>+</span> Criar Grupo
                </button>
                <button className={styles['btn-aceitar']}>
                  ↩ Aceitar
                </button>
              </div>
            </div>

            <div className={styles['grupos-grid']}>
              {gruposFiltrados.map(grupo => (
                <div key={grupo.id} className={styles['grupo-card']}>
                  <div className={styles['grupo-card-left']}>
                    <div className={styles['grupo-avatar']}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <div className={styles['grupo-info']}>
                      <p className={styles['grupo-nome']}>{grupo.nome}</p>
                      <p className={styles['grupo-lider']}>
                        Líder: <span>{grupo.lider}</span>
                      </p>
                    </div>
                  </div>
                  <button className={styles['btn-entrar']}>
                    Entrar
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                  </button>
                </div>
              ))}

              {gruposFiltrados.length === 0 && (
                <div className={styles['empty-state']}>
                  <p>Nenhum grupo encontrado.</p>
                  <span>Tente outro nome ou crie o seu!</span>
                </div>
              )}
            </div>

          </div>
        )}

        {abaAtiva === 'mural' && (
          <div className={styles['aba-placeholder']}>
            <p>📋 Mural de missões em construção...</p>
          </div>
        )}

        {abaAtiva === 'amigos' && (
          <div className={styles['aba-placeholder']}>
            <p>👥 Lista de amigos em construção...</p>
          </div>
        )}

      </div>
    </div>
  );
}