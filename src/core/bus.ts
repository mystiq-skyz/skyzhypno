export type Unsubscribe = () => void;

type Handler<T> = (event: T) => void;

export class EventBus<Events extends object> {
  private readonly handlers = new Map<keyof Events, Set<Handler<any>>>();

  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): Unsubscribe {
    const set = this.handlers.get(event) ?? new Set();
    set.add(handler);
    this.handlers.set(event, set);
    return () => set.delete(handler);
  }

  once<K extends keyof Events>(event: K, handler: Handler<Events[K]>): Unsubscribe {
    const off = this.on(event, (payload) => {
      off();
      handler(payload);
    });
    return off;
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    for (const handler of this.handlers.get(event) ?? []) {
      try {
        handler(payload);
      } catch (error) {
        console.error(`[SkyzHypno] event handler failed: ${String(event)}`, error);
      }
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}
