import styles from './Button.module.css';

export default function button({ children, variant = 'primary', type = 'button', ...props }) {
  return (
    <button type={type} className={`${styles.button} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
}