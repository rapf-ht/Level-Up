import { useState } from "react";
import styles from "./Tavern.module.css";
import { SearchIcon, ShieldIcon } from "../components/PixelIcons";

const GUILDS = [
  { id: 1, name: "Guilda dos Estudos", leader: "ana.rpg", members: 5, capacity: 8, bg: "#2a2440", line: "#4a3f6a", color: "#c9b8f0" },
  { id: 2, name: "Corredores da Manhã", leader: "lucas_m", members: 3, capacity: 6, bg: "#1d2a1b", line: "#3f6b3c", color: "#9fd69c" },
  { id: 3, name: "República Organizada", leader: "bia.c", members: 4, capacity: 4, bg: "#2b2316", line: "#6b5426", color: "#e9c46a" },
  { id: 4, name: "Clube da Economia", leader: "rafa.dev", members: 2, capacity: 8, bg: "#1a2733", line: "#35546f", color: "#7fb8ec" },
  { id: 5, name: "Projeto Integrador 3B", leader: "jggranito", members: 6, capacity: 6, bg: "#331d1a", line: "#6b3a33", color: "#ef7b6c", mine: true },
  { id: 6, name: "Leitores Noturnos", leader: "carol_l", members: 7, capacity: 10, bg: "#33261a", line: "#6b4a2a", color: "#f09a5b" },
];

const TABS = [
  { key: "guildas", label: "Guildas" },
  { key: "mural", label: "Mural de missões", soon: "O mural de missões em grupo ainda está em construção." },
  { key: "amigos", label: "Amigos", soon: "A lista de amigos ainda está em construção." },
];

function GuildAction({ guild }) {
  if (guild.mine) return <span className="badge badge-ok">SUA GUILDA</span>;
  if (guild.members >= guild.capacity) {
    return <button type="button" className="btn btn-sm" disabled>Cheia</button>;
  }
  return <button type="button" className="btn btn-sm btn-outline">Entrar</button>;
}

export default function Tavern() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [search, setSearch] = useState("");

  const guilds = GUILDS.filter((guild) => guild.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className={`page ${styles.page}`}>
      <section>
        <p className="eyebrow">SOCIAL</p>
        <h1 className="title">Taverna</h1>
        <p className="lead">Encontre uma guilda, aceite convites e cumpra missões em grupo.</p>
      </section>

      <div role="tablist" aria-label="Seções da taverna" className={`tabs ${styles.tabs}`}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab.key === tab.key}
            className="tab"
            onClick={() => setActiveTab(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab.key === "guildas" ? (
        <>
          <div className={styles.actions}>
            <div className={styles.search}>
              <SearchIcon size={18} className={styles.searchIcon} />
              <label htmlFor="busca-guilda" className="sr-only">Buscar guilda</label>
              <input
                id="busca-guilda"
                type="search"
                className={`px-input ${styles.searchInput}`}
                placeholder="Buscar guilda..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <button type="button" className="btn">
              Convites <span className={styles.count}>2</span>
            </button>
            <button type="button" className="btn btn-primary">+ Criar guilda</button>
          </div>

          {guilds.length === 0 ? (
            <p className="empty">Nenhuma guilda com esse nome. Tente outra busca ou crie a sua.</p>
          ) : (
            <div className={styles.grid}>
              {guilds.map((guild) => (
                <article key={guild.id} className={`panel ${styles.guild}`}>
                  <div
                    className={styles.emblem}
                    style={{ background: guild.bg, borderColor: guild.line, color: guild.color }}
                  >
                    <ShieldIcon size={28} />
                  </div>
                  <div className={styles.guildInfo}>
                    <h2 className={styles.guildName}>{guild.name}</h2>
                    <span className={styles.guildMeta}>
                      Líder: {guild.leader} · <span className={styles.members}>{guild.members}/{guild.capacity}</span>
                    </span>
                  </div>
                  <GuildAction guild={guild} />
                </article>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="empty">{activeTab.soon}</p>
      )}
    </div>
  );
}
