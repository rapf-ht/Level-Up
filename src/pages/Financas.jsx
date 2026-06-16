import AreasDaVidaLayout from "../layouts/AreasDaVidaLayout";
import { MissoesList } from "../components/MissoesList";
import { useAreaInfo } from "../hooks/useAreaInfo";

const financasMissions = [
  { id: 1, title: "Revisar e projetar gastos do mês", tags: ["Mensal"], xp: 50, done: false },
  { id: 2, title: "Guardar 10% do salário", tags: ["Mensal"], xp: 50, done: false },
];
 
export default function Financas() {
  useAreaInfo("Área de Finanças", "💲");
  return (
      <MissoesList initialMissions={financasMissions} />
  );
}