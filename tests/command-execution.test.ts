import { describe, expect, it, vi } from "vitest";
import { EventBus } from "@/core/bus";
import { Lifecycle } from "@/core/lifecycle";
import { createDefaultSettings } from "@/defaults";
import { SuggestionEngine } from "@/suggestions/engine";
import type { AppEvents } from "@/events";
import type { SuggestionDefinition } from "@/types";

describe("implanted commands", () => {
  it("executes an accepted command as a forced phrase", async () => {
    const forcedPhrase = vi.fn();
    const settings = createDefaultSettings();
    const suggestion: SuggestionDefinition = {
      id: "command-suggestion", name: "Command", description: "", trigger: "obey",
      installedBy: 123, installedByName: "Sky", installedAt: Date.now(), exclusive: false,
      enabled: true, requiredDepth: 1, cooldownMs: 0, maxUses: 0, uses: 0, lastUsedAt: 0,
      instructions: [{ id: "command-step", type: "command", config: { mode: "say", text: "Yes, I understand." } }],
    };
    settings.suggestions.push(suggestion);

    const runtime: any = {
      memberNumber: 123, playerName: "Sky", hook: () => () => undefined,
      localMessage: vi.fn(), characterName: () => "Sky", sendAction: vi.fn(), recordError: vi.fn(),
    };
    const store: any = {
      value: settings,
      update: (mutator: (value: typeof settings) => void) => mutator(settings),
    };
    const hypno: any = {
      snapshot: { depth: 50, trance: true, activeBy: 123 },
      setForcedPhrase: forcedPhrase, addDepth: vi.fn(), enterTrance: vi.fn(), wake: vi.fn(), setFocus: vi.fn(),
    };
    const influence: any = { suggestionStrength: () => 50, change: vi.fn() };
    const resistance: any = { request: async () => true, cancel: vi.fn() };
    const effects: any = { playPreset: vi.fn(), preview: vi.fn(), fragment: vi.fn() };
    const audio: any = { playCategory: async () => undefined };
    const restrictions: any = { add: vi.fn() };
    const permissions: any = { can: () => true };
    const bus = new EventBus<AppEvents>();
    const lifecycle = new Lifecycle();
    const engine = new SuggestionEngine(runtime, store, hypno, influence, resistance, effects, audio, restrictions, permissions, bus, lifecycle);

    await expect(engine.trigger(suggestion.id, 123)).resolves.toBe(true);
    expect(forcedPhrase).toHaveBeenCalledWith("Yes, I understand.");
    expect(suggestion.uses).toBe(1);
    lifecycle.stop();
  });
});
