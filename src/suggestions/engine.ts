import type { AudioEngine } from "@/audio/engine";
import type { EventBus } from "@/core/bus";
import type { Lifecycle } from "@/core/lifecycle";
import type { PermissionService } from "@/core/permissions";
import type { BCRuntime } from "@/core/runtime";
import type { SettingsStore } from "@/core/storage";
import type { EffectsEngine } from "@/effects/engine";
import type { AppEvents } from "@/events";
import type { HypnoEngine } from "@/hypno/engine";
import type { InfluenceService } from "@/hypno/influence";
import type { ResistanceService } from "@/hypno/resistance";
import type { RestrictionEngine, RestrictionKind } from "@/hypno/restrictions";
import type { SoundCategory, SuggestionDefinition, SuggestionInstruction } from "@/types";
import { phraseMatches } from "@/hypno/triggers";
import { validateSuggestion } from "./schema";

export class SuggestionEngine {
  private executionToken = 0;

  constructor(
    private readonly runtime: BCRuntime,
    private readonly store: SettingsStore,
    private readonly hypno: HypnoEngine,
    private readonly influence: InfluenceService,
    private readonly resistance: ResistanceService,
    private readonly effects: EffectsEngine,
    private readonly audio: AudioEngine,
    private readonly restrictions: RestrictionEngine,
    private readonly permissions: PermissionService,
    private readonly bus: EventBus<AppEvents>,
    lifecycle: Lifecycle,
  ) {
    lifecycle.add(runtime.hook("ChatRoomMessage", 55, (args, next) => {
      const message = args[0] as ServerChatRoomMessage;
      if (message?.Sender && (message.Type === "Chat" || message.Type === "Whisper")) this.checkMessage(message.Content, message.Sender);
      return next(args);
    }));
    lifecycle.add(bus.on("trigger.matched", ({ trigger, sender, message }) => {
      if (!trigger.suggestionId) return;
      const suggestion = this.store.value.suggestions.find((item) => item.id === trigger.suggestionId);
      if (suggestion) void this.requestExecution(suggestion, sender, message);
    }));
    lifecycle.add(bus.on("emergency.stop", () => this.cancelAll()));
  }

  list(): readonly SuggestionDefinition[] { return this.store.value.suggestions; }

  install(value: unknown, sender: number): SuggestionDefinition {
    const suggestion = validateSuggestion(value);
    const policy = this.store.value.suggestionPolicy;
    if (!policy.enabled) throw new Error("Suggestions are disabled");
    if (suggestion.installedBy !== sender) throw new Error("Installer identity does not match sender");
    const existingSuggestion = this.store.value.suggestions.find((item) => item.id === suggestion.id);
    if (!existingSuggestion && this.store.value.suggestions.length >= policy.maxSuggestions) throw new Error("Suggestion limit reached");
    if (policy.requireTranceForInstall && !this.hypno.snapshot.trance) throw new Error("Suggestion installation requires trance");
    if (policy.requireActiveHypnotizerForInstall && this.hypno.snapshot.activeBy !== sender && sender !== this.runtime.memberNumber) throw new Error("Only the active hypnotizer may install suggestions");
    const disallowed = suggestion.instructions.find((instruction) => !policy.allowedInstructionTypes.includes(instruction.type));
    if (disallowed) throw new Error(`Instruction type is not allowed: ${disallowed.type}`);
    this.store.update((settings) => {
      const existing = settings.suggestions.find((item) => item.id === suggestion.id);
      if (existing) {
        if (existing.installedBy !== sender) throw new Error("Cannot overwrite another installer's suggestion");
        Object.assign(existing, suggestion);
      } else settings.suggestions.push(suggestion);
    }, true);
    this.influence.change(sender, "suggestion", 8);
    this.runtime.localMessage(`${this.runtime.characterName(sender)} installed suggestion “${suggestion.name}”.`);
    return suggestion;
  }

