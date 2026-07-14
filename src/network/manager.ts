import { z } from "zod";
import type { EventBus } from "@/core/bus";
import type { Lifecycle } from "@/core/lifecycle";
import type { PermissionService } from "@/core/permissions";
import { createPacket, parsePacket } from "@/core/protocol";
import type { BCRuntime } from "@/core/runtime";
import type { SettingsStore } from "@/core/storage";
import type { EffectsEngine } from "@/effects/engine";
import type { AppEvents } from "@/events";
import type { HypnoEngine } from "@/hypno/engine";
import type { TriggerEngine } from "@/hypno/triggers";
import type { SuggestionEngine } from "@/suggestions/engine";
import type { NetworkPacket, PublicStatus, RemoteCapability } from "@/types";

export interface SessionNetworkHandler {
  onInvite(sender: number, payload: unknown): Promise<void> | void;
  onControl(sender: number, payload: unknown): Promise<void> | void;
  onLeave(sender: number, payload: unknown): Promise<void> | void;
}

const triggerPayload = z.object({ id: z.string().min(1).max(100), message: z.string().max(500).optional() }).strict();
const settingsPatchPayload = z.object({ changes: z.object({ autoWakeMinutes: z.number().min(0).max(1440).optional(), lucidTrance: z.boolean().optional(), effectIntensity: z.number().min(0).max(1).optional(), themeMode: z.enum(["pinky","dark","hybrid"]).optional(), restrictionThreshold: z.number().min(0).max(100).optional(), extremeEnabled: z.boolean().optional(), lockQuickControls: z.boolean().optional() }).strict() }).strict();
const depthPayload = z.object({ delta: z.number().min(-100).max(100), reason: z.string().max(120).optional() }).strict();
const effectPayload = z.object({ presetId: z.string().min(1).max(100), durationMs: z.number().int().min(500).max(600_000).optional() }).strict();
const idPayload = z.object({ id: z.string().min(1).max(100) }).strict();
const suggestionTriggerPayload = z.object({ id: z.string().min(1).max(100), command: z.string().max(500).optional() }).strict();
const indicatorPayload = z.object({ hidden: z.boolean() }).strict();

export class NetworkManager {
  private readonly seen = new Map<string, number>();
  private readonly statuses = new Map<number, PublicStatus>();
  private sessionHandler?: SessionNetworkHandler;
  private lastHello = 0;

  constructor(
    private readonly runtime: BCRuntime,
    private readonly store: SettingsStore,
    private readonly hypno: HypnoEngine,
    private readonly permissions: PermissionService,
    private readonly effects: EffectsEngine,
    private readonly triggers: TriggerEngine,
    private readonly suggestions: SuggestionEngine,
    private readonly bus: EventBus<AppEvents>,
    lifecycle: Lifecycle,
  ) {
    lifecycle.add(runtime.hook("ChatRoomMessage", 1000, (args, next) => {
      const message = args[0] as ServerChatRoomMessage;
      if (message?.Type === "Hidden" && message.Content === "SkyzHypno") this.receive(message);
      return next(args);
    }));
    lifecycle.add(runtime.hook("ChatRoomSync", 5, (args, next) => {
      const result = next(args);
      window.setTimeout(() => this.broadcastHello(true), 500);
      return result;
    }));
    lifecycle.interval(() => this.cleanup(), 15_000);
    lifecycle.add(bus.on("state.changed", () => this.broadcastHello(false)));
  }

  attachSessionHandler(handler: SessionNetworkHandler): void { this.sessionHandler = handler; }

  status(memberId: number): PublicStatus | undefined { return this.statuses.get(memberId); }
  allStatuses(): ReadonlyMap<number, PublicStatus> { return this.statuses; }

  send<T>(type: NetworkPacket["type"], payload: T, target?: number): void {
    if (this.runtime.memberNumber <= 0) return;
    const packet = createPacket(type, this.runtime.memberNumber, payload, target);
    this.runtime.sendHidden(packet, target);
  }

  requestTrigger(target: number, id: string, message?: string): void { this.send("trigger.request", { id, message }, target); }
  requestSettingsPatch(target: number, changes: { autoWakeMinutes?: number; lucidTrance?: boolean; effectIntensity?: number; themeMode?: "pinky" | "dark" | "hybrid"; restrictionThreshold?: number; extremeEnabled?: boolean; lockQuickControls?: boolean }): void { this.send("settings.patch", { changes }, target); }
  requestDepth(target: number, delta: number, reason?: string): void { this.send("depth.request", { delta, reason }, target); }
  requestWake(target: number): void { this.send("wake.request", {}, target); }
  requestEffect(target: number, presetId: string, durationMs?: number): void { this.send("effect.request", { presetId, durationMs }, target); }
  installSuggestion(target: number, suggestion: unknown): void { this.send("suggestion.install", { suggestion }, target); }
  removeSuggestion(target: number, id: string): void { this.send("suggestion.remove", { id }, target); }
  triggerSuggestion(target: number, id: string, command?: string): void { this.send("suggestion.trigger", { id, command }, target); }
  requestIndicator(target: number, hidden: boolean): void { this.send("indicator.request", { hidden }, target); }

