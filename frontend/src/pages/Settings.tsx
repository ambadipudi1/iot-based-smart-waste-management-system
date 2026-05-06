import React from 'react';
import { Shield, Lock, Key, Cloud, Server, Bell, User, Sliders } from 'lucide-react';
import { SecurityCard } from '../components/SecurityCard';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const securityFeatures = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Data Encryption (AES-256)',
    description:
      'All sensor data is encrypted using AES-256 standard before transmission. End-to-end encryption ensures that bin fill level data and alert information remain confidential and tamper-proof.',
    color: '#60a5fa',
    bgColor: 'rgba(96,165,250,0.12)',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure API Communication',
    description:
      'All API endpoints use HTTPS/TLS 1.3 protocols. Certificate pinning prevents man-in-the-middle attacks, and all requests are authenticated with signed JWT tokens with short expiry windows.',
    color: '#4ade80',
    bgColor: 'rgba(74,222,128,0.12)',
  },
  {
    icon: <Key className="w-6 h-6" />,
    title: 'Role-Based Access Control',
    description:
      'Granular RBAC system with three tiers: Guest (read-only), Operator (monitoring + alerts), and Administrator (full system control including dispatch and configuration). Principle of least privilege enforced.',
    color: '#a78bfa',
    bgColor: 'rgba(167,139,250,0.12)',
  },
  {
    icon: <Cloud className="w-6 h-6" />,
    title: 'Cloud Data Protection',
    description:
      'Data is stored in geo-redundant cloud infrastructure with automated backups every 6 hours. GDPR-compliant data handling with audit logs for all administrative actions and data access events.',
    color: '#fb923c',
    bgColor: 'rgba(251,146,60,0.12)',
  },
];

export function Settings() {
  const { userEmail } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">System configuration and security overview</p>
      </div>

      {/* Profile Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <User className="w-5 h-5 text-blue-400" />
          <h2 className="font-display font-semibold text-lg">Account</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #22c55e)' }}
          >
            {userEmail ? userEmail[0].toUpperCase() : 'A'}
          </div>
          <div>
            <p className="font-semibold">{userEmail || 'admin@smartcity.gov'}</p>
            <p className="text-sm text-muted-foreground">System Administrator</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Active Session</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Sliders className="w-5 h-5 text-purple-400" />
          <h2 className="font-display font-semibold text-lg">Preferences</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border/30">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">Switch between dark and light mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)' }}
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border/30">
            <div>
              <p className="text-sm font-medium">Alert Notifications</p>
              <p className="text-xs text-muted-foreground">Show toast alerts when bins exceed 80%</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-green-400">Enabled</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">Auto-Refresh Interval</p>
              <p className="text-xs text-muted-foreground">Bin data polling frequency</p>
            </div>
            <span className="text-sm font-semibold text-blue-400">4 seconds</span>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Server className="w-5 h-5 text-green-400" />
          <h2 className="font-display font-semibold text-lg">System Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Platform Version', value: 'v2.4.1' },
            { label: 'IoT Protocol', value: 'MQTT v3.1.1' },
            { label: 'Data Refresh Rate', value: '4 seconds' },
            { label: 'Active Sensors', value: '5 / 5' },
            { label: 'Cloud Region', value: 'Asia-Pacific' },
            { label: 'Last System Check', value: 'Just now' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-semibold text-blue-400">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-blue-400" />
          <h2 className="font-display font-bold text-xl">Security Overview</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {securityFeatures.map((feature, i) => (
            <SecurityCard
              key={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              bgColor={feature.bgColor}
            />
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Bell className="w-5 h-5 text-yellow-400" />
          <h2 className="font-display font-semibold text-lg">Alert Thresholds</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Critical Alert Threshold', value: '80%', color: '#f87171' },
            { label: 'Warning Alert Threshold', value: '50%', color: '#facc15' },
            { label: 'Normal Range', value: '0–50%', color: '#4ade80' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
