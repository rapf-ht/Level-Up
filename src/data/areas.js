export const AREAS = [
  { value: "saude", label: "Saúde", color: "#ec7fb0" },
  { value: "estudos", label: "Estudos", color: "#9b8af0" },
  { value: "agenda", label: "Agenda", color: "#4fcfd9" },
  { value: "planejamento", label: "Planejamento", color: "#b7d44f" },
  { value: "organizacao", label: "Organização", color: "#a8b4c4" },
  { value: "lazer", label: "Lazer", color: "#f09a5b" },
  { value: "financas", label: "Finanças", color: "#43c59e" },
];

export const OTHER_AREA = { value: "outros", label: "Outros", color: "#8a7d69" };

export function getArea(value) {
  return AREAS.find((area) => area.value === value) ?? OTHER_AREA;
}

export const MISSION_TYPES = {
  daily: { label: "Diária", badge: "" },
  medium: { label: "Média", badge: "badge-medium" },
  weekly: { label: "Semanal", badge: "badge-weekly" },
};
