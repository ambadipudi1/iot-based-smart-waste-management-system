import React from 'react';
import { BinData } from '../contexts/BinContext';
import { CircularProgress } from './CircularProgress';
import { Wifi, MapPin, Clock } from 'lucide-react';

interface BinCardProps {
  bin: BinData;
}

function getStatusLabel(pct: number): { label: string; color: string; bg: string } {
  if (pct >= 80) return { label: 'Critical', color: '#f87171', bg: 'rgba(239,68,68,0.15)' };
  if (pct >= 50) return { label: 'Moderate', color: '#facc15', bg: 'rgba(234,179,8,0.15)' };
  return { label: 'Normal', color: '#4ade80', bg: 'rgba(34,197,94,0.15)' };
}

function getBorderColor(pct: number): string {
  if (pct >= 80) return 'rgba(239,68,68,0.4)';
  if (pct >= 50) return 'rgba(234,179,8,0.4)';
  return 'rgba(34,197,94,0.4)';
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function BinCard({ bin }: BinCardProps) {
  const status = getStatusLabel(bin.fillLevel);
  const borderColor = getBorderColor(bin.fillLevel);

  return (
    <div
      className="glass-card p-5 flex flex-col items-center gap-4 transition-all duration-500 hover:scale-[1.02]"
      style={{ borderColor, borderWidth: '1px', borderStyle: 'solid' }}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-mono font-semibold text-muted-foreground">{bin.id}</span>
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: bin.status === 'online' ? '#4ade80' : '#f87171' }}
          />
          <Wifi className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </div>

      {/* Circular Progress */}
      <CircularProgress percentage={bin.fillLevel} size={130} strokeWidth={11} />

      {/* Status Badge */}
      <div
        className="px-3 py-1 rounded-full text-xs font-semibold"
        style={{ color: status.color, background: status.bg }}
      >
        {status.label}
      </div>

      {/* Location */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="font-medium truncate">{bin.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Updated: {formatTime(bin.lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
}
