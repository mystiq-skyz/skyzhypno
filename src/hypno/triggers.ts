import type { EventBus } from "@/core/bus";
import type { Lifecycle } from "@/core/lifecycle";
import type { BCRuntime } from "@/core/runtime";
import type { SettingsStore } from "@/core/storage";
import type { AppEvents } from "@/events";
import type { TriggerDefinition, TriggerSource } from "@/types";
import type { HypnoEngine } from "./engine";
import type { PermissionService } from "@/core/permissions";
import LZString from "lz-string";

interface RepeatState { count: number; firstAt: number; lastAt: number }

const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase();
const stripOoc = (value: string) => value.replace(/\([^)]*\)/g, " ");

export function phraseMatches(message: string, phrase: string): boolean {
  const normalizedMessage = normalize(stripOoc(message));
  const normalizedPhrase = normalize(phrase.trim());
  if (!normalizedPhrase) return false;
  const escaped = normalizedPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\s|[.,!?;:'\"-])${escaped}(?=$|\\s|[.,!?;:'\"-])`, "iu").test(normalizedMessage);
}

export class TriggerEngine {
  private readonly cooldowns = new Map<string, number>();
  private readonly repeats = new Map<string, RepeatState>();
  private readonly comboHistory = new Map<number, Array<{ phrase: string; at: number }>>();

  constructor(
    private readonly runtime: BCRuntime,
    private readonly store: SettingsStore,
    private readonly hypno: HypnoEngine,
    private readonly permissions: PermissionService,
    private readonly bus: EventBus<AppEvents>,
    lifecycle: Lifecycle,
  ) {
    lifecycle.add(runtime.hook("ChatRoomMessage", 60, (args, next) => {
      const message = args[0] as ServerChatRoomMessage;
      this.handleChatMessage(message);
      return next(args);
    }));
    this.installBcxVoice();
  }

  test(message: string, sender = this.runtime.memberNumber, source: TriggerSource = "api"): TriggerDefinition[] {
    return this.process(message, sender, source, false);
  }
  executeById(id: string, sender: number, message?: string): boolean {
    const trigger = this.store.value.triggers.find((item) => item.id === id);
    if (!trigger || !trigger.source.includes("remote")) return false;
    const text = message?.trim() || trigger.phrase;
    if (!this.isEligible(trigger, text, sender, "remote") || !this.matchesWithRepeats(trigger, text, sender)) return false;
    this.execute(trigger, text, sender, "remote");
    return true;
  }


  process(message: string, sender: number, source: TriggerSource, execute = true): TriggerDefinition[] {
    if (!this.store.value.general.enabled || !this.store.value.hypno.enabled || !message || sender <= 0) return [];
    const matches: TriggerDefinition[] = [];
    for (const trigger of this.store.value.triggers) {
      if (!this.isEligible(trigger, message, sender, source)) continue;
      if (!this.matchesWithRepeats(trigger, message, sender)) continue;
      matches.push(trigger);
      if (execute) this.execute(trigger, message, sender, source);
    }
    return matches;
  }

  private handleChatMessage(message: ServerChatRoomMessage): void {
    if (!message?.Sender || message.Content === "SkyzHypno") return;
    const source: TriggerSource | undefined = message.Type === "Chat" ? "chat"
      : message.Type === "Whisper" ? "whisper"
      : message.Type === "Activity" || message.Type === "Action" ? "activity"
      : undefined;
    if (!source) return;
    this.process(message.Content, message.Sender, source);
  }

  private installBcxVoice(): void {
    if (!this.store.value.compatibility.bcxVoice || !window.bcx) return;
    try {
      window.bcx.getModApi("SkyzHypno").on?.("bcxLocalMessage", (event: { message?: string; sender?: number }) => {
        const raw = event?.message;
        if (typeof raw !== "string" || !raw.startsWith("[Voice] ")) return;
        const sender = Number(event.sender) || this.findBcxReminderSender();
        if (sender > 0) this.process(raw.slice(8), sender, "voice");
      });
    } catch (error) { this.runtime.recordError("BCX voice hook", error); }
  }

  private findBcxReminderSender(): number {
    try {
      const raw = this.runtime.player?.ExtensionSettings?.BCX ?? this.runtime.player?.OnlineSettings?.BCX;
      if (typeof raw !== "string") return -1;
      const decoded = LZString.decompressFromBase64(raw);
      const parsed = decoded ? JSON.parse(decoded) : undefined;
      return Number(parsed?.conditions?.rules?.conditions?.other_constant_reminder?.addedBy) || -1;
    } catch { return -1; }
  }

  private isEligible(trigger: TriggerDefinition, message: string, sender: number, source: TriggerSource): boolean {
    const now = Date.now();
    if (!trigger.enabled || !trigger.source.includes(source)) return false;
    if (trigger.expiresAt && trigger.expiresAt < now) return false;
    const state = this.hypno.snapshot;
    if (state.depth < trigger.minDepth || state.depth > trigger.maxDepth) return false;
    if ((this.cooldowns.get(trigger.id) ?? 0) > now) return false;
    if (trigger.requireNameMention && !phraseMatches(message, this.runtime.playerName)) return false;
    if (trigger.allowedMemberIds.length > 0 && !trigger.allowedMemberIds.includes(sender)) return false;
    if (trigger.allowedMemberIds.length === 0 && sender !== this.runtime.memberNumber) {
      const allowedByTriggerPermission = this.permissions.can({ sender, capability: trigger.kind === "wake" ? "wake" : trigger.kind === "deepen" ? "deepen" : "trigger", activeBy: state.activeBy, depth: state.depth, trance: state.trance });
      if (!allowedByTriggerPermission) return false;
    }
    if (trigger.kind === "wake" && !state.trance && state.depth <= 0) return false;
    if (trigger.kind !== "wake" && trigger.kind !== "speechAllow" && state.trance && trigger.kind === "trigger") return false;
    return phraseMatches(message, trigger.phrase) || (trigger.kind === "combo" && trigger.comboPhrases.some((phrase) => phraseMatches(message, phrase)));
  }

  private matchesWithRepeats(trigger: TriggerDefinition, message: string, sender: number): boolean {
    const now = Date.now();
    if (trigger.kind === "combo") {
      const history = this.comboHistory.get(sender) ?? [];
      for (const phrase of trigger.comboPhrases) if (phraseMatches(message, phrase)) history.push({ phrase: normalize(phrase), at: now });
      const recent = history.filter((entry) => now - entry.at <= trigger.repeatWindowMs);
      this.comboHistory.set(sender, recent);
      return trigger.comboPhrases.every((phrase) => recent.some((entry) => entry.phrase === normalize(phrase)));
    }
    if (trigger.requiredRepeats <= 1) return true;
    const key = `${trigger.id}:${sender}`;
    const current = this.repeats.get(key);
    const state = !current || now - current.firstAt > trigger.repeatWindowMs
      ? { count: 1, firstAt: now, lastAt: now }
      : { count: current.count + 1, firstAt: current.firstAt, lastAt: now };
    this.repeats.set(key, state);
    if (state.count < trigger.requiredRepeats) return false;
    this.repeats.delete(key);
    return true;
  }

  private execute(trigger: TriggerDefinition, message: string, sender: number, source: TriggerSource): void {
    const run = () => {
      this.cooldowns.set(trigger.id, Date.now() + trigger.cooldownMs);
      if (trigger.oneShot) this.store.update((settings) => { const found = settings.triggers.find((item) => item.id === trigger.id); if (found) found.enabled = false; });
      switch (trigger.kind) {
        case "trigger":
        case "deepen":
        case "combo":
          this.hypno.addDepth(trigger.depthDelta, trigger.kind, sender);
          break;
        case "wake": this.hypno.wake("wake trigger", sender); break;
        case "speechBlock": this.hypno.setSpeechAllowed(false); break;
        case "speechAllow": this.hypno.setSpeechAllowed(true); break;
        case "suggestion": break;
      }
      this.bus.emit("trigger.matched", { trigger, sender, source, message });
    };
    if (trigger.delayMs > 0) window.setTimeout(run, trigger.delayMs); else run();
  }
}
