interface NavigatorLike {
  userAgent: string;
  platform?: string;
  maxTouchPoints?: number;
}

export function isMobileDevice(nav: NavigatorLike = navigator): boolean {
  if (/Android|iPhone|iPod|iPad/i.test(nav.userAgent)) return true;
  if (nav.platform === 'MacIntel' && (nav.maxTouchPoints ?? 0) > 1) return true;
  return false;
}

export async function isWebGPUAvailable(): Promise<boolean> {
  const gpu = (navigator as any).gpu;
  if (!gpu) return false;
  try {
    const adapter = await gpu.requestAdapter();
    return adapter != null;
  } catch {
    return false;
  }
}