  remove(id: string, sender: number): boolean {
    const suggestion = this.store.value.suggestions.find((item) => item.id === id);
    if (!suggestion) return false;
    const own = suggestion.installedBy === sender;
    if (sender !== this.runtime.memberNumber && !own) throw new Error("Cannot remove another person's suggestion");
    if (sender === this.runtime.memberNumber && !this.store.value.suggestionPolicy.allowSelfRemoval && !own) throw new Error("Self-removal is disabled for this suggestion");
    this.store.update((settings) => { settings.suggestions = settings.suggestions.filter((item) => item.id !== id); }, true);
    return true;
  }

  async trigger(id: string, sender: number, command = ""): Promise<boolean> {
    const suggestion = this.store.value.suggestions.find((item) => item.id === id);
    if (!suggestion) return false;
    return this.requestExecution(suggestion, sender, command);
  }

  cancelAll(): void {
    this.executionToken += 1;
    this.resistance.cancel();
    this.hypno.setForcedPhrase(undefined);
  }

  private checkMessage(message: string, sender: number): void {
    if (!message || message.trim().startsWith("(")) return;
    for (const suggestion of this.store.value.suggestions) {
      if (!suggestion.enabled || !phraseMatches(message, suggestion.trigger)) continue;
      if (suggestion.exclusive && suggestion.installedBy !== sender) continue;
      const command = message.slice(message.toLocaleLowerCase().indexOf(suggestion.trigger.toLocaleLowerCase()) + suggestion.trigger.length).trim();
      void this.requestExecution(suggestion, sender, command);
      break;
    }
  }

  private async requestExecution(suggestion: SuggestionDefinition, sender: number, command: string): Promise<boolean> {
    const now = Date.now();
    if (!this.store.value.suggestionPolicy.enabled || !suggestion.enabled) return false;
    if (suggestion.expiresAt && suggestion.expiresAt < now) return false;
    if (suggestion.maxUses > 0 && suggestion.uses >= suggestion.maxUses) return false;
    if (suggestion.lastUsedAt + suggestion.cooldownMs > now) return false;
    if (this.hypno.snapshot.depth < suggestion.requiredDepth) return false;
    if (suggestion.exclusive && suggestion.installedBy !== sender) return false;
    if (sender !== this.runtime.memberNumber) {
      const state = this.hypno.snapshot;
      const canTrigger = this.permissions.can({ sender, capability: "trigger", activeBy: state.activeBy, depth: state.depth, trance: state.trance });
      if (!canTrigger) return false;
    }
    this.bus.emit("suggestion.request", { suggestion, sender, command });
    const strength = this.influence.suggestionStrength(suggestion, sender);
    await this.audio.playCategory("suggestion");
    const accepted = await this.resistance.request(suggestion, sender, strength);
    if (!accepted) {
      this.influence.change(sender, "suggestion", -3);
      if (suggestion.installedBy !== sender) this.influence.change(suggestion.installedBy, "suggestion", -2);
      this.runtime.localMessage(`Successfully resisted “${suggestion.name}”.`);
      return false;
    }
    const token = ++this.executionToken;
    await this.executeInstructions(suggestion.instructions, { suggestion, sender, command, token });
    if (token !== this.executionToken) return false;
    this.store.update(() => { suggestion.uses += 1; suggestion.lastUsedAt = Date.now(); });
    this.influence.change(sender, "suggestion", 2);
    if (suggestion.installedBy !== sender) this.influence.change(suggestion.installedBy, "suggestion", 1);
    this.bus.emit("suggestion.executed", { suggestion, sender });
    return true;
  }

  private async executeInstructions(instructions: SuggestionInstruction[], context: ExecutionContext): Promise<void> {
    for (const instruction of instructions) {
      if (context.token !== this.executionToken) return;
      if (!this.store.value.suggestionPolicy.allowedInstructionTypes.includes(instruction.type)) continue;
      await this.executeInstruction(instruction, context);
    }
  }

