function pixelIcon(box, rects) {
  return function PixelIcon({ size = 20, ...rest }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${box} ${box}`}
        shapeRendering="crispEdges"
        fill="currentColor"
        aria-hidden="true"
        {...rest}
      >
        {rects.map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} />
        ))}
      </svg>
    );
  };
}

export const BellIcon = pixelIcon(10, [[4, 0, 2, 1], [3, 1, 4, 1], [2, 2, 6, 4], [1, 6, 8, 1], [0, 7, 10, 1], [4, 8, 2, 2]]);
export const PlusIcon = pixelIcon(7, [[3, 0, 1, 7], [0, 3, 7, 1]]);
export const CheckIcon = pixelIcon(7, [[0, 3, 1, 1], [1, 4, 1, 1], [2, 5, 1, 1], [3, 4, 1, 1], [4, 3, 1, 1], [5, 2, 1, 1], [6, 1, 1, 1]]);
export const CloseIcon = pixelIcon(7, [[0, 0, 1, 1], [1, 1, 1, 1], [2, 2, 1, 1], [3, 3, 1, 1], [4, 4, 1, 1], [5, 5, 1, 1], [6, 6, 1, 1], [6, 0, 1, 1], [5, 1, 1, 1], [4, 2, 1, 1], [2, 4, 1, 1], [1, 5, 1, 1], [0, 6, 1, 1]]);
export const SearchIcon = pixelIcon(9, [[2, 0, 3, 1], [1, 1, 1, 1], [5, 1, 1, 1], [0, 2, 1, 3], [6, 2, 1, 3], [1, 5, 1, 1], [5, 5, 1, 1], [2, 6, 3, 1], [6, 6, 1, 1], [7, 7, 1, 1], [8, 8, 1, 1]]);
export const HomeIcon = pixelIcon(9, [[4, 0, 1, 1], [3, 1, 3, 1], [2, 2, 5, 1], [1, 3, 7, 1], [0, 4, 9, 1], [1, 5, 7, 4]]);
export const GridIcon = pixelIcon(9, [[0, 0, 4, 4], [5, 0, 4, 4], [0, 5, 4, 4], [5, 5, 4, 4]]);
export const BagIcon = pixelIcon(9, [[3, 0, 3, 1], [2, 1, 1, 2], [6, 1, 1, 2], [0, 3, 9, 6]]);
export const UserIcon = pixelIcon(9, [[3, 0, 3, 3], [1, 4, 7, 1], [0, 5, 9, 4]]);
export const MugIcon = pixelIcon(9, [[1, 0, 5, 1], [0, 1, 7, 8], [7, 2, 2, 1], [8, 3, 1, 3], [7, 6, 2, 1]]);
export const ShieldIcon = pixelIcon(7, [[0, 0, 7, 4], [1, 4, 5, 1], [2, 5, 3, 1], [3, 6, 1, 1]]);
