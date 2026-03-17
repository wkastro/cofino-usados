"use client";

import { Children } from "react";

interface EffectMarqueeProps {
  children: React.ReactNode;
  /** Duration in seconds for one full loop. Default: 28 */
  speed?: number;
  /** Scroll direction. Default: "left" */
  direction?: "left" | "right";
  /** Gap between items in px. Default: 48 */
  gap?: number;
  /** How many times to repeat the set to guarantee no gaps. Default: 4 */
  repeat?: number;
  /** Pause animation on hover. Default: true */
  pauseOnHover?: boolean;
  className?: string;
}

export function EffectMarquee({
  children,
  speed = 28,
  direction = "left",
  gap = 48,
  repeat = 4,
  pauseOnHover = true,
  className = "",
}: EffectMarqueeProps) {
  const items = Children.toArray(children);

  // Build a single "set" repeated `repeat` times, then duplicate it for the seamless loop.
  // Animation moves -50% → back to start, so both halves must be identical.
  const set = Array.from({ length: repeat }, (_, r) =>
    items.map((item, i) => ({ item, key: `${r}-${i}` }))
  ).flat();

  const animationName = direction === "right" ? "marquee-reverse" : "marquee";

  const trackStyle: React.CSSProperties = {
    display: "flex",
    width: "max-content",
    animation: `${animationName} ${speed}s linear infinite`,
    gap: `${gap}px`,
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <div
        style={trackStyle}
        className={pauseOnHover ? "[&:hover]:paused" : ""}
      >
        {/* First half */}
        {set.map(({ item, key }) => (
          <div key={`a-${key}`} className="flex shrink-0 items-center">
            {item}
          </div>
        ))}
        {/* Second half — identical copy for seamless loop */}
        {set.map(({ item, key }) => (
          <div key={`b-${key}`} aria-hidden className="flex shrink-0 items-center">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
