import type { HardwareItem, BudgetAllocation, RecommendedBuild, UsageType } from '../types';

const BUDGET_RATIOS: Record<UsageType, BudgetAllocation> = {
  office:    { cpu: 0.25, gpu: 0.00, ram: 0.15, motherboard: 0.10, storage: 0.15, psu: 0.10, case: 0.05, monitor: 0.20 },
  gaming:    { cpu: 0.20, gpu: 0.35, ram: 0.10, motherboard: 0.08, storage: 0.10, psu: 0.07, case: 0.03, monitor: 0.07 },
  design:    { cpu: 0.30, gpu: 0.25, ram: 0.15, motherboard: 0.08, storage: 0.10, psu: 0.07, case: 0.03, monitor: 0.02 },
  coding:    { cpu: 0.30, gpu: 0.10, ram: 0.20, motherboard: 0.08, storage: 0.15, psu: 0.07, case: 0.03, monitor: 0.07 },
  'all-round': { cpu: 0.22, gpu: 0.22, ram: 0.12, motherboard: 0.08, storage: 0.12, psu: 0.08, case: 0.04, monitor: 0.12 },
};

function pickBest(items: HardwareItem[], budget: number, minRequired: boolean): HardwareItem | null {
  const withinBudget = items.filter(i => i.price <= budget).sort((a, b) => b.score - a.score);
  if (withinBudget.length > 0) return withinBudget[0];
  if (minRequired) {
    const byPrice = [...items].sort((a, b) => a.price - b.price);
    return byPrice[0] || null;
  }
  return null;
}

function generateBuildName(usage: UsageType, strategy: string): string {
  const usageNames: Record<UsageType, string> = {
    office: '办公', gaming: '游戏', design: '设计', coding: '编程', 'all-round': '全能',
  };
  const strategyNames: Record<string, string> = {
    value: '性价比', balanced: '均衡', performance: '性能',
  };
  return `${usageNames[usage]} · ${strategyNames[strategy]}方案`;
}

export function recommend(
  hardware: HardwareItem[],
  budget: number,
  usage: UsageType
): RecommendedBuild[] {
  const ratio = BUDGET_RATIOS[usage];
  const getItems = (cat: string) => hardware.filter(i => i.category === cat);

  const strategies: Array<{ name: 'value' | 'balanced' | 'performance'; budgetMultiplier: number }> = [
    { name: 'value', budgetMultiplier: 0.85 },
    { name: 'balanced', budgetMultiplier: 1.0 },
    { name: 'performance', budgetMultiplier: 1.15 },
  ];

  return strategies.map(({ name: strategy, budgetMultiplier }) => {
    const effectiveBudget = budget * budgetMultiplier;

    const cpu = pickBest(getItems('cpu'), effectiveBudget * ratio.cpu, true)!;
    const gpu = usage === 'office' ? null : pickBest(getItems('gpu'), effectiveBudget * ratio.gpu, false);
    const ram = pickBest(getItems('ram'), effectiveBudget * ratio.ram, true)!;
    const motherboard = pickBest(getItems('motherboard'), effectiveBudget * ratio.motherboard, true)!;
    const storage = pickBest(getItems('storage'), effectiveBudget * ratio.storage, true)!;
    const psu = pickBest(getItems('psu'), effectiveBudget * ratio.psu, true)!;
    const caseItem = pickBest(getItems('case'), effectiveBudget * ratio.case, true)!;
    const monitor = pickBest(getItems('monitor'), effectiveBudget * ratio.monitor, false);

    const totalPrice = [cpu, gpu, ram, motherboard, storage, psu, caseItem, monitor]
      .filter(Boolean)
      .reduce((sum, item) => sum + (item as HardwareItem).price, 0);

    const components = [cpu, gpu, ram, motherboard, storage, psu, caseItem, monitor].filter(Boolean) as HardwareItem[];
    const avgScore = components.reduce((s, i) => s + i.score, 0) / components.length;
    const valueScore = Math.round((avgScore / (totalPrice / 1000)) * 10) / 10;

    return {
      id: `${usage}-${strategy}-${Date.now()}`,
      name: generateBuildName(usage, strategy),
      cpu,
      gpu,
      ram,
      motherboard,
      storage,
      psu,
      case: caseItem,
      monitor,
      totalPrice,
      valueScore,
      strategy,
    };
  });
}
