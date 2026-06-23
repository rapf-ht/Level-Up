import { MissoesList } from "../components/MissoesList";
import { useAreaInfo } from "../hooks/useAreaInfo";

export default function Organizacao() {
  useAreaInfo("Área da Casa", "🏠", "/banners/banner_organizacao.png");
  return <MissoesList categoryFilter="organizacao" />;
}