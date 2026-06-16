import AreasDaVidaLayout from "../layouts/AreasDaVidaLayout";
import { MissoesList } from "../components/MissoesList";
import { useAreaInfo } from "../hooks/useAreaInfo";

const planejamentoMissions = [
  { id: 1, title: "Definir metas mensais", tags: ["Mensal"], xp: 50, done: false },
  { id: 2, title: "Revisar plano de carreira", tags: ["Carreira"], xp: 50, done: false },
];
 
export default function Planejamento() {
  useAreaInfo("Área de Plano", "✏️");
  return (
      <MissoesList initialMissions={planejamentoMissions} />
  );
}