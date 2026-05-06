import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

function getBinColor(pct: number): { stroke: string; text: string; glow: string } {
  if (pct >= 80) return { stroke: '#ef4444', text: '#f87171', glow: 'rgba(239,68,68,0.3)' };
  if (pct >= 50) return { stroke: '#eab308', text: '#facc15', glow: 'rgba(234,179,8,0.3)' };
  return { stroke: '#22c55e', text: '#4ade80', glow: 'rgba(34,197,94,0.3)' };
}

export function CircularProgress({ percentage, size = 120, strokeWidth = 10 }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const colors = getBinColor(percentage);
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease',
            filter: `drop-shadow(0 0 6px ${colors.glow})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-display" style={{ color: colors.text }}>
          {percentage}%
        </span>
        <span className="text-xs opacity-60 mt-0.5">filled</span>
      </div>
    </div>
  );
}
