export const MASCOT_CELEBRATE_EVENT = 'mascot-celebrate';

export type CelebrateIntensity = 'small' | 'big';

export function celebrateMascot(intensity: CelebrateIntensity = 'small'): void {
  window.dispatchEvent(new CustomEvent<CelebrateIntensity>(MASCOT_CELEBRATE_EVENT, { detail: intensity }));
}
