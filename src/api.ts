import type { BCRuntime } from "@/core/runtime";
import type { SettingsStore } from "@/core/storage";
import type { EffectsEngine } from "@/effects/engine";
import type { HypnoEngine } from "@/hypno/engine";
import type { TriggerEngine } from "@/hypno/triggers";
import type { SuggestionEngine } from "@/suggestions/engine";
import type { SessionDirector } from "@/sessions/director";
import type { PreferencesUI } from "@/ui/preferences";
import type { HypnoRuntimeState, SkyzHypnoSettings, SuggestionDefinition, TriggerSource } from "@/types";

export interface SkyzHypnoPublicApi {
  readonly version: string;
  readonly state: HypnoRuntimeState;
  getSettings(): SkyzHypnoSettings;
  open(tab?: string): void;
  setDepth(value: number, reason?: string): number;
  addDepth(delta: number, reason?: string, source?: number): number;
  trance(source?: number): void;
  wake(reason?: string, source?: number): void;
  testTrigger(text: string, sender?: number, source?: TriggerSource): string[];
  playPreset(id: string, durationMs?: number): Promise<void>;
  installSuggestion(suggestion: SuggestionDefinition): SuggestionDefinition;
  runSuggestion(id: string, command?: string): Promise<boolean>;
  startSession(id: string): void;
  stopSession(reason?: string): void;
  emergencyStop(reason?: string): void;
  exportSettings(): string;
  importSettings(value: string): void;
  diagnostics(): unknown;
  unload(): void;
}

export class PublicApi implements SkyzHypnoPublicApi {
  readonly version = __SH_VERSION__;

  constructor(
    private readonly runtime: BCRuntime,
    private readonly store: SettingsStore,
    private readonly hypno: HypnoEngine,
    private readonly triggers: TriggerEngine,
    private readonly effects: EffectsEngine,
    private readonly suggestions: SuggestionEngine,
    private readonly sessions: SessionDirector,
    private readonly ui: PreferencesUI,
    private readonly onEmergency: (reason: string) => void,
    private readonly onUnload: () => void,
  ) {}

  get state() { return this.hypno.snapshot; }
  getSettings(): SkyzHypnoSettings { return structuredClone(this.store.value); }
  open(tab?: string): void { this.ui.open(tab as any); }
  setDepth(value: number, reason = "API"): number { return this.hypno.setDepth(value, reason); }
  addDepth(delta: number, reason = "API", source?: number): number { return this.hypno.addDepth(delta, reason, source); }
  trance(source?: number): void { this.hypno.enterTrance(source, "API"); }
  wake(reason = "API", source?: number): void { this.hypno.wake(reason, source); }
  testTrigger(text: string, sender = this.runtime.memberNumber, source: TriggerSource = "api"): string[] { return this.triggers.test(text, sender, source).map((trigger) => trigger.id); }
  playPreset(id: string, durationMs?: number): Promise<void> { return this.effects.playPreset(id, durationMs); }
  installSuggestion(suggestion: SuggestionDefinition): SuggestionDefinition { return this.suggestions.install(suggestion, this.runtime.memberNumber); }
  runSuggestion(id: string, command = ""): Promise<boolean> { return this.suggestions.trigger(id, this.runtime.memberNumber, command); }
  startSession(id: string): void { this.sessions.start(id); }
  stopSession(reason = "API"): void { this.sessions.stop(reason, true); }
  emergencyStop(reason = "API emergency stop"): void { this.onEmergency(reason); }
  exportSettings(): string { return this.store.export(); }
  importSettings(value: string): void { this.store.import(value); }
  diagnostics(): unknown { return { ...this.runtime.diagnostics, audit: this.runtime.getAudit() }; }
  unload(): void { this.onUnload(); }
}
