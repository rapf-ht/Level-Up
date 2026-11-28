import { SPRITES, SPRITE_PALETTE } from "./sprites";

// Junta pixels vizinhos da mesma cor numa linha em um só retângulo (menos elementos no SVG).
export function spriteRects(name) {
  const rows = SPRITES[name] ?? [];
  const rects = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const key = row[x];
      if (key === ".") {
        x += 1;
        continue;
      }
      let end = x;
      while (end + 1 < row.length && row[end + 1] === key) end += 1;
      rects.push({ x, y, w: end - x + 1, fill: SPRITE_PALETTE[key] });
      x = end + 1;
    }
  });
  return rects;
}

// Ícone do item: o sprite recortado no tamanho do desenho, como imagem SVG.
export function spriteIcon(name) {
  const rects = spriteRects(name);
  if (rects.length === 0) return "";
  const minX = Math.min(...rects.map((r) => r.x));
  const maxX = Math.max(...rects.map((r) => r.x + r.w));
  const minY = Math.min(...rects.map((r) => r.y));
  const maxY = Math.max(...rects.map((r) => r.y + 1));
  const size = Math.max(maxX - minX, maxY - minY);
  const offX = minX - (size - (maxX - minX)) / 2;
  const offY = minY - (size - (maxY - minY)) / 2;
  const body = rects.map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="1" fill="${r.fill}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${offX} ${offY} ${size} ${size}" shape-rendering="crispEdges">${body}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
