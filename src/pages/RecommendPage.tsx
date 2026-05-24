import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHardwareData } from '../hooks/useHardwareData';
import type { UsageType, RecommendedBuild } from '../types';
import { recommend } from '../utils/recommend';
import BudgetSlider from '../components/BudgetSlider';
import BuildCard from '../components/BuildCard';

const USAGES: { key: UsageType; label: string; desc: string }[] = [
  { key: 'office', label: '办公', desc: '文档处理、上网、视频会议' },
  { key: 'gaming', label: '游戏', desc: '3A大作、电竞游戏' },
  { key: 'design', label: '设计', desc: '3D渲染、视频剪辑、平面设计' },
  { key: 'coding', label: '编程', desc: '软件开发、编译、本地服务' },
  { key: 'all-round', label: '全能', desc: '游戏+工作综合用途' },
];

export default function RecommendPage() {
  const [searchParams] = useSearchParams();
  const fromUrl = searchParams.get('usage') as UsageType;
  const initialUsage: UsageType = (fromUrl && USAGES.some(u => u.key === fromUrl)) ? fromUrl : 'gaming';

  const [budget, setBudget] = useState(8000);
  const [usage, setUsage] = useState<UsageType>(initialUsage);
  const { items, loading, error } = useHardwareData();

  const results: RecommendedBuild[] = useMemo(() => {
    if (items.length === 0) return [];
    try {
      return recommend(items, budget, usage);
    } catch (e) {
      console.error('Recommend failed:', e);
      return [];
    }
  }, [items, budget, usage]);

  return (
    <div className="recommend-page">
      <h1>配置推荐</h1>

      <section className="recommend-form">
        <BudgetSlider value={budget} onChange={setBudget} />

        <div className="usage-select">
          <label className="usage-select__label">选择用途</label>
          <div className="usage-select__options">
            {USAGES.map(u => (
              <button
                key={u.key}
                className={`usage-option ${usage === u.key ? 'usage-option--active' : ''}`}
                onClick={() => setUsage(u.key)}
              >
                <strong>{u.label}</strong>
                <span>{u.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{ padding: '16px', background: '#f0f0f0', borderRadius: '8px', marginTop: '16px' }}>
        <p><strong>Debug:</strong> items={items.length} loading={String(loading)} error={String(error)} results={results.length} budget={budget} usage={usage}</p>
      </div>

      {error ? (
        <p className="error-text">数据加载失败: {error}</p>
      ) : loading ? (
        <p className="loading-text">加载硬件数据中...</p>
      ) : results.length === 0 ? (
        <p className="empty-text">
          暂无可推荐的配置，请调整预算或用途
          <br />
          <small>当前数据: {items.length} 件硬件, 预算: ¥{budget.toLocaleString()}, 用途: {usage}</small>
        </p>
      ) : (
        <section className="recommend-results">
          <h2>推荐方案</h2>
          <p className="results-hint">以下提供三套方案，按不同策略优化，请根据偏好选择</p>
          <div className="builds-grid">
            {results.map(build => (
              <BuildCard key={build.id} build={build} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
