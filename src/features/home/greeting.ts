export function timeGreeting(hour: number): string {
  if (hour >= 5 && hour < 11) return 'おはよう';
  if (hour >= 11 && hour < 17) return 'こんにちは';
  return 'こんばんは';
}
