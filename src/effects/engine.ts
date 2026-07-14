import type { EventBus } from "@/core/bus";
import type { Lifecycle } from "@/core/lifecycle";
import type { BCRuntime } from "@/core/runtime";
import type { SettingsStore } from "@/core/storage";
import type { AppEvents } from "@/events";
import type { EffectPreset, EffectsSettings, HypnoRuntimeState } from "@/types";
import type { AudioEngine } from "@/audio/engine";
import type { HypnoEngine } from "@/hypno/engine";
import { SH_STYLES } from "./styles";

interface ActivePreset { id: string; preset: EffectPreset; expiresAt: number }
interface Particle { x: number; y: number; size: number; speed: number; phase: number }

export class EffectsEngine {
  private root?: HTMLDivElement;
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private hud?: HTMLDivElement;
  private animationFrame?: number;
  private activePresets: ActivePreset[] = [];
  private particles: Particle[] = [];
  private state: HypnoRuntimeState;
  private savedExpressions?: Record<string, string>;
  private chatObserver?: MutationObserver;

  constructor(
    private readonly runtime: BCRuntime,
    private readonly store: SettingsStore,
    private readonly hypno: HypnoEngine,
    private readonly audio: AudioEngine,
    private readonly bus: EventBus<AppEvents>,
    lifecycle: Lifecycle,
  ) {
    this.state = hypno.snapshot;
    this.mount();
    lifecycle.add(() => this.unmount());
    lifecycle.add(bus.on("state.changed", (state) => { this.state = state; this.updateDom(); }));
    lifecycle.add(bus.on("trigger.matched", ({ trigger }) => { this.flash(0.16); if (trigger.effectPresetId) void this.playPreset(trigger.effectPresetId, undefined, false); }));
    lifecycle.add(bus.on("trance.enter", () => { this.applyCharacterEffects(); void this.audio.playCategory("trance"); this.fragment("Deeper..."); }));
    lifecycle.add(bus.on("trance.wake", () => { this.restoreCharacterEffects(); this.clearPresets(); void this.audio.playCategory("wake"); this.fragment("Wide awake"); }));
    lifecycle.add(bus.on("emergency.stop", () => { this.restoreCharacterEffects(); this.clearPresets(); }));
    lifecycle.add(runtime.hook("DrawCharacter", 90, (args, next) => this.drawCharacterHook(args, next)));
    lifecycle.interval(() => this.expirePresets(), 500);
    lifecycle.add(store.subscribe(() => this.updateDom()));
  }

  async playPreset(id: string, durationOverride?: number, applyDepth = true): Promise<void> {
    const preset = this.store.value.presets.find((item) => item.id === id);
    if (!preset) return;
    this.activePresets.push({ id: crypto.randomUUID(), preset, expiresAt: Date.now() + (durationOverride ?? preset.durationMs) });
    if (preset.soundCategory) await this.audio.playCategory(preset.soundCategory, { loop: preset.soundCategory === "ambient" });
    if (applyDepth && preset.depthDelta) this.hypno.addDepth(preset.depthDelta, `preset:${preset.name}`);
    this.updateDom();
  }

  async previewPreset(id: string, durationMs?: number): Promise<void> {
    await this.playPreset(id, durationMs, false);
  }

  preview(effectOverrides: Partial<EffectsSettings>, durationMs = 8000): void {
    const preset: EffectPreset = { id: crypto.randomUUID(), name: "Preview", description: "", effects: effectOverrides, durationMs, depthDelta: 0 };
    this.activePresets.push({ id: preset.id, preset, expiresAt: Date.now() + durationMs });
    this.updateDom();
  }

  clearPresets(): void {
    this.activePresets = [];
    this.audio.stopCategory("ambient");
    this.updateDom();
  }

  fragment(text: string): void {
    if (!this.root || !text) return;
    const element = document.createElement("div");
    element.className = "sh-fragment";
    element.textContent = text;
    this.root.appendChild(element);
    window.setTimeout(() => element.remove(), 4800);
  }

  flash(strength = 0.25): void {
    if (this.store.value.accessibility.noFlashes || this.store.value.effects.flashProtection) strength = Math.min(strength, 0.12);
    const flash = this.root?.querySelector<HTMLElement>(".sh-flash");
    if (!flash) return;
    flash.style.opacity = String(strength);
    window.setTimeout(() => { flash.style.opacity = "0"; }, 140);
  }

