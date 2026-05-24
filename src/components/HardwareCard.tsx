import type { HardwareItem } from '../types';

const CATEGORY_NAMES: Record<string, string> = {
  cpu: 'CPU', gpu: '显卡', ram: '内存', monitor: '显示器',
  motherboard: '主板', storage: '存储', psu: '电源', case: '机箱',
};

export default function HardwareCard({ item }: { item: HardwareItem }) {
  return (
    <div className="hardware-card">
      <div className="hardware-card__header">
        <span className="hardware-card__category">{CATEGORY_NAMES[item.category]}</span>
        <span className="hardware-card__brand">{item.brand}</span>
      </div>
      <h3 className="hardware-card__model">{item.model}</h3>
      <div className="hardware-card__specs">
        {Object.entries(item.specs).slice(0, 4).map(([key, val]) => (
          <span key={key} className="hardware-card__spec">{key}: {val}</span>
        ))}
      </div>
      <div className="hardware-card__footer">
        <span className="hardware-card__price">&yen;{item.price.toLocaleString()}</span>
        <span className="hardware-card__score">评分 {item.score}</span>
      </div>
    </div>
  );
}
