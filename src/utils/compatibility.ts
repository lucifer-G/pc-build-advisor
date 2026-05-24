import type { HardwareItem } from '../types';

export interface CompatibilityIssue {
  severity: 'error' | 'warning';
  message: string;
}

export function checkCompatibility(
  cpu: HardwareItem,
  motherboard: HardwareItem,
  gpu: HardwareItem | null,
  ram: HardwareItem,
  psu: HardwareItem,
  caseItem: HardwareItem
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  const cpuSocket = cpu.specs['接口'];
  const mbSocket = motherboard.specs['接口'];
  if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
    issues.push({
      severity: 'error',
      message: `CPU 接口 (${cpuSocket}) 与主板接口 (${mbSocket}) 不匹配`,
    });
  }

  const ramType = ram.specs['类型'];
  const mbMemory = motherboard.specs['内存'] || '';
  if (ramType && mbMemory && !mbMemory.includes(ramType)) {
    issues.push({
      severity: 'error',
      message: `内存类型 (${ramType}) 与主板支持的内存不匹配`,
    });
  }

  if (gpu) {
    const gpuTDP = parseInt(gpu.specs['TDP'] || '0');
    const cpuTDP = parseInt(cpu.specs['TDP'] || '0');
    const psuWattage = parseInt(psu.specs['功率'] || '0');
    const estimatedTotal = (gpuTDP + cpuTDP + 150) * 1.25;
    if (psuWattage && estimatedTotal > psuWattage) {
      issues.push({
        severity: 'warning',
        message: `预估整机功耗约 ${Math.round(estimatedTotal)}W，电源 ${psuWattage}W 可能不足，建议升级`,
      });
    }
  }

  const gpuLength = parseInt(gpu?.specs['显卡长度'] || '0');
  const caseMaxGpu = parseInt(caseItem.specs['显卡限长'] || '999');
  if (gpuLength && caseMaxGpu && gpuLength > caseMaxGpu) {
    issues.push({
      severity: 'error',
      message: `显卡长度 (${gpuLength}mm) 超出机箱显卡限长 (${caseMaxGpu}mm)`,
    });
  }

  return issues;
}