  broadcastHello(force: boolean): void {
    if (!this.runtime.inChatRoom() || !this.store.value.hypno.showPublicStatus) return;
    const now = Date.now();
    if (!force && now - this.lastHello < 5500) return;
    this.lastHello = now;
    const capabilities = (Object.entries(this.store.value.remote.capabilities) as Array<[RemoteCapability, { enabled: boolean }]>)
      .filter(([, rule]) => this.store.value.remote.enabled && rule.enabled)
      .map(([capability]) => capability);
    this.send("hello", this.hypno.publicStatus(capabilities));
  }

  private receive(message: ServerChatRoomMessage): void {
    const sender = Number(message.Sender);
    const raw = message.Dictionary?.find((entry: any) => entry?.Tag === "SkyzHypno")?.message ?? message.Dictionary?.[0]?.message;
    const packet = parsePacket(raw, sender);
    if (!packet || (packet.target && packet.target !== this.runtime.memberNumber)) {
      this.runtime.diagnostics.networkPacketsRejected += 1;
      return;
    }
    if (this.seen.has(packet.id)) return;
    this.seen.set(packet.id, Date.now());
    this.runtime.diagnostics.networkPacketsReceived += 1;
    this.bus.emit("network.packet", packet);
    void this.dispatch(packet).catch((error) => {
      this.runtime.diagnostics.networkPacketsRejected += 1;
      this.runtime.recordError(`network ${packet.type}`, error);
      this.audit(packet, false, error instanceof Error ? error.message : String(error));
    });
  }

  private async dispatch(packet: NetworkPacket): Promise<void> {
    switch (packet.type) {
      case "hello":
      case "sync": {
        const status = publicStatusSchema.parse(packet.payload);
        this.statuses.set(packet.sender, status);
        if (packet.type === "hello" && packet.sender !== this.runtime.memberNumber) this.send("sync", this.hypno.publicStatus(this.enabledCapabilities()), packet.sender);
        return;
      }
      case "permission.query":
        this.send("permission.response", { capabilities: this.enabledCapabilities() }, packet.sender);
        return;
      case "permission.response": return;
      case "trigger.request": {
        this.require(packet, "trigger");
        const payload = triggerPayload.parse(packet.payload);
        if (!this.triggers.executeById(payload.id, packet.sender, payload.message)) throw new Error("Remote trigger is unavailable or ineligible");
        this.audit(packet, true, `Trigger ${payload.id}`);
        return;
      }
      case "settings.patch": {
        this.require(packet, "editSettings");
        const { changes } = settingsPatchPayload.parse(packet.payload);
        this.store.update((settings) => {
          if (changes.autoWakeMinutes !== undefined) settings.hypno.autoWakeMinutes = changes.autoWakeMinutes;
          if (changes.lucidTrance !== undefined) settings.hypno.lucidTrance = changes.lucidTrance;
          if (changes.effectIntensity !== undefined) settings.effects.intensity = changes.effectIntensity;
          if (changes.restrictionThreshold !== undefined) settings.restrictions.threshold = changes.restrictionThreshold;
          if (changes.extremeEnabled !== undefined) settings.extreme.enabled = changes.extremeEnabled;
          if (changes.lockQuickControls !== undefined) settings.extreme.lockQuickControls = changes.lockQuickControls;
          if (changes.themeMode !== undefined) {
            settings.theme.mode = changes.themeMode;
            const palette = changes.themeMode === "pinky" ? { primary: "#ff58bd", secondary: "#b45cff", accent: "#ffd0f0", background: "#12051a", glow: .95, darkness: .42 }
              : changes.themeMode === "dark" ? { primary: "#ff2f72", secondary: "#3b0b66", accent: "#a868ff", background: "#030106", glow: .62, darkness: .9 }
              : { primary: "#ff58bd", secondary: "#731dff", accent: "#ff9fe2", background: "#09030f", glow: .8, darkness: .65 };
            Object.assign(settings.theme, palette);
          }
        }, true);
        this.audit(packet, true, "Settings patch");
        return;
      }
      case "depth.request": {
        this.require(packet, (depthPayload.parse(packet.payload).delta >= 0 ? "deepen" : "wake"));
        const payload = depthPayload.parse(packet.payload);
        this.hypno.addDepth(payload.delta, payload.reason ?? "remote request", packet.sender);
        this.audit(packet, true, `Depth ${payload.delta}`);
        return;
      }
      case "wake.request":
        this.require(packet, "wake"); this.hypno.wake("remote wake", packet.sender); this.audit(packet, true, "Wake"); return;
      case "effect.request": {
        this.require(packet, "testEffect"); const payload = effectPayload.parse(packet.payload);
        await this.effects.playPreset(payload.presetId, payload.durationMs, false); this.audit(packet, true, `Effect ${payload.presetId}`); return;
      }
      case "suggestion.install": {
        const payload = z.object({ suggestion: z.unknown() }).strict().parse(packet.payload);
        const suggestionId = typeof (payload.suggestion as any)?.id === "string" ? (payload.suggestion as any).id : "";
        const existing = this.store.value.suggestions.some((item) => item.id === suggestionId);
        this.require(packet, existing ? "editOwnSuggestion" : "installSuggestion");
        this.suggestions.install(payload.suggestion, packet.sender); this.audit(packet, true, existing ? "Suggestion edit" : "Suggestion install"); return;
      }
      case "suggestion.remove": {
        this.require(packet, "removeOwnSuggestion"); const payload = idPayload.parse(packet.payload);
        this.suggestions.remove(payload.id, packet.sender); this.audit(packet, true, `Suggestion remove ${payload.id}`); return;
      }
      case "suggestion.trigger": {
        this.require(packet, "trigger"); const payload = suggestionTriggerPayload.parse(packet.payload);
        await this.suggestions.trigger(payload.id, packet.sender, payload.command ?? ""); this.audit(packet, true, `Suggestion trigger ${payload.id}`); return;
      }
      case "session.invite":
        this.require(packet, "startSession"); await this.sessionHandler?.onInvite(packet.sender, packet.payload); this.audit(packet, true, "Session invite"); return;
      case "session.control":
        this.require(packet, "controlSession"); await this.sessionHandler?.onControl(packet.sender, packet.payload); this.audit(packet, true, "Session control"); return;
      case "session.leave": await this.sessionHandler?.onLeave(packet.sender, packet.payload); return;
      case "indicator.request": {
        this.require(packet, "controlIndicator");
        if (!this.store.value.extreme.allowRemoteIndicatorControl) throw new Error("Remote indicator control is disabled locally");
        const payload = indicatorPayload.parse(packet.payload);
        this.store.update((settings) => { settings.extreme.hideOwnIndicator = payload.hidden; }, true);
        this.audit(packet, true, payload.hidden ? "Indicator hidden" : "Indicator shown");
        return;
      }
      case "audit.ack": return;
    }
  }

