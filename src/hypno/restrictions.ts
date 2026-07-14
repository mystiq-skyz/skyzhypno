import type { Lifecycle } from "@/core/lifecycle";
import type { BCRuntime } from "@/core/runtime";
import type { SettingsStore } from "@/core/storage";
import type { RestrictionMode } from "@/types";
import type { HypnoEngine } from "./engine";

export type RestrictionKind = "speech" | "walk" | "pose" | "wardrobe" | "interact" | "hearing" | "sight" | "names" | "menus";

interface TemporaryRestriction {
  id: string;
  kind: RestrictionKind;
  expiresAt?: number;
  source?: number;
}

export class RestrictionEngine {
  private readonly temporary = new Map<string, TemporaryRestriction>();

  constructor(
    private readonly runtime: BCRuntime,
    private readonly store: SettingsStore,
    private readonly hypno: HypnoEngine,
    lifecycle: Lifecycle,
  ) {
    lifecycle.add(runtime.hook("ServerSend", 100, (args, next) => this.interceptServerSend(args, next)));
    lifecycle.add(runtime.hook("Player.CanTalk", 100, (args, next) => this.active("speech") ? false : next(args)));
    lifecycle.add(runtime.hook("Player.CanWalk", 100, (args, next) => this.active("walk") ? false : next(args)));
    lifecycle.add(runtime.hook("Player.CanChangeClothesOn", 100, (args, next) => this.active("wardrobe") ? false : next(args)));
    lifecycle.add(runtime.hook("Player.CanInteract", 100, (args, next) => this.active("interact") ? false : next(args)));
    lifecycle.add(runtime.hook("PoseCanChangeUnaided", 100, (args, next) => this.active("pose") ? false : next(args)));
    lifecycle.add(runtime.hook("Player.GetDeafLevel", 100, (args, next) => this.active("hearing") ? Math.max(4, Number(next(args)) || 0) : next(args)));
    lifecycle.add(runtime.hook("Player.GetBlindLevel", 100, (args, next) => this.active("sight") ? Math.max(2, Number(next(args)) || 0) : next(args)));
    lifecycle.add(runtime.hook("CommonSetScreen", 100, (args, next) => this.interceptScreen(args, next)));
    lifecycle.add(runtime.hook("ChatRoomSafewordRevert", 1000, (args, next) => { this.clearAll(); const result = next(args); this.hypno.emergencyStop("BC safeword revert"); return result; }));
    lifecycle.add(runtime.hook("ChatRoomSafewordRelease", 1000, (args, next) => { const result = next(args); this.clearAll(); this.hypno.emergencyStop("BC safeword release"); return result; }));
    lifecycle.interval(() => this.expire(), 1000);
  }

  add(kind: RestrictionKind, durationMs?: number, source?: number): string {
    const id = crypto.randomUUID();
    this.temporary.set(id, { id, kind, source, expiresAt: durationMs && durationMs > 0 ? Date.now() + durationMs : undefined });
    return id;
  }

  remove(id: string): void {
    this.temporary.delete(id);
  }

  clearAll(): void {
    this.temporary.clear();
    this.hypno.setSpeechAllowed(true);
    this.hypno.setForcedPhrase(undefined);
  }

  active(kind: RestrictionKind): boolean {
    this.expire();
    if ([...this.temporary.values()].some((entry) => entry.kind === kind)) return true;
    const mode = this.store.value.restrictions[kind] as RestrictionMode;
    const state = this.hypno.snapshot;
    switch (mode) {
      case "off": return false;
      case "trance": return state.trance && !state.lucid;
      case "suggestion": return false;
      case "both": return state.trance && !state.lucid;
      case "depth": return state.depth >= this.store.value.restrictions.threshold && !state.lucid;
      default: return false;
    }
  }

  private interceptServerSend(args: any[], next: (args: any[]) => any): any {
    const [type, data] = args as [string, { Type?: string; Content?: string }];
    if (type !== "ChatRoomChat" || data?.Type !== "Chat") return next(args);
    const text = String(data.Content ?? "");
    if (!text || this.isControlText(text)) return next(args);
    const forced = this.hypno.snapshot.forcedPhrase;
    if (forced) {
      if (text.trim().toLocaleLowerCase() === forced.trim().toLocaleLowerCase()) {
        this.hypno.setForcedPhrase(undefined);
        return next(args);
      }
      this.runtime.localMessage(`Your thoughts keep returning to: “${forced}”`, "warn");
      return null;
    }
    if (!this.hypno.snapshot.speechAllowed || this.active("speech")) {
      const replacements = this.store.value.restrictions.replacementResponses;
      const replacement = replacements[Math.floor(Math.random() * replacements.length)] || "...";
      this.runtime.localMessage(`Speech blocked. Intended response: ${replacement}`, "warn");
      return null;
    }
    return next(args);
  }

  private interceptScreen(args: any[], next: (args: any[]) => any): any {
    if (!this.active("menus")) return next(args);
    const module = String(args[0] ?? "");
    const screen = String(args[1] ?? "");
    const allowed = screen === "ChatRoom" || screen.includes("Preference") || module.includes("Preference");
    if (allowed) return next(args);
    this.runtime.localMessage("That menu is temporarily unavailable. Preferences and the emergency stop remain accessible.", "warn");
    return undefined;
  }

  private isControlText(text: string): boolean {
    const trimmed = text.trim();
    return this.store.value.restrictions.allowedPhrases.some((prefix) => trimmed.startsWith(prefix));
  }

  private expire(): void {
    const now = Date.now();
    for (const [id, restriction] of this.temporary) if (restriction.expiresAt && restriction.expiresAt <= now) this.temporary.delete(id);
  }
}
