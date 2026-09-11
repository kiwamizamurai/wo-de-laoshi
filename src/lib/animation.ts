export function replayAnimation(el: HTMLElement | null, className: string): void {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}