  private require(packet: NetworkPacket, capability: RemoteCapability): void {
    const state = this.hypno.snapshot;
    if (!this.permissions.can({ sender: packet.sender, capability, activeBy: state.activeBy, depth: state.depth, trance: state.trance })) throw new Error(`Permission denied: ${capability}`);
  }

  private enabledCapabilities(): RemoteCapability[] {
    if (!this.store.value.remote.enabled) return [];
    return (Object.entries(this.store.value.remote.capabilities) as Array<[RemoteCapability, { enabled: boolean }]>).filter(([, rule]) => rule.enabled).map(([key]) => key);
  }

  private audit(packet: NetworkPacket, allowed: boolean, detail: string): void {
    if (!this.store.value.remote.auditLog) return;
    this.runtime.auditEntry({
      id: packet.id, timestamp: Date.now(), sender: packet.sender, senderName: this.runtime.characterName(packet.sender),
      action: packet.type, allowed, detail,
    });
  }

  private cleanup(): void {
    const cutoff = Date.now() - 120_000;
    for (const [id, timestamp] of this.seen) if (timestamp < cutoff) this.seen.delete(id);
    const roomIds = new Set((typeof ChatRoomCharacter === "undefined" ? [] : ChatRoomCharacter).map((character) => character.MemberNumber));
    for (const id of this.statuses.keys()) if (!roomIds.has(id)) this.statuses.delete(id);
  }
}

const publicStatusSchema = z.object({
  protocol: z.number().int(), version: z.string().max(50), depthBucket: z.number().min(0).max(100),
  stage: z.enum(["awake", "influenced", "dazed", "deep", "critical", "trance"]), trance: z.boolean(),
  activeBy: z.number().int().positive().optional(), capabilities: z.array(z.enum(["viewStatus","trigger","deepen","wake","testEffect","installSuggestion","editOwnSuggestion","removeOwnSuggestion","editSettings","startSession","controlSession","controlIndicator"])).max(30), theme: z.enum(["pinky", "dark", "hybrid", "custom"]),
}).strict() as unknown as z.ZodType<PublicStatus>;
