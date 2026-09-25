import React from "react";

interface GaugeProps {
  value: string; // e.g. "78%"
  label?: string; // "Occupancy"
  delta?: string; // "+4.2% vs last month"
}

export function Gauge({
  value = "78%",
  label = "Occupancy",
  delta = "+4.2% vs last month",
}: GaugeProps) {
  // Parse percentage number (default to 78)
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, "")) || 78;
  const clamped = Math.min(100, Math.max(0, numericValue));

  // Semicircle parameters
  // Radius = 65, center = (80, 80)
  // Arc spans from 180 degrees (left) to 0 degrees (right) => total length = PI * 65 ≈ 204.2
  const r = 60;
  const cx = 80;
  const cy = 75;
  const circumference = Math.PI * r;
  const strokeDashoffset = circumference * (1 - clamped / 100);

  // Position of coral marker at arc end:
  // Angle = PI - (clamped / 100) * PI
  const angle = Math.PI - (clamped / 100) * Math.PI;
  const markerX = cx + r * Math.cos(angle);
  const markerY = cy - r * Math.sin(angle);

  return (
    <div className="flex flex-col items-center">
      <div className="w-44 h-24 relative flex items-center justify-center">
        <svg viewBox="0 0 160 95" className="w-full h-full overflow-visible">
          {/* Background track arc */}
          <path
            d="M 20 75 A 60 60 0 0 1 140 75"
            fill="none"
            stroke="#E3EAD8"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Active sage arc */}
          <path
            d="M 20 75 A 60 60 0 0 1 140 75"
            fill="none"
            stroke="#6F8559"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />

          {/* Coral accent marker at the tip of the value arc */}
          <circle
            cx={markerX}
            cy={markerY}
            r="6"
            fill="#E58A6E"
            stroke="#FFFFFF"
            strokeWidth="2"
            className="shadow-sm"
          />
        </svg>

        {/* Centered value readout */}
        <div className="absolute top-10 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-serif text-text_primary tracking-tight font-normal">
            {value}
          </span>
          <span className="text-[10px] text-text_muted uppercase tracking-wider font-medium">
            {label}
          </span>
        </div>
      </div>

      {delta && (
        <span className="text-[11px] text-sage_700 font-medium mt-1">
          {delta}
        </span>
      )}
    </div>
  );
}
