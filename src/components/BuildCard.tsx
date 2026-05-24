import type { RecommendedBuild, HardwareItem } from '../types';
import { checkCompatibility } from '../utils/compatibility';

const CAT_ICONS: Record<string, string> = {
  cpu: '🔲', gpu: '🎮', ram: '📊', monitor: '🖥️',
  motherboard: '📋', storage: '💾', psu: '🔌', case: '🖥️',
};

const CAT_NAMES: Record<string, string> = {
  cpu: 'CPU 处理器', gpu: '显卡', ram: '内存', monitor: '显示器',
  motherboard: '主板', storage: '硬盘', psu: '电源', case: '机箱',
};

function getSpecSummary(item: HardwareItem): string {
  const specs = Object.entries(item.specs).slice(0, 2);
  return specs.map(([k, v]) => `${k}: ${v}`).join('  |  ');
}

export default function BuildCard({ build }: { build: RecommendedBuild }) {
  const issues = checkCompatibility(build.cpu, build.motherboard, build.gpu, build.ram, build.psu, build.case);
  const components: HardwareItem[] = [
    build.cpu, build.gpu, build.ram, build.motherboard,
    build.storage, build.psu, build.case, build.monitor,
  ].filter((i): i is HardwareItem => i !== null);

  const strategyLabel = {
    value: '性价比优先', balanced: '均衡配置', performance: '性能优先',
  }[build.strategy];
  const strategyColor = {
    value: '#059669', balanced: '#2563eb', performance: '#d97706',
  }[build.strategy];

  return (
    <div className="build-card">
      <div className="build-card__top">
        <div className="build-card__title-row">
          <h2>{build.name}</h2>
          <span className="build-card__badge" style={{ background: strategyColor }}>
            {strategyLabel}
          </span>
        </div>
        <div className="build-card__price-row">
          <span className="build-card__total">&yen;{build.totalPrice.toLocaleString()}</span>
          <span className="build-card__score">
            性价比 <strong>{build.valueScore}</strong>
          </span>
        </div>
      </div>

      <div className="build-card__list">
        {components.map((item) => (
          <div key={item.id} className={`build-comp ${!item.price ? 'build-comp--missing' : ''}`}>
            <span className="build-comp__icon">{CAT_ICONS[item.category] || '📦'}</span>
            <div className="build-comp__info">
              <div className="build-comp__head">
                <span className="build-comp__cat">{CAT_NAMES[item.category] || item.category}</span>
                <span className="build-comp__price">&yen;{item.price.toLocaleString()}</span>
              </div>
              <div className="build-comp__model">{item.brand} {item.model}</div>
              <div className="build-comp__specs">{getSpecSummary(item)}</div>
            </div>
          </div>
        ))}
      </div>

      {issues.length > 0 && (
        <div className="build-card__issues">
          {issues.map((issue, i) => (
            <p key={i} className={`build-card__issue build-card__issue--${issue.severity}`}>
              {issue.severity === 'error' ? '❌' : '⚠️'} {issue.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
