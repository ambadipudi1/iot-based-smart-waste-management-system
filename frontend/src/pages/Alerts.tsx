import React, { useEffect, useRef } from 'react';
import { Bell, CheckCircle, Truck, AlertTriangle, Clock } from 'lucide-react';
import { useBins } from '../contexts/BinContext';
import { useToast } from '../contexts/ToastContext';

function formatTime(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}

export function Alerts() {
  const { alerts, bins, dispatchCollection } = useBins();
  const { showToast } = useToast();
  const prevAlertsRef = useRef<string[]>([]);

  // Show toast for new alerts
  useEffect(() => {
    const currentIds = alerts.filter(a => !a.resolved).map(a => a.id);
    const newAlerts = currentIds.filter(id => !prevAlertsRef.current.includes(id));
    newAlerts.forEach(id => {
      const alert = alerts.find(a => a.id === id);
      if (alert) {
        showToast(
          `${alert.location} has reached ${alert.fillLevel}% capacity. Immediate collection required!`,
          'warning',
          `🚨 Bin ${alert.binId} Critical Alert`
        );
      }
    });
    prevAlertsRef.current = currentIds;
  }, [alerts]);

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  const handleDispatch = (binId: string) => {
    dispatchCollection(binId);
    showToast(`Collection truck dispatched to ${bins.find(b => b.id === binId)?.location}. Bin level reset.`, 'success', '✅ Collection Dispatched');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Smart Alert System</h1>
          <p className="text-muted-foreground text-sm mt-1">Automated alerts when bin fill levels exceed 80%</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <Bell className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">{activeAlerts.length} Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-400">{resolvedAlerts.length} Resolved</span>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display font-semibold text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Active Alerts
          </h2>
          {activeAlerts.map(alert => (
            <div
              key={alert.id}
              className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-in"
              style={{ borderColor: 'rgba(239,68,68,0.4)', borderWidth: '1px', borderStyle: 'solid' }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(239,68,68,0.15)' }}>
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-red-400">{alert.binId}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-semibold">
                      {alert.fillLevel}% Full
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{alert.location}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{formatTime(alert.time)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDispatch(alert.binId)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #22c55e)' }}
              >
                <Truck className="w-4 h-4" />
                Dispatch Collection
              </button>
            </div>
          ))}
        </div>
      )}

      {activeAlerts.length === 0 && (
        <div className="glass-card p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="font-display font-semibold text-lg text-green-400">All Clear!</p>
          <p className="text-sm text-muted-foreground mt-1">No active alerts. All bins are within normal levels.</p>
        </div>
      )}

      {/* Alert Log Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-border/30">
          <h2 className="font-display font-semibold text-base">Alert Log</h2>
          <p className="text-xs text-muted-foreground mt-1">Complete history of all triggered alerts</p>
        </div>
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No alerts recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Bin ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Location</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Fill Level</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(alert => (
                  <tr key={alert.id} className="border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-blue-400">{alert.binId}</td>
                    <td className="px-5 py-3 text-sm">{alert.location}</td>
                    <td className="px-5 py-3">
                      <span className="font-bold" style={{ color: alert.fillLevel >= 80 ? '#f87171' : '#facc15' }}>
                        {alert.fillLevel}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{formatTime(alert.time)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        alert.resolved
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}>
                        {alert.resolved ? '✓ Resolved' : '⚠ Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {!alert.resolved ? (
                        <button
                          onClick={() => handleDispatch(alert.binId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                          style={{ background: 'linear-gradient(135deg, #3b82f6, #22c55e)' }}
                        >
                          <Truck className="w-3 h-3" />
                          Dispatch
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
