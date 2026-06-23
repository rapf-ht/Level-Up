import { MissoesList } from "../components/MissoesList";
import { useAreaInfo } from "../hooks/useAreaInfo";

export default function Financas() {
  useAreaInfo("Área de Finanças", "💲", "/banners/banner_financas.png");
  return <MissoesList categoryFilter="financas" />;
}