interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const PRESETS = [3000, 5000, 8000, 12000, 20000];

export default function BudgetSlider({ value, onChange, min = 2000, max = 50000, step = 500 }: Props) {
  return (
    <div className="budget-slider">
      <label className="budget-slider__label">预算区间</label>
      <h2 className="budget-slider__value">&yen;{value.toLocaleString()}</h2>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="budget-slider__input"
      />
      <div className="budget-slider__range">
        <span>&yen;{min.toLocaleString()}</span>
        <span>&yen;{max.toLocaleString()}</span>
      </div>
      <div className="budget-slider__presets">
        {PRESETS.map(p => (
          <button
            key={p}
            className={`budget-slider__preset ${value === p ? 'budget-slider__preset--active' : ''}`}
            onClick={() => onChange(p)}
          >
            &yen;{p.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}
