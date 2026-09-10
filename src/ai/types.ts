export type AvailabilityState = 'unavailable' | 'downloadable' | 'downloading' | 'available';

export type ProgressHandler = (ratio: number) => void;

export interface AiCheckResult {
  supported: boolean;
  availability: AvailabilityState;
}
