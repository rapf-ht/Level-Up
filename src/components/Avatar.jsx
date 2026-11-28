import { spriteRects } from "../data/spriteArt";
import { SHOP_CATALOG } from "../manager/ItemManager";

// Ordem das camadas, de trás para a frente. A casa não aparece no personagem.
const LAYER_ORDER = ["cenario", "base", "calca", "bota", "armadura", "capacete", "arma", "pet"];

function Layer({ sprite, src }) {
  if (src) return <image href={src} x="0" y="0" width="32" height="32" style={{ imageRendering: "pixelated" }} />;
  return (
    <g>
      {spriteRects(sprite).map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height="1" fill={r.fill} />
      ))}
    </g>
  );
}

/**
 * Avatar montado em camadas: personagem base + o que estiver equipado.
 * equipped: { [slot]: itemId } — o mesmo formato do ItemManager.getEquipped().
 */
export function Avatar({ equipped = {}, size = 96, label, className = "" }) {
  const layers = LAYER_ORDER.map((slot) => {
    if (slot === "base") return { slot, sprite: "base" };
    const item = SHOP_CATALOG.find((entry) => entry.id === equipped[slot]);
    if (!item || (!item.sprite && !item.layerSrc)) return null;
    return { slot, sprite: item.sprite, src: item.layerSrc };
  }).filter(Boolean);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {layers.map((layer) => (
        <Layer key={layer.slot} sprite={layer.sprite} src={layer.src} />
      ))}
    </svg>
  );
}
