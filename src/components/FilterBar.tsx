import type { HardwareCategory } from '../types';

const CATEGORIES: { key: HardwareCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'cpu', label: 'CPU' },
  { key: 'gpu', label: '显卡' },
  { key: 'ram', label: '内存' },
  { key: 'monitor', label: '显示器' },
];

interface Props {
  selected: HardwareCategory | 'all';
  onSelect: (c: HardwareCategory | 'all') => void;
  onPriceRange?: (min: number, max: number) => void;
}

export default function FilterBar({ selected, onSelect }: Props) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__tabs">
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            className={`filter-bar__tab ${selected === c.key ? 'filter-bar__tab--active' : ''}`}
            onClick={() => onSelect(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
