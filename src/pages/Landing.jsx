import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Landing.module.css";
import { Avatar } from "../components/Avatar";
import { PixelBar } from "../components/PixelBar";
import { MoonIcon, PlusIcon, SunIcon } from "../components/PixelIcons";
import { useTheme } from "../hooks/useTheme";

// Missões de exemplo do quadro da página inicial. Nada aqui é salvo.
const DEMO = [
  { id: "agua", type: "Hábito", badge: "badge-habito", title: "Beber um copo de água", xp: 10, repeat: true },
  { id: "ler", type: "Diária", badge: "badge-diaria", title: "Ler 10 páginas", xp: 20 },
  { id: "luz", type: "Afazer", badge: "badge-afazer", title: "Pagar a conta de luz", xp: 20, note: "Vence hoje" },
];

const OUTFITS = [
  { key: "simples", label: "Visual inicial", equipped: {} },
  { key: "guerreiro", label: "Guerreiro", equipped: { capacete: "elmo_ferro_1", armadura: "escudo_madeira_1", arma: "espada_curta_1", bota: "botas_couro_1" } },
  { key: "mago", label: "Mago", equipped: { capacete: "chapeu_mago_1", calca: "calca_viajante_1", cenario: "cenario_taverna_1" } },
  { key: "aventureiro", label: "Aventureiro", equipped: { calca: "calca_viajante_1", bota: "botas_couro_1", cenario: "cenario_floresta_1", pet: "pet_slime_1" } },
];

