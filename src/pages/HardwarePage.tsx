import { useState, useMemo } from 'react';
import { useHardwareData } from '../hooks/useHardwareData';
import type { HardwareCategory } from '../types';
import FilterBar from '../components/FilterBar';
import HardwareCard from '../components/HardwareCard';

export default function HardwarePage() {
  const [category, setCategory] = useState<HardwareCategory | 'all'>('all');
  const { items, loading, error, lastUpdated } = useHardwareData(
    category === 'all' ? undefined : category
  );

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.score - a.score),
    [items]
  );

  return (
    <div className="hardware-page">
      <h1>硬件行情</h1>
      {lastUpdated && <p className="update-info">数据更新于: {lastUpdated}</p>}

      <FilterBar selected={category} onSelect={setCategory} />

      {loading ? (
        <p className="loading-text">加载中...</p>
      ) : error ? (
        <p className="error-text">加载失败: {error}</p>
      ) : sorted.length === 0 ? (
        <p className="empty-text">暂无该分类数据</p>
      ) : (
        <div className="hardware-grid">
          {sorted.map(item => (
            <HardwareCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
