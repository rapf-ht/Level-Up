import AreasDaVidaLayout from "../layouts/AreasDaVidaLayout";
import { MissoesList } from "../components/MissoesList";
import { useAreaInfo } from "../hooks/useAreaInfo";

const missions = [
  {
    id: 1,
    title: "Alongar por 30 minutos",
    tags: ["Exercício", "Diário"],
    xp: 50,
    done: false,
  },
  {
    id: 2,
    title: "Beber 2L de água",
    tags: ["Hidratação", "Diário"],
    xp: 50,
    done: false,
  },
  { id: 3, title: "Dormir 8 horas", tags: ["Sono"], xp: 50, done: false },
  {
    id: 4,
    title: "Consulta com dentista",
    tags: ["Médico"],
    xp: 50,
    done: false,
  },
  {
    id: 5,
    title: "Meditar 10 minutos",
    tags: ["Mental", "Diário"],
    xp: 50,
    done: false,
  },
];

export default function Saude() {
  useAreaInfo("Área da Saúde", "❤️");
  return <MissoesList initialMissions={missions} />;
}
