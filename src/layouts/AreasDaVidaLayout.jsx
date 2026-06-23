import { NavLink, Outlet, Link } from "react-router-dom";
import styles from "./AreasDaVidaLayout.module.css";
import { AreaProvider, useArea } from "../contexts/AreaContext";

const areas = [
  { label: "Saúde", to: "/areas-da-vida/saude" },
  { label: "Estudos", to: "/areas-da-vida/estudos" },
  { label: "Agenda", to: "/areas-da-vida/agenda" },
  { label: "Planejamento", to: "/areas-da-vida/planejamento" },
  { label: "Organização", to: "/areas-da-vida/organizacao" },
  { label: "Lazer", to: "/areas-da-vida/lazer" },
  { label: "Finanças", to: "/areas-da-vida/financas" },
];

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const xpBars = [
  { h: 40, active: true },
  { h: 55, active: true },
  { h: 70, active: true },
  { h: 20, active: false },
  { h: 15, active: false },
  { h: 10, active: false },
  { h: 8, active: false },
];

function AreasDaVidaContent() {
  const { areaInfo } = useArea();
  const areaTitle = areaInfo.title;
  const areaIcon = areaInfo.icon;
  const areaBanner = areaInfo.banner;
  return (
    <div className={styles.page}>
      {/* ── MOBILE ONLY: Menu Horizontal de Áreas (Invisível no Desktop) ── */}
      <div className={styles.mobileAreaTabsContainer}>
        <nav className={styles.mobileAreaTabs}>
          {areas.map((area) => (
            <NavLink
              key={area.to}
              to={area.to}
              className={({ isActive }) =>
                `${styles.mobileAreaTab} ${isActive ? styles.mobileAreaTabActive : ""}`
              }
            >
              <span className={styles.mobileAreaTabIcon}>{area.icon}</span>
              <span className={styles.mobileAreaTabLabel}>{area.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      {/* ── Banner ── */}
      <div className={styles.banner}>
        {areaBanner ? (
          <img src={areaBanner} alt={areaTitle} className={styles.bannerImg} />
        ) : (
          ""
        )}
      </div>
      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <Link to="/home">Home</Link> &gt;{" "}
        <Link to="/areas-da-vida">Áreas da Vida</Link> &gt;{" "}
        <span>{areaTitle}</span>
      </div>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerTopRow}>
          <div className={styles.areaTitle}>
            <span className={styles.areaIcon}>{areaIcon}</span>
            <div>
              <h1 className={styles.areaName}>{areaTitle}</h1>
              <p className={styles.areaMeta}>
                Classe • 5 tarefas ativas • Sequência de 5 dias
              </p>
            </div>
          </div>
          <Link to="#" className={styles.newMissionBtn}>
            + Nova Missão
          </Link>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Missões concluídas</p>
            <p className={styles.statValue}>12</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "60%" }} />
            </div>
            <p className={styles.statSub}>60% da meta atual</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>XP ganho esta semana</p>
            <p className={`${styles.statValue} ${styles.xpValue}`}>+ 280</p>
            <p className={styles.statSub}>40 a mais que semana passada</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Sequência atual</p>
            <p className={styles.statValue}>4</p>
            <p className={styles.statSub}>Recorde: 14 dias</p>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Áreas da vida</h2>
          <nav className={styles.areaNav}>
            {areas.map((area) => (
              <NavLink
                key={area.to}
                to={area.to}
                className={({ isActive }) =>
                  `${styles.areaBtn} ${isActive ? styles.areaBtnActive : ""}`
                }
              >
                {area.label}
              </NavLink>
            ))}
          </nav>
          <div className={styles.progressSection}>
            <p className={styles.progressTitle}>Progresso Geral</p>
            <p className={styles.progressLabel}>Tarefas Gerais</p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFillGreen}
                style={{ width: "65%" }}
              />
            </div>
            <p className={`${styles.progressLabel} ${styles.xpLabel}`}>
              XP da Semana
            </p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFillBlue}
                style={{ width: "45%" }}
              />
            </div>
          </div>
        </aside>

        {/* Main content — pages inject here */}
        <main className={styles.content}>
          <Outlet />
        </main>

        {/* Right Panel */}
        <aside className={styles.rightPanel}>
          {/* HP */}
          <div className={styles.rpCard}>
            <p className={styles.hpLabel}>❤️ STATUS DE HP</p>
            <p className={styles.hpValue}>72 / 100</p>
            <div className={styles.hpBar}>
              <div className={styles.hpFill} style={{ width: "72%" }} />
            </div>
          </div>

          {/* Sequência */}
          <div className={styles.rpCard}>
            <p className={styles.rpLabel}>SEQUÊNCIA</p>
            <div className={styles.streakDots}>
              {weekDays.map((day, i) => (
                <div key={i} className={styles.streakDot}>
                  <div className={i < 3 ? styles.dotDone : styles.dotEmpty}>
                    {i < 3 ? "✓" : "XP"}
                  </div>
                  <span className={styles.dayLabel}>{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* XP da semana */}
          <div className={styles.rpCard}>
            <p className={styles.rpLabel}>XP DA SEMANA</p>
            <div className={styles.chartBars}>
              {xpBars.map((bar, i) => (
                <div
                  key={i}
                  className={`${styles.bar} ${bar.active ? styles.barActive : styles.barInactive}`}
                  style={{ height: bar.h }}
                />
              ))}
            </div>
            <div className={styles.chartDays}>
              {weekDays.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function AreasDaVidaLayout() {
  return (
    <AreaProvider>
      <AreasDaVidaContent />
    </AreaProvider>
  );
}
