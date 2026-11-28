import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Premium.module.css";
import { CheckIcon } from "../components/PixelIcons";

const PERKS = [
  { title: "Bazar do Patrono", text: "Roupas, mascotes e cenários que só aparecem para patronos." },
  { title: "Áreas da vida sem limite", text: "No plano básico, são até 3 áreas personalizadas. Patronos criam quantas quiserem." },
  { title: "Escudo de HP", text: "Uma vez por semana, uma diária esquecida não tira HP." },
  { title: "Guilda maior", text: "Sua guilda aceita até 20 membros em vez de 10." },
  { title: "Relatório do mês", text: "Um resumo de quanto você evoluiu em cada área." },
];

const PLANS = [
  { key: "mensal", label: "Mensal", price: "R$ 9,90", period: "por mês" },
  { key: "anual", label: "Anual", price: "R$ 89,90", period: "por ano", note: "Sai por R$ 7,49 ao mês" },
];

export default function Premium() {
  const [plan, setPlan] = useState("anual");

  return (
    <div className={`page ${styles.page}`}>
      <section className={styles.intro}>
        <img src="/ui/escudo.png" alt="" className={`${styles.crest} pixel-img`} />
        <div>
          <h1 className="title">Torne-se Patrono</h1>
          <p className="lead">O jogo continua grátis. O Patrono ajuda a manter o Level Up no ar e libera alguns extras.</p>
        </div>
      </section>

      <div className={styles.layout}>
        <section className={`notice ${styles.perks}`} aria-labelledby="premium-perks">
          <h2 id="premium-perks" className={styles.perksTitle}>O que o Patrono recebe</h2>
          <ul className={styles.perkList}>
            {PERKS.map((perk) => (
              <li key={perk.title} className={styles.perk}>
                <CheckIcon size={14} className={styles.perkIcon} />
                <span>
                  <strong>{perk.title}.</strong> {perk.text}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`frame ${styles.checkout}`} aria-labelledby="premium-plan">
          <h2 id="premium-plan" className="h2">Escolha o plano</h2>
          <div role="radiogroup" aria-labelledby="premium-plan" className={styles.plans}>
            {PLANS.map((item) => {
              const selected = plan === item.key;
              return (
                <label key={item.key} className={`${styles.plan} ${selected ? styles.planOn : ""}`}>
                  <input type="radio" name="plano" className="sr-only" checked={selected} onChange={() => setPlan(item.key)} />
                  <span className={styles.planName}>{item.label}</span>
                  <span className={styles.planPrice}>{item.price}</span>
                  <span className={styles.planPeriod}>{item.period}</span>
                  {item.note && <span className={styles.planNote}>{item.note}</span>}
                </label>
              );
            })}
          </div>
          <button type="button" className="btn btn-primary" disabled aria-describedby="premium-soon">
            Assinar o Patrono
          </button>
          <p id="premium-soon" className={styles.soon}>
            Os pagamentos ainda não estão abertos. Quando abrirem, você assina por aqui e pode cancelar quando quiser.
          </p>
        </section>
      </div>

      <p className={styles.back}><Link to="/inventario">Voltar ao perfil</Link></p>
    </div>
  );
}
