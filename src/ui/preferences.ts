import type { AudioEngine } from "@/audio/engine";
import type { EventBus } from "@/core/bus";
import type { Lifecycle } from "@/core/lifecycle";
import type { BCRuntime } from "@/core/runtime";
import type { SettingsStore } from "@/core/storage";
import type { EffectsEngine } from "@/effects/engine";
import type { AppEvents } from "@/events";
import type { HypnoEngine } from "@/hypno/engine";
import type { NetworkManager } from "@/network/manager";
import type { SessionDirector } from "@/sessions/director";
import type { SuggestionEngine } from "@/suggestions/engine";
import type { RemoteCapability, RestrictionMode, SessionPreset, SoundCategory, SuggestionDefinition, SuggestionInstructionType, TriggerKind, TriggerSource } from "@/types";
import { instructionTypes } from "@/suggestions/schema";

const tabs = ["overview", "hypnosis", "triggers", "suggestions", "effects", "sounds", "restrictions", "resistance", "remote", "presets", "sessions", "safety", "diagnostics"] as const;
type Tab = typeof tabs[number];

export class PreferencesUI {
  private root?: HTMLDivElement;
  private tab: Tab = "overview";
  private selectedSuggestionId?: string;
  private remoteMember?: number;
  private extensionRegistered = false;
  private extensionContext = false;

  constructor(
    private readonly runtime: BCRuntime,
    private readonly store: SettingsStore,
    private readonly hypno: HypnoEngine,
    private readonly effects: EffectsEngine,
    private readonly audio: AudioEngine,
    private readonly suggestions: SuggestionEngine,
    private readonly network: NetworkManager,
    private readonly sessions: SessionDirector,
    private readonly bus: EventBus<AppEvents>,
    lifecycle: Lifecycle,
  ) {
    lifecycle.add(bus.on("settings.open", ({ tab }) => this.open((tab as Tab) ?? "overview")));
    lifecycle.add(store.subscribe(() => { if (this.root) this.render(); }));
    lifecycle.add(runtime.hook("InformationSheetRun", 5, (args, next) => { const result = next(args); this.drawRemoteEntry(); return result; }));
    lifecycle.add(runtime.hook("InformationSheetClick", 5, (args, next) => { if (typeof MouseIn === "function" && MouseIn(1540, 790, 410, 80)) { const target = this.currentCharacter(); if (target?.MemberNumber && target.MemberNumber !== this.runtime.memberNumber) this.openRemote(target.MemberNumber); return; } return next(args); }));
    lifecycle.interval(() => this.registerExtensionSetting(), 500);
    this.registerExtensionSetting();
    lifecycle.add(() => this.close(false));
  }

  open(tab: Tab = "overview"): void {
    this.tab = tabs.includes(tab) ? tab : "overview";
    this.remoteMember = undefined;
    this.mount();
    this.render();
  }

  openRemote(member: number): void {
    this.remoteMember = member;
    this.tab = "remote";
    this.mount();
    this.render();
  }

  close(returnToExtensions = true): void {
    this.root?.remove();
    this.root = undefined;
    if (returnToExtensions && this.extensionContext) {
      this.extensionContext = false;
      try { PreferenceSubscreenExtensionsClear?.(); } catch { /* BC version without clear helper */ }
    }
  }

  private mount(): void {
    if (this.root) return;
    const root = document.createElement("div");
    root.id = "sh-preferences";
    root.innerHTML = `<style>${UI_CSS}</style><div class="sh-shell"><aside></aside><main><header></header><section></section></main></div>`;
    root.addEventListener("click", (event) => this.onClick(event));
    root.addEventListener("change", (event) => this.onChange(event));
    root.addEventListener("input", (event) => this.onInput(event));
    document.body.appendChild(root);
    this.root = root;
    void this.audio.unlock();
  }

  private render(): void {
    if (!this.root) return;
    const aside = this.root.querySelector("aside")!;
    const header = this.root.querySelector("header")!;
    const section = this.root.querySelector("section")!;
    aside.innerHTML = `<div class="brand"><b>SH</b><span>SkyzHypno<small>v${__SH_VERSION__}</small></span></div><nav>${tabs.map((tab) => `<button data-tab="${tab}" class="${this.tab === tab ? "active" : ""}">${label(tab)}</button>`).join("")}</nav><button class="danger" data-action="emergency">Emergency Stop</button>`;
    header.innerHTML = `<div><h1>${this.remoteMember ? `Remote · ${escapeHtml(this.runtime.characterName(this.remoteMember))}` : label(this.tab)}</h1><p>${description(this.tab)}</p></div><button data-action="close">×</button>`;
    section.innerHTML = this.remoteMember ? this.renderRemoteTarget(this.remoteMember) : this.renderTab();
  }

  private renderTab(): string {
    switch (this.tab) {
      case "overview": return this.renderOverview();
      case "hypnosis": return this.renderHypnosis();
      case "triggers": return this.renderTriggers();
      case "suggestions": return this.renderSuggestions();
      case "effects": return this.renderEffects();
      case "sounds": return this.renderSounds();
      case "restrictions": return this.renderRestrictions();
      case "resistance": return this.renderResistance();
      case "remote": return this.renderRemoteSettings();
      case "presets": return this.renderPresets();
      case "sessions": return this.renderSessions();
      case "safety": return this.renderSafety();
      case "diagnostics": return this.renderDiagnostics();
    }
  }

