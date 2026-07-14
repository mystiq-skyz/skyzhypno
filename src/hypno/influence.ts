import type { SettingsStore } from "@/core/storage";
import type { BCRuntime } from "@/core/runtime";
import type { InfluenceEntry, SuggestionDefinition } from "@/types";
import { clamp } from "@/core/storage";
import type { HypnoEngine } from "./engine";

export type InfluenceCategory = "trigger" | "suggestion" | "deepen" | "wake";

export class InfluenceService {
  constructor(
    private readonly runtime: BCRuntime,
    private readonly store: SettingsStore,
    private readonly hypno: HypnoEngine,
  ) {}

  get(memberId: number): InfluenceEntry {
    let entry = this.store.value.influence.find((item) => item.memberId === memberId);
    if (!entry) {
      entry = {
        memberId,
        memberName: this.runtime.characterName(memberId),
        trigger: 0,
        suggestion: 0,
        deepen: 0,
        wake: 0,
        lastChangedAt: Date.now(),
      };
      this.store.update((settings) => settings.influence.push(entry!));
    }
    return entry;
  }

  value(memberId: number, category: InfluenceCategory): number {
    return this.store.value.influence.find((entry) => entry.memberId === memberId)?.[category] ?? 0;
  }

  change(memberId: number, category: InfluenceCategory, delta: number): number {
    let result = 0;
    this.store.update(() => {
      const entry = this.get(memberId);
      entry[category] = clamp(entry[category] + delta, 0, 100);
      entry.memberName = this.runtime.characterName(memberId);
      entry.lastChangedAt = Date.now();
      result = entry[category];
    });
    return result;
  }

  suggestionStrength(suggestion: SuggestionDefinition, speaker: number): number {
    const installer = this.value(suggestion.installedBy, "suggestion");
    const currentSpeaker = this.value(speaker, "suggestion");
    const depth = this.hypno.snapshot.depth;
    const depthFactor = 0.45 + depth / 100;
    const tranceBonus = this.hypno.snapshot.trance ? 1.35 : 1;
    return clamp(((installer + currentSpeaker) / 2 + suggestion.requiredDepth * 0.15) * depthFactor * tranceBonus, 0, 100);
  }

  decay(): void {
    this.store.update((settings) => {
      settings.influence = settings.influence.map((entry) => {
        const copy = { ...entry };
        for (const category of ["trigger", "suggestion", "deepen", "wake"] as const) {
          const value = copy[category];
          copy[category] = value <= 1 ? 0 : Math.max(0, value - Math.ceil(Math.log10(value)));
        }
        return copy;
      }).filter((entry) => entry.trigger + entry.suggestion + entry.deepen + entry.wake > 0);
    });
  }
}