  private async executeInstruction(instruction: SuggestionInstruction, context: ExecutionContext): Promise<void> {
    const config = instruction.config;
    switch (instruction.type) {
      case "effect": {
        const presetId = stringValue(config.presetId);
        if (presetId) await this.effects.playPreset(presetId, numberValue(config.durationMs), false);
        else this.effects.preview((config.effects ?? {}) as any, numberValue(config.durationMs) ?? 8000);
        break;
      }
      case "sound": {
        const category = stringValue(config.category) as SoundCategory | undefined;
        if (category) await this.audio.playCategory(category, { loop: booleanValue(config.loop) });
        break;
      }
      case "depth": this.hypno.addDepth(numberValue(config.delta) ?? 0, `suggestion:${context.suggestion.name}`, context.sender); break;
      case "trance": this.hypno.enterTrance(context.sender, `suggestion:${context.suggestion.name}`); break;
      case "wake": this.hypno.wake(`suggestion:${context.suggestion.name}`, context.sender); break;
      case "message": {
        const text = template(stringValue(config.text) ?? context.command, context);
        if (text) booleanValue(config.public) ? this.runtime.sendAction(text) : this.runtime.localMessage(text);
        break;
      }
      case "expression": this.applyExpression(config); break;
      case "pose": this.applyPose(config); break;
      case "activity": this.applyActivity(config, context); break;
      case "follow": {
        const target = numberValue(config.memberId) ?? context.sender;
        this.hypno.setFocus(target);
        const duration = numberValue(config.durationMs);
        if (duration) window.setTimeout(() => { if (this.hypno.snapshot.focusMemberId === target) this.hypno.setFocus(undefined); }, duration);
        this.runtime.sendAction(`${this.runtime.playerName}'s attention locks completely onto ${this.runtime.characterName(target)}.`);
        break;
      }
      case "say": {
        const phrase = template(stringValue(config.text) ?? context.command, context);
        if (phrase && !/^[*!/.]/.test(phrase) && !phrase.includes("(")) this.hypno.setForcedPhrase(phrase);
        break;
      }
      case "strip": this.applyStrip(config); break;
      case "restriction": {
        const kind = stringValue(config.kind) as RestrictionKind | undefined;
        if (kind) this.restrictions.add(kind, numberValue(config.durationMs), context.sender);
        break;
      }
      case "wait": await delay(Math.min(60_000, Math.max(0, numberValue(config.durationMs) ?? 1000))); break;
      case "random": {
        const options = Array.isArray(config.options) ? config.options as SuggestionInstruction[] : [];
        if (options.length) await this.executeInstruction(options[Math.floor(Math.random() * options.length)]!, context);
        break;
      }
      case "condition": {
        const passes = this.evaluateCondition(config);
        const branch = passes ? config.then : config.else;
        if (Array.isArray(branch)) await this.executeInstructions(branch as SuggestionInstruction[], context);
        break;
      }
      case "memory": this.effects.fragment(template(stringValue(config.text) ?? "The words linger in your thoughts...", context)); break;
      case "aftereffect": {
        const duration = numberValue(config.durationMs) ?? 30_000;
        this.effects.preview((config.effects ?? { dreamMode: true, vignette: true, intensity: 0.25 }) as any, duration);
        break;
      }
      case "status": {
        const text = template(stringValue(config.text) ?? `${context.suggestion.name} is active.`, context);
        booleanValue(config.public) ? this.runtime.sendAction(text) : this.runtime.localMessage(text);
        break;
      }
      case "command": {
        const mode = stringValue(config.mode) ?? "say";
        const text = template(stringValue(config.text) ?? context.command, context);
        if (!text) break;
        if (mode === "say") {
          if (!/^[*!/.]/.test(text) && !text.includes("(")) this.hypno.setForcedPhrase(text);
        } else if (mode === "action") {
          booleanValue(config.public) ? this.runtime.sendAction(text) : this.runtime.localMessage(text);
        } else if (mode === "memory") {
          this.effects.fragment(text);
        }
        break;
      }
    }
  }

