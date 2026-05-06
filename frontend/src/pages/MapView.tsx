import React, { useState } from 'react';
import { X, MapPin, Clock, Wifi } from 'lucide-react';
import { useBins, BinData } from '../contexts/BinContext';

interface MarkerPosition {
  x: number;
  y: number;
}

const BIN_POSITIONS: Record<string, MarkerPosition> = {
  'BIN-001': { x: 28, y: 38 },
  'BIN-002': { x: 18, y: 58 },
  'BIN-003': { x: 58, y: 68 },
  'BIN-004': { x: 72, y: 28 },
  'BIN-005': { x: 45, y: 80 },
};

function getBinColor(pct: number): string {
  if (pct >= 80) return '#ef4444';
  if (pct >= 50) return '#eab308';
  return '#22c55e';
}

function getBinGlow(pct: number): string {
  if (pct >= 80) return 'rgba(239,68,68,0.5)';
  if (pct >= 50) return 'rgba(234,179,8,0.5)';
  return 'rgba(34,197,94,0.5)';
}

function getStatusLabel(pct: number): string {
  if (pct >= 80) return 'Critical';
  if (pct >= 50) return 'Moderate';
  return 'Normal';
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

interface BinDetailPopupProps {
  bin: BinData;
  onClose: () => void;
}

function BinDetailPopup({ bin, onClose }: BinDetailPopupProps) {
  const color = getBinColor(bin.fillLevel);
  const statusLabel = getStatusLabel(bin.fillLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative glass-card-dark p-6 rounded-2xl w-full max-w-sm animate-fade-in-up"
        onClick={e => e.stopPropagation()}
        style={{ border: `1px solid ${color}40` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${color}15`, border: `1px solid ${color}40` }}
          >
            <MapPin className="w-6 h-6" style={{ color }} />
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-blue-400">{bin.id}</p>
            <p className="font-display font-semibold text-base">{bin.location}</p>
          </div>
        </div>

        {/* Fill Level */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Fill Level</span>
            <span className="text-lg font-bold font-display" style={{ color }}>
              {bin.fillLevel}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${bin.fillLevel}%`,
                background: color,
                boxShadow: `0 0 8px ${getBinGlow(bin.fillLevel)}`,
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-sm text-muted-foreground">Status</span>
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ color, background: `${color}15` }}
            >
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-sm text-muted-foreground">Network</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <Wifi className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-green-400 font-semibold">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{formatTime(bin.lastUpdated)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MapView() {
  const { bins } = useBins();
  const [selectedBin, setSelectedBin] = useState<BinData | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl">Map View</h1>
        <p className="text-muted-foreground text-sm mt-1">Geographic overview of all smart bin locations</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {[
          { color: '#22c55e', label: 'Normal (0–50%)' },
          { color: '#eab308', label: 'Moderate (50–80%)' },
          { color: '#ef4444', label: 'Critical (80–100%)' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
            />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs text-muted-foreground">Click marker for details</span>
        </div>
      </div>

      {/* Map Container */}
      <div
        className="relative rounded-2xl overflow-hidden map-container"
        style={{ height: '520px', border: '1px solid rgba(80,120,200,0.2)' }}
      >
        {/* City grid roads */}
        {/* Horizontal roads */}
        <div className="map-road-h absolute left-0 right-0" style={{ top: '25%', height: '18px' }} />
        <div className="map-road-h absolute left-0 right-0" style={{ top: '50%', height: '18px' }} />
        <div className="map-road-h absolute left-0 right-0" style={{ top: '75%', height: '18px' }} />
        {/* Vertical roads */}
        <div className="map-road-v absolute top-0 bottom-0" style={{ left: '25%', width: '18px' }} />
        <div className="map-road-v absolute top-0 bottom-0" style={{ left: '50%', width: '18px' }} />
        <div className="map-road-v absolute top-0 bottom-0" style={{ left: '75%', width: '18px' }} />

        {/* City blocks */}
        {[
          { top: '2%', left: '2%', width: '21%', height: '21%' },
          { top: '2%', left: '27%', width: '21%', height: '21%' },
          { top: '2%', left: '52%', width: '21%', height: '21%' },
          { top: '2%', left: '77%', width: '21%', height: '21%' },
          { top: '27%', left: '2%', width: '21%', height: '21%' },
          { top: '27%', left: '27%', width: '21%', height: '21%' },
          { top: '27%', left: '52%', width: '21%', height: '21%' },
          { top: '27%', left: '77%', width: '21%', height: '21%' },
          { top: '52%', left: '2%', width: '21%', height: '21%' },
          { top: '52%', left: '27%', width: '21%', height: '21%' },
          { top: '52%', left: '52%', width: '21%', height: '21%' },
          { top: '52%', left: '77%', width: '21%', height: '21%' },
          { top: '77%', left: '2%', width: '21%', height: '21%' },
          { top: '77%', left: '27%', width: '21%', height: '21%' },
          { top: '77%', left: '52%', width: '21%', height: '21%' },
          { top: '77%', left: '77%', width: '21%', height: '21%' },
        ].map((block, i) => (
          <div key={i} className="map-block absolute" style={block} />
        ))}

        {/* Map label */}
        <div
          className="absolute top-3 left-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300"
          style={{ background: 'rgba(15,25,60,0.8)', border: '1px solid rgba(80,120,200,0.3)' }}
        >
          Smart City — Waste Management Zone
        </div>

        {/* Compass */}
        <div
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-blue-300"
          style={{ background: 'rgba(15,25,60,0.8)', border: '1px solid rgba(80,120,200,0.3)' }}
        >
          N
        </div>

        {/* Bin Markers */}
        {bins.map(bin => {
          const pos = BIN_POSITIONS[bin.id];
          if (!pos) return null;
          const color = getBinColor(bin.fillLevel);
          const glow = getBinGlow(bin.fillLevel);

          return (
            <button
              key={bin.id}
              onClick={() => setSelectedBin(bin)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 hover:scale-125 z-10"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              title={`${bin.id} — ${bin.location}`}
            >
              {/* Pulse ring */}
              {bin.fillLevel >= 80 && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-40"
                  style={{ backgroundColor: color, transform: 'scale(1.8)' }}
                />
              )}
              {/* Marker */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200"
                style={{
                  backgroundColor: `${color}20`,
                  borderColor: color,
                  boxShadow: `0 0 12px ${glow}`,
                }}
              >
                <MapPin className="w-5 h-5" style={{ color }} />
              </div>
              {/* Label */}
              <div
                className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(15,25,60,0.9)', color, border: `1px solid ${color}40` }}
              >
                {bin.fillLevel}%
              </div>
            </button>
          );
        })}

        {/* Scale bar */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="w-16 h-1 rounded-full bg-blue-400/40" />
          <span className="text-[10px] text-blue-300/60">500m</span>
        </div>
      </div>

      {/* Bin Status List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {bins.map(bin => {
          const color = getBinColor(bin.fillLevel);
          return (
            <button
              key={bin.id}
              onClick={() => setSelectedBin(bin)}
              className="glass-card p-3 text-left hover:scale-[1.02] transition-all duration-200"
              style={{ borderColor: `${color}40`, borderWidth: '1px', borderStyle: 'solid' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-blue-400">{bin.id}</span>
                <span className="text-xs font-bold" style={{ color }}>
                  {bin.fillLevel}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{bin.location}</p>
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${bin.fillLevel}%`, background: color }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Popup */}
      {selectedBin && <BinDetailPopup bin={selectedBin} onClose={() => setSelectedBin(null)} />}
    </div>
  );
}
