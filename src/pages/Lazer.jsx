import AreasDaVidaLayout from "../layouts/AreasDaVidaLayout";
import { MissoesList } from "../components/MissoesList";
import { useAreaInfo } from "../hooks/useAreaInfo";

const lazerMissions = [
  { id: 1, title: "Assistir a um filme no cinema", tags: ["Entretenimento"], xp: 50, done: false },
];
 
export default function Lazer() {
  useAreaInfo("Área do Lazer", "🖥️");
  return (
      <MissoesList initialMissions={lazerMissions} />
  );
}