import { z } from "zod";
import type { AudioEngine } from "@/audio/engine";
import type { EventBus } from "@/core/bus";
import type { Lifecycle } from "@/core/lifecycle";
import type { BCRuntime } from "@/core/runtime";
import type { SettingsStore } from "@/core/storage";
import type { EffectsEngine } from "@/effects/engine";
import type { AppEvents } from "@/events";
import type { HypnoEngine } from "@/hypno/engine";
import type { RestrictionEngine, RestrictionKind } from "@/hypno/restrictions";
import type { SuggestionEngine } from "@/suggestions/engine";
import type { NetworkManager, SessionNetworkHandler } from "@/network/manager";
import type { SessionPreset, SessionStep, SoundCategory } from "@/types";

interface ActiveSession {
  id: string;
  presetId: string;
  host: number;
  startedAt: number;
  participants: Map<number, "host" | "hypnotist" | "support" | "viewer" | "subject">;
  timers: number[];
  pausedAt?: number;
  elapsedMs: number;
}

const inviteSchema = z.object({ sessionId: z.string().min(8).max(100), presetId: z.string().min(1).max(100), role: z.enum(["hypnotist", "support", "viewer", "subject"]), hostName: z.string().max(100) }).strict();
const controlSchema = z.object({ sessionId: z.string().min(8).max(100), action: z.enum(["start", "stop", "pause", "resume", "effect", "depth", "wake", "message"]), config: z.record(z.unknown()).default({}) }).strict();

export class SessionDirector implements SessionNetworkHandler {
  private active?: ActiveSession;

  constructor(
    private readonly runtime: BCRuntime,
    private readonly store: SettingsStore,
    private readonly hypno: HypnoEngine,
    private readonly effects: EffectsEngine,
    private readonly audio: AudioEngine,
    private readonly suggestions: SuggestionEngine,
    private readonly restrictions: RestrictionEngine,
    private readonly network: NetworkManager,
    private readonly bus: EventBus<AppEvents>,
    lifecycle: Lifecycle,
  ) {
    network.attachSessionHandler(this);
    lifecycle.add(() => this.stop("addon unload", false));
    lifecycle.add(bus.on("emergency.stop", () => this.stop("emergency stop", true)));
  }

  get current(): Readonly<ActiveSession> | undefined { return this.active; }

  start(presetId: string, host: number = this.runtime.memberNumber, sessionId: string = crypto.randomUUID()): void {
    const preset = this.store.value.sessions.find((item) => item.id === presetId);
    if (!preset) throw new Error("Unknown session preset");
    this.stop("new session", false);
    const active: ActiveSession = { id: sessionId, presetId, host, startedAt: Date.now(), participants: new Map([[host, "host"], [this.runtime.memberNumber, host === this.runtime.memberNumber ? "host" : "subject"]]), timers: [], elapsedMs: 0 };
    this.active = active;
    this.hypno.setSession(sessionId);
    this.schedulePreset(preset, active);
    this.runtime.localMessage(`Session “${preset.name}” started.`);
  }

  invite(target: number, presetId: string, role: "hypnotist" | "support" | "viewer" | "subject" = "subject"): void {
    const sessionId: string = this.active?.id ?? crypto.randomUUID();
    if (!this.active) this.start(presetId, this.runtime.memberNumber, sessionId);
    this.active!.participants.set(target, role);
    this.network.send("session.invite", { sessionId, presetId, role, hostName: this.runtime.playerName }, target);
  }

  control(action: "start" | "stop" | "pause" | "resume" | "effect" | "depth" | "wake" | "message", config: Record<string, unknown> = {}): void {
    if (!this.active) return;
    for (const memberId of this.active.participants.keys()) if (memberId !== this.runtime.memberNumber) this.network.send("session.control", { sessionId: this.active.id, action, config }, memberId);
    void this.applyControl(action, config);
  }

  stop(reason = "stopped", notify = true): void {
    const active = this.active;
    if (!active) return;
    this.clearTimers(active);
    if (notify) for (const memberId of active.participants.keys()) if (memberId !== this.runtime.memberNumber) this.network.send("session.leave", { sessionId: active.id, reason }, memberId);
    this.active = undefined;
    this.hypno.setSession(undefined);
    this.audio.stopCategory("ambient");
    this.runtime.localMessage(`Session ${reason}.`);
  }

  async onInvite(sender: number, payload: unknown): Promise<void> {
    const invite = inviteSchema.parse(payload);
    const accepted = await showInvite(`${invite.hostName} invites you to a shared SkyzHypno session as ${invite.role}.`, this.store.value.theme.primary);
    if (!accepted) return;
    this.start(invite.presetId, sender, invite.sessionId);
    this.active?.participants.set(sender, "host");
    this.active?.participants.set(this.runtime.memberNumber, invite.role);
  }

  async onControl(sender: number, payload: unknown): Promise<void> {
    const control = controlSchema.parse(payload);
    if (!this.active || this.active.id !== control.sessionId || this.active.host !== sender) throw new Error("Session control does not match active host");
    if (control.action === "stop") { this.stop("ended by host", false); return; }
    await this.applyControl(control.action, control.config);
  }

