import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

const typeConfig = {
  warning: { icon: AlertTriangle, bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.4)', color: '#facc15', title: 'Warning' },
  error: { icon: AlertCircle, bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', color: '#f87171', title: 'Alert' },
  success: { icon: CheckCircle, bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)', color: '#4ade80', title: 'Success' },
  info: { icon: Info, bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.4)', color: '#60a5fa', title: 'Info' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const cfg = typeConfig[toast.type];
        const Icon = cfg.icon;
        return (
          <div
            key={toast.id}
            className="toast-enter pointer-events-auto rounded-xl p-4 flex items-start gap-3 shadow-xl"
            style={{
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: cfg.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: cfg.color }}>
                {toast.title || cfg.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
