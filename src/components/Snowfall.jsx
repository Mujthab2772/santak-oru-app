import React, { useEffect, useState } from 'react';

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Generate snowflakes only on mount
    const flakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + 'vw',
      size: Math.random() * 1 + 0.5 + 'rem',
      animationDuration: Math.random() * 10 + 5 + 's',
      animationDelay: Math.random() * -10 + 's',
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute top-[-20px] text-white"
          style={{
            left: flake.left,
            fontSize: flake.size,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            animationIterationCount: 'infinite',
            opacity: Math.random() * 0.5 + 0.3
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowfall;
