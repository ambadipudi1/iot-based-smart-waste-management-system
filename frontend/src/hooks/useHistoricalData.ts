import { useState, useEffect, useRef } from 'react';
import { BinData } from '../contexts/BinContext';

export interface HistoricalDataPoint {
  time: string;
  'BIN-001': number;
  'BIN-002': number;
  'BIN-003': number;
  'BIN-004': number;
  'BIN-005': number;
}

const MAX_POINTS = 20;

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export function useHistoricalData(bins: BinData[]) {
  const [history, setHistory] = useState<HistoricalDataPoint[]>(() => {
    // Pre-populate with some initial data
    const now = Date.now();
    return Array.from({ length: 10 }, (_, i) => ({
      time: formatTime(new Date(now - (9 - i) * 4000)),
      'BIN-001': 40 + Math.round(Math.random() * 20),
      'BIN-002': 65 + Math.round(Math.random() * 15),
      'BIN-003': 80 + Math.round(Math.random() * 15),
      'BIN-004': 25 + Math.round(Math.random() * 15),
      'BIN-005': 85 + Math.round(Math.random() * 10),
    }));
  });

  const prevBinsRef = useRef<BinData[]>([]);

  useEffect(() => {
    if (bins.length === 0) return;
    const hasChanged = bins.some((bin, i) => {
      const prev = prevBinsRef.current[i];
      return !prev || prev.fillLevel !== bin.fillLevel;
    });

    if (hasChanged) {
      prevBinsRef.current = bins;
      const point: HistoricalDataPoint = {
        time: formatTime(new Date()),
        'BIN-001': bins.find(b => b.id === 'BIN-001')?.fillLevel ?? 0,
        'BIN-002': bins.find(b => b.id === 'BIN-002')?.fillLevel ?? 0,
        'BIN-003': bins.find(b => b.id === 'BIN-003')?.fillLevel ?? 0,
        'BIN-004': bins.find(b => b.id === 'BIN-004')?.fillLevel ?? 0,
        'BIN-005': bins.find(b => b.id === 'BIN-005')?.fillLevel ?? 0,
      };
      setHistory(prev => [...prev.slice(-(MAX_POINTS - 1)), point]);
    }
  }, [bins]);

  return history;
}
