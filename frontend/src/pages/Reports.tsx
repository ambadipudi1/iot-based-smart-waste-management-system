import React from 'react';
import { FileText, Download, Calendar, CheckCircle } from 'lucide-react';
import { useBins } from '../contexts/BinContext';

function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function Reports() {
  const { collectionLog } = useBins();

  const handleExportCSV = () => {
    if (collectionLog.length === 0) return;
    const headers = ['Date/Time', 'Bin ID', 'Location', 'Fill Level at Dispatch', 'Status'];
    const rows = collectionLog.map(entry => [
      formatDateTime(entry.time),
      entry.binId,
      entry.location,
      `${entry.fillLevelBefore}%`,
      entry.status,
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waste-collection-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Collection Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">
            History of all waste collection events dispatched from the system
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={collectionLog.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #22c55e)' }}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Collections', value: collectionLog.length, color: '#60a5fa' },
          { label: 'Today', value: collectionLog.filter(e => {
            const today = new Date();
            return e.time.toDateString() === today.toDateString();
          }).length, color: '#4ade80' },
          { label: 'Avg Fill at Dispatch', value: collectionLog.length > 0
            ? `${Math.round(collectionLog.reduce((s, e) => s + e.fillLevelBefore, 0) / collectionLog.length)}%`
            : 'N/A', color: '#facc15' },
          { label: 'Bins Serviced', value: new Set(collectionLog.map(e => e.binId)).size, color: '#a78bfa' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-border/30 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <h2 className="font-display font-semibold text-base">Collection Log</h2>
          <span className="ml-auto text-xs text-muted-foreground">{collectionLog.length} records</span>
        </div>

        {collectionLog.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-display font-semibold text-muted-foreground">No collections yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Dispatch a collection from the Alerts page to see records here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date / Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Bin ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Location</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Fill Level at Dispatch</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {collectionLog.map((entry, i) => (
                  <tr
                    key={entry.id}
                    className="border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-5 py-3 text-xs text-muted-foreground">{i + 1}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(entry.time)}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-blue-400">{entry.binId}</td>
                    <td className="px-5 py-3 text-sm">{entry.location}</td>
                    <td className="px-5 py-3">
                      <span
                        className="font-bold"
                        style={{ color: entry.fillLevelBefore >= 80 ? '#f87171' : '#facc15' }}
                      >
                        {entry.fillLevelBefore}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-xs font-semibold text-green-400 capitalize">{entry.status}</span>
                      </div>
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
