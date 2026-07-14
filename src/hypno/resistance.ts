import type { BCRuntime } from "@/core/runtime";
import type { SettingsStore } from "@/core/storage";
import type { SuggestionDefinition } from "@/types";
import type { HypnoEngine } from "./engine";

export class ResistanceService {
  private active?: { finish: (accepted: boolean) => void };
  private acceptedSessions = new Set<string>();

  constructor(
    private readonly runtime: BCRuntime,
    private readonly store: SettingsStore,
    private readonly hypno: HypnoEngine,
  ) {}

  request(suggestion: SuggestionDefinition, sender: number, influence: number): Promise<boolean> {
    const settings = this.store.value.resistance;
    const state = this.hypno.snapshot;
    if (!settings.enabled) return Promise.resolve(true);
    if (settings.whitelistAutoAccept.includes(sender)) return Promise.resolve(true);
    if (state.depth >= settings.autoAcceptDepth) return Promise.resolve(true);
    if (settings.autoAcceptCapabilities.length > 0 && suggestion.instructions.every((instruction) => settings.autoAcceptCapabilities.includes(instruction.type))) return Promise.resolve(true);
    if (settings.askOncePerSession && state.sessionId && this.acceptedSessions.has(`${state.sessionId}:${sender}`)) return Promise.resolve(true);
    return this.openGame(suggestion, sender, influence);
  }

  cancel(): void {
    this.active?.finish(false);
  }

