import React from 'react';
import { RefreshCw, Wifi, AlertTriangle } from 'lucide-react';
import { useBins } from '../contexts/BinContext';
import { BinCard } from '../components/BinCard';

export function BinMonitoring() {
  const { bins } = useBins();
  const criticalCount = bins.filter(b => b.fillLevel >= 80).length;
  const moderateCount = bins.filter(b => b.fillLevel >= 50 && b.fillLevel < 80).length;
  const normalCount = bins.filter(b => b.fillLevel < 50).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Bin Monitoring</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time fill level monitoring for all smart bins</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Auto-updating every 4s</span>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold font-display text-green-400">{normalCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Normal (0–50%)</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold font-display text-yellow-400">{moderateCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Moderate (50–80%)</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold font-display text-red-400">{criticalCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Critical (80–100%)</p>
        </div>
      </div>

      {/* Alert Banner */}
      {criticalCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl animate-fade-in"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 animate-pulse" />
          <p className="text-sm text-red-400 font-medium">
            {criticalCount} bin{criticalCount > 1 ? 's' : ''} require immediate collection! Fill level exceeds 80%.
          </p>
        </div>
      )}

      {/* Bin Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {bins.map(bin => (
          <BinCard key={bin.id} bin={bin} />
        ))}
      </div>

      {/* Legend */}
      <div className="glass-card p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3">Color Legend</p>
        <div className="flex flex-wrap gap-6">
          {[
            { color: '#4ade80', label: 'Normal (0–50%)', desc: 'No action required' },
            { color: '#facc15', label: 'Moderate (50–80%)', desc: 'Schedule collection soon' },
            { color: '#f87171', label: 'Critical (80–100%)', desc: 'Immediate collection needed' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: item.color }}>{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
