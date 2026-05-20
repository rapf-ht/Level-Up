import styles from './Signup.module.css'
import { Link } from 'react-router-dom'

export default function SignupForm() {
  return (
    <div className={styles.container}>
      <div className={styles['signup-form']}>

        <h4 className={styles['title-intro']}>
          📜 Toda lenda começou de algum lugar...
        </h4>
        <h4 className={styles['title-intro']}>
          A sua começa aqui 📜
        </h4>

        <div className={styles['choose-class']}>
          <h6 className={styles['text-choice']}>
            Escolha sua classe para começar a aventura:
          </h6>
          <div className={styles['list-classes']}>
            <button className={styles['class-btn']}>Guerreiro ⚔️</button>
            <button className={styles['class-btn']}>Mago 🔮</button>
            <button className={styles['class-btn']}>Ladino 🏹</button>
          </div>
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="signup-email" className={styles['form-label']}>Email:</label>
          <input
            type="email"
            className={styles['form-control']}
            id="signup-email"
            placeholder="Digite seu email"
            aria-describedby="emailDisclaimer"
          />
          <span id="emailDisclaimer" className={styles['span-disclaimer']}>
            Nós nunca compartilhamos seu email com ninguém
          </span>
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="signup-password" className={styles['form-label']}>Criar senha:</label>
          <input
            type="password"
            className={styles['form-control']}
            id="signup-password"
            placeholder="Digite sua senha"
          />
          <span className={styles['span-disclaimer']}>
            Mínimo 8 caracteres, letras maiúsculas e minúsculas
          </span>
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="signup-confirm-password" className={styles['form-label']}>
            Confirmar Senha:
          </label>
          <input
            type="password"
            className={styles['form-control']}
            id="signup-confirm-password"
            placeholder="Digite sua senha novamente"
          />
        </div>

        <div className={styles['grid']}>
          <button type="submit" className={styles['btn-enter']}>
            ⚔ Começar sua jornada ⚔
          </button>
        </div>

        <div className={styles['text-center']}>
          <Link to="/signin" className={styles['btn-link']}>
            Já tenho cadastro
            <svg xmlns="http://www.w3.org/2000/svg" className={styles['bi']} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
            </svg>
          </Link>
        </div>

      </div>
    </div>
  )
}