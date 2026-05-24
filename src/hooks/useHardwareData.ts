import { useState, useEffect } from 'react';
import type { HardwareItem, HardwareCategory } from '../types';

interface HardwareDataState {
  items: HardwareItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export function useHardwareData(category?: HardwareCategory) {
  const [state, setState] = useState<HardwareDataState>({
    items: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch('/data/hardware.json');
        if (!res.ok) throw new Error('数据加载失败');
        const data: HardwareItem[] = await res.json();
        if (cancelled) return;

        const filtered = category ? data.filter(i => i.category === category) : data;
        const dates = data.map(i => i.priceDate).sort().reverse();
        setState({
          items: filtered,
          loading: false,
          error: null,
          lastUpdated: dates[0] || null,
        });
      } catch (e) {
        if (!cancelled) {
          setState(s => ({ ...s, loading: false, error: (e as Error).message }));
        }
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [category]);

  return state;
}
