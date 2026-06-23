import AreasDaVidaLayout from "../layouts/AreasDaVidaLayout";
import { MissoesList } from "../components/MissoesList";
import { useAreaInfo } from "../hooks/useAreaInfo";

const organizacaoMissions = [
  { id: 1, title: "Lavar roupa", tags: ["Semanal"], xp: 50, done: false },
  { id: 2, title: "Lavar a louça", tags: ["Diário"], xp: 50, done: false },
];
 
export default function Organizacao() {
  useAreaInfo("Área da Casa", "🏠", "/banners/banner_organizacao.png");
  return (
      <MissoesList initialMissions={organizacaoMissions} />
  );
}