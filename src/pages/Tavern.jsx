import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./Tavern.module.css";
import { SearchIcon, ShieldIcon } from "../components/PixelIcons";
import { Ranking } from "../components/Ranking";
import { PLAYERS } from "../data/players";
import { Avatar } from "../components/Avatar";
import { EmptyState } from "../components/EmptyState";

const GUILDS = [
  { id: 1, name: "Guilda dos Estudos", leader: "ana.rpg", members: 5, capacity: 8, tone: "purple" },
  { id: 2, name: "Corredores da Manhã", leader: "lucas_m", members: 3, capacity: 6, tone: "green" },
  { id: 3, name: "República Organizada", leader: "bia.c", members: 4, capacity: 4, tone: "gold" },
  { id: 4, name: "Clube da Economia", leader: "rafa.dev", members: 2, capacity: 8, tone: "blue" },
  { id: 5, name: "Projeto Integrador 3B", leader: "jggranito", members: 6, capacity: 6, tone: "red", mine: true },
  { id: 6, name: "Leitores Noturnos", leader: "carol_l", members: 7, capacity: 10, tone: "orange" },
];

const TABS = [
  { key: "guildas", label: "Guildas" },
  { key: "ranking", label: "Ranking" },
  { key: "amigos", label: "Amigos" },
  { key: "mural", label: "Mural de missões", soon: "O mural de missões em grupo ainda não está pronto. Por enquanto, combine as missões dentro da sua guilda." },
];

function Friends() {
  const friends = PLAYERS.filter((player) => player.friend);
  if (friends.length === 0) {
    return <p className="empty">Você ainda não tem amigos na Taverna. Abra o perfil de alguém no ranking e toque em Adicionar amigo.</p>;
  }
  return (
    <ul className={styles.friends}>
      {friends.map((friend) => (
        <li key={friend.id}>
          <Link to={`/jogador/${friend.id}`} className={`panel ${styles.friend}`}>
            <span className={`slot ${styles.friendPortrait}`}><Avatar equipped={friend.equipped} size={44} /></span>
            <span className={styles.friendText}>
              <span className={styles.friendName}>{friend.name}</span>
              <span className={styles.friendNote}>{friend.playerClass} de nível {friend.level}, {friend.streak} dias seguidos</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function GuildAction({ guild }) {
  if (guild.mine) return <span className="badge badge-ok">Sua guilda</span>;
  if (guild.members >= guild.capacity) {
    return <button type="button" className="btn btn-sm" disabled>Cheia</button>;
  }
  return <button type="button" className="btn btn-sm btn-outline">Entrar</button>;
}

export default function Tavern() {
  const [params, setParams] = useSearchParams();
  const activeTab = TABS.find((tab) => tab.key === params.get("aba")) ?? TABS[0];
  const setActiveTab = (tab) => setParams(tab.key === "guildas" ? {} : { aba: tab.key }, { replace: true });
  const [search, setSearch] = useState("");

  const guilds = GUILDS.filter((guild) => guild.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className={`page ${styles.page}`}>
      <section>
        <h1 className="title">Taverna</h1>
        <p className="lead">Entre em uma guilda para cumprir missões em grupo ou crie a sua.</p>
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
                <article key={guild.id} className={styles.guild}>
                  <div
                    className={styles.cloth}
                    style={{
                      "--cloth": `var(--tone-${guild.tone}-bg)`,
                      "--cloth-line": `var(--tone-${guild.tone}-line)`,
                      "--cloth-ink": `var(--tone-${guild.tone})`,
                    }}
                  >
                    <ShieldIcon size={56} className={styles.emblem} />
                    <h2 className={styles.guildName}>{guild.name}</h2>
                    <p className={styles.guildMeta}>Liderada por <Link to={`/jogador/${guild.leader}`}>{guild.leader}</Link></p>
                    <div className={styles.seats} role="img" aria-label={`${guild.members} de ${guild.capacity} vagas ocupadas`}>
                      {Array.from({ length: guild.capacity }, (_, i) => (
                        <span key={i} className={i < guild.members ? styles.seatTaken : styles.seat} />
                      ))}
                    </div>
                  </div>
                  <GuildAction guild={guild} />
                </article>
              ))}
            </div>
          )}
        </>
      ) : activeTab.key === "ranking" ? (
        <Ranking />
      ) : activeTab.key === "amigos" ? (
        <Friends />
      ) : (
        <EmptyState art="quadro">{activeTab.soon}</EmptyState>
      )}
    </div>
  );
}
