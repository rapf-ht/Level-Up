import styles from "./CustomCheckbox.module.css";

export function CustomCheckbox({ text, checked, onToggle }) {
  return (
    <label className={styles.checkboxContainer}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className={styles.hiddenInput}
      />
      <div
        className={`${styles.circle} ${checked ? styles.checked : styles.unchecked}`}
      >
        {checked && <span className={styles.checkmark}>L</span>}
      </div>
      {text ? (
        <p
          className={`${styles.text} ${checked ? styles.textChecked : styles.textUnchecked}`}
        >
          {text}
        </p>
      ) : null}
    </label>
  );
}