  onLeave(sender: number, payload: unknown): void {
    if (!this.active) return;
    const sessionId = (payload as any)?.sessionId;
    if (sessionId !== this.active.id) return;
    this.active.participants.delete(sender);
    if (sender === this.active.host) this.stop("host left", false);
  }

  private schedulePreset(preset: SessionPreset, active: ActiveSession, fromMs = 0): void {
    this.clearTimers(active);
    for (const step of [...preset.steps].sort((a, b) => a.atMs - b.atMs)) {
      if (step.atMs < fromMs) continue;
      const timer = window.setTimeout(() => { if (this.active?.id === active.id && !active.pausedAt) void this.executeStep(step); }, Math.max(0, step.atMs - fromMs));
      active.timers.push(timer);
    }
    active.timers.push(window.setTimeout(() => { if (this.active?.id === active.id && !active.pausedAt) this.stop("completed", true); }, Math.max(0, preset.durationMs - fromMs)));
  }

  private clearTimers(active: ActiveSession): void {
    active.timers.forEach((timer) => window.clearTimeout(timer));
    active.timers = [];
  }

  private pause(): void {
    if (!this.active || this.active.pausedAt) return;
    this.active.elapsedMs = Math.max(0, Date.now() - this.active.startedAt);
    this.active.pausedAt = Date.now();
    this.clearTimers(this.active);
    this.runtime.localMessage("Shared session paused.");
  }

  private resume(): void {
    if (!this.active?.pausedAt) return;
    const preset = this.store.value.sessions.find((item) => item.id === this.active?.presetId);
    if (!preset) { this.stop("preset missing", true); return; }
    this.active.pausedAt = undefined;
    this.active.startedAt = Date.now() - this.active.elapsedMs;
    this.schedulePreset(preset, this.active, this.active.elapsedMs);
    this.runtime.localMessage("Shared session resumed.");
  }

  private async executeStep(step: SessionStep): Promise<void> {
    switch (step.action) {
      case "effect": await this.effects.playPreset(String(step.config.presetId ?? ""), number(step.config.durationMs), false); break;
      case "sound": await this.audio.playCategory(String(step.config.category ?? "ambient") as SoundCategory, { loop: Boolean(step.config.loop) }); break;
      case "depth": this.hypno.addDepth(number(step.config.delta) ?? 0, "session", this.active?.host); break;
      case "message": this.runtime.localMessage(String(step.config.text ?? "")); break;
      case "suggestion": if (typeof step.config.id === "string" && this.active) await this.suggestions.trigger(step.config.id, this.active.host, String(step.config.command ?? "")); break;
      case "restriction": if (typeof step.config.kind === "string") this.restrictions.add(step.config.kind as RestrictionKind, number(step.config.durationMs), this.active?.host); break;
      case "wake": this.hypno.wake("session wake", this.active?.host); break;
    }
  }

  private async applyControl(action: string, config: Record<string, unknown>): Promise<void> {
    if (action === "pause") { this.pause(); return; }
    if (action === "resume") { this.resume(); return; }
    if (action === "start" && this.active) { this.resume(); return; }
    if (action === "effect" && typeof config.presetId === "string") await this.effects.playPreset(config.presetId, number(config.durationMs), false);
    else if (action === "depth") this.hypno.addDepth(number(config.delta) ?? 0, "session remote", this.active?.host);
    else if (action === "wake") this.hypno.wake("session remote wake", this.active?.host);
    else if (action === "message") this.effects.fragment(String(config.text ?? ""));
  }
}

const number = (value: unknown): number | undefined => typeof value === "number" && Number.isFinite(value) ? value : undefined;

function showInvite(message: string, color: string): Promise<boolean> {
  return new Promise((resolve) => {
    const root = document.createElement("div");
    root.style.cssText = "position:fixed;inset:0;z-index:1000001;display:grid;place-items:center;background:rgba(0,0,0,.78);backdrop-filter:blur(8px)";
    root.innerHTML = `<div style="width:min(520px,90vw);padding:28px;border-radius:24px;background:#100718;color:white;border:1px solid ${color};box-shadow:0 0 50px ${color}55;font-family:system-ui;text-align:center"><h2 style="color:${color}">Shared Session</h2><p></p><button data-yes style="padding:10px 20px;margin:8px;border:0;border-radius:12px;background:${color};color:white;font-weight:800">Accept</button><button data-no style="padding:10px 20px;margin:8px;border:0;border-radius:12px;background:#34243e;color:white">Decline</button></div>`;
    root.querySelector("p")!.textContent = message;
    document.body.appendChild(root);
    const finish = (value: boolean) => { root.remove(); resolve(value); };
    root.querySelector("[data-yes]")!.addEventListener("click", () => finish(true));
    root.querySelector("[data-no]")!.addEventListener("click", () => finish(false));
  });
}
