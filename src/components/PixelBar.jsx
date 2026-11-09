export function PixelBar({ kind, value, max }) {
  const percent = max > 0 ? Math.max(0, Math.min((value / max) * 100, 100)) : 0;
  return (
    <div className={`bar bar-${kind}`}>
      <div style={{ width: `${percent}%` }} />
    </div>
  );
}

export function PlayerBars({ player }) {
  const xpNeeded = player.level * 100;
  return (
    <>
      <div className="bar-stack">
        <div className="bar-head">
          <span style={{ color: "var(--hp-text)" }}>HP</span>
          <span>{player.hp} / {player.maxHp}</span>
        </div>
        <PixelBar kind="hp" value={player.hp} max={player.maxHp} />
      </div>
      <div className="bar-stack">
        <div className="bar-head">
          <span style={{ color: "var(--xp-text)" }}>XP</span>
          <span>{player.xp} / {xpNeeded}</span>
        </div>
        <PixelBar kind="xp" value={player.xp} max={xpNeeded} />
      </div>
    </>
  );
}