  private applyExpression(config: Record<string, unknown>): void {
    if (typeof CharacterSetFacialExpression !== "function") return;
    const group = stringValue(config.group) ?? "Eyes";
    const expression = stringValue(config.expression) ?? "Dazed";
    const duration = numberValue(config.durationMs) ?? 0;
    try { CharacterSetFacialExpression(Player, group, expression, duration); CharacterRefresh(Player, false); }
    catch (error) { this.runtime.recordError("suggestion expression", error); }
  }

  private applyPose(config: Record<string, unknown>): void {
    if (typeof PoseSetActive !== "function") return;
    const pose = config.pose;
    try { PoseSetActive(Player, pose ?? null); ChatRoomCharacterUpdate(Player); CharacterLoadCanvas(Player); }
    catch (error) { this.runtime.recordError("suggestion pose", error); }
  }

  private applyActivity(config: Record<string, unknown>, context: ExecutionContext): void {
    try {
      const activityRun = this.runtime.get<(...args: any[]) => unknown>("ActivityRun");
      const activityAllowedForGroup = this.runtime.get<(...args: any[]) => any[]>("ActivityAllowedForGroup");
      const getActivities = this.runtime.get<(group: any) => any[]>("getActivities");
      const assetGroups = this.runtime.get<any[]>("AssetGroup") ?? [];
      const groupName = stringValue(config.group);
      const activityName = stringValue(config.name);
      const targetId = numberValue(config.targetMemberId) ?? context.sender;
      const target = this.runtime.character(targetId);
      const group = assetGroups.find((item) => item.Name === groupName);
      const activity = group && getActivities?.(group).find((item) => item.Name === activityName);
      const allowed = target && group && activity && activityAllowedForGroup?.(target, group.Name).some((item) => !item.Blocked && item.Activity?.Name === activity.Name);
      if (allowed && activityRun) activityRun(Player, target, group, { Activity: activity, Group: group.Name }, true);
      else this.runtime.localMessage("The requested activity could not be performed.", "warn");
    } catch (error) { this.runtime.recordError("suggestion activity", error); }
  }

  private applyStrip(config: Record<string, unknown>): void {
    if (!Player.CanChangeOwnClothes?.()) { this.runtime.localMessage("Current permissions prevent clothing changes.", "warn"); return; }
    const groups = Array.isArray(config.groups) ? config.groups.filter((item): item is string => typeof item === "string").slice(0, 30) : [];
    try { for (const group of groups) InventoryRemove(Player, group, false); ChatRoomCharacterUpdate(Player); CharacterLoadCanvas(Player); }
    catch (error) { this.runtime.recordError("suggestion strip", error); }
  }

  private evaluateCondition(config: Record<string, unknown>): boolean {
    const kind = stringValue(config.kind) ?? "depth";
    const value = numberValue(config.value) ?? 0;
    if (kind === "depth") return this.hypno.snapshot.depth >= value;
    if (kind === "trance") return this.hypno.snapshot.trance === booleanValue(config.expected, true);
    if (kind === "random") return Math.random() * 100 < value;
    if (kind === "activeHypnotizer") return this.hypno.snapshot.activeBy === value;
    return false;
  }
}

interface ExecutionContext { suggestion: SuggestionDefinition; sender: number; command: string; token: number }
const stringValue = (value: unknown): string | undefined => typeof value === "string" ? value.slice(0, 1000) : undefined;
const numberValue = (value: unknown): number | undefined => typeof value === "number" && Number.isFinite(value) ? value : undefined;
const booleanValue = (value: unknown, fallback = false): boolean => typeof value === "boolean" ? value : fallback;
const delay = (milliseconds: number) => new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
function template(text: string, context: ExecutionContext): string {
  return text.replaceAll("%PLAYER%", typeof CharacterNickname === "function" ? CharacterNickname(Player) : "Player")
    .replaceAll("%SENDER%", String(context.sender))
    .replaceAll("%COMMAND%", context.command)
    .slice(0, 1000);
}
