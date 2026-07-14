import LZString from "lz-string";
import type { SkyzHypnoSettings, TriggerDefinition } from "@/types";
import { BCRuntime } from "./runtime";
import { SettingsStore } from "./storage";

function decodeUnknown(value: unknown): any | undefined {
  if (typeof value !== "string" || !value) return undefined;
  for (const decoder of [LZString.decompressFromBase64, LZString.decompressFromUTF16]) {
    try {
      const decoded = decoder(value);
      if (decoded) return JSON.parse(decoded);
    } catch { /* try next format */ }
  }
  try { return JSON.parse(value); } catch { return undefined; }
}

const uniqueStrings = (values: unknown): string[] => Array.isArray(values)
  ? [...new Set(values.filter((value): value is string => typeof value === "string" && value.trim().length > 0).map((value) => value.trim()))]
  : [];

export class CompatibilityService {
  constructor(private readonly runtime: BCRuntime, private readonly store: SettingsStore) {}

  detect(): string[] {
    const conflicts: string[] = [];
    if (window.Liko?.HSC) conflicts.push("HSC is loaded; disable its effect/trigger modules when using SH replacement mode.");
    if (window.LSCG_Loaded) conflicts.push("LSCG is loaded; disable LSCG Hypnosis while keeping other LSCG modules if desired.");
    if (window.WCE) conflicts.push("WCE detected; SH will avoid replacing WCE functions and only add SDK hooks.");
    if (window.bcx) conflicts.push("BCX detected; [Voice] integration is available.");
    this.runtime.diagnostics.conflicts.push(...conflicts);
    return conflicts;
  }

  migrateOnce(): void {
    const migrationKey = `SkyzHypno_${this.runtime.memberNumber}_migrated_0_1`;
    if (localStorage.getItem(migrationKey)) return;
    const settings = this.store.value;
    let changed = false;
    if (settings.compatibility.importHSC) changed = this.importHSC(settings) || changed;
    if (settings.compatibility.importLSCG) changed = this.importLSCG(settings) || changed;
    if (changed) this.store.update(() => undefined, true);
    localStorage.setItem(migrationKey, new Date().toISOString());
  }

  private importHSC(settings: SkyzHypnoSettings): boolean {
    const raw = this.runtime.player?.ExtensionSettings?.HSC;
    const hsc = decodeUnknown(raw);
    if (!hsc || typeof hsc !== "object") return false;
    let changed = false;
    const triggerWords = uniqueStrings(hsc.customTexts?.trigger ?? hsc.triggerWords ?? hsc.triggers);
    const wakeWords = uniqueStrings(hsc.customTexts?.wake ?? hsc.wakeWords ?? hsc.awakeners);
    for (const phrase of triggerWords) changed = this.addImportedTrigger(settings, phrase, "trigger", "HSC") || changed;
    for (const phrase of wakeWords) changed = this.addImportedTrigger(settings, phrase, "wake", "HSC") || changed;
    const soundUrls = uniqueStrings(hsc.sounds ?? hsc.soundUrls);
    for (const url of soundUrls) {
      if (settings.audio.sounds.some((sound) => sound.url === url)) continue;
      settings.audio.sounds.push({
        id: crypto.randomUUID(), name: "Imported HSC sound", category: "trigger", url, enabled: true, volume: 0.5,
        loop: false, playbackRate: 1, pan: 0, reverb: 0.2, echo: 0.1, builtIn: false,
      });
      changed = true;
    }
    return changed;
  }

  private importLSCG(settings: SkyzHypnoSettings): boolean {
    const raw = this.runtime.player?.ExtensionSettings?.LSCG ?? this.runtime.player?.OnlineSettings?.LSCG;
    const lscg = decodeUnknown(raw) ?? (this.runtime.player as any)?.LSCG;
    const hypno = lscg?.HypnoModule;
    if (!hypno || typeof hypno !== "object") return false;
    let changed = false;
    const triggers = typeof hypno.overrideWords === "string" ? hypno.overrideWords.split(",") : [hypno.trigger];
    const awakeners = typeof hypno.awakeners === "string" ? hypno.awakeners.split(",") : [];
    for (const phrase of uniqueStrings(triggers)) changed = this.addImportedTrigger(settings, phrase, "trigger", "LSCG") || changed;
    for (const phrase of uniqueStrings(awakeners)) changed = this.addImportedTrigger(settings, phrase, "wake", "LSCG") || changed;
    if (Array.isArray(hypno.influence)) {
      for (const entry of hypno.influence) {
        if (!Number.isInteger(entry?.memberId) || entry.memberId <= 0) continue;
        if (settings.influence.some((existing) => existing.memberId === entry.memberId)) continue;
        const value = Math.max(0, Math.min(100, Number(entry.influence) || 0));
        settings.influence.push({
          memberId: entry.memberId,
          memberName: String(entry.memberName ?? `#${entry.memberId}`),
          trigger: value, suggestion: value, deepen: value, wake: 0, lastChangedAt: Date.now(),
        });
        changed = true;
      }
    }
    return changed;
  }

  private addImportedTrigger(settings: SkyzHypnoSettings, phrase: string, kind: TriggerDefinition["kind"], source: string): boolean {
    phrase = phrase.trim();
    if (!phrase || settings.triggers.some((trigger) => trigger.phrase.toLocaleLowerCase() === phrase.toLocaleLowerCase() && trigger.kind === kind)) return false;
    settings.triggers.push({
      id: crypto.randomUUID(), name: `Imported ${source} ${kind}`, phrase, kind, enabled: true,
      source: ["chat", "whisper", "voice"], minDepth: 0, maxDepth: 100, depthDelta: kind === "wake" ? 0 : 25,
      cooldownMs: 5_000, delayMs: 0, requiredRepeats: 1, repeatWindowMs: 30_000, comboPhrases: [], allowedMemberIds: [],
      requireNameMention: false, oneShot: false,
    });
    return true;
  }
}
