import { EventBus } from "@/core/bus";
import { CompatibilityService } from "@/core/compatibility";
import { Lifecycle } from "@/core/lifecycle";
import { PermissionService } from "@/core/permissions";
import { BCRuntime } from "@/core/runtime";
import { SettingsStore } from "@/core/storage";
import { AudioEngine } from "@/audio/engine";
import { EffectsEngine } from "@/effects/engine";
import type { AppEvents } from "@/events";
import { HypnoEngine } from "@/hypno/engine";
import { InfluenceService } from "@/hypno/influence";
import { ResistanceService } from "@/hypno/resistance";
import { RestrictionEngine } from "@/hypno/restrictions";
import { TriggerEngine } from "@/hypno/triggers";
import { NetworkManager } from "@/network/manager";
import { PublicApi } from "@/api";
import { SessionDirector } from "@/sessions/director";
import { SuggestionEngine } from "@/suggestions/engine";
import { PreferencesUI } from "@/ui/preferences";

class SkyzHypnoApp {
  readonly runtime = new BCRuntime();
  readonly lifecycle = new Lifecycle();
  readonly bus = new EventBus<AppEvents>();
  readonly store = new SettingsStore(this.runtime);
  readonly compatibility = new CompatibilityService(this.runtime, this.store);
  readonly hypno: HypnoEngine;
  readonly permissions: PermissionService;
  readonly audio: AudioEngine;
  readonly restrictions: RestrictionEngine;
  readonly influence: InfluenceService;
  readonly resistance: ResistanceService;
  readonly effects: EffectsEngine;
  readonly triggers: TriggerEngine;
  readonly suggestions: SuggestionEngine;
  readonly network: NetworkManager;
  readonly sessions: SessionDirector;
  readonly ui: PreferencesUI;
  readonly api: PublicApi;
  private unloaded = false;

  constructor() {
    this.store.load();
    this.compatibility.detect();
    this.compatibility.migrateOnce();
    this.hypno = new HypnoEngine(this.runtime, this.store, this.bus, this.lifecycle);
    this.permissions = new PermissionService(this.runtime, () => this.store.value);
    this.audio = new AudioEngine(this.runtime, this.store, this.lifecycle);
    this.restrictions = new RestrictionEngine(this.runtime, this.store, this.hypno, this.lifecycle);
    this.influence = new InfluenceService(this.runtime, this.store, this.hypno);
    this.resistance = new ResistanceService(this.runtime, this.store, this.hypno);
    this.effects = new EffectsEngine(this.runtime, this.store, this.hypno, this.audio, this.bus, this.lifecycle);
    this.triggers = new TriggerEngine(this.runtime, this.store, this.hypno, this.permissions, this.bus, this.lifecycle);
    this.suggestions = new SuggestionEngine(this.runtime, this.store, this.hypno, this.influence, this.resistance, this.effects, this.audio, this.restrictions, this.permissions, this.bus, this.lifecycle);
    this.network = new NetworkManager(this.runtime, this.store, this.hypno, this.permissions, this.effects, this.triggers, this.suggestions, this.bus, this.lifecycle);
    this.sessions = new SessionDirector(this.runtime, this.store, this.hypno, this.effects, this.audio, this.suggestions, this.restrictions, this.network, this.bus, this.lifecycle);
    this.ui = new PreferencesUI(this.runtime, this.store, this.hypno, this.effects, this.audio, this.suggestions, this.network, this.sessions, this.bus, this.lifecycle);
    this.api = new PublicApi(this.runtime, this.store, this.hypno, this.triggers, this.effects, this.suggestions, this.sessions, this.ui, (reason) => this.bus.emit("emergency.stop", { reason }), () => this.unload());
    this.lifecycle.add(this.bus.on("emergency.stop", () => {
      this.restrictions.clearAll();
      this.suggestions.cancelAll();
      this.effects.clearPresets();
      this.audio.stopAll();
      if (this.store.value.audio.muteOnEmergency) this.audio.setMuted(true);
    }));
    this.installSafetyControls();
    this.network.broadcastHello(true);
    this.runtime.localMessage(`SkyzHypno v${__SH_VERSION__} loaded.`);
  }

  unload(): void {
    if (this.unloaded) return;
    this.unloaded = true;
    this.bus.emit("emergency.stop", { reason: "addon unload" });
    this.store.flush(true);
    this.lifecycle.stop();
    this.bus.clear();
    this.runtime.unload();
    delete window.SkyzHypno;
    delete window.SH;
  }

  private installSafetyControls(): void {
    const keydown = (event: KeyboardEvent) => {
      if (matchesHotkey(event, this.store.value.general.emergencyHotkey)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.bus.emit("emergency.stop", { reason: "emergency hotkey" });
      }
    };
    this.lifecycle.listen(window, "keydown", keydown, { capture: true });
    this.lifecycle.listen(window, "pagehide", () => this.store.flush(true));
    this.lifecycle.listen(window, "beforeunload", () => this.store.flush(true));
    this.lifecycle.interval(() => this.influence.decay(), 30 * 60_000);
  }
}

function matchesHotkey(event: KeyboardEvent, hotkey: string): boolean {
  const parts = hotkey.toLocaleLowerCase().split("+").map((part) => part.trim());
  const key = parts.at(-1);
  return event.key.toLocaleLowerCase() === key
    && event.altKey === parts.includes("alt")
    && event.shiftKey === parts.includes("shift")
    && event.ctrlKey === parts.includes("ctrl")
    && event.metaKey === parts.includes("meta");
}

async function waitForGame(): Promise<void> {
  while (true) {
    const player = (globalThis as any).Player as Character | undefined;
    const screen = (globalThis as any).CurrentScreen as string | undefined;
    if (player?.MemberNumber && screen && screen !== "Login") return;
    await new Promise((resolve) => window.setTimeout(resolve, 200));
  }
}

async function bootstrap(): Promise<void> {
  if (window.SkyzHypno || window.SH) return;
  try {
    await waitForGame();
    const app = new SkyzHypnoApp();
    window.SkyzHypno = app.api;
    window.SH = app.api;
  } catch (error) {
    console.error("[SkyzHypno] Fatal initialization error", error);
    const banner = document.createElement("div");
    banner.style.cssText = "position:fixed;z-index:1000000;left:10px;right:10px;top:10px;padding:14px;border-radius:12px;background:#5b0c29;color:white;font:14px system-ui";
    banner.textContent = `SkyzHypno failed to initialize: ${error instanceof Error ? error.message : String(error)}`;
    document.body.appendChild(banner);
  }
}

void bootstrap();
