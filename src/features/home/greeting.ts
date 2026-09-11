export type GreetingSlot = 'morning' | 'noon' | 'evening';

export function timeGreetingSlot(hour: number): GreetingSlot {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'noon';
  return 'evening';
}
