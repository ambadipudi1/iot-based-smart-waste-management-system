import React, { useMemo } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useBins } from '../contexts/BinContext';
import { useHistoricalData } from '../hooks/useHistoricalData';

const BIN_COLORS = ['#60a5fa', '#4ade80', '#f87171', '#facc15', '#a78bfa'];
const BIN_IDS = ['BIN-001', 'BIN-002', 'BIN-003', 'BIN-004', 'BIN-005'];

function getBarColor(value: number): string {
  if (value >= 80) return '#f87171';
  if (value >= 50) return '#facc15';
  return '#4ade80';
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card-dark p-3 text-xs space-y-1">
        <p className="font-semibold text-blue-300 mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-bold" style={{ color: entry.color }}>
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function Analytics() {
  const { bins } = useBins();
  const history = useHistoricalData(bins);

  const barData = useMemo(
    () =>
      bins.map(bin => ({
        name: bin.id,
        location: bin.location.split(' ').slice(0, 2).join(' '),
        fill: bin.fillLevel,
        color: getBarColor(bin.fillLevel),
      })),
    [bins]
  );

  const pieData = useMemo(
    () =>
      bins.map((bin, i) => ({
        name: bin.location.split(' ').slice(0, 2).join(' '),
        value: bin.fillLevel,
        color: BIN_COLORS[i],
      })),
    [bins]
  );

  const totalWaste = bins.reduce((s, b) => s + b.fillLevel, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time waste data visualization and trends</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Fill Level', value: `${bins.length > 0 ? Math.round(totalWaste / bins.length) : 0}%`, color: '#60a5fa' },
          { label: 'Total Capacity Used', value: `${totalWaste}%`, color: '#4ade80' },
          { label: 'Critical Bins', value: bins.filter(b => b.fillLevel >= 80).length, color: '#f87171' },
          { label: 'Data Points', value: history.length, color: '#a78bfa' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold font-display" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h2 className="font-display font-semibold text-lg">Waste Levels Over Time</h2>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '16px' }}
              formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.6)' }}>{value}</span>}
            />
            {BIN_IDS.map((id, i) => (
              <Line
                key={id}
                type="monotone"
                dataKey={id}
                stroke={BIN_COLORS[i]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar + Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <h2 className="font-display font-semibold text-lg">Bin Fill Comparison</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Fill Level']}
                contentStyle={{
                  background: 'rgba(15,25,60,0.9)',
                  border: '1px solid rgba(96,165,250,0.2)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#60a5fa' }}
              />
              <Bar dataKey="fill" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-green-400" /> Normal (&lt;50%)
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-yellow-400" /> Moderate (50–80%)
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-red-400" /> Critical (&gt;80%)
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 text-purple-400">◉</div>
            <h2 className="font-display font-semibold text-lg">Waste Distribution</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Fill Level']}
                  contentStyle={{
                    background: 'rgba(15,25,60,0.9)',
                    border: '1px solid rgba(96,165,250,0.2)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 min-w-0 w-full sm:w-auto">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-muted-foreground truncate">{entry.name}</span>
                  <span className="text-xs font-bold ml-auto" style={{ color: entry.color }}>
                    {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="glass-card p-6">
        <h2 className="font-display font-semibold text-lg mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Highest Fill',
              value: bins.length > 0 ? `${Math.max(...bins.map(b => b.fillLevel))}%` : 'N/A',
              desc: bins.length > 0 ? bins.reduce((a, b) => (a.fillLevel > b.fillLevel ? a : b)).location : '',
              color: '#f87171',
            },
            {
              title: 'Lowest Fill',
              value: bins.length > 0 ? `${Math.min(...bins.map(b => b.fillLevel))}%` : 'N/A',
              desc: bins.length > 0 ? bins.reduce((a, b) => (a.fillLevel < b.fillLevel ? a : b)).location : '',
              color: '#4ade80',
            },
            {
              title: 'Collection Efficiency',
              value: '94%',
              desc: 'On-time collection rate this week',
              color: '#60a5fa',
            },
          ].map(insight => (
            <div
              key={insight.title}
              className="p-4 rounded-xl"
              style={{ background: `${insight.color}08`, border: `1px solid ${insight.color}20` }}
            >
              <p className="text-xs text-muted-foreground mb-1">{insight.title}</p>
              <p className="text-2xl font-bold font-display" style={{ color: insight.color }}>
                {insight.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1 truncate">{insight.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
