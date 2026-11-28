import { useState } from "react";
import { Navigate, NavLink, useNavigate, useParams } from "react-router-dom";
import styles from "./AreasDaVidaLayout.module.css";
import { MissionManager } from "../manager/MissionManager";
import { useGameData } from "../hooks/useGameData";
import { useAreas } from "../hooks/useAreas";
import { createArea, customAreaSlots, deleteArea, getArea, updateArea } from "../data/areas";
import { MissionModal } from "../components/MissionModal";
import { MissoesList } from "../components/MissoesList";
import { FocusTimer } from "../components/FocusTimer";
import { DeadlineCalendar } from "../components/DeadlineCalendar";
import { AreaEditor } from "../components/AreaEditor";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PixelBar } from "../components/PixelBar";
import { PlusIcon } from "../components/PixelIcons";

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

function compareWeeks(total, previous) {
  const difference = total - previous;
  if (difference > 0) return `${difference} XP a mais que na semana passada`;
  if (difference < 0) return `${-difference} XP a menos que na semana passada`;
  return "o mesmo que na semana passada";
}

function startOfWeek() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// /areas-da-vida sem área escolhida: abre a primeira
export function AreasIndex() {
  const areas = useAreas();
  return <Navigate to={`/areas-da-vida/${areas[0]?.value ?? "outros"}`} replace />;
}

