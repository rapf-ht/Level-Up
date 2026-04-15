import { Link, useRouteError } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  // Captura o erro gerado pelo React Router

  return (
    <div className={styles.mainContainer}>
        <div className={styles.backgroundGif}>

        </div>
      <h1>Oops! 😢</h1>
      <p>Desculpe, ocorreu um erro inesperado.</p>
    </div>
  );
}