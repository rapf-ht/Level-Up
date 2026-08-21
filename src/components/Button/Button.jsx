import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export default function Button({children, classNmae = 'primary', type = 'button', to, onClick}) {
  const variantClass = styles[variant] || styles.primary;
  const combinedClasses = `${styles.button} ${variantClass} ${className}`;

// Se a prop `to` for informada, renderiza como <Link> do React Router
  if (to) {
    return (
      <Link to={to} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  // Caso contrário, renderiza como um <button> HTML normal
  return (
    <button type={type} onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  );
}