export default function AreasDaVidaLayout() {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const { player, missions, history } = useGameData();
  const areas = useAreas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editor, setEditor] = useState(null); // null | "new" | "edit" | "limite"

  const area = areas.find((item) => item.value === areaId) ?? (areaId === "outros" ? getArea("outros") : null);
  if (!area) return <Navigate to={`/areas-da-vida/${areas[0]?.value ?? "outros"}`} replace />;

  const inArea = missions.filter((m) => m.category === area.value);
  const weekStart = startOfWeek();
  const doneThisWeek = history.filter((h) => h.kind === "done" && h.category === area.value && new Date(h.at) >= weekStart).length;
  const dailies = inArea.filter((m) => m.type === "diaria");
  const dailiesDone = dailies.filter((m) => MissionManager.isDoneToday(m)).length;
  const openTodos = inArea.filter((m) => m.type === "afazer" && m.status !== "completed");
  const hasDeadlines = openTodos.some((m) => m.dueDate);
  const weekly = MissionManager.getWeeklyXp(area.value);
  const highestDay = Math.max(...weekly.days, 1);
  const today = new Date().getDay();

  function saveArea(data) {
    if (editor === "new") {
      const value = createArea(data);
      if (!value) {
        setEditor("limite");
        return;
      }
      navigate(`/areas-da-vida/${value}`);
    } else {
      updateArea(area.value, data);
    }
    setEditor(null);
  }

  function removeArea() {
    MissionManager.moveCategory(area.value, "outros");
    deleteArea(area.value);
    window.dispatchEvent(new Event("playerStateUpdated"));
    setEditor(null);
    navigate("/areas-da-vida", { replace: true });
  }

  const slots = customAreaSlots();

  const pendingCount = (value) =>
    missions.filter((m) => m.category === value && !(m.type === "afazer" && m.status === "completed")).length;

  return (
    <div className={`page ${styles.page}`}>
      <aside className={styles.sidebar}>
        <h2 className={`meta ${styles.sidebarTitle}`}>Áreas da vida</h2>
        <nav aria-label="Áreas" className={styles.areaNav}>
          {areas.map((item) => (
            <NavLink
              key={item.value}
              to={`/areas-da-vida/${item.value}`}
              className={({ isActive }) => `${styles.areaLink} ${isActive ? styles.areaActive : ""}`}
            >
              <span className={styles.areaDot} style={{ background: item.color }} />
              <span className={styles.areaName}>{item.label}</span>
              <span className={styles.areaCount}>{pendingCount(item.value)}</span>
            </NavLink>
          ))}
          {missions.some((m) => m.category === "outros") && (
            <NavLink to="/areas-da-vida/outros" className={({ isActive }) => `${styles.areaLink} ${isActive ? styles.areaActive : ""}`}>
              <span className={styles.areaDot} style={{ background: "var(--area-outros)" }} />
              <span className={styles.areaName}>Outros</span>
              <span className={styles.areaCount}>{pendingCount("outros")}</span>
            </NavLink>
          )}
          <button type="button" className={styles.newArea} onClick={() => setEditor(slots.left > 0 ? "new" : "limite")}>
            <PlusIcon size={12} />
            Nova área
          </button>
          {Number.isFinite(slots.limit) && (
            <p className={styles.slots}>Áreas personalizadas: {slots.used} de {slots.limit}</p>
          )}
        </nav>
      </aside>

      <div className={styles.content}>
        <section className="page-head">
          <div>
            <h1 className={`title ${styles.areaTitle}`}>
              <span className={styles.areaTitleDot} style={{ background: area.color }} />
              {area.label}
            </h1>
            {area.hint && <p className="lead">{area.hint}</p>}
          </div>
          <div className={styles.headActions}>
            {area.value !== "outros" && (
              <button type="button" className="btn" onClick={() => setEditor("edit")}>Editar área</button>
            )}
            <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <PlusIcon size={14} />
              Nova missão
            </button>
          </div>
        </section>

        <section aria-label="Diário da área" className={styles.logbook}>
          {inArea.length === 0 ? (
            <p>Ainda não há missões em {area.label}. Comece com algo pequeno, que leve menos de 5 minutos.</p>
          ) : (
            <p>
              Esta semana você cumpriu <strong>{plural(doneThisWeek, "missão", "missões")}</strong> em {area.label} e
              ganhou <strong className={styles.xp}>+{weekly.total} XP</strong>, {compareWeeks(weekly.total, weekly.previous)}.
              {dailies.length > 0 &&
                (dailiesDone === dailies.length
                  ? " Todas as diárias de hoje foram cumpridas."
                  : ` Hoje ${dailies.length - dailiesDone === 1 ? "falta" : "faltam"} ${plural(dailies.length - dailiesDone, "diária", "diárias")}.`)}
              {openTodos.length > 0 && ` Há ${plural(openTodos.length, "afazer pendente", "afazeres pendentes")}.`}
            </p>
          )}
          {dailies.length > 0 && (
            <div className={styles.dailyBar}>
              <span>Diárias de hoje: {dailiesDone} de {dailies.length}</span>
              <PixelBar kind="ok" value={dailiesDone} max={dailies.length} />
            </div>
          )}
        </section>

        <MissoesList key={area.value} categoryFilter={area.value} />
        <FocusTimer />
        {hasDeadlines && <DeadlineCalendar missions={inArea} />}

        <section className={styles.bottom}>
          <div className={`panel ${styles.card}`}>
            <h2 className={styles.cardTitle}>XP da semana</h2>
            <div className={styles.chart}>
              {weekly.days.map((value, i) => (
                <div
                  key={i}
                  className={value > 0 ? styles.chartBar : styles.chartEmpty}
                  style={value > 0 ? { height: `${Math.max((value / highestDay) * 100, 12)}%` } : undefined}
                  title={`${value} XP`}
                />
              ))}
            </div>
            <div className={styles.chartDays}>
              {WEEK_DAYS.map((day, i) => (
                <span key={i} style={i === today ? { color: "var(--text)" } : undefined}>{day}</span>
              ))}
            </div>
          </div>
          <div className={`panel ${styles.card}`}>
            <h2 className={styles.cardTitle}>Seu HP</h2>
            <p className={styles.cardText}>Cada diária não cumprida até a meia-noite custa HP. Se o HP chegar a zero, você perde um nível.</p>
            <div className="bar-head">
              <span style={{ color: "var(--hp-text)" }}>HP</span>
              <span>{player.hp} / {player.maxHp}</span>
            </div>
            <PixelBar kind="hp" value={player.hp} max={player.maxHp} />
          </div>
        </section>
      </div>

      <MissionModal key={`nova-${area.value}`} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} category={area.value} />
      <ConfirmDialog
        open={editor === "limite"}
        title="Você chegou ao limite de áreas"
        confirmLabel="Ver vantagens"
        cancelLabel="Agora não"
        onCancel={() => setEditor(null)}
        onConfirm={() => navigate("/premium")}
      >
        <p>
          No plano básico, é possível criar até {slots.limit} áreas personalizadas. Para criar mais, torne-se Patrono ou
          apague uma área que você não usa mais.
        </p>
      </ConfirmDialog>
      {(editor === "new" || editor === "edit") && (
        <AreaEditor
          key={editor === "new" ? "nova-area" : area.value}
          open
          area={editor === "edit" ? area : null}
          onSave={saveArea}
          onDelete={removeArea}
          onClose={() => setEditor(null)}
        />
      )}
    </div>
  );
}
