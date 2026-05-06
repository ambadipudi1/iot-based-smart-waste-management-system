import React from 'react';
import {
  Trash2, Bell, Droplets, Activity, Wifi,
  TrendingUp, TrendingDown, ArrowUpRight
} from 'lucide-react';
import { useBins } from '../contexts/BinContext';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

function StatCard({ title, value, unit, icon, color, bg, trend, trendUp, delay = 0 }: StatCardProps) {
  return (
    <div
      className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <div style={{ color }}>{icon}</div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold font-display" style={{ color }}>
          {value}{unit && <span className="text-lg ml-1 opacity-70">{unit}</span>}
        </p>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
      </div>
    </div>
  );
}

export function DashboardOverview() {
  const { bins, alerts } = useBins();
  const activeAlerts = alerts.filter(a => !a.resolved).length;
  const avgFill = bins.length > 0 ? Math.round(bins.reduce((s, b) => s + b.fillLevel, 0) / bins.length) : 0;
  const criticalBins = bins.filter(b => b.fillLevel >= 80).length;

  const totalBinsCount = useAnimatedCounter(5, 1000, 0);
  const alertsCount = useAnimatedCounter(activeAlerts, 800, 100);
  const wasteCount = useAnimatedCounter(247, 1200, 200);
  const networkHealth = useAnimatedCounter(98, 1000, 300);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time IoT waste monitoring — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-semibold text-green-400">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Smart Bins"
          value={totalBinsCount}
          icon={<Trash2 className="w-5 h-5" />}
          color="#60a5fa"
          bg="rgba(96,165,250,0.15)"
          trend="+0 this week"
          trendUp={true}
          delay={0}
        />
        <StatCard
          title="Active Alerts"
          value={alertsCount}
          icon={<Bell className="w-5 h-5" />}
          color={activeAlerts > 0 ? '#f87171' : '#4ade80'}
          bg={activeAlerts > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}
          trend={criticalBins > 0 ? `${criticalBins} critical` : 'All clear'}
          trendUp={activeAlerts === 0}
          delay={0.1}
        />
        <StatCard
          title="Waste Collected Today"
          value={wasteCount}
          unit="kg"
          icon={<Droplets className="w-5 h-5" />}
          color="#4ade80"
          bg="rgba(34,197,94,0.15)"
          trend="+12% vs yesterday"
          trendUp={true}
          delay={0.2}
        />
        <StatCard
          title="Network Health"
          value={networkHealth}
          unit="%"
          icon={<Wifi className="w-5 h-5" />}
          color="#a78bfa"
          bg="rgba(167,139,250,0.15)"
          trend="Excellent"
          trendUp={true}
          delay={0.3}
        />
      </div>

      {/* Bin Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bin Status Overview */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-lg">Bin Status Overview</h2>
            <span className="text-xs text-muted-foreground">Live updates every 4s</span>
          </div>
          <div className="space-y-3">
            {bins.map(bin => {
              const color = bin.fillLevel >= 80 ? '#f87171' : bin.fillLevel >= 50 ? '#facc15' : '#4ade80';
              const label = bin.fillLevel >= 80 ? 'Critical' : bin.fillLevel >= 50 ? 'Moderate' : 'Normal';
              return (
                <div key={bin.id} className="flex items-center gap-4">
                  <span className="text-xs font-mono text-muted-foreground w-20 flex-shrink-0">{bin.id}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-muted/30 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${bin.fillLevel}%`, background: color, boxShadow: `0 0 8px ${color}60` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-10 text-right" style={{ color }}>{bin.fillLevel}%</span>
                  <span className="text-xs px-2 py-0.5 rounded-full w-16 text-center"
                    style={{ color, background: `${color}15` }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-6">System Status</h2>
          <div className="space-y-4">
            {[
              { label: 'IoT Sensors', status: 'Online', color: '#4ade80' },
              { label: 'Cloud Sync', status: 'Active', color: '#4ade80' },
              { label: 'Alert Engine', status: activeAlerts > 0 ? 'Triggered' : 'Standby', color: activeAlerts > 0 ? '#f87171' : '#4ade80' },
              { label: 'Data Pipeline', status: 'Running', color: '#4ade80' },
              { label: 'API Gateway', status: 'Healthy', color: '#4ade80' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-semibold" style={{ color: item.color }}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 rounded-xl"
            style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400">Avg Fill Level</span>
            </div>
            <p className="text-2xl font-bold font-display text-blue-400">{avgFill}%</p>
            <p className="text-xs text-muted-foreground mt-1">Across all 5 bins</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Recent Activity</h2>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {bins.slice(0, 3).map((bin, i) => (
            <div key={bin.id} className="flex items-center gap-4 py-2 border-b border-border/20 last:border-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(96,165,250,0.1)' }}>
                <Trash2 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{bin.location}</p>
                <p className="text-xs text-muted-foreground">{bin.id} — Fill level updated</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold" style={{ color: bin.fillLevel >= 80 ? '#f87171' : bin.fillLevel >= 50 ? '#facc15' : '#4ade80' }}>
                  {bin.fillLevel}%
                </p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
