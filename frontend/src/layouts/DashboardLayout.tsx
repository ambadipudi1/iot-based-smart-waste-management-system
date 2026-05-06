import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from '@tanstack/react-router';
import {
  LayoutDashboard, Trash2, BarChart3, Bell, Map, FileText,
  Settings, LogOut, Menu, X, Wifi, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { useBins } from '../contexts/BinContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Bin Monitoring', icon: Trash2, path: '/bin-monitoring' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Alerts', icon: Bell, path: '/alerts' },
  { label: 'Map View', icon: Map, path: '/map-view' },
  { label: 'Reports', icon: FileText, path: '/reports' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userEmail } = useAuth();
  const { alerts } = useBins();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeAlerts = alerts.filter(a => !a.resolved).length;

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  const handleNav = (path: string) => {
    navigate({ to: path });
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-sidebar-foreground leading-tight">IoT Based Smart Waste</p>
            <p className="text-[10px] text-sidebar-foreground/60 leading-tight">Management System</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const isAlerts = item.path === '/alerts';
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-sidebar-primary/20 text-sidebar-primary border-l-2 border-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-sidebar-primary' : ''}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {isAlerts && activeAlerts > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeAlerts > 9 ? '9+' : activeAlerts}
                </span>
              )}
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {/* User info */}
        <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50">
          <p className="text-xs font-medium text-sidebar-foreground truncate">{userEmail || 'admin@smartcity.gov'}</p>
          <p className="text-[10px] text-sidebar-foreground/50">System Administrator</p>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 flex-col bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col animate-slide-in-left">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-sidebar-accent transition-colors"
          >
            <Menu className="w-5 h-5 text-sidebar-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold text-sidebar-foreground">IoT Smart Waste Management</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <Wifi className="w-4 h-4 text-sidebar-foreground/60" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
