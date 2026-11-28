import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./MissionModal.module.css";
import { MissionManager, dayKey } from "../manager/MissionManager";
import { OTHER_AREA } from "../data/areas";
import { DIFFICULTIES, DIFFICULTY_ORDER, MISSION_TYPES, TYPE_ORDER } from "../data/missions";
import { useAreas } from "../hooks/useAreas";
import { CloseIcon } from "./PixelIcons";

function ModalContent({ onClose, category, mission }) {
  const areas = useAreas();
  const categories = [...areas, OTHER_AREA];
  const editing = Boolean(mission);

  const validationSchema = Yup.object({
    title: Yup.string().trim().min(3, "Use pelo menos 3 letras.").required("Dê um nome para a missão."),
    type: Yup.string().oneOf(TYPE_ORDER).required(),
    difficulty: Yup.string().oneOf(DIFFICULTY_ORDER).required(),
    category: Yup.string().oneOf(categories.map((c) => c.value)).required(),
    dueDate: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      title: mission?.title ?? "",
      type: mission?.type ?? "diaria",
      difficulty: mission?.difficulty ?? "facil",
      category: mission?.category ?? category ?? areas[0]?.value ?? OTHER_AREA.value,
      dueDate: mission?.dueDate ?? "",
    },
    validationSchema,
    onSubmit: (values) => {
      const data = {
        title: values.title.trim(),
        type: values.type,
        difficulty: values.difficulty,
        category: values.category,
        dueDate: values.type === "afazer" && values.dueDate ? values.dueDate : null,
      };
      if (editing) MissionManager.updateMission(mission.id, data);
      else MissionManager.createMission(data);
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

  // O erro do nome só aparece depois da primeira tentativa de salvar
  const hasError = formik.submitCount > 0 && formik.errors.title;
  const type = formik.values.type;

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
          <h2 id="nm-title" className={styles.title}>{editing ? "Editar missão" : "Nova missão"}</h2>
          <button type="button" aria-label="Fechar" className={styles.close} onClick={onClose}>
            <CloseIcon size={14} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className={styles.form} noValidate>
          <div className="field">
            <label htmlFor="nm-nome" className="field-label">Nome da missão</label>
            <input
              id="nm-nome"
              name="title"
              type="text"
              className="px-input"
              placeholder={type === "habito" ? "Ex: Beber um copo de água" : type === "diaria" ? "Ex: Ler 10 páginas" : "Ex: Pagar a conta de luz"}
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
            <legend className={`field-label ${styles.legend}`}>Tipo</legend>
            <div className={styles.options}>
              {TYPE_ORDER.map((key) => {
                const selected = type === key;
                return (
                  <label key={key} className={`${styles.option} ${selected ? styles.selected : ""}`}>
                    <input type="radio" name="type" value={key} checked={selected} onChange={formik.handleChange} className="sr-only" />
                    <span className={styles.optionName}>{MISSION_TYPES[key].label}</span>
                  </label>
                );
              })}
            </div>
            <p className={styles.hint}>{MISSION_TYPES[type].hint}</p>
          </fieldset>

          <fieldset className="field">
            <legend className={`field-label ${styles.legend}`}>Dificuldade</legend>
            <div className={styles.options}>
              {DIFFICULTY_ORDER.map((key) => {
                const item = DIFFICULTIES[key];
                const selected = formik.values.difficulty === key;
                return (
                  <label key={key} className={`${styles.option} ${selected ? styles.selected : ""}`}>
                    <input type="radio" name="difficulty" value={key} checked={selected} onChange={formik.handleChange} className="sr-only" />
                    <span className={styles.optionName}>{item.label}</span>
                    <span className={styles.optionReward}>+{item.xp} XP, +{item.gold} G</span>
                  </label>
                );
              })}
            </div>
            {type === "diaria" && (
              <p className={styles.hint}>Se não for cumprida no dia, custa {DIFFICULTIES[formik.values.difficulty].hpLoss} de HP.</p>
            )}
          </fieldset>

          <div className={styles.row}>
            <div className="field">
              <label htmlFor="nm-area" className="field-label">Área da vida</label>
              <select id="nm-area" name="category" className="px-input" value={formik.values.category} onChange={formik.handleChange}>
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
            {type === "afazer" && (
              <div className="field">
                <label htmlFor="nm-prazo" className="field-label">Prazo (opcional)</label>
                <input
                  id="nm-prazo"
                  name="dueDate"
                  type="date"
                  className="px-input"
                  min={editing ? undefined : dayKey()}
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                />
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{editing ? "Salvar missão" : "Criar missão"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MissionModal({ isOpen, onClose, category, mission }) {
  if (!isOpen) return null;
  return <ModalContent onClose={onClose} category={category} mission={mission} />;
}
