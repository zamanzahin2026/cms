import React from "react";

interface BarLineChartProps {
  periodLabel?: string;
  legendRevenue?: string;
  legendBookings?: string;
}

export function BarLineChart({
  periodLabel = "Monthly",
  legendRevenue = "Revenue (USD)",
  legendBookings = "Bookings",
}: BarLineChartProps) {
  // 24 simulated bar heights (0 to 100 scale)
  const barHeights = [
    35, 42, 50, 48, 62, 58, 70, 65, 82, 78, 88, 74,
    80, 85, 92, 79, 86, 94, 90, 84, 89, 95, 91, 96,
  ];

  // Overlay trendline points matching the progression
  const linePoints = [
    { x: 10, y: 70 },
    { x: 45, y: 65 },
    { x: 80, y: 58 },
    { x: 115, y: 60 },
    { x: 150, y: 46 },
    { x: 185, y: 50 },
    { x: 220, y: 38 },
    { x: 255, y: 42 },
    { x: 290, y: 28 },
    { x: 325, y: 32 },
    { x: 360, y: 22 },
    { x: 395, y: 35 },
    { x: 430, y: 30 },
    { x: 465, y: 25 },
    { x: 500, y: 18 },
    { x: 535, y: 26 },
    { x: 570, y: 20 },
    { x: 605, y: 15 },
    { x: 640, y: 18 },
    { x: 675, y: 24 },
    { x: 710, y: 19 },
    { x: 745, y: 14 },
    { x: 780, y: 17 },
    { x: 815, y: 12 },
  ];

  const pathD = linePoints.reduce(
    (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ""
  );

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sage_600 inline-block" />
            <span className="text-[11px] text-text_secondary">{legendRevenue}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent_coral inline-block" />
            <span className="text-[11px] text-text_secondary">{legendBookings}</span>
          </div>
        </div>

        <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface_muted border border-border text-text_secondary font-medium">
          {periodLabel}
        </span>
      </div>

      <div className="w-full h-32 relative">
        <svg
          viewBox="0 0 830 110"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Subtle horizontal grid lines */}
          <line x1="0" y1="20" x2="830" y2="20" stroke="#E7E7E1" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="0" y1="55" x2="830" y2="55" stroke="#E7E7E1" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="0" y1="90" x2="830" y2="90" stroke="#E7E7E1" strokeWidth="0.8" strokeDasharray="3 3" />

          {/* 24 Sage Bars */}
          {barHeights.map((h, i) => {
            const barWidth = 14;
            const x = i * 34.5 + 4;
            const barHeight = (h / 100) * 85;
            const y = 100 - barHeight;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={3}
                fill="#9CAF86"
                className="transition-opacity hover:opacity-80"
              />
            );
          })}

          {/* Coral Trendline */}
          <path
            d={pathD}
            fill="none"
            stroke="#E58A6E"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Subtle dots on coral line */}
          {linePoints.filter((_, idx) => idx % 4 === 0).map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={3}
              fill="#FFFFFF"
              stroke="#E58A6E"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
