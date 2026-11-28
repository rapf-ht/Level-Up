import styles from "./EmptyState.module.css";
import { spriteRects } from "../data/spriteArt";

// Tela vazia com uma ilustração em pixel art (sprites "vazio_*" de src/data/sprites.js).
export function EmptyState({ art, children, size = 72, compact = false, className = "" }) {
  return (
    <div className={`${styles.empty} ${compact ? styles.compact : ""} ${className}`}>
      <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges" aria-hidden="true" className={styles.art}>
        {spriteRects(`vazio_${art}`).map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height="1" fill={r.fill} />
        ))}
      </svg>
      <div className={styles.text}>{children}</div>
    </div>
  );
}
