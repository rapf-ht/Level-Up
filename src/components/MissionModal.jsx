import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./MissionModal.module.css";
import { MissionManager } from "../manager/MissionManager";
import { AREAS, OTHER_AREA } from "../data/areas";
import { CloseIcon } from "./PixelIcons";

const CATEGORIES = [...AREAS, OTHER_AREA];

const DIFFICULTIES = [
  { value: "daily", label: "Diária", reward: "10 XP · 5 G" },
  { value: "medium", label: "Média", reward: "30 XP · 15 G" },
  { value: "weekly", label: "Semanal", reward: "100 XP · 50 G" },
];

const validationSchema = Yup.object({
  title: Yup.string().trim().min(3, "Use pelo menos 3 letras.").required("Dê um nome para a missão."),
  type: Yup.string().oneOf(DIFFICULTIES.map((d) => d.value)).required(),
  category: Yup.string().oneOf(CATEGORIES.map((c) => c.value)).required(),
});

function ModalContent({ onClose, category }) {
  const formik = useFormik({
    initialValues: { title: "", type: "daily", category: category || AREAS[0].value },
    validationSchema,
    onSubmit: (values) => {
      MissionManager.createMission(values.title.trim(), values.type, values.category);
      window.dispatchEvent(new Event("playerStateUpdated"));
      onClose();
    },
  });

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hasError = formik.touched.title && formik.errors.title;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nm-title"
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.head}>
          <h2 id="nm-title" className={styles.title}>Nova missão</h2>
          <button type="button" aria-label="Fechar" className={styles.close} onClick={onClose}>
            <CloseIcon size={14} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className={styles.form} noValidate>
          <div className="field">
            <label htmlFor="nm-nome" className="field-label">NOME DA MISSÃO</label>
            <input
              id="nm-nome"
              name="title"
              type="text"
              className="px-input"
              placeholder="Ex: Ler 10 páginas"
              autoFocus
              aria-invalid={Boolean(hasError)}
              aria-describedby={hasError ? "nm-erro" : undefined}
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {hasError && <span id="nm-erro" className="field-error">{formik.errors.title}</span>}
          </div>

          <fieldset className="field">
            <legend className={`field-label ${styles.legend}`}>DIFICULDADE</legend>
            <div className={styles.difficulties}>
              {DIFFICULTIES.map((difficulty) => {
                const selected = formik.values.type === difficulty.value;
                return (
                  <label key={difficulty.value} className={`${styles.difficulty} ${selected ? styles.selected : ""}`}>
                    <input
                      type="radio"
                      name="type"
                      value={difficulty.value}
                      checked={selected}
                      onChange={formik.handleChange}
                      className="sr-only"
                    />
                    <span className={styles.difficultyName}>{difficulty.label}</span>
                    <span className={styles.difficultyReward}>{difficulty.reward}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="nm-area" className="field-label">ÁREA DA VIDA</label>
            <select
              id="nm-area"
              name="category"
              className="px-input"
              value={formik.values.category}
              onChange={formik.handleChange}
            >
              {CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Criar missão</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MissionModal({ isOpen, onClose, category }) {
  if (!isOpen) return null;
  return <ModalContent onClose={onClose} category={category} />;
}