  private mount(): void {
    if (document.querySelector("#sh-overlay-root")) return;
    const style = document.createElement("style"); style.id = "sh-styles"; style.textContent = SH_STYLES; document.head.appendChild(style);
    const root = document.createElement("div"); root.id = "sh-overlay-root";
    root.innerHTML = `<canvas id="sh-effect-canvas"></canvas><div class="sh-blur"></div><div class="sh-tint"></div><div class="sh-room-aura"></div><div class="sh-vignette"></div><div class="sh-tunnel"></div><div class="sh-waves"></div><div class="sh-dream"></div><div class="sh-glitch"></div><div class="sh-flash"></div><div id="sh-hud"><div class="sh-title"><span>SkyzHypno</span><span class="sh-stage">AWAKE</span></div><div class="sh-bar"><i></i></div><button type="button" data-sh-open>Settings</button> <button type="button" data-sh-stop>Stop</button></div>`;
    document.body.appendChild(root);
    const canvas = root.querySelector<HTMLCanvasElement>("#sh-effect-canvas")!;
    this.root = root; this.canvas = canvas; this.ctx = canvas.getContext("2d") ?? undefined; this.hud = root.querySelector<HTMLDivElement>("#sh-hud")!;
    root.querySelector("[data-sh-open]")?.addEventListener("click", () => this.bus.emit("settings.open", {}));
    root.querySelector("[data-sh-stop]")?.addEventListener("click", () => this.bus.emit("emergency.stop", { reason: "HUD stop button" }));
    this.resize();
    window.addEventListener("resize", this.resize);
    this.initParticles();
    this.animate(0);
    this.observeChat();
    this.updateDom();
  }

  private unmount(): void {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("resize", this.resize);
    this.chatObserver?.disconnect();
    this.restoreCharacterEffects();
    this.root?.remove();
    document.querySelector("#sh-styles")?.remove();
    document.documentElement.classList.remove("sh-hide-names", "sh-stream-hide-members", "sh-trance-body", "sh-chromatic-body", "sh-high-contrast", "sh-stream-hide-suggestions");
  }

