import type { EventBus } from "@/core/bus";
import type { Lifecycle } from "@/core/lifecycle";
import type { SettingsStore } from "@/core/storage";
import type { AppEvents } from "@/events";
import type { HypnoRuntimeState, HypnoStage, PublicStatus, RemoteCapability } from "@/types";
import { clamp } from "@/core/storage";
import type { BCRuntime } from "@/core/runtime";

export function stageForDepth(depth: number, trance = false): HypnoStage {
  if (trance || depth >= 100) return "trance";
  if (depth >= 80) return "critical";
  if (depth >= 60) return "deep";
  if (depth >= 40) return "dazed";
  if (depth >= 20) return "influenced";
  return "awake";
}

export class HypnoEngine {
  private state: HypnoRuntimeState;

  constructor(
    private readonly runtime: BCRuntime,
    private readonly store: SettingsStore,
    private readonly bus: EventBus<AppEvents>,
    lifecycle: Lifecycle,
  ) {
    const depth = clamp(store.value.hypno.depth, 0, 100);
    this.state = {
      depth,
      stage: stageForDepth(depth),
      trance: depth >= store.value.hypno.enterTranceAt,
      lucid: store.value.hypno.lucidTrance,
      lastDepthChangeAt: Date.now(),
      speechAllowed: true,
    };
    lifecycle.interval(() => this.tick(), 1000);
    lifecycle.add(bus.on("emergency.stop", ({ reason }) => this.emergencyStop(reason)));
  }

  get snapshot(): HypnoRuntimeState {
    return structuredClone(this.state);
  }

  setDepth(value: number, reason = "manual", source?: number): number {
    const previous = this.state.depth;
    const current = clamp(value, 0, 100);
    if (current === previous) return current;
    this.state.depth = current;
    this.state.lastDepthChangeAt = Date.now();
    this.state.stage = stageForDepth(current, this.state.trance);
    this.store.update((settings) => { settings.hypno.depth = current; });
    this.bus.emit("depth.changed", { previous, current, delta: current - previous, source, reason });
    if (!this.state.trance && current >= this.store.value.hypno.enterTranceAt) this.enterTrance(source, reason);
    if (this.state.trance && current <= 0 && reason === "decay") this.wake("depth faded");
    this.emitState();
    return current;
  }

  addDepth(delta: number, reason = "trigger", source?: number): number {
    return this.setDepth(this.state.depth + delta, reason, source);
  }

  enterTrance(source?: number, reason = "threshold"): void {
    if (this.state.trance) {
      this.extendTrance(this.store.value.hypno.autoWakeMinutes * 60_000 * 0.15);
      return;
    }
    const now = Date.now();
    const autoWakeMinutes = this.store.value.hypno.autoWakeMinutes;
    this.state.trance = true;
    this.state.stage = "trance";
    this.state.activeBy = source && source > 0 ? source : undefined;
    this.state.activeByName = source && source > 0 ? this.runtime.characterName(source) : undefined;
    this.state.enteredAt = now;
    this.state.wakeAt = autoWakeMinutes > 0 ? now + autoWakeMinutes * 60_000 : undefined;
    this.state.lucid = this.store.value.hypno.lucidTrance;
    this.state.speechAllowed = true;
    this.runtime.sendAction(`${this.runtime.playerName}'s eyes lose focus as a deep trance settles in.`);
    this.bus.emit("trance.enter", this.snapshot);
    this.bus.emit("depth.changed", { previous: this.state.depth, current: 100, delta: 100 - this.state.depth, source, reason });
    this.state.depth = 100;
    this.store.update((settings) => { settings.hypno.depth = 100; }, true);
    this.emitState();
  }

  extendTrance(milliseconds: number): void {
    if (!this.state.trance || milliseconds <= 0) return;
    this.state.wakeAt = Math.max(this.state.wakeAt ?? Date.now(), Date.now()) + milliseconds;
    this.emitState();
  }

  wake(reason = "wake", source?: number): void {
    if (!this.state.trance && this.state.depth <= this.store.value.hypno.wakeToDepth) return;
    const aftereffects = this.store.value.hypno.aftereffectsMinutes;
    const previousDepth = this.state.depth;
    this.state.trance = false;
    this.state.depth = clamp(this.store.value.hypno.wakeToDepth, 0, 100);
    this.state.stage = stageForDepth(this.state.depth);
    this.state.wakeAt = undefined;
    this.state.aftereffectsUntil = aftereffects > 0 ? Date.now() + aftereffects * 60_000 : undefined;
    this.state.speechAllowed = true;
    this.state.forcedPhrase = undefined;
    this.state.focusMemberId = undefined;
    this.store.update((settings) => { settings.hypno.depth = this.state.depth; }, true);
    this.runtime.sendAction(`${this.runtime.playerName} blinks and slowly returns to full awareness.`);
    this.bus.emit("trance.wake", this.snapshot);
    this.bus.emit("depth.changed", { previous: previousDepth, current: this.state.depth, delta: this.state.depth - previousDepth, source, reason });
    this.emitState();
  }

  setSpeechAllowed(allowed: boolean): void {
    this.state.speechAllowed = allowed;
    this.emitState();
  }

  setForcedPhrase(phrase?: string): void {
    this.state.forcedPhrase = phrase?.trim() || undefined;
    this.emitState();
  }

  setFocus(memberId?: number): void {
    this.state.focusMemberId = memberId;
    this.emitState();
  }

  setSession(sessionId?: string): void {
    this.state.sessionId = sessionId;
    this.emitState();
  }

  publicStatus(capabilities: RemoteCapability[]): PublicStatus {
    return {
      protocol: 1,
      version: __SH_VERSION__,
      depthBucket: Math.round(this.state.depth / 5) * 5,
      stage: this.state.stage,
      trance: this.state.trance,
      activeBy: this.state.activeBy,
      capabilities,
      theme: this.store.value.theme.mode,
    };
  }

  emergencyStop(reason: string): void {
    this.state.trance = false;
    this.state.depth = 0;
    this.state.stage = "awake";
    this.state.wakeAt = undefined;
    this.state.aftereffectsUntil = undefined;
    this.state.speechAllowed = true;
    this.state.forcedPhrase = undefined;
    this.state.focusMemberId = undefined;
    this.state.sessionId = undefined;
    this.store.update((settings) => { settings.hypno.depth = 0; }, true);
    this.runtime.localMessage(`Emergency stop: ${reason}`, "warn");
    this.emitState();
  }

  private tick(): void {
    const now = Date.now();
    if (this.state.trance && this.state.wakeAt && now >= this.state.wakeAt) {
      this.wake("automatic timeout");
      return;
    }
    if (this.state.aftereffectsUntil && now >= this.state.aftereffectsUntil) {
      this.state.aftereffectsUntil = undefined;
      this.emitState();
    }
    if (this.state.trance || this.state.depth <= 0) return;
    const settings = this.store.value.hypno;
    if (now - this.state.lastDepthChangeAt < settings.decayDelaySeconds * 1000) return;
    if (settings.decayPerMinute <= 0) return;
    this.setDepth(this.state.depth - settings.decayPerMinute / 60, "decay");
  }

  private emitState(): void {
    this.state.stage = stageForDepth(this.state.depth, this.state.trance);
    this.bus.emit("state.changed", this.snapshot);
  }
}
