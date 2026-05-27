import styles from './Signin.module.css'
import { Link } from 'react-router-dom'

export default function SigninForm() {
  return (
    <div className={styles.container}>
      
      <div className={styles['signin-form']}>

            <h4 className={styles['title-intro']}>
              🧙 Bem-vindo, Aventureiro(a)
            </h4>

            <div className={styles['form-group']}>
              <label htmlFor="signin-email" className={styles['form-label']}>Email:</label>
              <input
                type="email"
                className={styles['form-control']}
                id="signin-email"
                placeholder="  Digite seu email"
                aria-describedby="emailDisclaimer"
              />
              <span id="emailDisclaimer" className={styles['span-disclaimer']}>
                Nós nunca compartilhamos seu email com ninguém
              </span>
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="signin-password" className={styles['form-label']}>Senha:</label>
              <input
                type="password"
                className={styles['form-control']}
                id="signin-password"
                placeholder="  Digite sua senha"
              />
              <span className={styles['span-disclaimer']}>
                Mínimo 8 caracteres, letras maiúsculas e minúsculas
              </span>
            </div>

            <div className={styles.grid}>
              <Link to="/home" className={styles['btn-enter']}>
                ⚔ Entrar
              </Link>
            </div>

            <div className={styles['text-center']}>
              <Link to="/signup" className={styles['btn-link']}>
                Não tenho cadastro
                <svg xmlns="http://www.w3.org/2000/svg" className={styles['bi']} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
              </Link>
            </div>

      </div>

    </div>
  )
}