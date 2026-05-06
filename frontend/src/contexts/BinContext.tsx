import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';

export interface BinData {
  id: string;
  location: string;
  fillLevel: number;
  lastUpdated: Date;
  status: 'online' | 'offline';
  lat: number;
  lng: number;
}

export interface AlertRecord {
  id: string;
  binId: string;
  location: string;
  fillLevel: number;
  time: Date;
  resolved: boolean;
}

export interface CollectionRecord {
  id: string;
  binId: string;
  location: string;
  fillLevelBefore: number;
  time: Date;
  status: 'completed';
}

interface BinContextType {
  bins: BinData[];
  alerts: AlertRecord[];
  collectionLog: CollectionRecord[];
  dispatchCollection: (binId: string) => void;
  acknowledgedAlerts: Set<string>;
}

const BinContext = createContext<BinContextType | undefined>(undefined);

const INITIAL_BINS: BinData[] = [
  { id: 'BIN-001', location: 'Main Street Plaza', fillLevel: 45, lastUpdated: new Date(), status: 'online', lat: 35, lng: 30 },
  { id: 'BIN-002', location: 'Central Park North', fillLevel: 72, lastUpdated: new Date(), status: 'online', lat: 20, lng: 55 },
  { id: 'BIN-003', location: 'Tech Hub District', fillLevel: 88, lastUpdated: new Date(), status: 'online', lat: 55, lng: 70 },
  { id: 'BIN-004', location: 'Riverside Market', fillLevel: 30, lastUpdated: new Date(), status: 'online', lat: 70, lng: 25 },
  { id: 'BIN-005', location: 'Airport Terminal', fillLevel: 91, lastUpdated: new Date(), status: 'online', lat: 45, lng: 80 },
];

export function BinProvider({ children }: { children: ReactNode }) {
  const [bins, setBins] = useState<BinData[]>(INITIAL_BINS);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [collectionLog, setCollectionLog] = useState<CollectionRecord[]>([]);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
  const prevBinsRef = useRef<BinData[]>(INITIAL_BINS);

  // Auto-simulate bin fill level changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBins(prev => prev.map(bin => {
        const delta = (Math.random() - 0.3) * 6;
        const newLevel = Math.max(5, Math.min(100, bin.fillLevel + delta));
        return {
          ...bin,
          fillLevel: Math.round(newLevel),
          lastUpdated: new Date(),
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Monitor for new alerts
  useEffect(() => {
    bins.forEach(bin => {
      if (bin.fillLevel > 80) {
        const alertKey = `${bin.id}-${Math.floor(bin.fillLevel / 5)}`;
        if (!acknowledgedAlerts.has(alertKey)) {
          const existingAlert = alerts.find(a => a.binId === bin.id && !a.resolved);
          if (!existingAlert) {
            const newAlert: AlertRecord = {
              id: `alert-${Date.now()}-${bin.id}`,
              binId: bin.id,
              location: bin.location,
              fillLevel: bin.fillLevel,
              time: new Date(),
              resolved: false,
            };
            setAlerts(prev => [newAlert, ...prev]);
            setAcknowledgedAlerts(prev => new Set([...prev, alertKey]));
          }
        }
      }
    });
  }, [bins]);

  const dispatchCollection = useCallback((binId: string) => {
    const bin = bins.find(b => b.id === binId);
    if (!bin) return;

    const logEntry: CollectionRecord = {
      id: `log-${Date.now()}`,
      binId: bin.id,
      location: bin.location,
      fillLevelBefore: bin.fillLevel,
      time: new Date(),
      status: 'completed',
    };

    setCollectionLog(prev => [logEntry, ...prev]);
    setBins(prev => prev.map(b =>
      b.id === binId ? { ...b, fillLevel: 8, lastUpdated: new Date() } : b
    ));
    setAlerts(prev => prev.map(a =>
      a.binId === binId ? { ...a, resolved: true } : a
    ));
  }, [bins]);

  return (
    <BinContext.Provider value={{ bins, alerts, collectionLog, dispatchCollection, acknowledgedAlerts }}>
      {children}
    </BinContext.Provider>
  );
}

export function useBins() {
  const ctx = useContext(BinContext);
  if (!ctx) throw new Error('useBins must be used within BinProvider');
  return ctx;
}
