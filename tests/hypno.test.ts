import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventBus } from "@/core/bus";
import { Lifecycle } from "@/core/lifecycle";
import { createDefaultSettings } from "@/defaults";
import type { AppEvents } from "@/events";
import { HypnoEngine } from "@/hypno/engine";
import type { SkyzHypnoSettings } from "@/types";

class FakeStore {
  value: SkyzHypnoSettings = createDefaultSettings();
  update(mutator: (settings: SkyzHypnoSettings) => void): void { mutator(this.value); }
}

function createHarness() {
  const actions: string[] = [];
  const messages: string[] = [];
  const runtime = {
    playerName: "Sky",
    characterName: (member: number) => `Member ${member}`,
    sendAction: (text: string) => actions.push(text),
    localMessage: (text: string) => messages.push(text),
  } as any;
  const store = new FakeStore();
  const bus = new EventBus<AppEvents>();
  const lifecycle = new Lifecycle();
  const engine = new HypnoEngine(runtime, store as any, bus, lifecycle);
  return { actions, messages, runtime, store, bus, lifecycle, engine };
}

describe("HypnoEngine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-14T10:00:00Z"));
    (globalThis as any).__SH_VERSION__ = "test";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("enters trance at the configured threshold and records the source", () => {
    const h = createHarness();
    h.store.value.hypno.enterTranceAt = 80;
    h.engine.setDepth(80, "test trigger", 1234);

    expect(h.engine.snapshot.trance).toBe(true);
    expect(h.engine.snapshot.depth).toBe(100);
    expect(h.engine.snapshot.activeBy).toBe(1234);
    expect(h.engine.snapshot.activeByName).toBe("Member 1234");
    expect(h.actions).toHaveLength(1);
    h.lifecycle.stop();
  });

  it("automatically wakes after the configured duration", () => {
    const h = createHarness();
    h.store.value.hypno.autoWakeMinutes = 0.02;
    h.store.value.hypno.wakeToDepth = 10;
    h.engine.enterTrance(222, "test");

    vi.advanceTimersByTime(2_000);

    expect(h.engine.snapshot.trance).toBe(false);
    expect(h.engine.snapshot.depth).toBe(10);
    expect(h.actions.at(-1)).toContain("returns to full awareness");
    h.lifecycle.stop();
  });

  it("emergency stop clears every transient state", () => {
    const h = createHarness();
    h.engine.enterTrance(55, "test");
    h.engine.setForcedPhrase("obey");
    h.engine.setFocus(55);
    h.engine.setSession("session-1");

    h.bus.emit("emergency.stop", { reason: "test panic" });

    expect(h.engine.snapshot).toMatchObject({
      depth: 0,
      stage: "awake",
      trance: false,
      speechAllowed: true,
    });
    expect(h.engine.snapshot.forcedPhrase).toBeUndefined();
    expect(h.engine.snapshot.focusMemberId).toBeUndefined();
    expect(h.engine.snapshot.sessionId).toBeUndefined();
    expect(h.messages.at(-1)).toContain("Emergency stop");
    h.lifecycle.stop();
  });
});