  private renderOverview(): string {
    const state = this.hypno.snapshot;
    return `<div class="hero"><div><span class="pill">${state.stage}</span><h2>${Math.round(state.depth)}% depth</h2><p>${state.trance ? `Trance active${state.activeByName ? ` · ${escapeHtml(state.activeByName)}` : ""}` : "Awake and responsive"}</p></div><div class="orb" style="--depth:${state.depth}"></div></div>
      <div class="grid three">${card("Effects", `${this.store.value.effects.enabled ? "Enabled" : "Disabled"} · ${Math.round(this.store.value.effects.intensity * 100)}%`, "effects")}${card("Suggestions", `${this.store.value.suggestions.length} installed`, "suggestions")}${card("Remote", this.store.value.remote.enabled ? "Enabled" : "Disabled", "remote")}</div>
      <div class="panel"><h3>Quick controls</h3>${this.store.value.extreme.enabled && this.store.value.extreme.lockQuickControls ? `<p class="notice">Locked by Extreme Mode. The local emergency hotkey and BC safeword remain available.</p>` : `<div class="actions"><button data-action="depth" data-value="10">+10 depth</button><button data-action="depth" data-value="-10">−10 depth</button><button data-action="trance">Enter trance</button><button data-action="wake">Wake</button><button data-action="preview" data-value="preset-deep-trance">Preview Deep Trance</button></div>`}</div>
      <div class="panel"><h3>Compatibility</h3>${this.runtime.diagnostics.conflicts.length ? `<ul>${this.runtime.diagnostics.conflicts.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<p>No known conflicts detected.</p>`}</div>`;
  }

  private renderHypnosis(): string {
    const s = this.store.value;
    return `<div class="grid two">
      ${control("Enable hypnosis", checkbox("hypno.enabled", s.hypno.enabled), "Master switch for depth and trance logic.")}
      ${control("Current depth", range("hypno.depth", s.hypno.depth, 0, 100, 1), `${Math.round(s.hypno.depth)}%`)}
      ${control("Decay per minute", numberInput("hypno.decayPerMinute", s.hypno.decayPerMinute, 0, 20, .1), "How quickly depth fades while awake.")}
      ${control("Decay delay", numberInput("hypno.decayDelaySeconds", s.hypno.decayDelaySeconds, 0, 600, 1), "Seconds before decay begins.")}
      ${control("Automatic wake", numberInput("hypno.autoWakeMinutes", s.hypno.autoWakeMinutes, 0, 1440, 1), "0 keeps trance active until a wake action.")}
      ${control("Aftereffects", numberInput("hypno.aftereffectsMinutes", s.hypno.aftereffectsMinutes, 0, 120, 1), "Minutes of gentle residual effects.")}
      ${control("Enter trance at", numberInput("hypno.enterTranceAt", s.hypno.enterTranceAt, 1, 100, 1), "Depth threshold for trance.")}
      ${control("Lucid trance", checkbox("hypno.lucidTrance", s.hypno.lucidTrance), "Keep interaction restrictions disabled while visuals remain active.")}
      ${control("Public status", checkbox("hypno.showPublicStatus", s.hypno.showPublicStatus), "Share a quantized status with other SH clients.")}
      ${control("Character status indicator", checkbox("general.showHud", s.general.showHud), "Show a compact vertical SH depth bar to the right of your character only while affected.")}
    </div>`;
  }

  private renderTriggers(): string {
    return `<div class="toolbar"><button data-action="trigger-add">+ Add trigger</button></div><div class="stack">${this.store.value.triggers.map((trigger, index) => `<article class="panel block"><div class="row"><b>${escapeHtml(trigger.name)}</b><button class="icon" data-action="trigger-delete" data-index="${index}">Delete</button></div><div class="grid three">
      ${smallField("Name", `<input data-trigger="name" data-index="${index}" value="${attr(trigger.name)}">`)}
      ${smallField("Phrase", `<input data-trigger="phrase" data-index="${index}" value="${attr(trigger.phrase)}">`)}
      ${smallField("Kind", `<select data-trigger="kind" data-index="${index}">${["trigger","deepen","wake","speechBlock","speechAllow","suggestion","combo"].map((kind) => `<option ${kind === trigger.kind ? "selected" : ""}>${kind}</option>`).join("")}</select>`)}
      ${smallField("Sources", `<input data-trigger="source" data-index="${index}" value="${attr(trigger.source.join(","))}" placeholder="chat,whisper,voice,activity,item,api,remote">`)}
      ${smallField("Minimum depth", `<input type="number" min="0" max="100" data-trigger="minDepth" data-index="${index}" value="${trigger.minDepth}">`)}
      ${smallField("Maximum depth", `<input type="number" min="0" max="100" data-trigger="maxDepth" data-index="${index}" value="${trigger.maxDepth}">`)}
      ${smallField("Depth delta", `<input type="number" min="-100" max="100" data-trigger="depthDelta" data-index="${index}" value="${trigger.depthDelta}">`)}
      ${smallField("Delay ms", `<input type="number" min="0" max="600000" data-trigger="delayMs" data-index="${index}" value="${trigger.delayMs}">`)}
      ${smallField("Cooldown ms", `<input type="number" min="0" max="86400000" data-trigger="cooldownMs" data-index="${index}" value="${trigger.cooldownMs}">`)}
      ${smallField("Required repeats", `<input type="number" min="1" max="20" data-trigger="requiredRepeats" data-index="${index}" value="${trigger.requiredRepeats}">`)}
      ${smallField("Repeat/combo window ms", `<input type="number" min="100" max="600000" data-trigger="repeatWindowMs" data-index="${index}" value="${trigger.repeatWindowMs}">`)}
      ${smallField("Combo phrases", `<input data-trigger="comboPhrases" data-index="${index}" value="${attr(trigger.comboPhrases.join(" | "))}" placeholder="phrase one | phrase two">`)}
      ${smallField("Allowed member IDs", `<input data-trigger="allowedMemberIds" data-index="${index}" value="${trigger.allowedMemberIds.join(",")}">`)}
      ${smallField("Expires at (timestamp)", `<input type="number" min="0" data-trigger="expiresAt" data-index="${index}" value="${trigger.expiresAt ?? ""}">`)}
      ${smallField("Effect preset", `<select data-trigger="effectPresetId" data-index="${index}"><option value="">None</option>${this.store.value.presets.map((preset) => `<option value="${attr(preset.id)}" ${preset.id === trigger.effectPresetId ? "selected" : ""}>${escapeHtml(preset.name)}</option>`).join("")}</select>`)}
      ${smallField("Linked suggestion", `<select data-trigger="suggestionId" data-index="${index}"><option value="">None</option>${this.store.value.suggestions.map((suggestion) => `<option value="${attr(suggestion.id)}" ${suggestion.id === trigger.suggestionId ? "selected" : ""}>${escapeHtml(suggestion.name)}</option>`).join("")}</select>`)}
      ${smallField("Require name mention", `<input type="checkbox" data-trigger="requireNameMention" data-index="${index}" ${trigger.requireNameMention ? "checked" : ""}>`)}
      ${smallField("One-shot", `<input type="checkbox" data-trigger="oneShot" data-index="${index}" ${trigger.oneShot ? "checked" : ""}>`)}
      ${smallField("Enabled", `<input type="checkbox" data-trigger="enabled" data-index="${index}" ${trigger.enabled ? "checked" : ""}>`)}
    </div></article>`).join("")}</div>`;
  }

  private renderSuggestions(): string {
    const list = this.store.value.suggestions;
    if (!this.selectedSuggestionId && list[0]) this.selectedSuggestionId = list[0].id;
    const selected = list.find((item) => item.id === this.selectedSuggestionId);
    return `<div class="split"><div class="panel list"><button data-action="suggestion-add">+ New suggestion</button><button data-action="command-add">+ New implanted command</button>${list.map((item) => `<button data-action="suggestion-select" data-value="${attr(item.id)}" class="${item.id === selected?.id ? "active" : ""}"><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.trigger)}</small></button>`).join("") || `<p>No suggestions installed.</p>`}</div><div>${selected ? this.renderSuggestionEditor(selected) : `<div class="panel"><h3>Create your first suggestion</h3><p>Suggestions combine trigger phrases, effects, sounds, conditions and BC actions.</p></div>`}</div></div>`;
  }

  private renderSuggestionEditor(suggestion: SuggestionDefinition): string {
    return `<article class="panel"><div class="row"><h3>${escapeHtml(suggestion.name)}</h3><button class="danger" data-action="suggestion-delete" data-value="${attr(suggestion.id)}">Delete</button></div><div class="grid two">
      ${smallField("Name", `<input data-suggestion="name" value="${attr(suggestion.name)}">`)}
      ${smallField("Trigger", `<input data-suggestion="trigger" value="${attr(suggestion.trigger)}">`)}
      ${smallField("Description", `<textarea data-suggestion="description">${escapeHtml(suggestion.description)}</textarea>`)}
      ${smallField("Required depth", `<input type="number" min="0" max="100" data-suggestion="requiredDepth" value="${suggestion.requiredDepth}">`)}
      ${smallField("Cooldown ms", `<input type="number" min="0" data-suggestion="cooldownMs" value="${suggestion.cooldownMs}">`)}
      ${smallField("Maximum uses", `<input type="number" min="0" max="100000" data-suggestion="maxUses" value="${suggestion.maxUses}">`)}
      ${smallField("Expires at (timestamp)", `<input type="number" min="0" data-suggestion="expiresAt" value="${suggestion.expiresAt ?? ""}">`)}
      ${smallField("Exclusive installer trigger", `<input type="checkbox" data-suggestion="exclusive" ${suggestion.exclusive ? "checked" : ""}>`)}
      ${smallField("Enabled", `<input type="checkbox" data-suggestion="enabled" ${suggestion.enabled ? "checked" : ""}>`)}
    </div><h3>Instruction flow</h3><div class="flow">${suggestion.instructions.map((instruction, index) => `<div class="instruction"><span>${index + 1}</span><select data-instruction="type" data-index="${index}">${instructionTypes.map((type) => `<option ${instruction.type === type ? "selected" : ""}>${type}</option>`).join("")}</select><textarea data-instruction="config" data-index="${index}">${escapeHtml(JSON.stringify(instruction.config, null, 2))}</textarea><div><button data-action="instruction-up" data-index="${index}">↑</button><button data-action="instruction-down" data-index="${index}">↓</button><button data-action="instruction-delete" data-index="${index}">×</button></div></div>`).join("")}</div><button data-action="instruction-add">+ Add instruction</button><button data-action="suggestion-test" data-value="${attr(suggestion.id)}">Test locally</button></article>`;
  }

  private renderEffects(): string {
    const e = this.store.value.effects, t = this.store.value.theme;
    const toggles = ["spiral","vignette","blur","tint","waves","particles","chromatic","doubleVision","trails","glitch","tunnelVision","focusLock","roomAura","dreamMode","memoryFragments","chatEcho","chatDistort","fadeOthers","eyeGlow","characterAura","audioReactive"] as const;
    return `<div class="grid two">${control("Effects enabled", checkbox("effects.enabled", e.enabled), "Master switch for the visual compositor.")}${control("Theme", `<select data-setting="theme.mode">${["pinky","dark","hybrid","custom"].map((mode) => `<option ${t.mode === mode ? "selected" : ""}>${mode}</option>`).join("")}</select>`, "Pinky glow, dark creepy or a hybrid theme.")}${control("Intensity", range("effects.intensity", e.intensity, 0, 1, .01), `${Math.round(e.intensity * 100)}%`)}${control("Glow", range("theme.glow", t.glow, 0, 1, .01), `${Math.round(t.glow * 100)}%`)}${control("Darkness", range("theme.darkness", t.darkness, 0, 1, .01), `${Math.round(t.darkness * 100)}%`)}${control("Performance", `<select data-setting="effects.performance">${["low","balanced","high"].map((mode) => `<option ${e.performance === mode ? "selected" : ""}>${mode}</option>`).join("")}</select>`, "Controls particle count and expensive effects.")}${control("Spiral style", `<select data-setting="effects.spiralStyle">${["classic","double","tunnel","fracture","rings"].map((mode) => `<option ${e.spiralStyle === mode ? "selected" : ""}>${mode}</option>`).join("")}</select>`, "Visual geometry of the main spiral.")}${control("Spiral speed", range("effects.spiralSpeed", e.spiralSpeed, 0, 3, .05), `${e.spiralSpeed.toFixed(2)}×`)}${control("Reverse spiral", checkbox("effects.reverseSpiral", e.reverseSpiral), "Reverse the main rotation direction.")}</div>
      <div class="panel"><h3>Effect composer</h3><div class="chips">${toggles.map((key) => `<label><input type="checkbox" data-setting="effects.${key}" ${e[key] ? "checked" : ""}>${key}</label>`).join("")}</div><div class="colors">${["primary","secondary","accent","background"].map((key) => `<label>${key}<input type="color" data-setting="theme.${key}" value="${(t as any)[key]}"></label>`).join("")}</div><div class="actions"><button data-action="preview" data-value="preset-soft-induction">Soft</button><button data-action="preview" data-value="preset-deep-trance">Deep</button><button data-action="preview" data-value="preset-dream">Dream</button><button data-action="preview" data-value="preset-glitch">Glitch</button><button data-action="preset-save-current">Save current as preset</button></div></div>`;
  }

  private renderSounds(): string {
    const audio = this.store.value.audio;
    return `<div class="grid two">${control("Audio enabled", checkbox("audio.enabled", audio.enabled), "Master switch for built-in and URL sounds.")}${control("Master volume", range("audio.masterVolume", audio.masterVolume, 0, 1, .01), `${Math.round(audio.masterVolume * 100)}%`)}${control("Mute on emergency", checkbox("audio.muteOnEmergency", audio.muteOnEmergency), "Immediately mutes and stops audio during emergency stop.")}${control("Duck game audio", checkbox("audio.duckGameAudio", audio.duckGameAudio), "Reserved for compatible game-audio mixers.")}</div><div class="toolbar"><button data-action="sound-add">+ Add URL sound</button><button data-action="audio-stop">Stop all</button><button data-action="audio-mute">${this.audio.isMuted ? "Unmute" : "Mute"}</button></div><div class="stack">${audio.sounds.map((sound, index) => `<article class="panel block"><div class="row"><b>${escapeHtml(sound.name)}</b><div><button data-action="sound-play" data-index="${index}">Play</button><button data-action="sound-delete" data-index="${index}" ${sound.builtIn ? "disabled" : ""}>Delete</button></div></div><div class="grid three">${smallField("Name", `<input data-sound="name" data-index="${index}" value="${attr(sound.name)}">`)}${smallField("Category", `<select data-sound="category" data-index="${index}">${soundCategories.map((category) => `<option ${sound.category === category ? "selected" : ""}>${category}</option>`).join("")}</select>`)}${smallField("URL", `<input data-sound="url" data-index="${index}" value="${attr(sound.url)}" ${sound.builtIn ? "readonly" : ""}>`)}${smallField("Volume", `<input type="range" min="0" max="1" step=".01" data-sound="volume" data-index="${index}" value="${sound.volume}">`)}${smallField("Playback rate", `<input type="number" min=".25" max="4" step=".05" data-sound="playbackRate" data-index="${index}" value="${sound.playbackRate}">`)}${smallField("Stereo pan", `<input type="number" min="-1" max="1" step=".05" data-sound="pan" data-index="${index}" value="${sound.pan}">`)}${smallField("Reverb", `<input type="number" min="0" max="1" step=".05" data-sound="reverb" data-index="${index}" value="${sound.reverb}">`)}${smallField("Echo", `<input type="number" min="0" max="1" step=".05" data-sound="echo" data-index="${index}" value="${sound.echo}">`)}${smallField("Loop", `<input type="checkbox" data-sound="loop" data-index="${index}" ${sound.loop ? "checked" : ""}>`)}${smallField("Enabled", `<input type="checkbox" data-sound="enabled" data-index="${index}" ${sound.enabled ? "checked" : ""}>`)}</div></article>`).join("")}</div>`;
  }

  private renderRestrictions(): string {
    const r = this.store.value.restrictions;
    const keys = ["speech","walk","pose","wardrobe","interact","hearing","sight","names","menus"] as const;
    return `<div class="grid two">${keys.map((key) => control(key, `<select data-setting="restrictions.${key}">${["off","trance","suggestion","both","depth"].map((mode) => `<option ${r[key] === mode ? "selected" : ""}>${mode}</option>`).join("")}</select>`, "Choose whether this applies in trance, through suggestions, both, or above the threshold.")).join("")}${control("Depth threshold", numberInput("restrictions.threshold", r.threshold, 0, 100, 1), "Used by depth-based restrictions.")}${control("Replacement responses", `<textarea data-setting="restrictions.replacementResponses" data-array>${escapeHtml(r.replacementResponses.join("\n"))}</textarea>`, "One response per line.")}${control("Always-allowed prefixes", `<textarea data-setting="restrictions.allowedPhrases" data-array>${escapeHtml(r.allowedPhrases.join("\n"))}</textarea>`, "Commands, OOC and emergency prefixes that bypass speech restrictions.")}</div>`;
  }

  private renderResistance(): string {
    const r = this.store.value.resistance;
    return `<div class="grid two">${control("Enable minigame", checkbox("resistance.enabled", r.enabled), "Suggestions request an interactive resistance decision.")}${control("Game type", `<select data-setting="resistance.game">${["timing","reaction","pulse","classic","multi"].map((game) => `<option ${r.game === game ? "selected" : ""}>${game}</option>`).join("")}</select>`, "Five implemented minigame variants.")}${control("Base difficulty", range("resistance.baseDifficulty", r.baseDifficulty, 0, 100, 1), `${r.baseDifficulty}`)}${control("Duration ms", numberInput("resistance.durationMs", r.durationMs, 3000, 30000, 500), "Time before the attempt safely rejects.")}${control("Auto-accept whitelist", `<input data-setting="resistance.whitelistAutoAccept" data-number-array value="${r.whitelistAutoAccept.join(",")}">`, "Member IDs that skip the minigame.")}${control("Auto-accept depth", numberInput("resistance.autoAcceptDepth", r.autoAcceptDepth, 0, 101, 1), "101 disables depth-based auto-accept.")}${control("Ask once per session", checkbox("resistance.askOncePerSession", r.askOncePerSession), "After one acceptance, allow that sender for the current shared session.")}</div><div class="panel"><h3>Auto-accept instruction categories</h3><div class="chips">${instructionTypes.map((type) => `<label><input type="checkbox" data-resistance-capability="${type}" ${r.autoAcceptCapabilities.includes(type) ? "checked" : ""}>${type}</label>`).join("")}</div></div>`;
  }

  private renderRemoteSettings(): string {
    const remote = this.store.value.remote;
    return `${control("Enable multiplayer remote features", checkbox("remote.enabled", remote.enabled), "All individual capabilities still require their own explicit rule.")}<div class="stack">${(Object.keys(remote.capabilities) as RemoteCapability[]).map((capability) => { const rule = remote.capabilities[capability]; return `<article class="panel block"><div class="row"><b>${capability}</b><input type="checkbox" data-capability="${capability}" data-cap-field="enabled" ${rule.enabled ? "checked" : ""}></div><div class="grid three">${smallField("Member IDs", `<input data-capability="${capability}" data-cap-field="memberIds" value="${rule.memberIds.join(",")}">`)}${smallField("Minimum depth", `<input type="number" min="0" max="100" data-capability="${capability}" data-cap-field="minDepth" value="${rule.minDepth}">`)}${smallField("Requires trance", `<input type="checkbox" data-capability="${capability}" data-cap-field="requireTrance" ${rule.requireTrance ? "checked" : ""}>`)}${smallField("Only active hypnotizer", `<input type="checkbox" data-capability="${capability}" data-cap-field="requireActiveHypnotizer" ${rule.requireActiveHypnotizer ? "checked" : ""}>`)}${smallField("Roles", `<div class="chips">${["owner","lover","friend","itemPermission","whitelist","everyone"].map((role) => `<label><input type="checkbox" data-capability="${capability}" data-role="${role}" ${rule.roles.includes(role as any) ? "checked" : ""}>${role}</label>`).join("")}</div>`)}</div></article>`; }).join("")}</div>`;
  }

  private renderRemoteTarget(member: number): string {
    const status = this.network.status(member);
    return `<div class="panel"><h3>${escapeHtml(this.runtime.characterName(member))}</h3>${status ? `<p>SH ${escapeHtml(status.version)} · ${status.stage} · ${status.depthBucket}%</p><div class="chips">${status.capabilities.map((cap) => `<span>${cap}</span>`).join("")}</div>` : `<p>No SH status received yet. The player may not have SH or public status enabled.</p>`}<h3>Remote triggers</h3><div class="actions">${this.store.value.triggers.filter((trigger) => trigger.enabled && trigger.source.includes("remote")).map((trigger) => `<button data-remote="trigger" data-value="${attr(trigger.id)}">${escapeHtml(trigger.name)}</button>`).join("") || `<small>No local trigger is marked for remote use.</small>`}</div><div class="actions"><button data-remote="depth" data-value="10">Deepen +10</button><button data-remote="depth" data-value="25">Deepen +25</button><button data-remote="wake">Wake</button>${this.store.value.presets.map((preset) => `<button data-remote="effect" data-value="${attr(preset.id)}">${escapeHtml(preset.name)}</button>`).join("")}</div><h3>Indicator controls</h3><div class="actions"><button data-remote="indicator" data-value="hide">Hide indicator</button><button data-remote="indicator" data-value="show">Show indicator</button></div><h3>Allowed settings controls</h3><div class="actions"><button data-remote="settings" data-value="soft">Soft visuals</button><button data-remote="settings" data-value="intense">Intense visuals</button><button data-remote="settings" data-value="pinky">Pinky theme</button><button data-remote="settings" data-value="dark">Dark theme</button><button data-remote="settings" data-value="lucid">Lucid trance</button><button data-remote="settings" data-value="extreme-on">Extreme on</button><button data-remote="settings" data-value="extreme-off">Extreme off</button></div><h3>Suggestions from your library</h3><div class="stack">${this.store.value.suggestions.map((suggestion) => `<div class="row"><span><b>${escapeHtml(suggestion.name)}</b><small>${escapeHtml(suggestion.trigger)}</small></span><div><button data-remote="suggestion-install" data-value="${attr(suggestion.id)}">Install / update</button><button data-remote="suggestion-trigger" data-value="${attr(suggestion.id)}">Trigger</button></div></div>`).join("") || `<p>Create a suggestion locally first.</p>`}</div><div class="actions"><button data-action="close-remote">Back to settings</button></div></div>`;
  }

  private renderPresets(): string {
    return `<div class="grid three">${this.store.value.presets.map((preset) => `<article class="panel"><h3>${escapeHtml(preset.name)}</h3><p>${escapeHtml(preset.description)}</p><small>${Math.round(preset.durationMs / 1000)}s · depth ${preset.depthDelta >= 0 ? "+" : ""}${preset.depthDelta}</small><div><button data-action="preview" data-value="${attr(preset.id)}">Preview</button></div></article>`).join("")}</div>`;
  }

  private renderSessions(): string {
    return `<div class="toolbar"><button data-action="session-add">+ New session timeline</button></div><div class="grid two">${this.store.value.sessions.map((session, index) => `<article class="panel block"><div class="row"><h3>${escapeHtml(session.name)}</h3><button class="danger" data-action="session-delete" data-index="${index}">Delete</button></div><div class="grid two">${smallField("Name", `<input data-session="name" data-index="${index}" value="${attr(session.name)}">`)}${smallField("Duration ms", `<input type="number" min="1000" max="86400000" data-session="durationMs" data-index="${index}" value="${session.durationMs}">`)}${smallField("Description", `<textarea data-session="description" data-index="${index}">${escapeHtml(session.description)}</textarea>`)}${smallField("Timeline JSON", `<textarea class="timeline-json" data-session="steps" data-index="${index}">${escapeHtml(JSON.stringify(session.steps, null, 2))}</textarea>`)}</div><small>${Math.round(session.durationMs / 60000)} min · ${session.steps.length} timeline steps</small><div class="actions"><button data-action="session-start" data-value="${attr(session.id)}">Start locally</button><button data-action="session-invite" data-value="${attr(session.id)}">Invite member</button></div><ol>${session.steps.map((step) => `<li>${formatTime(step.atMs)} — ${step.action}</li>`).join("")}</ol></article>`).join("")}</div><div class="panel"><h3>Current session</h3><p>${this.sessions.current ? `${this.sessions.current.id} · host ${this.sessions.current.host}` : "No active session"}</p><div class="actions"><button data-action="session-pause">Pause</button><button data-action="session-resume">Resume</button><button data-action="session-stop">Stop session</button></div></div>`;
  }

  private renderSafety(): string {
    const a = this.store.value.accessibility, st = this.store.value.streaming, x = this.store.value.extreme, c = this.store.value.compatibility;
    return `<div class="panel extreme"><h3>Extreme Mode</h3><p>Immersive controls can be locked and the visible indicator can be hidden. The private emergency hotkey and Bondage Club safeword always remain functional and cannot be disabled remotely.</p><div class="grid two">${control("Enable Extreme Mode", checkbox("extreme.enabled", x.enabled), "Opt-in immersive mode for this account.")}${control("Lock quick controls", checkbox("extreme.lockQuickControls", x.lockQuickControls), "Disables the normal depth, trance and wake buttons while Extreme Mode is active.")}${control("Hide my indicator", checkbox("extreme.hideOwnIndicator", x.hideOwnIndicator), "Hide the compact depth bar beside your character.")}${control("Allow trusted remote indicator control", checkbox("extreme.allowRemoteIndicatorControl", x.allowRemoteIndicatorControl), "Allows people who also pass the controlIndicator permission rule to hide or reveal the indicator.")}</div></div><div class="grid two">${control("Emergency hotkey", `<input data-setting="general.emergencyHotkey" value="${attr(this.store.value.general.emergencyHotkey)}">`, "Always available and cannot be remotely disabled.")}${control("Accessibility mode", checkbox("accessibility.enabled", a.enabled), "Apply all accessibility limits together.")}${control("Reduced motion", checkbox("accessibility.reducedMotion", a.reducedMotion), "Disables rapid glitching and slows movement.")}${control("No flashes", checkbox("accessibility.noFlashes", a.noFlashes), "Prevents strong flash effects.")}${control("Maximum blur", numberInput("accessibility.maxBlur", a.maxBlur, 0, 30, .5), "Accessibility cap used by visual presentation.")}${control("Maximum rotation", numberInput("accessibility.maxRotation", a.maxRotation, 0, 15, .5), "Accessibility cap for rotating presentation.")}${control("High contrast text", checkbox("accessibility.highContrastText", a.highContrastText), "Improves readability over effects.")}${control("Streaming mode", checkbox("streaming.enabled", st.enabled), "Hide sensitive names, member numbers and suggestion details.")}${control("Hide names", checkbox("streaming.hideNames", st.hideNames), "Obscure character names in compatible UI.")}${control("Hide member numbers", checkbox("streaming.hideMemberNumbers", st.hideMemberNumbers), "Obscure member IDs in compatible UI.")}${control("Hide suggestion text", checkbox("streaming.hideSuggestionText", st.hideSuggestionText), "Avoid exposing suggestion details in streaming mode.")}${control("Replace HSC", checkbox("compatibility.replaceHSC", c.replaceHSC), "Use SH as the primary visual hypnosis addon.")}${control("Replace LSCG Hypno", checkbox("compatibility.replaceLSCGHypno", c.replaceLSCGHypno), "Use SH for hypnosis while other LSCG modules may remain.")}${control("Import HSC settings", checkbox("compatibility.importHSC", c.importHSC), "One-time migration of recognized HSC triggers and sounds.")}${control("Import LSCG settings", checkbox("compatibility.importLSCG", c.importLSCG), "One-time migration of recognized LSCG hypnosis settings.")}${control("BCX Voice integration", checkbox("compatibility.bcxVoice", c.bcxVoice), "Recognize BCX [Voice] messages.")}${control("WCE coexistence", checkbox("compatibility.wceCoexistence", c.wceCoexistence), "Avoid replacing WCE functions and use SDK hooks only.")}</div><div class="panel"><h3>Backup</h3><div class="actions"><button data-action="export">Export settings</button><button data-action="import">Import settings</button><button class="danger" data-action="reset">Reset SH</button></div></div>`;
  }

  private renderDiagnostics(): string {
    return `<div class="grid two"><div class="panel"><h3>Hooks</h3><pre>${escapeHtml(this.runtime.diagnostics.hooks.join("\n") || "No hooks")}</pre></div><div class="panel"><h3>Network</h3><p>Accepted: ${this.runtime.diagnostics.networkPacketsReceived}</p><p>Rejected: ${this.runtime.diagnostics.networkPacketsRejected}</p></div><div class="panel"><h3>Conflicts</h3><pre>${escapeHtml(this.runtime.diagnostics.conflicts.join("\n") || "None")}</pre></div><div class="panel"><h3>Errors</h3><pre>${escapeHtml(this.runtime.diagnostics.lastErrors.join("\n") || "None")}</pre></div><div class="panel"><h3>Audit log</h3><pre>${escapeHtml(this.runtime.getAudit().map((item) => `${new Date(item.timestamp).toLocaleTimeString()} ${item.allowed ? "ALLOW" : "DENY"} ${item.senderName}: ${item.action} ${item.detail}`).join("\n") || "Empty")}</pre></div></div>`;
  }

  private onClick(event: Event): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>("button,[data-tab]");
    if (!target) return;
    const tab = target.dataset.tab as Tab | undefined;
    if (tab) { this.tab = tab; this.remoteMember = undefined; this.render(); return; }
    const action = target.dataset.action;
    const value = target.dataset.value;
    const index = Number(target.dataset.index);
    if (target.dataset.remote && this.remoteMember) {
      if (target.dataset.remote === "trigger" && value) this.network.requestTrigger(this.remoteMember, value);
      if (target.dataset.remote === "depth") this.network.requestDepth(this.remoteMember, Number(value));
      if (target.dataset.remote === "wake") this.network.requestWake(this.remoteMember);
      if (target.dataset.remote === "effect" && value) this.network.requestEffect(this.remoteMember, value);
      if (target.dataset.remote === "indicator" && value) this.network.requestIndicator(this.remoteMember, value === "hide");
      if (target.dataset.remote === "settings") {
        if (value === "soft") this.network.requestSettingsPatch(this.remoteMember, { effectIntensity: .35 });
        if (value === "intense") this.network.requestSettingsPatch(this.remoteMember, { effectIntensity: .9 });
        if (value === "pinky" || value === "dark") this.network.requestSettingsPatch(this.remoteMember, { themeMode: value });
        if (value === "lucid") this.network.requestSettingsPatch(this.remoteMember, { lucidTrance: true });
        if (value === "extreme-on") this.network.requestSettingsPatch(this.remoteMember, { extremeEnabled: true, lockQuickControls: true });
        if (value === "extreme-off") this.network.requestSettingsPatch(this.remoteMember, { extremeEnabled: false });
      }
      if (target.dataset.remote === "suggestion-install" && value) {
        const suggestion = this.store.value.suggestions.find((item) => item.id === value);
        if (suggestion) this.network.installSuggestion(this.remoteMember, { ...structuredClone(suggestion), installedBy: this.runtime.memberNumber, installedByName: this.runtime.playerName, installedAt: Date.now(), uses: 0, lastUsedAt: 0 });
      }
      if (target.dataset.remote === "suggestion-trigger" && value) this.network.triggerSuggestion(this.remoteMember, value);
      return;
    }
    switch (action) {
      case "close": this.close(); break;
      case "close-remote": this.remoteMember = undefined; this.tab = "remote"; this.render(); break;
      case "emergency": this.bus.emit("emergency.stop", { reason: "Preference emergency button" }); break;
      case "depth": if (!this.quickControlsLocked()) this.hypno.addDepth(Number(value), "preference control"); break;
      case "trance": if (!this.quickControlsLocked()) this.hypno.enterTrance(this.runtime.memberNumber, "preference control"); break;
      case "wake": if (!this.quickControlsLocked()) this.hypno.wake("preference control"); break;
      case "preview": if (value) void this.effects.previewPreset(value); break;
      case "trigger-add": this.addTrigger(); break;
      case "trigger-delete": this.store.update((s) => s.triggers.splice(index, 1)); break;
      case "suggestion-add": this.addSuggestion(); break;
      case "command-add": this.addCommand(); break;
      case "suggestion-select": this.selectedSuggestionId = value; this.render(); break;
      case "suggestion-delete": if (value) { this.suggestions.remove(value, this.runtime.memberNumber); this.selectedSuggestionId = undefined; } break;
      case "suggestion-test": if (value) void this.suggestions.trigger(value, this.runtime.memberNumber, "test"); break;
      case "instruction-add": this.editSelected((s) => s.instructions.push({ id: crypto.randomUUID(), type: "message", config: { text: "A thought drifts through your mind..." } })); break;
      case "instruction-delete": this.editSelected((s) => s.instructions.splice(index, 1)); break;
      case "instruction-up": this.moveInstruction(index, index - 1); break;
      case "instruction-down": this.moveInstruction(index, index + 1); break;
      case "sound-add": this.addSound(); break;
      case "sound-delete": if (!this.store.value.audio.sounds[index]?.builtIn) this.store.update((s) => s.audio.sounds.splice(index, 1)); break;
      case "sound-play": { const sound = this.store.value.audio.sounds[index]; if (sound) void this.audio.playSound(sound); break; }
      case "audio-stop": this.audio.stopAll(); break;
      case "audio-mute": this.audio.setMuted(!this.audio.isMuted); break;
      case "preset-save-current": this.saveCurrentPreset(); break;
      case "session-add": this.addSession(); break;
      case "session-delete": this.store.update((settings) => settings.sessions.splice(index, 1), true); break;
      case "session-start": if (value) this.sessions.start(value); break;
      case "session-pause": this.sessions.control("pause"); break;
      case "session-resume": this.sessions.control("resume"); break;
      case "session-stop": this.sessions.control("stop"); this.sessions.stop("stopped manually", true); break;
      case "session-invite": if (value) { const raw = prompt("Member ID to invite"); const member = Number(raw); const role = prompt("Role: hypnotist, support, viewer or subject", "subject") as "hypnotist" | "support" | "viewer" | "subject" | null; if (member > 0 && role && ["hypnotist","support","viewer","subject"].includes(role)) this.sessions.invite(member, value, role); } break;
      case "export": this.downloadExport(); break;
      case "import": this.importSettings(); break;
      case "reset": if (confirm("Reset all SkyzHypno settings?")) { localStorage.removeItem(`SkyzHypno_${this.runtime.memberNumber}_backup`); this.runtime.player!.ExtensionSettings!.SkyzHypno = ""; location.reload(); } break;
    }
    if (this.root) this.render();
  }

  private onChange(event: Event): void { this.applyField(event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement); }
  private onInput(event: Event): void { const target = event.target as HTMLInputElement; if (target.type === "range") this.applyField(target, false); }

  private applyField(target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, rerender = true): void {
    const path = target.dataset.setting;
    if (path) {
      let value: unknown = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
      if (target.dataset.array !== undefined) value = String(value).split(/\n+/).map((item) => item.trim()).filter(Boolean);
      if (target.dataset.numberArray !== undefined) value = parseIds(String(value));
      if (target instanceof HTMLInputElement && ["number", "range"].includes(target.type)) value = Number(target.value);
      this.store.update((settings) => {
        setPath(settings as any, path, value);
        if (path === "theme.mode") applyThemePalette(settings, String(value));
      });
    }
    if (target.dataset.trigger) this.updateTrigger(target);
    if (target.dataset.suggestion) this.updateSuggestion(target);
    if (target.dataset.instruction) this.updateInstruction(target);
    if (target.dataset.sound) this.updateSound(target);
    if (target.dataset.capability) this.updateCapability(target);
    if (target.dataset.resistanceCapability) this.updateResistanceCapability(target);
    if (target.dataset.session) this.updateSession(target);
    if (rerender && this.root) this.render();
  }

  private updateTrigger(target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): void {
    const index = Number(target.dataset.index), field = target.dataset.trigger!;
    this.store.update((settings) => {
      const trigger = settings.triggers[index]; if (!trigger) return;
      let value: any = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
      if (["minDepth","maxDepth","depthDelta","delayMs","requiredRepeats","repeatWindowMs","cooldownMs","expiresAt"].includes(field)) value = value === "" ? undefined : Number(value);
      if (field === "allowedMemberIds") value = parseIds(value);
      if (field === "source") value = String(value).split(/[\s,]+/).filter((item): item is TriggerSource => ["chat","whisper","voice","activity","item","api","remote"].includes(item));
      if (field === "comboPhrases") value = String(value).split("|").map((item) => item.trim()).filter(Boolean);
      if (["effectPresetId","suggestionId"].includes(field) && value === "") value = undefined;
      (trigger as any)[field] = value;
    });
  }

  private updateSuggestion(target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): void {
    const field = target.dataset.suggestion!;
    this.editSelected((suggestion) => {
      let value: any = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
      if (["requiredDepth","cooldownMs","maxUses","expiresAt"].includes(field)) value = value === "" ? undefined : Number(value);
      (suggestion as any)[field] = value;
    });
  }

  private updateInstruction(target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): void {
    const index = Number(target.dataset.index), field = target.dataset.instruction!;
    this.editSelected((suggestion) => {
      const instruction = suggestion.instructions[index]; if (!instruction) return;
      if (field === "type") instruction.type = target.value as SuggestionInstructionType;
      if (field === "config") { try { instruction.config = JSON.parse(target.value); target.classList.remove("invalid"); } catch { target.classList.add("invalid"); } }
    });
  }

  private updateSound(target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): void {
    const index = Number(target.dataset.index), field = target.dataset.sound!;
    this.store.update((settings) => {
      const sound = settings.audio.sounds[index]; if (!sound) return;
      let value: any = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
      if (["volume","playbackRate","pan","reverb","echo"].includes(field)) value = Number(value);
      (sound as any)[field] = value;
    });
  }

  private updateCapability(target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): void {
    const capability = target.dataset.capability as RemoteCapability;
    this.store.update((settings) => {
      const rule = settings.remote.capabilities[capability]; if (!rule) return;
      if (target.dataset.role) {
        const role = target.dataset.role as any;
        if ((target as HTMLInputElement).checked && !rule.roles.includes(role)) rule.roles.push(role);
        if (!(target as HTMLInputElement).checked) rule.roles = rule.roles.filter((item) => item !== role);
        return;
      }
      const field = target.dataset.capField!;
      let value: any = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
      if (field === "memberIds") value = parseIds(value);
      if (field === "minDepth") value = Number(value);
      (rule as any)[field] = value;
    });
  }

  private updateResistanceCapability(target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): void {
    const type = target.dataset.resistanceCapability as SuggestionInstructionType;
    this.store.update((settings) => {
      const list = settings.resistance.autoAcceptCapabilities;
      if ((target as HTMLInputElement).checked && !list.includes(type)) list.push(type);
      if (!(target as HTMLInputElement).checked) settings.resistance.autoAcceptCapabilities = list.filter((item) => item !== type);
    });
  }

  private updateSession(target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): void {
    const index = Number(target.dataset.index), field = target.dataset.session!;
    this.store.update((settings) => {
      const session = settings.sessions[index]; if (!session) return;
      if (field === "durationMs") session.durationMs = Math.max(1000, Number(target.value) || 1000);
      else if (field === "steps") {
        try { session.steps = JSON.parse(target.value) as SessionPreset["steps"]; target.classList.remove("invalid"); }
        catch { target.classList.add("invalid"); }
      } else (session as any)[field] = target.value;
    }, true);
  }

  private addSession(): void {
    const session: SessionPreset = { id: crypto.randomUUID(), name: "New shared session", description: "Custom SH timeline", durationMs: 120000, steps: [{ id: crypto.randomUUID(), atMs: 0, action: "effect", config: { presetId: "preset-soft-induction" } }, { id: crypto.randomUUID(), atMs: 110000, action: "wake", config: {} }] };
    this.store.update((settings) => settings.sessions.push(session), true);
  }

  private addTrigger(): void {
    this.store.update((settings) => settings.triggers.push({ id: crypto.randomUUID(), name: "New trigger", phrase: "focus", kind: "deepen" as TriggerKind, enabled: true, source: ["chat","whisper","voice"], minDepth: 0, maxDepth: 100, depthDelta: 10, cooldownMs: 5000, delayMs: 0, requiredRepeats: 1, repeatWindowMs: 30000, comboPhrases: [], allowedMemberIds: [], requireNameMention: false, oneShot: false }));
  }

  private addSuggestion(): void {
    const suggestion: SuggestionDefinition = { id: crypto.randomUUID(), name: "New suggestion", description: "", trigger: "obey", installedBy: this.runtime.memberNumber, installedByName: this.runtime.playerName, installedAt: Date.now(), exclusive: false, enabled: true, requiredDepth: 0, cooldownMs: 5000, maxUses: 0, uses: 0, lastUsedAt: 0, instructions: [{ id: crypto.randomUUID(), type: "message", config: { text: "A soft thought settles into place..." } }] };
    this.store.update((settings) => settings.suggestions.push(suggestion), true);
    this.selectedSuggestionId = suggestion.id;
  }

  private addCommand(): void {
    const trigger = prompt("Command trigger phrase", "obey")?.trim();
    if (!trigger) return;
    const response = prompt("What should the command make the person say or do?", "Yes, I understand.")?.trim();
    if (!response) return;
    const suggestion: SuggestionDefinition = {
      id: crypto.randomUUID(), name: `Command: ${trigger}`, description: "Implanted hypnotic command", trigger,
      installedBy: this.runtime.memberNumber, installedByName: this.runtime.playerName, installedAt: Date.now(),
      exclusive: false, enabled: true, requiredDepth: 1, cooldownMs: 5000, maxUses: 0, uses: 0, lastUsedAt: 0,
      instructions: [{ id: crypto.randomUUID(), type: "command", config: { mode: "say", text: response } }],
    };
    this.store.update((settings) => settings.suggestions.push(suggestion), true);
    this.selectedSuggestionId = suggestion.id;
  }

  private editSelected(mutator: (suggestion: SuggestionDefinition) => void): void {
    this.store.update((settings) => { const suggestion = settings.suggestions.find((item) => item.id === this.selectedSuggestionId); if (suggestion) mutator(suggestion); }, true);
  }

  private moveInstruction(from: number, to: number): void {
    this.editSelected((suggestion) => { if (to < 0 || to >= suggestion.instructions.length) return; const [item] = suggestion.instructions.splice(from, 1); if (item) suggestion.instructions.splice(to, 0, item); });
  }

  private addSound(): void {
    this.store.update((settings) => settings.audio.sounds.push({ id: crypto.randomUUID(), name: "Custom sound", category: "trigger", url: "https://", enabled: true, volume: .5, loop: false, playbackRate: 1, pan: 0, reverb: .2, echo: .1, builtIn: false }));
  }

  private saveCurrentPreset(): void {
    const name = prompt("Preset name", "My SH effect"); if (!name) return;
    this.store.update((settings) => settings.presets.push({ id: crypto.randomUUID(), name, description: "Custom effect-composer preset", effects: { ...settings.effects }, theme: { ...settings.theme }, durationMs: 15000, depthDelta: 0 }));
  }

  private downloadExport(): void {
    const blob = new Blob([this.store.export()], { type: "text/plain" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `SkyzHypno-${this.runtime.memberNumber}-${Date.now()}.sh`; anchor.click(); URL.revokeObjectURL(url);
  }

  private importSettings(): void {
    const input = document.createElement("input"); input.type = "file"; input.accept = ".sh,.txt"; input.addEventListener("change", async () => { const file = input.files?.[0]; if (!file) return; try { this.store.import(await file.text()); this.runtime.localMessage("Settings imported."); } catch (error) { this.runtime.localMessage(`Import failed: ${String(error)}`, "error"); } }); input.click();
  }

  private drawRemoteEntry(): void {
    const target = this.currentCharacter(); if (!target?.MemberNumber || target.MemberNumber === this.runtime.memberNumber) return;
    if (typeof DrawButton === "function") DrawButton(1540, 790, 410, 80, "SH Remote", "#731dff", "", "Open SkyzHypno remote controls");
  }

  private currentCharacter(): Character | undefined { return this.runtime.get<Character>("CurrentCharacter") ?? this.runtime.get<Character>("InformationSheetCharacter"); }

  private registerExtensionSetting(): void {
    if (this.extensionRegistered) return;
    const register = this.runtime.get<typeof PreferenceRegisterExtensionSetting>("PreferenceRegisterExtensionSetting");
    if (typeof register !== "function") return;
    register({
      Identifier: "SkyzHypno",
      ButtonText: "SkyzHypno",
      Image: "https://raw.githubusercontent.com/mystiq-skyz/skyzhypno/main/dist/icon.svg",
      load: () => { this.extensionContext = true; this.open("overview"); },
      run: () => { if (!this.root) { this.extensionContext = true; this.open("overview"); } },
      click: () => undefined,
      exit: () => this.close(false),
    });
    this.extensionRegistered = true;
  }

  private quickControlsLocked(): boolean {
    return this.store.value.extreme.enabled && this.store.value.extreme.lockQuickControls;
  }
}

const soundCategories: SoundCategory[] = ["induction","deepen","trigger","trance","suggestion","wake","ambient","heartbeat","metronome","glitch"];
const label = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).replace(/([A-Z])/g, " $1");
const description = (tab: Tab) => ({ overview:"Live status and quick controls.", hypnosis:"Depth, trance, decay and aftereffects.", triggers:"Words, combinations, activities and BCX voice triggers.", suggestions:"Visual flow editor for persistent suggestions.", effects:"Pinky glow and dark-creepy visual compositor.", sounds:"Built-in synthesis and editable URL sounds.", restrictions:"Configurable trance and suggestion restrictions.", resistance:"Interactive minigame and automatic-accept whitelist.", remote:"Receiver-validated multiplayer permissions.", presets:"Reusable audiovisual scenes.", sessions:"Timed local and shared multiplayer timelines.", safety:"Emergency, accessibility, compatibility and backups.", diagnostics:"Hooks, conflicts, networking, errors and audit log." }[tab]);
const card = (title: string, body: string, tab: string) => `<button class="panel card" data-tab="${tab}"><b>${title}</b><span>${body}</span></button>`;
const control = (title: string, input: string, hint: string) => `<label class="panel control"><span><b>${title}</b><small>${hint}</small></span>${input}</label>`;
const smallField = (title: string, input: string) => `<label class="small"><span>${title}</span>${input}</label>`;
const checkbox = (path: string, checked: boolean) => `<input type="checkbox" data-setting="${path}" ${checked ? "checked" : ""}>`;
const range = (path: string, value: number, min: number, max: number, step: number) => `<input type="range" data-setting="${path}" value="${value}" min="${min}" max="${max}" step="${step}">`;
const numberInput = (path: string, value: number, min: number, max: number, step: number) => `<input type="number" data-setting="${path}" value="${value}" min="${min}" max="${max}" step="${step}">`;
const parseIds = (value: string) => [...new Set(value.split(/[,\s]+/).map(Number).filter((id) => Number.isInteger(id) && id > 0))];
const formatTime = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2,"0")}`;
function setPath(target: any, path: string, value: unknown): void { const parts = path.split("."); const key = parts.pop()!; let cursor = target; for (const part of parts) cursor = cursor[part]; cursor[key] = value; }
function escapeHtml(value: string): string { const span = document.createElement("span"); span.textContent = value; return span.innerHTML; }
const attr = (value: string) => escapeHtml(value).replaceAll('"', "&quot;");


function applyThemePalette(settings: any, mode: string): void {
  const palettes: Record<string, { primary: string; secondary: string; accent: string; background: string; glow: number; darkness: number }> = {
    pinky: { primary: "#ff58bd", secondary: "#b45cff", accent: "#ffd0f0", background: "#12051a", glow: .95, darkness: .42 },
    dark: { primary: "#ff2f72", secondary: "#3b0b66", accent: "#a868ff", background: "#030106", glow: .62, darkness: .9 },
    hybrid: { primary: "#ff58bd", secondary: "#731dff", accent: "#ff9fe2", background: "#09030f", glow: .8, darkness: .65 },
  };
  const palette = palettes[mode]; if (palette) Object.assign(settings.theme, palette);
}

const UI_CSS = `
#sh-preferences{position:fixed;inset:0;z-index:999999;background:rgba(2,0,6,.76);backdrop-filter:blur(12px);font:14px/1.45 Inter,ui-rounded,system-ui;color:#fff;pointer-events:auto}
#sh-preferences *{box-sizing:border-box}#sh-preferences .sh-shell{display:grid;grid-template-columns:235px 1fr;width:min(1500px,96vw);height:min(900px,94vh);margin:3vh auto;border:1px solid #ff58bd55;border-radius:28px;overflow:hidden;background:linear-gradient(145deg,#15081ef2,#07040df5);box-shadow:0 0 80px #ff2f9250,inset 0 1px #ffffff18}
#sh-preferences aside{padding:20px 14px;background:#09030ecc;border-right:1px solid #ffffff12;overflow:auto}#sh-preferences .brand{display:flex;gap:12px;align-items:center;margin:2px 8px 22px}#sh-preferences .brand>b{display:grid;place-items:center;width:44px;height:44px;border-radius:15px;background:linear-gradient(135deg,#ff58bd,#731dff);box-shadow:0 0 24px #ff58bd77;font-size:18px}#sh-preferences .brand span{font-size:17px;font-weight:800}#sh-preferences .brand small{display:block;font-size:10px;opacity:.55}
#sh-preferences nav{display:grid;gap:4px}#sh-preferences nav button,#sh-preferences .list>button{border:0;border-radius:12px;padding:9px 11px;text-align:left;background:transparent;color:#ddcee4;cursor:pointer}#sh-preferences nav button:hover,#sh-preferences nav button.active,#sh-preferences .list>button.active{background:linear-gradient(90deg,#ff58bd22,#731dff25);color:#fff;box-shadow:inset 3px 0 #ff58bd}
#sh-preferences main{display:grid;grid-template-rows:auto minmax(0,1fr);min-width:0;min-height:0;overflow:hidden}#sh-preferences header{display:flex;justify-content:space-between;align-items:center;padding:22px 28px;border-bottom:1px solid #ffffff12}#sh-preferences h1,#sh-preferences h2,#sh-preferences h3{margin:0 0 7px}#sh-preferences header p{margin:0;opacity:.62}#sh-preferences header>button{font-size:30px;border:0;background:transparent;color:#fff;cursor:pointer}#sh-preferences section{overflow-y:auto;overflow-x:hidden;min-height:0;padding:24px 28px 52px;scrollbar-gutter:stable;overscroll-behavior:contain}
#sh-preferences .panel{border:1px solid #ffffff16;border-radius:18px;background:linear-gradient(145deg,#ffffff0c,#ffffff05);padding:18px;box-shadow:inset 0 1px #ffffff0d}#sh-preferences .grid{display:grid;gap:14px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}#sh-preferences section>.grid,#sh-preferences section>.panel,#sh-preferences section>.split{margin-bottom:18px}.stack{display:grid;gap:18px}.hero{display:flex;justify-content:space-between;align-items:center;padding:30px;border-radius:24px;background:radial-gradient(circle at 80%,#ff58bd29,transparent 30%),linear-gradient(120deg,#731dff24,#ff58bd17);margin-bottom:16px}.hero h2{font-size:34px}.pill{padding:4px 9px;border-radius:99px;background:#ff58bd25;color:#ff9fdf;text-transform:uppercase}.orb{width:120px;height:120px;border-radius:50%;background:conic-gradient(#ff58bd calc(var(--depth)*1%),#731dff22 0);box-shadow:0 0 50px #ff58bd55;position:relative}.orb:after{content:"";position:absolute;inset:12px;border-radius:50%;background:#0c0612}
#sh-preferences button{border:1px solid #ffffff18;border-radius:12px;padding:8px 12px;background:linear-gradient(135deg,#ff58bd35,#731dff35);color:#fff;cursor:pointer}#sh-preferences button:hover{border-color:#ff58bd88;box-shadow:0 0 18px #ff58bd33}#sh-preferences button.danger,#sh-preferences .danger{background:#7d123b80;color:#ffd2e3}.toolbar,.actions,.row{display:flex;gap:9px;align-items:center;flex-wrap:wrap}.toolbar{margin-bottom:14px}.row{justify-content:space-between}.control{display:flex;align-items:center;justify-content:space-between;gap:15px}.control span{display:grid}.control small,.small span{opacity:.58}.small{display:grid;gap:5px}.block input:not([type=checkbox]),.block select,.block textarea,.small input:not([type=checkbox]),.small select,.small textarea,#sh-preferences .control input:not([type=checkbox]),#sh-preferences .control select,#sh-preferences .control textarea{width:100%;background:#08040e;border:1px solid #ffffff18;border-radius:10px;color:#fff;padding:8px}#sh-preferences input[type=range]{accent-color:#ff58bd}#sh-preferences input[type=checkbox]{accent-color:#ff58bd;width:20px;height:20px}.chips{display:flex;flex-wrap:wrap;gap:7px}.chips label,.chips span{padding:6px 9px;border-radius:99px;background:#ffffff0b}.colors{display:flex;gap:12px;margin:14px 0}.colors label{display:grid;gap:5px}.colors input{width:70px;height:38px;background:none;border:0}.split{display:grid;grid-template-columns:260px 1fr;gap:14px}.list{display:flex;flex-direction:column;gap:5px;align-self:start}.list button{display:grid}.list small{opacity:.55}.flow{display:grid;gap:10px;margin:10px 0}.instruction{display:grid;grid-template-columns:32px 150px 1fr auto;gap:8px;align-items:start;padding:10px;border-radius:15px;background:#ffffff08}.instruction>span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#ff58bd44}.instruction textarea{min-height:95px;background:#050208;color:#ded0e5;border:1px solid #ffffff18;border-radius:10px;padding:8px;font-family:ui-monospace,monospace}.instruction textarea.invalid,.timeline-json.invalid{border-color:#ff3c6f}.timeline-json{min-height:240px;font-family:ui-monospace,monospace}.card{display:grid;text-align:left}.card span{opacity:.65}.icon{padding:4px 8px!important}.notice{padding:11px 13px;border-radius:12px;background:#ff58bd12;border:1px solid #ff58bd35;color:#ffd4ed}.extreme{border-color:#ff2f7266!important;background:linear-gradient(145deg,#3a071b55,#17042155)!important}#sh-preferences .panel>.grid{margin-top:12px}#sh-preferences article.panel>h3:not(:first-child),#sh-preferences .panel>h3:not(:first-child){margin-top:22px}.panel pre{white-space:pre-wrap;max-height:300px;overflow:auto;background:#050208;padding:10px;border-radius:10px}.panel ol{max-height:180px;overflow:auto;padding-left:20px}
@media(max-width:900px){#sh-preferences .sh-shell{grid-template-columns:1fr;height:100vh;width:100vw;margin:0;border-radius:0}#sh-preferences aside{display:none}.grid.two,.grid.three,.split{grid-template-columns:1fr}#sh-preferences section{padding:16px}.instruction{grid-template-columns:1fr}.hero .orb{display:none}}
`;
