// Point-buy or auto-assign
import { useState } from "react";

export default function StatAllocator({ onChange }) {
  const [points, setPoints] = useState(5);
  const [stats, setStats] = useState({
    hp: 0,
    atk: 0,
    def: 0,
    agi: 0,
    luck: 0
  });

  const modify = (key, delta) => {
    if (delta > 0 && points === 0) return;
    if (delta < 0 && stats[key] === 0) return;

    const newStats = { ...stats, [key]: stats[key] + delta };
    setStats(newStats);
    setPoints(points - delta);
    onChange(newStats);
  };

  return (
    <div className="stat-allocator">
      <h4>Allocate Bonus Stats</h4>
      <p>Points remaining: {points}</p>

      {Object.keys(stats).map(key => (
        <div key={key} className="stat-row">
          <span>{key.toUpperCase()}</span>
          <button onClick={() => modify(key, -1)}>-</button>
          <span>{stats[key]}</span>
          <button onClick={() => modify(key, 1)}>+</button>
        </div>
      ))}
    </div>
  );
}
