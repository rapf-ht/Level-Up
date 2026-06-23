import { MissoesList } from "../components/MissoesList";
import { useAreaInfo } from "../hooks/useAreaInfo";

export default function Lazer() {
  useAreaInfo("Área do Lazer", "🖥️", "/banners/banner_lazer.png");
  return <MissoesList categoryFilter="lazer" />;
}