import type { RecommendedBuild, HardwareItem } from '../types';
import { checkCompatibility } from '../utils/compatibility';

function getCategoryName(cat: string): string {
  const map: Record<string, string> = {
    cpu: 'CPU', gpu: '显卡', ram: '内存', monitor: '显示器',
    motherboard: '主板', storage: '存储', psu: '电源', case: '机箱',
  };
  return map[cat] || cat;
}

export default function BuildCard({ build }: { build: RecommendedBuild }) {
  const issues = checkCompatibility(build.cpu, build.motherboard, build.gpu, build.ram, build.psu, build.case);
  const components: HardwareItem[] = [
    build.cpu, build.gpu, build.ram, build.motherboard,
    build.storage, build.psu, build.case, build.monitor,
  ].filter((i): i is HardwareItem => i !== null);

  const strategyLabel = {
    value: '性价比优先',
    balanced: '均衡配置',
    performance: '性能优先',
  }[build.strategy];

  return (
    <div className="build-card">
      <div className="build-card__header">
        <h2>{build.name}</h2>
        <span className="build-card__badge">{strategyLabel}</span>
      </div>

      <div className="build-card__components">
        {components.map((item) => (
          <div key={item.id} className="build-card__component">
            <span className="build-card__comp-cat">{getCategoryName(item.category)}</span>
            <span className="build-card__comp-model">{item.brand} {item.model}</span>
            <span className="build-card__comp-price">&yen;{item.price.toLocaleString()}</span>
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

      <div className="build-card__summary">
        <span className="build-card__total">总价: &yen;{build.totalPrice.toLocaleString()}</span>
        <span className="build-card__value">性价比评分: {build.valueScore}</span>
      </div>
    </div>
  );
}
