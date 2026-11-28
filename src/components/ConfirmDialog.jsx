import { useEffect, useRef } from "react";
import styles from "./ConfirmDialog.module.css";

// Janela de confirmação com <dialog> nativo: prende o foco, fecha com Esc e devolve o foco ao sair.
export function ConfirmDialog({ open, title, children, confirmLabel, cancelLabel = "Cancelar", onConfirm, onCancel, confirmDisabled = false, danger = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`frame ${styles.dialog}`}
      aria-labelledby="confirm-title"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        // Fecha só com clique no fundo escurecido (fora da caixa), não no espaço interno da janela
        const box = ref.current.getBoundingClientRect();
        const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
        if (event.target === ref.current && outside) onCancel();
      }}
    >
      <h2 id="confirm-title" className={styles.title}>{title}</h2>
      <div className={styles.body}>{children}</div>
      <div className={styles.actions}>
        <button type="button" className={danger ? `btn ${styles.danger}` : "btn btn-primary"} onClick={onConfirm} disabled={confirmDisabled}>{confirmLabel}</button>
        <button type="button" className="btn" onClick={onCancel}>{cancelLabel}</button>
      </div>
    </dialog>
  );
}
