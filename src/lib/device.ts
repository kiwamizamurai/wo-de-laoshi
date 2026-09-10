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
