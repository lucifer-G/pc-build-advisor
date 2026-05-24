export type HardwareCategory = 'cpu' | 'gpu' | 'ram' | 'monitor' | 'motherboard' | 'storage' | 'psu' | 'case';

export interface HardwareItem {
  id: string;
  category: HardwareCategory;
  brand: string;
  model: string;
  specs: Record<string, string>;
  price: number;
  priceDate: string;
  source: string;
  score: number;
  image?: string;
}

export type UsageType = 'office' | 'gaming' | 'design' | 'coding' | 'all-round';

export interface BudgetAllocation {
  cpu: number;
  gpu: number;
  ram: number;
  motherboard: number;
  storage: number;
  psu: number;
  case: number;
  monitor: number;
}

export interface RecommendedBuild {
  id: string;
  name: string;
  cpu: HardwareItem;
  gpu: HardwareItem | null;
  ram: HardwareItem;
  motherboard: HardwareItem;
  storage: HardwareItem;
  psu: HardwareItem;
  case: HardwareItem;
  monitor: HardwareItem | null;
  totalPrice: number;
  valueScore: number;
  strategy: 'value' | 'balanced' | 'performance';
}
