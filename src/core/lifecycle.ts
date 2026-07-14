export class Lifecycle {
  private readonly cleanups: Array<() => void> = [];
  private stopped = false;

  add(cleanup: (() => void) | undefined | null): void {
    if (!cleanup) return;
    if (this.stopped) {
      cleanup();
      return;
    }
    this.cleanups.push(cleanup);
  }

  timeout(callback: () => void, delay: number): number {
    const timer = window.setTimeout(callback, delay);
    this.add(() => window.clearTimeout(timer));
    return timer;
  }

  interval(callback: () => void, delay: number): number {
    const timer = window.setInterval(callback, delay);
    this.add(() => window.clearInterval(timer));
    return timer;
  }

  listen<K extends keyof WindowEventMap>(target: Window, type: K, listener: (event: WindowEventMap[K]) => void, options?: AddEventListenerOptions): void;
  listen<K extends keyof DocumentEventMap>(target: Document, type: K, listener: (event: DocumentEventMap[K]) => void, options?: AddEventListenerOptions): void;
  listen(target: EventTarget, type: string, listener: EventListener, options?: AddEventListenerOptions): void {
    target.addEventListener(type, listener, options);
    this.add(() => target.removeEventListener(type, listener, options));
  }

  stop(): void {
    if (this.stopped) return;
    this.stopped = true;
    for (const cleanup of this.cleanups.splice(0).reverse()) {
      try { cleanup(); } catch (error) { console.error("[SkyzHypno] cleanup failed", error); }
    }
  }
}