function DemoBoard() {
  const [xp, setXp] = useState(30);
  const [done, setDone] = useState({});
  const [said, setSaid] = useState("");

  function act(mission) {
    setXp((value) => Math.min(value + mission.xp, 100));
    setDone((current) => ({ ...current, [mission.id]: (current[mission.id] ?? 0) + 1 }));
    setSaid(`Muito bem! Você ganhou ${mission.xp} XP.`);
  }

  const levelUp = xp >= 100;

  return (
    <div className={styles.demo}>
      <div className={styles.hud}>
        <Avatar equipped={OUTFITS[1].equipped} size={56} />
        <div className={styles.hudBars}>
          <span className={styles.hudName}>{levelUp ? "Nível 2!" : "Nível 1"}</span>
          <div className="bar-head"><span>XP</span><span>{xp} / 100</span></div>
          <PixelBar kind="xp" value={xp} max={100} />
        </div>
      </div>

      <ul className={`board ${styles.board}`} aria-label="Quadro de missões de exemplo">
        {DEMO.map((mission) => {
          const count = done[mission.id] ?? 0;
          const finished = !mission.repeat && count > 0;
          return (
            <li key={mission.id} className={`notice ${styles.note}`}>
              <span className={`badge ${mission.badge}`}>{mission.type}</span>
              <span className={styles.noteTitle}>{mission.title}</span>
              {mission.note && !finished && <span className={styles.noteLate}>{mission.note}</span>}
              {mission.repeat && count > 0 && <span className={styles.noteCount}>Hoje: {count} {count === 1 ? "vez" : "vezes"}</span>}
              <div className={styles.noteFoot}>
                <span className="reward-xp">+{mission.xp} XP</span>
                {!finished && (
                  <button type="button" className={`btn btn-sm btn-primary ${styles.noteBtn}`} onClick={() => act(mission)}>
                    {mission.repeat ? <><PlusIcon size={12} /> Fiz agora</> : mission.type === "Diária" ? "Feito hoje" : "Concluir"}
                  </button>
                )}
              </div>
              {finished && <span className="stamp stamp-ok">{mission.type === "Diária" ? "FEITA HOJE" : "CUMPRIDA"}</span>}
            </li>
          );
        })}
      </ul>
      <p className={styles.demoHint} role="status">{said || "Experimente: use os botões do quadro."}</p>
    </div>
  );
}

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const [outfit, setOutfit] = useState(OUTFITS[3]);

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <img src="/ui/logo.png" alt="Level Up" className={`${styles.logo} pixel-img`} />
        <nav className={styles.topNav} aria-label="Conta">
          <button type="button" className={styles.theme} onClick={toggleTheme} aria-label={theme === "light" ? "Mudar para o tema escuro" : "Mudar para o tema claro"}>
            {theme === "light" ? <MoonIcon size={18} /> : <SunIcon size={20} />}
          </button>
          <Link to="/entrar" className={styles.signin}>Entrar</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Criar personagem</Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={styles.headline}>Cumpra suas tarefas, ganhe XP e evolua seu personagem.</h1>
            <p className={styles.lead}>
              O Level Up organiza sua rotina como um jogo de RPG. Cada hábito, diária ou afazer cumprido rende experiência e
              ouro para o seu personagem. Diárias esquecidas custam pontos de vida.
            </p>
            <div className={styles.ctas}>
              <Link to="/signup" className="btn btn-primary">Criar personagem grátis</Link>
              <Link to="/entrar" className="btn">Já tenho conta</Link>
            </div>
          </div>
          <DemoBoard />
        </section>

        <section className={styles.types} aria-labelledby="tipos">
          <h2 id="tipos" className={styles.h2}>Três tipos de missão para organizar sua rotina</h2>
          <dl className={styles.typeList}>
            <div>
              <dt><span className="badge badge-habito">Hábito</span></dt>
              <dd>Algo que você quer fazer com mais frequência, como beber água ou alongar. Registre sempre que fizer. Não há prazo nem penalidade.</dd>
            </div>
            <div>
              <dt><span className="badge badge-diaria">Diária</span></dt>
              <dd>Uma tarefa que se repete todos os dias, como ler 10 páginas. Se o dia terminar sem ela, você perde HP; se o HP chegar a zero, perde um nível.</dd>
            </div>
            <div>
              <dt><span className="badge badge-afazer">Afazer</span></dt>
              <dd>Uma tarefa única, como pagar uma conta. Pode ter prazo e sai do quadro quando é concluída.</dd>
            </div>
          </dl>
          <p className={styles.typesNote}>
            Comece com metas pequenas: uma diária de 5 minutos cumprida todos os dias vale mais do que uma lista longa demais.
            Se estiver difícil começar, o Modo foco reserva 25 minutos para uma única tarefa.
          </p>
        </section>

        <section className={styles.outfit} aria-labelledby="personagem">
          <div className={styles.outfitStage}>
            <Avatar equipped={outfit.equipped} size={208} label={`Personagem vestido de ${outfit.label.toLowerCase()}`} />
          </div>
          <div className={styles.outfitText}>
            <h2 id="personagem" className={styles.h2}>Use o ouro das missões para personalizar seu personagem</h2>
            <p>
              Cada missão cumprida também rende ouro. No Bazar, você pode trocá-lo por elmos, chapéus, cenários e até um
              mascote, e tudo aparece no seu personagem.
            </p>
            <div role="radiogroup" aria-label="Experimente um visual" className={styles.outfits}>
              {OUTFITS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="radio"
                  aria-checked={outfit.key === item.key}
                  className={`${styles.outfitBtn} ${outfit.key === item.key ? styles.outfitOn : ""}`}
                  onClick={() => setOutfit(item)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.guild} aria-labelledby="guildas">
          <h2 id="guildas" className={styles.h2}>Evolua junto com outras pessoas</h2>
          <p>
            Na Taverna, você pode entrar em uma guilda com amigos ou colegas de turma, acompanhar o ranking de XP da
            temporada e ver quem está mantendo a sequência.
          </p>
        </section>

        <section className={styles.final}>
          <h2 className={styles.finalTitle}>Sua primeira missão: criar o personagem.</h2>
          <Link to="/signup" className="btn btn-primary">Criar personagem grátis</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <img src="/ui/logo.png" alt="Level Up" className={`${styles.footerLogo} pixel-img`} />
        <span>Projeto Integrador II</span>
      </footer>
    </div>
  );
}