  private resize = (): void => {
    if (!this.canvas) return;
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.floor(window.innerWidth * ratio);
    this.canvas.height = Math.floor(window.innerHeight * ratio);
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  private effectiveEffects(): EffectsSettings {
    const base = { ...this.store.value.effects };
    for (const active of this.activePresets) Object.assign(base, active.preset.effects);
    if (this.store.value.accessibility.enabled || this.store.value.accessibility.reducedMotion) {
      base.reducedMotion = true; base.glitch = false; base.trails = false; base.spiralSpeed = Math.min(base.spiralSpeed, 0.25);
    }
    return base;
  }

  private effectiveIntensity(): number {
    const effects = this.effectiveEffects();
    const depthScale = 0.18 + this.state.depth / 100 * 0.82;
    const aftereffectScale = this.state.aftereffectsUntil ? 0.28 : 1;
    return Math.max(0, Math.min(1, effects.intensity * depthScale * aftereffectScale));
  }

  private updateDom(): void {
    if (!this.root) return;
    const settings = this.store.value;
    const effects = this.effectiveEffects();
    const theme = this.activePresets.map((active) => active.preset.theme).filter(Boolean).at(-1) ?? {};
    const mergedTheme = { ...settings.theme, ...theme };
    const style = document.documentElement.style;
    style.setProperty("--sh-primary", mergedTheme.primary);
    style.setProperty("--sh-secondary", mergedTheme.secondary);
    style.setProperty("--sh-accent", mergedTheme.accent);
    style.setProperty("--sh-bg", mergedTheme.background);
    style.setProperty("--sh-glow", String(mergedTheme.glow));
    style.setProperty("--sh-darkness", String(mergedTheme.darkness));
    style.setProperty("--sh-intensity", String(this.effectiveIntensity()));
    style.setProperty("--sh-depth", String(this.state.depth));
    style.setProperty("--sh-max-blur", String(settings.accessibility.maxBlur));
    style.setProperty("--sh-max-rotation", String(settings.accessibility.maxRotation));
    this.root.style.display = settings.general.enabled && settings.effects.enabled ? "" : "none";
    this.root.querySelector<HTMLElement>(".sh-blur")!.style.display = effects.blur ? "" : "none";
    this.root.querySelector<HTMLElement>(".sh-tint")!.style.display = effects.tint ? "" : "none";
    this.root.querySelector<HTMLElement>(".sh-room-aura")!.style.display = effects.roomAura ? "" : "none";
    this.root.querySelector<HTMLElement>(".sh-vignette")!.style.display = effects.vignette ? "" : "none";
    this.root.querySelector<HTMLElement>(".sh-tunnel")!.style.display = effects.tunnelVision ? "" : "none";
    this.root.querySelector<HTMLElement>(".sh-waves")!.style.display = effects.waves ? "" : "none";
    this.root.querySelector<HTMLElement>(".sh-dream")!.style.display = effects.dreamMode ? "" : "none";
    this.root.querySelector<HTMLElement>(".sh-glitch")!.style.display = effects.glitch ? "" : "none";
    if (this.hud) {
      this.hud.style.display = settings.general.showHud ? "" : "none";
      const stage = this.hud.querySelector<HTMLElement>(".sh-stage");
      if (stage) stage.textContent = `${this.state.stage} · ${Math.round(this.state.depth)}%`;
    }
    document.documentElement.classList.toggle("sh-hide-names", effects.fadeOthers && this.state.depth >= settings.restrictions.threshold || settings.streaming.enabled && settings.streaming.hideNames);
    document.documentElement.classList.toggle("sh-stream-hide-members", settings.streaming.enabled && settings.streaming.hideMemberNumbers);
    document.documentElement.classList.toggle("sh-trance-body", this.state.depth > 15);
    document.documentElement.classList.toggle("sh-chromatic-body", effects.chromatic && this.state.depth >= 40);
    document.documentElement.classList.toggle("sh-high-contrast", settings.accessibility.highContrastText);
    document.documentElement.classList.toggle("sh-stream-hide-suggestions", settings.streaming.enabled && settings.streaming.hideSuggestionText);
  }

  private animate = (time: number): void => {
    this.animationFrame = requestAnimationFrame(this.animate);
    if (!this.ctx || !this.canvas || !this.store.value.effects.enabled) return;
    const ctx = this.ctx;
    const width = window.innerWidth, height = window.innerHeight;
    ctx.clearRect(0, 0, width, height);
    const effects = this.effectiveEffects();
    const intensity = this.effectiveIntensity();
    if (intensity <= 0.01) return;
    const audioLevel = effects.audioReactive ? this.audio.level() : 0;
    if (effects.spiral) this.drawSpiral(ctx, width / 2, height / 2, Math.min(width, height) * (0.44 + audioLevel * 0.08), time, effects, intensity);
    if (effects.particles) this.drawParticles(ctx, width, height, time, intensity, audioLevel, effects.trails);
    if (effects.doubleVision) this.drawRings(ctx, width / 2, height / 2, time, intensity);
  };

  private drawSpiral(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number, effects: EffectsSettings, intensity: number): void {
    const reduced = effects.reducedMotion || this.store.value.accessibility.reducedMotion;
    const direction = effects.reverseSpiral ? -1 : 1;
    const rotation = reduced ? 0 : time * 0.00035 * effects.spiralSpeed * direction;
    const arms = effects.spiralStyle === "double" ? 4 : effects.spiralStyle === "fracture" ? 7 : 2;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rotation); ctx.globalCompositeOperation = "lighter";
    for (let arm = 0; arm < arms; arm++) {
      ctx.beginPath();
      for (let i = 0; i < 260; i++) {
        const t = i / 259;
        const angle = t * Math.PI * (effects.spiralStyle === "tunnel" ? 11 : 7) + arm * Math.PI * 2 / arms;
        const r = t * radius;
        const pulse = effects.spiralStyle === "rings" ? Math.sin(t * 36 + time * .002) * 8 : 0;
        const x = Math.cos(angle) * (r + pulse), y = Math.sin(angle) * (r + pulse);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = arm % 2 ? this.store.value.theme.primary : this.store.value.theme.secondary;
      ctx.globalAlpha = 0.16 + intensity * 0.36;
      ctx.lineWidth = 1.5 + intensity * 3;
      ctx.shadowBlur = 8 + intensity * 24;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, intensity: number, audioLevel: number, trails: boolean): void {
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    const max = this.store.value.effects.performance === "low" ? 24 : this.store.value.effects.performance === "high" ? 90 : 52;
    for (let i = 0; i < Math.min(max, this.particles.length); i++) {
      const p = this.particles[i]!;
      p.y -= p.speed * (0.3 + intensity);
      p.x += Math.sin(time * 0.0006 + p.phase) * 0.18;
      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      if (trails) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y + 2); ctx.lineTo(p.x, p.y + 12 + intensity * 28);
        ctx.strokeStyle = i % 2 ? this.store.value.theme.primary : this.store.value.theme.accent;
        ctx.globalAlpha = 0.05 + intensity * 0.18; ctx.lineWidth = Math.max(0.5, p.size * 0.55); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 + audioLevel * 2), 0, Math.PI * 2);
      ctx.fillStyle = i % 2 ? this.store.value.theme.primary : this.store.value.theme.accent;
      ctx.globalAlpha = 0.12 + intensity * 0.34;
      ctx.shadowBlur = 12; ctx.shadowColor = ctx.fillStyle; ctx.fill();
    }
    ctx.restore();
  }

  private drawRings(ctx: CanvasRenderingContext2D, cx: number, cy: number, time: number, intensity: number): void {
    ctx.save(); ctx.translate(cx, cy); ctx.globalCompositeOperation = "screen";
    for (let i = 0; i < 4; i++) {
      const radius = ((time * 0.04 + i * 140) % 560) + 20;
      ctx.beginPath(); ctx.arc(i % 2 ? 7 : -7, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 ? this.store.value.theme.primary : this.store.value.theme.secondary;
      ctx.globalAlpha = (1 - radius / 600) * intensity * 0.18;
      ctx.lineWidth = 3; ctx.stroke();
    }
    ctx.restore();
  }

  private initParticles(): void {
    this.particles = Array.from({ length: 100 }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, size: 0.8 + Math.random() * 2.5, speed: 0.1 + Math.random() * 0.7, phase: Math.random() * Math.PI * 2 }));
  }

  private expirePresets(): void {
    const previous = this.activePresets.length;
    this.activePresets = this.activePresets.filter((active) => active.expiresAt > Date.now());
    if (previous !== this.activePresets.length) this.updateDom();
    if (this.store.value.effects.memoryFragments && this.state.depth >= 55 && Math.random() < 0.015) {
      const messages = ["Listen...", "Focus...", "Let the thoughts drift...", "Deeper with every breath...", "The glow feels familiar..."];
      this.fragment(messages[Math.floor(Math.random() * messages.length)]!);
    }
  }

  private observeChat(): void {
    const target = document.querySelector("#TextAreaChatLog") ?? document.querySelector("#ChatRoomChatLog") ?? document.body;
    this.chatObserver = new MutationObserver((records) => {
      const effects = this.effectiveEffects();
      for (const record of records) for (const node of record.addedNodes) {
        if (!(node instanceof HTMLElement) || !node.classList.contains("ChatMessage")) continue;
        if (effects.chatEcho && this.state.depth >= 35) node.classList.add("sh-chat-echo");
        if (effects.chatDistort && this.state.depth >= 55) node.classList.add("sh-chat-distort");
      }
    });
    this.chatObserver.observe(target, { childList: true, subtree: true });
  }

  private applyCharacterEffects(): void {
    try {
      this.savedExpressions = typeof WardrobeGetExpression === "function" ? { ...WardrobeGetExpression(Player) } : undefined;
      if (typeof CharacterSetFacialExpression === "function") {
        CharacterSetFacialExpression(Player, "Eyes", "Dazed", 0);
        CharacterSetFacialExpression(Player, "Blush", "High", 0);
      }
      if (typeof CharacterRefresh === "function") CharacterRefresh(Player, false);
    } catch (error) { this.runtime.recordError("character effects", error); }
  }

  private restoreCharacterEffects(): void {
    if (!this.savedExpressions) return;
    try {
      for (const [group, expression] of Object.entries(this.savedExpressions)) CharacterSetFacialExpression(Player, group, expression || null, 0);
      CharacterRefresh(Player, false);
    } catch (error) { this.runtime.recordError("restore expressions", error); }
    this.savedExpressions = undefined;
  }

  private drawCharacterHook(args: any[], next: (args: any[]) => any): any {
    const [character, x, y, zoom] = args as [Character, number, number, number];
    const focus = this.state.focusMemberId ?? this.state.activeBy;
    const effects = this.effectiveEffects();
    if (!focus || !effects.focusLock || !character?.MemberNumber || typeof MainCanvas === "undefined") return next(args);
    const isFocus = character.MemberNumber === focus;
    MainCanvas.save();
    if (!isFocus && effects.fadeOthers) MainCanvas.globalAlpha *= Math.max(0.18, 1 - this.state.depth / 120);
    if (isFocus && effects.characterAura) {
      MainCanvas.shadowColor = this.store.value.theme.primary;
      MainCanvas.shadowBlur = 12 + this.effectiveIntensity() * 38;
    }
    const result = next(args);
    if (isFocus && effects.eyeGlow && Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(zoom)) {
      MainCanvas.globalCompositeOperation = "lighter";
      MainCanvas.fillStyle = this.store.value.theme.accent;
      MainCanvas.globalAlpha = 0.12 + this.effectiveIntensity() * 0.2;
      MainCanvas.beginPath(); MainCanvas.arc(x + 250 * zoom, y + 170 * zoom, 90 * zoom, 0, Math.PI * 2); MainCanvas.fill();
    }
    MainCanvas.restore();
    return result;
  }
}
