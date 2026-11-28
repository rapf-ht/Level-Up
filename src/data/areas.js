// Áreas da vida: as padrão do jogo e as que o jogador cria.
// Ficam salvas em localStorage ("areas"). A cor é o nome de uma cor da paleta (--area-<cor> no CSS),
// assim a mesma área fica legível no tema escuro e no claro.

export const AREA_COLORS = [
  { key: "rosa", label: "Rosa" },
  { key: "roxo", label: "Roxo" },
  { key: "azul", label: "Azul" },
  { key: "ciano", label: "Ciano" },
  { key: "verde", label: "Verde" },
  { key: "lima", label: "Lima" },
  { key: "laranja", label: "Laranja" },
  { key: "cinza", label: "Cinza" },
];

export const DEFAULT_AREAS = [
  { value: "saude", label: "Saúde", color: "rosa", hint: "Corpo e mente: exercício, sono, alimentação, água." },
  { value: "estudos", label: "Estudos", color: "roxo", hint: "Aulas, leituras, cursos e revisões." },
  { value: "trabalho", label: "Trabalho", color: "azul", hint: "Entregas, reuniões e tarefas que costumam ficar para depois." },
  { value: "casa", label: "Casa", color: "ciano", hint: "Limpeza, compras, contas da casa e consertos." },
  { value: "financas", label: "Finanças", color: "verde", hint: "Gastos, economias e contas a pagar." },
  { value: "lazer", label: "Lazer", color: "laranja", hint: "Hobbies, amigos e descanso. Também conta como missão." },
];

// Plano básico: até 3 áreas criadas pelo jogador. Patronos não têm limite.
export const FREE_CUSTOM_AREAS = 3;

function isPatron() {
  try {
    return Boolean(JSON.parse(localStorage.getItem("profile"))?.premium);
  } catch {
    return false;
  }
}

// Quantas áreas personalizadas o jogador ainda pode criar (Infinity para patronos).
export function customAreaSlots() {
  if (isPatron()) return { used: 0, limit: Infinity, left: Infinity };
  const used = (readStored() ?? []).filter((area) => area.custom).length;
  return { used, limit: FREE_CUSTOM_AREAS, left: Math.max(FREE_CUSTOM_AREAS - used, 0) };
}

const OTHER = { value: "outros", label: "Outros", color: "outros", hint: "Missões sem área." };
const STORAGE_KEY = "areas";
const EVENT = "areasUpdated";

// Áreas que existiam antes da revisão. Organização vira Casa; as outras viram áreas
// personalizadas se o jogador tinha missões nelas, para nada se perder.
const LEGACY = {
  organizacao: { moveTo: "casa" },
  agenda: { label: "Agenda", color: "cinza" },
  planejamento: { label: "Planejamento", color: "lima" },
};

function withColor(area) {
  return { ...area, colorKey: area.color, color: `var(--area-${area.color})` };
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function store(areas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(areas));
  window.dispatchEvent(new Event(EVENT));
}

function migrateLegacy() {
  let missions = [];
  try {
    missions = JSON.parse(localStorage.getItem("missions")) ?? [];
  } catch {
    missions = [];
  }
  const areas = DEFAULT_AREAS.map((area) => ({ ...area }));
  let changed = false;
  const used = new Set(missions.map((m) => m.category));

  Object.entries(LEGACY).forEach(([id, rule]) => {
    if (!used.has(id)) return;
    if (rule.moveTo) {
      missions = missions.map((m) => (m.category === id ? { ...m, category: rule.moveTo } : m));
      changed = true;
    } else {
      areas.push({ value: id, label: rule.label, color: rule.color, custom: true });
    }
  });
  if (changed) localStorage.setItem("missions", JSON.stringify(missions));
  return areas;
}

export function getAreas() {
  let areas = readStored();
  if (!areas) {
    areas = migrateLegacy();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(areas));
  }
  return areas.map(withColor);
}

export function getArea(value) {
  if (value === OTHER.value) return withColor(OTHER);
  return getAreas().find((area) => area.value === value) ?? withColor(OTHER);
}

export const OTHER_AREA = withColor(OTHER);

function slugify(label) {
  return label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "area";
}

// Retorna o id da área criada, ou null se o limite do plano básico foi atingido.
export function createArea({ label, color }) {
  if (customAreaSlots().left <= 0) return null;
  const raw = readStored() ?? DEFAULT_AREAS;
  const base = slugify(label);
  let value = base;
  let n = 2;
  while (value === OTHER.value || raw.some((area) => area.value === value)) value = `${base}-${n++}`;
  store([...raw, { value, label: label.trim(), color, custom: true }]);
  return value;
}

export function updateArea(value, patch) {
  const raw = readStored() ?? DEFAULT_AREAS;
  store(raw.map((area) => (area.value === value ? { ...area, ...patch, label: (patch.label ?? area.label).trim() } : area)));
}

// Apaga a área. Quem chama move as missões dela para "Outros".
export function deleteArea(value) {
  const raw = readStored() ?? DEFAULT_AREAS;
  store(raw.filter((area) => area.value !== value));
}

export function subscribeAreas(listener) {
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
