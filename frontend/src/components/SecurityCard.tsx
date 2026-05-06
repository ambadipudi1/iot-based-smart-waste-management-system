import React, { ReactNode } from 'react';

interface SecurityCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function SecurityCard({ icon, title, description, color, bgColor }: SecurityCardProps) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 hover:scale-[1.02] transition-all duration-300">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: bgColor }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <div>
        <h3 className="font-display font-semibold text-base mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        <span className="text-xs font-medium" style={{ color }}>Active Protection</span>
      </div>
    </div>
  );
}
