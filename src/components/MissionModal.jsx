import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./MissionModal.module.css";
import { MissionManager } from "../manager/MissionManager";

export function MissionModal({ isOpen, onClose, category }) {
  if (!isOpen) return null;

  const categories = [
    { value: "saude", label: "Saúde" },
    { value: "estudos", label: "Estudos" },
    { value: "agenda", label: "Agenda" },
    { value: "planejamento", label: "Planejamento" },
    { value: "organizacao", label: "Organização" },
    { value: "lazer", label: "Lazer" },
    { value: "financas", label: "Finanças" },
    { value: "outros", label: "Outros" },
  ];

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Muito curto")
      .required("O nome da missão é obrigatório"),
    type: Yup.string()
      .oneOf(["daily", "medium", "weekly"], "Tipo inválido")
      .required("Selecione um tipo"),
    category: Yup.string()
      .oneOf(
        categories.map((c) => c.value),
        "Categoria inválida",
      )
      .required("Selecione uma categoria"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      type: "daily",
      category: category || "outros",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      MissionManager.createMission(values.title, values.type, values.category);
      window.dispatchEvent(new Event("playerStateUpdated"));
      formik.resetForm();
      onClose();
    },
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Criar Nova Missão</h3>

        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Nome da Missão:</label>
            <input
              name="title"
              type="text"
              placeholder="Ex: Ler 10 páginas"
              onChange={formik.handleChange}
              value={formik.values.title}
              className={styles.inputModal}
            />
            {formik.touched.title && formik.errors.title && (
              <span className={styles.errorText}>{formik.errors.title}</span>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Dificuldade:</label>
              <select
                name="type"
                onChange={formik.handleChange}
                value={formik.values.type}
                className={styles.inputModal}
              >
                <option value="daily">Diária</option>
                <option value="medium">Média</option>
                <option value="weekly">Semanal</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Categoria:</label>
              <select
                name="category"
                onChange={formik.handleChange}
                value={formik.values.category}
                className={styles.inputModal}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Criar Missão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
