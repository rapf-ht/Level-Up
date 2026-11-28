import { useState } from "react";
import styles from "./AreaEditor.module.css";
import { ConfirmDialog } from "./ConfirmDialog";
import { AREA_COLORS } from "../data/areas";

// Criar ou editar uma área da vida: nome e cor. Ao editar, também dá para apagar.
export function AreaEditor({ open, area, onSave, onDelete, onClose }) {
  const [label, setLabel] = useState(area?.label ?? "");
  const [color, setColor] = useState(area?.colorKey ?? AREA_COLORS[0].key);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const editing = Boolean(area);
  const valid = label.trim().length >= 2;

  if (confirmDelete) {
    return (
      <ConfirmDialog
        open={open}
        title={`Apagar ${area.label}?`}
        confirmLabel="Apagar área"
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={onDelete}
      >
        <p>As missões desta área não serão apagadas. Elas passarão para Outros, e você poderá mudar a área delas depois.</p>
      </ConfirmDialog>
    );
  }

  return (
    <ConfirmDialog
      open={open}
      title={editing ? "Editar área" : "Nova área"}
      confirmLabel={editing ? "Salvar área" : "Criar área"}
      confirmDisabled={!valid}
      onCancel={onClose}
      onConfirm={() => valid && onSave({ label: label.trim(), color })}
    >
      <div className="field">
        <label htmlFor="area-nome" className="field-label">Nome</label>
        <input
          id="area-nome"
          className="px-input"
          type="text"
          maxLength={24}
          placeholder="Ex: Família, Academia, TCC"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
        />
      </div>
      <fieldset>
        <legend className={`field-label ${styles.legend}`}>Cor</legend>
        <div className={styles.colors}>
          {AREA_COLORS.map((item) => (
            <label key={item.key} className={`${styles.color} ${color === item.key ? styles.colorOn : ""}`} title={item.label}>
              <input type="radio" name="area-cor" className="sr-only" checked={color === item.key} onChange={() => setColor(item.key)} />
              <span className={styles.swatch} style={{ background: `var(--area-${item.key})` }} aria-hidden="true" />
              <span className="sr-only">{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {editing && (
        <button type="button" className={styles.remove} onClick={() => setConfirmDelete(true)}>Apagar esta área</button>
      )}
    </ConfirmDialog>
  );
}
