import React from "react";

export function AreaChart() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  // Curve coordinates across 7 months (viewBox width 500, height 120)
  // X steps: 20, 95, 170, 245, 320, 395, 470
  const points = [
    { x: 20, y: 80 },
    { x: 95, y: 65 },
    { x: 170, y: 72 },
    { x: 245, y: 48 },
    { x: 320, y: 35 },
    { x: 395, y: 40 },
    { x: 470, y: 22 },
  ];

  // Smooth bezier curve generator
  const curveD = `
    M 20 80
    C 55 72, 65 65, 95 65
    C 125 65, 140 72, 170 72
    C 200 72, 220 52, 245 48
    C 275 42, 290 36, 320 35
    C 350 34, 370 42, 395 40
    C 425 38, 445 25, 470 22
  `;

  const fillD = `${curveD} L 470 105 L 20 105 Z`;

  return (
    <div className="w-full">
      <div className="w-full h-24 relative">
        <svg
          viewBox="0 0 490 115"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="sageAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6F8559" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6F8559" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background grid lines */}
          <line x1="15" y1="30" x2="475" y2="30" stroke="#E7E7E1" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="15" y1="65" x2="475" y2="65" stroke="#E7E7E1" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="15" y1="100" x2="475" y2="100" stroke="#E7E7E1" strokeWidth="0.8" strokeDasharray="3 3" />

          {/* Area fill */}
          <path d={fillD} fill="url(#sageAreaGrad)" />

          {/* Line stroke */}
          <path
            d={curveD}
            fill="none"
            stroke="#6F8559"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* End marker dot */}
          <circle cx="470" cy="22" r="3.5" fill="#6F8559" />
          <circle cx="470" cy="22" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* X Axis Months */}
      <div className="flex justify-between px-2 pt-2 border-t border-border/60">
        {months.map((m) => (
          <span key={m} className="text-[10px] text-text_muted font-medium">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
