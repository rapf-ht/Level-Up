import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Configuracoes.module.css";
import { getProfile, saveProfile } from "../data/profile";
import { CLASSES } from "../data/classes";
import { ClassIcon } from "../components/ClassIcon";
import { useTheme } from "../hooks/useTheme";
import { CheckIcon, MoonIcon, SunIcon } from "../components/PixelIcons";

const THEMES = [
  { value: "dark", label: "Masmorra", description: "Fundo escuro, bom para a noite", Icon: MoonIcon },
  { value: "light", label: "Pergaminho", description: "Papel claro, bom para o dia", Icon: SunIcon },
  { value: "system", label: "Igual ao sistema", description: "Muda junto com o seu aparelho" },
];

// Tudo o que o jogo guarda no navegador. Excluir a conta apaga estes dados.
const SAVED_KEYS = ["profile", "gameState", "missions", "inventory", "equipped", "notifications", "history", "areas", "lastDailyCheck", "levelup-theme"];

export default function Configuracoes() {
  const navigate = useNavigate();
  const { preference, setPreference } = useTheme();
  const [form, setForm] = useState(() => {
    const profile = getProfile();
    return { name: profile.name, playerClass: profile.playerClass, email: profile.email ?? "" };
  });
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const nameMissing = form.name.trim() === "";
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  function handleSave(event) {
    event.preventDefault();
    if (nameMissing) return;
    saveProfile({ ...getProfile(), name: form.name.trim(), playerClass: form.playerClass, email: form.email.trim() });
    window.dispatchEvent(new Event("playerStateUpdated"));
    setToast("Alterações salvas.");
  }

  function handleDelete() {
    SAVED_KEYS.forEach((key) => localStorage.removeItem(key));
    setPreference("system");
    navigate("/", { replace: true });
  }

  return (
    <div className={`page ${styles.page}`}>
      <section>
        <h1 className="title">Configurações</h1>
        <p className="lead">Seu personagem, sua conta e a aparência do jogo.</p>
      </section>

      <form className={`panel ${styles.section}`} onSubmit={handleSave} noValidate>
        <h2 className="h2">Personagem e conta</h2>

        <div className="field">
          <label htmlFor="cfg-nome" className="field-label">Nome do personagem</label>
          <input
            id="cfg-nome"
            className="px-input"
            type="text"
            value={form.name}
            onChange={update("name")}
            aria-invalid={nameMissing}
            aria-describedby={nameMissing ? "cfg-nome-erro" : undefined}
          />
          {nameMissing && <p id="cfg-nome-erro" className="field-error">Escreva um nome para o seu personagem.</p>}
        </div>

        <fieldset>
          <legend className={`field-label ${styles.legend}`}>Classe</legend>
          <div className={styles.classes}>
            {CLASSES.map((item) => {
              const selected = form.playerClass === item.name;
              return (
                <label key={item.name} className={`${styles.choice} ${selected ? styles.choiceOn : ""}`}>
                  <input type="radio" name="classe" className="sr-only" checked={selected} onChange={() => setForm({ ...form, playerClass: item.name })} />
                  <ClassIcon playerClass={item} size={32} />
                  <span className={styles.choiceText}>
                    <span className={styles.choiceName}>{item.name}</span>
                    <span className={styles.choiceNote}>{item.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="cfg-email" className="field-label">E-mail</label>
          <input id="cfg-email" className="px-input" type="email" autoComplete="email" placeholder="voce@email.com" value={form.email} onChange={update("email")} />
        </div>

        <div>
          <button type="submit" className="btn btn-primary" disabled={nameMissing}>Salvar alterações</button>
        </div>
      </form>

      <section className={`panel ${styles.section}`}>
        <h2 className="h2">Aparência</h2>
        <fieldset>
          <legend className="sr-only">Tema</legend>
          <div className={styles.themes}>
            {THEMES.map(({ value, label, description, Icon }) => {
              const selected = preference === value;
              return (
                <label key={value} className={`${styles.choice} ${selected ? styles.choiceOn : ""}`}>
                  <input type="radio" name="tema" className="sr-only" checked={selected} onChange={() => setPreference(value)} />
                  <span className={`${styles.swatch} ${styles[`swatch_${value}`]}`} aria-hidden="true">
                    {Icon && <Icon size={18} />}
                  </span>
                  <span className={styles.choiceText}>
                    <span className={styles.choiceName}>{label}</span>
                    <span className={styles.choiceNote}>{description}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <p className={styles.note}>O tema muda na hora e fica salvo neste navegador.</p>
      </section>

      <section className={`panel ${styles.section} ${styles.danger}`}>
        <h2 className="h2">Excluir conta</h2>
        <p className={styles.note}>
          Apaga seu personagem, missões, ouro e itens deste navegador. Essa ação não pode ser desfeita.
        </p>
        {confirmDelete ? (
          <div className={styles.confirm} role="alert">
            <p>Tem certeza? Todo o seu progresso será apagado permanentemente.</p>
            <div className={styles.confirmActions}>
              <button type="button" className={`btn ${styles.deleteBtn}`} onClick={handleDelete}>Sim, excluir minha conta</button>
              <button type="button" className="btn" onClick={() => setConfirmDelete(false)}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div>
            <button type="button" className={`btn ${styles.deleteBtn}`} onClick={() => setConfirmDelete(true)}>Excluir conta</button>
          </div>
        )}
      </section>

      <p className={styles.back}><Link to="/inventario">Voltar ao perfil</Link></p>

      {toast && (
        <div role="status" className="toast">
          <CheckIcon size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}