  private openGame(suggestion: SuggestionDefinition, sender: number, influence: number): Promise<boolean> {
    this.active?.finish(false);
    return new Promise((resolve) => {
      const config = this.store.value.resistance;
      const difficulty = Math.max(0, Math.min(100, config.baseDifficulty * 0.35 + influence * 0.65));
      const overlay = document.createElement("div");
      overlay.id = "sh-resistance";
      overlay.innerHTML = `
        <style>
          #sh-resistance{position:fixed;inset:0;z-index:1000000;display:grid;place-items:center;background:radial-gradient(circle,rgba(86,10,75,.48),rgba(0,0,0,.92));backdrop-filter:blur(9px);font-family:Inter,system-ui;color:white}
          #sh-resistance .card{width:min(680px,92vw);padding:28px;border-radius:28px;border:1px solid rgba(255,91,194,.5);background:linear-gradient(145deg,rgba(34,6,42,.92),rgba(7,4,15,.94));box-shadow:0 0 60px rgba(255,48,167,.25),inset 0 1px rgba(255,255,255,.12);text-align:center}
          #sh-resistance h2{margin:0;color:#ff88d4;text-shadow:0 0 18px #b72aff} #sh-resistance p{opacity:.84}
          #sh-resistance .track{position:relative;height:28px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden;margin:24px 0}
          #sh-resistance .safe{position:absolute;top:0;bottom:0;background:rgba(84,255,191,.36);border:1px solid #54ffbf}
          #sh-resistance .marker{position:absolute;top:-4px;width:8px;height:36px;border-radius:8px;background:#fff;box-shadow:0 0 15px #ff58bd}
          #sh-resistance .pulse{width:150px;height:150px;margin:22px auto;border-radius:50%;border:6px solid #ff58bd;box-shadow:0 0 40px #7d25ff;transform:scale(1)}
          #sh-resistance button{border:0;border-radius:15px;padding:12px 22px;margin:6px;font-weight:800;color:white;cursor:pointer}
          #sh-resistance [data-resist]{background:linear-gradient(135deg,#5d2aff,#d81d8c)} #sh-resistance [data-submit]{background:linear-gradient(135deg,#ff4fa9,#8524ff)}
          #sh-resistance .progress{height:5px;background:rgba(255,255,255,.12);margin-top:18px;border-radius:99px;overflow:hidden}.progress i{display:block;height:100%;background:#ff58bd;width:100%}
        </style>
        <div class="card">
          <h2>${escapeHtml(suggestion.name)}</h2>
          <p>${escapeHtml(this.runtime.characterName(sender))}'s suggestion presses against your thoughts.</p>
          <div data-game></div>
          <button data-resist>Resist</button><button data-submit>Submit</button>
          <div class="progress"><i></i></div>
          <small>Influence ${Math.round(influence)} · Difficulty ${Math.round(difficulty)}</small>
        </div>`;
      document.body.appendChild(overlay);
      const game = overlay.querySelector<HTMLElement>("[data-game]")!;
      const resist = overlay.querySelector<HTMLButtonElement>("[data-resist]")!;
      const submit = overlay.querySelector<HTMLButtonElement>("[data-submit]")!;
      const progress = overlay.querySelector<HTMLElement>(".progress i")!;
      const startedAt = performance.now();
      const duration = Math.max(3_000, config.durationMs);
      let frame = 0;
      let finished = false;
      let successes = 0;
      let reactionAt = startedAt + 900 + Math.random() * Math.max(400, duration - 2200);
      let reactionOpen = false;

      const finish = (accepted: boolean) => {
        if (finished) return;
        finished = true;
        cancelAnimationFrame(frame);
        overlay.remove();
        this.active = undefined;
        if (accepted && config.askOncePerSession && this.hypno.snapshot.sessionId) this.acceptedSessions.add(`${this.hypno.snapshot.sessionId}:${sender}`);
        resolve(accepted);
      };
      this.active = { finish };

      let marker = 0;
      let direction = 1;
      const safeWidth = Math.max(12, 48 - difficulty * 0.32);
      const safeStart = 50 - safeWidth / 2;
      if (config.game === "timing" || config.game === "multi") game.innerHTML = `<div class="track"><div class="safe" style="left:${safeStart}%;width:${safeWidth}%"></div><div class="marker"></div></div><div data-status>${config.game === "multi" ? "Land three successful resistance hits." : "Stop the marker inside the green area."}</div>`;
      else if (config.game === "pulse") game.innerHTML = `<div class="pulse"></div><div>Resist when the pulse is smallest.</div>`;
      else if (config.game === "reaction") game.innerHTML = `<div class="pulse"></div><div data-status>Wait for the glow, then resist quickly.</div>`;
      else game.innerHTML = `<div class="pulse"></div><div>Resistance compares your roll against the influence.</div>`;

      const animate = (now: number) => {
        const elapsed = now - startedAt;
        progress.style.width = `${Math.max(0, 100 * (1 - elapsed / duration))}%`;
        if (elapsed >= duration) { finish(false); return; }
        if (config.game === "timing" || config.game === "multi") {
          marker += direction * (0.8 + difficulty * 0.018);
          if (marker >= 100 || marker <= 0) direction *= -1;
          marker = Math.max(0, Math.min(100, marker));
          const markerEl = game.querySelector<HTMLElement>(".marker"); if (markerEl) markerEl.style.left = `calc(${marker}% - 4px)`;
        } else if (config.game === "pulse" || config.game === "reaction") {
          const pulse = game.querySelector<HTMLElement>(".pulse");
          if (pulse) {
            const scale = 0.55 + (Math.sin(elapsed * 0.007) + 1) * 0.42;
            pulse.style.transform = `scale(${scale})`;
            if (config.game === "reaction" && now >= reactionAt) {
              reactionOpen = true; pulse.style.background = "rgba(84,255,191,.38)";
              const status = game.querySelector<HTMLElement>("[data-status]"); if (status) status.textContent = "NOW!";
            }
          }
        }
        frame = requestAnimationFrame(animate);
      };

      resist.addEventListener("click", () => {
        switch (config.game) {
          case "classic": finish(Math.random() * 100 <= difficulty); break;
          case "timing": finish(!(marker >= safeStart && marker <= safeStart + safeWidth)); break;
          case "multi": {
            const hit = marker >= safeStart && marker <= safeStart + safeWidth;
            if (!hit) { finish(true); break; }
            successes += 1;
            const status = game.querySelector<HTMLElement>("[data-status]"); if (status) status.textContent = `${successes}/3 successful resistance hits`;
            if (successes >= 3) finish(false);
            break;
          }
          case "pulse": {
            const elapsed = performance.now() - startedAt;
            const scale = 0.55 + (Math.sin(elapsed * 0.007) + 1) * 0.42;
            finish(scale > 0.82 + (100 - difficulty) * 0.0015);
            break;
          }
          case "reaction": finish(!(reactionOpen && performance.now() - reactionAt < 900)); break;
        }
      });
      submit.addEventListener("click", () => finish(true));
      frame = requestAnimationFrame(animate);
    });
  }
}

function escapeHtml(value: string): string {
  const element = document.createElement("span"); element.textContent = value; return element.innerHTML;
}
