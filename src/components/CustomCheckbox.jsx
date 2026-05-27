import { useState } from "react";
import styles from "./CustomCheckbox.module.css";

export function CustomCheckbox({ text }) {
  const [checked, setChecked] = useState(false);

  return (
    <label className={styles.checkboxContainer}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className={styles.hiddenInput}
      />
      <div
        className={`${styles.circle} ${checked ? styles.checked : styles.unchecked}`}
      >
        {checked && <span className={styles.checkmark}>L</span>}
      </div>
      {text ? <p className={`${styles.text} ${checked ? styles.textChecked : styles.textUnchecked}`}>{text}</p> : null}
    </label>
  );
}
