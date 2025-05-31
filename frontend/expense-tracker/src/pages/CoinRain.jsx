import React, { useRef, useEffect, useState } from "react";

const COIN_SIZE = 32;
const GRAVITY = 0.16;
const SPAWN_INTERVAL = 600;
const BOUNCE_STRENGTH = 7;
const COIN_LIFETIME = 12000;
const COIN_COLORS = ["#facc15", "#fde68a", "#fbbf24", "#fef08a"];
const BASKET_WIDTH = 56;
const BASKET_HEIGHT = 32;

// Rock definitions (fixed positions for now)
const ROCKS = [
  { x: 120, y: window.innerHeight - 60, w: 60, h: 32 },
  { x: window.innerWidth / 2 - 40, y: window.innerHeight - 48, w: 80, h: 36 },
  { x: window.innerWidth - 180, y: window.innerHeight - 54, w: 70, h: 30 },
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

const CoinRain = () => {
  const [coins, setCoins] = useState([]);
  const [score, setScore] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const pointer = useRef({ x: window.innerWidth / 2, y: window.innerHeight - 80 });
  const coinId = useRef(0);
  const animationRef = useRef();
  const containerRef = useRef();
  const basketRef = useRef(pointer.current);

  // Responsive rocks based on window size
  const ROCKS = [
    { x: 40, y: windowSize.height - 60, w: 70, h: 32 },
    { x: windowSize.width / 2 - 50, y: windowSize.height - 48, w: 100, h: 36 },
    { x: windowSize.width - 110, y: windowSize.height - 54, w: 70, h: 30 },
  ];

  // Spawn coins at intervals
  useEffect(() => {
    const spawn = () => {
      setCoins((prev) => [
        ...prev,
        {
          id: coinId.current++,
          x: randomBetween(0, window.innerWidth - COIN_SIZE),
          y: -COIN_SIZE,
          vy: randomBetween(0.6, 1.2),
          vx: randomBetween(-0.3, 0.3),
          color: COIN_COLORS[Math.floor(Math.random() * COIN_COLORS.length)],
          created: Date.now(),
        },
      ]);
    };
    const interval = setInterval(spawn, SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Animate coins and check for catching
  useEffect(() => {
    const animate = () => {
      setCoins((prev) => {
        const newCoins = [];
        prev.forEach((coin) => {
          let { x, y, vx, vy } = coin;
          // Pointer interaction
          const dx = pointer.current.x - (x + COIN_SIZE / 2);
          const dy = pointer.current.y - (y + COIN_SIZE / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            // Repel coin
            const angle = Math.atan2(dy, dx);
            vx -= Math.cos(angle) * BOUNCE_STRENGTH * 0.08;
            vy -= Math.sin(angle) * BOUNCE_STRENGTH * 0.08;
          }
          vy += GRAVITY;
          x += vx;
          y += vy;

          // Rock collision
          for (const rock of ROCKS) {
            const coinRect = { left: x, right: x + COIN_SIZE, top: y, bottom: y + COIN_SIZE };
            const rockRect = { left: rock.x, right: rock.x + rock.w, top: rock.y, bottom: rock.y + rock.h };
            const overlap =
              coinRect.left < rockRect.right &&
              coinRect.right > rockRect.left &&
              coinRect.top < rockRect.bottom &&
              coinRect.bottom > rockRect.top;
            if (overlap) {
              // Simple bounce: reverse y velocity, dampen
              vy = -Math.abs(vy) * 0.6;
              y = rock.y - COIN_SIZE; // Place coin on top of rock
              // Add a little random x bounce
              vx += (Math.random() - 0.5) * 1.2;
            }
          }

          // Basket collision
          const basketX = pointer.current.x - BASKET_WIDTH / 2;
          const basketY = pointer.current.y - BASKET_HEIGHT / 2;
          const coinRect = { left: x, right: x + COIN_SIZE, top: y, bottom: y + COIN_SIZE };
          const basketRect = { left: basketX, right: basketX + BASKET_WIDTH, top: basketY, bottom: basketY + BASKET_HEIGHT };
          const overlap =
            coinRect.left < basketRect.right &&
            coinRect.right > basketRect.left &&
            coinRect.top < basketRect.bottom &&
            coinRect.bottom > basketRect.top;
          if (overlap) {
            setScore((s) => s + 1);
            return; // Don't add this coin (caught)
          }

          if (
            y < window.innerHeight + COIN_SIZE &&
            Date.now() - coin.created < COIN_LIFETIME
          ) {
            newCoins.push({ ...coin, x, y, vx, vy });
          }
        });
        return newCoins;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  // Pointer tracking
  useEffect(() => {
    const handlePointer = (e) => {
      pointer.current = {
        x: e.clientX,
        y: e.clientY,
      };
      basketRef.current = pointer.current;
    };
    window.addEventListener("pointermove", handlePointer);
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  // For touch devices, set pointer to bottom center
  useEffect(() => {
    const handleTouch = (e) => {
      if (e.touches && e.touches.length > 0) {
        pointer.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        basketRef.current = pointer.current;
      }
    };
    window.addEventListener("touchmove", handleTouch);
    return () => window.removeEventListener("touchmove", handleTouch);
  }, []);

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Score Display */}
      <div
        style={{
          position: "fixed",
          top: 24,
          right: 36,
          zIndex: 100,
          background: "rgba(255,255,255,0.85)",
          color: "#b45309",
          fontWeight: 700,
          fontSize: 22,
          borderRadius: 12,
          padding: "8px 22px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          letterSpacing: 1,
          userSelect: "none",
        }}
      >
        <span role="img" aria-label="coin">🪙</span> {score}
      </div>
      {/* Coin Rain Layer */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {/* Render rocks */}
        {ROCKS.map((rock, i) => (
          <svg
            key={i}
            width={rock.w}
            height={rock.h}
            style={{
              position: "absolute",
              left: rock.x,
              top: rock.y,
              zIndex: 2,
              pointerEvents: "none",
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.18))",
            }}
          >
            <ellipse
              cx={rock.w / 2}
              cy={rock.h / 2}
              rx={rock.w / 2.2}
              ry={rock.h / 2.3}
              fill="#a3a3a3"
            />
            <ellipse
              cx={rock.w / 2.5}
              cy={rock.h / 2.2}
              rx={rock.w / 5}
              ry={rock.h / 4.5}
              fill="#d4d4d4"
              opacity={0.7}
            />
          </svg>
        ))}
        {/* Coins */}
        {coins.map((coin) => (
          <svg
            key={coin.id}
            width={COIN_SIZE}
            height={COIN_SIZE}
            style={{
              position: "absolute",
              left: coin.x,
              top: coin.y,
              transition: "filter 0.2s",
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.12))",
              zIndex: 1,
            }}
          >
            <circle cx={16} cy={16} r={16} fill={coin.color} />
            <circle cx={16} cy={16} r={10} fill="#fde68a" />
            <text x={16} y={21} textAnchor="middle" fontSize="14" fill="#b45309" fontWeight="bold">$</text>
          </svg>
        ))}
        {/* Basket */}
        <svg
          width={BASKET_WIDTH}
          height={BASKET_HEIGHT}
          style={{
            position: "absolute",
            left: pointer.current.x - BASKET_WIDTH / 2,
            top: pointer.current.y - BASKET_HEIGHT / 2,
            zIndex: 2,
            pointerEvents: "none",
            transition: "filter 0.2s",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.10))",
          }}
        >
          <ellipse cx={BASKET_WIDTH / 2} cy={BASKET_HEIGHT - 8} rx={BASKET_WIDTH / 2.2} ry={BASKET_HEIGHT / 2.5} fill="#fbbf24" />
          <rect x={8} y={BASKET_HEIGHT / 2 - 6} width={BASKET_WIDTH - 16} height={BASKET_HEIGHT / 2} rx={8} fill="#f59e42" />
          <ellipse cx={BASKET_WIDTH / 2} cy={BASKET_HEIGHT / 2} rx={BASKET_WIDTH / 2.5} ry={BASKET_HEIGHT / 4.2} fill="#fde68a" />
        </svg>
      </div>
    </>
  );
};

export default CoinRain; 