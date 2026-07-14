import LZString from "lz-string";
import { z } from "zod";
import { createDefaultSettings } from "@/defaults";
import type { SkyzHypnoSettings } from "@/types";
import { BCRuntime } from "./runtime";

const settingsEnvelopeSchema = z.object({
  storageVersion: z.number().int().min(1),
  general: z.object({ enabled: z.boolean() }).passthrough(),
  hypno: z.object({ depth: z.number().min(0).max(100) }).passthrough(),
  effects: z.object({ enabled: z.boolean(), intensity: z.number().min(0).max(1) }).passthrough(),
  audio: z.object({ enabled: z.boolean(), masterVolume: z.number().min(0).max(1), sounds: z.array(z.any()) }).passthrough(),
  remote: z.object({ enabled: z.boolean() }).passthrough(),
  suggestions: z.array(z.any()).max(100),
}).passthrough();

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function deepMerge<T>(base: T, incoming: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(incoming)) return (incoming ?? base) as T;
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(incoming)) {
    const current = result[key];
    result[key] = isPlainObject(current) && isPlainObject(value) ? deepMerge(current, value) : value;
  }
  return result as T;
}

export class SettingsStore {
  private settings: SkyzHypnoSettings = createDefaultSettings();
  private saveTimer?: number;
  private listeners = new Set<(settings: SkyzHypnoSettings) => void>();

  constructor(private readonly runtime: BCRuntime) {}

  get value(): SkyzHypnoSettings {
    return this.settings;
  }

  load(): SkyzHypnoSettings {
    const defaults = createDefaultSettings();
    const member = this.runtime.memberNumber;
    const extensionRaw = this.runtime.player?.ExtensionSettings?.SkyzHypno;
    const backupRaw = localStorage.getItem(`SkyzHypno_${member}_backup`);
    const candidates = [extensionRaw, backupRaw].filter((value): value is string => typeof value === "string" && value.length > 0);

    for (const raw of candidates) {
      try {
        const json = LZString.decompressFromBase64(raw) ?? raw;
        const parsed = JSON.parse(json) as unknown;
        const validated = settingsEnvelopeSchema.safeParse(parsed);
        if (!validated.success) continue;
        this.settings = sanitizeSettings(deepMerge(defaults, parsed));
        this.persistBackup();
        return this.settings;
      } catch (error) {
        this.runtime.recordError("settings load", error);
      }
    }

    this.settings = defaults;
    return this.settings;
  }

  update(mutator: (settings: SkyzHypnoSettings) => void, publish = false): void {
    mutator(this.settings);
    this.settings = sanitizeSettings(this.settings);
    this.notify();
    this.scheduleSave(publish);
  }

  replace(settings: SkyzHypnoSettings, publish = true): void {
    const parsed = settingsEnvelopeSchema.parse(settings);
    this.settings = sanitizeSettings(deepMerge(createDefaultSettings(), parsed));
    this.notify();
    this.scheduleSave(publish);
  }

  subscribe(listener: (settings: SkyzHypnoSettings) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  export(): string {
    return LZString.compressToBase64(JSON.stringify(this.settings));
  }

  import(raw: string): void {
    const json = LZString.decompressFromBase64(raw) ?? raw;
    const parsed = settingsEnvelopeSchema.parse(JSON.parse(json));
    this.replace(parsed as unknown as SkyzHypnoSettings);
  }

  flush(publish = true): void {
    if (this.saveTimer) window.clearTimeout(this.saveTimer);
    this.saveTimer = undefined;
    const compressed = this.export();
    if (!this.runtime.player) return;
    this.runtime.player.ExtensionSettings ??= {};
    this.runtime.player.ExtensionSettings.SkyzHypno = compressed;
    this.persistBackup(compressed);
    this.runtime.syncExtensionSettings();
    if (publish) this.publishPublicPlaceholder();
  }

  private scheduleSave(publish: boolean): void {
    if (this.saveTimer) window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.flush(publish), 650);
  }

  private persistBackup(value = this.export()): void {
    localStorage.setItem(`SkyzHypno_${this.runtime.memberNumber}_backup`, value);
  }

  private publishPublicPlaceholder(): void {
    const player = this.runtime.player;
    if (!player) return;
    player.OnlineSharedSettings ??= {};
    player.OnlineSharedSettings.SkyzHypno = {
      version: __SH_VERSION__,
      enabled: this.settings.general.enabled,
      theme: this.settings.theme.mode,
      remote: this.settings.remote.enabled,
    };
    this.runtime.syncOnlineSettings();
  }

  private notify(): void {
    for (const listener of this.listeners) listener(this.settings);
  }
}

export function sanitizeSettings(settings: SkyzHypnoSettings): SkyzHypnoSettings {
  settings.hypno.depth = clamp(settings.hypno.depth, 0, 100);
  settings.effects.intensity = clamp(settings.effects.intensity, 0, 1);
  settings.audio.masterVolume = clamp(settings.audio.masterVolume, 0, 1);
  settings.suggestions = settings.suggestions.slice(0, 100);
  settings.triggers = settings.triggers.slice(0, 200);
  settings.influence = settings.influence.slice(0, 500);
  for (const sound of settings.audio.sounds) {
    sound.volume = clamp(sound.volume, 0, 1);
    sound.playbackRate = clamp(sound.playbackRate, 0.25, 4);
    sound.pan = clamp(sound.pan, -1, 1);
    sound.echo = clamp(sound.echo, 0, 1);
    sound.reverb = clamp(sound.reverb, 0, 1);
  }
  return settings;
}

export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
