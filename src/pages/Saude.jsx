import { MissoesList } from "../components/MissoesList";
import { useAreaInfo } from "../hooks/useAreaInfo";

export default function Saude() {
  useAreaInfo("Área da Saúde", "❤️", "/banners/banner_saude.png");
  return <MissoesList categoryFilter="saude" />;
}