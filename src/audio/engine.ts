import type { Lifecycle } from "@/core/lifecycle";
import type { BCRuntime } from "@/core/runtime";
import type { SettingsStore } from "@/core/storage";
import type { SoundCategory, SoundDefinition } from "@/types";

interface ActiveSound { stop: () => void; category: SoundCategory; loop: boolean }

export class AudioEngine {
  private context?: AudioContext;
  private master?: GainNode;
  private analyser?: AnalyserNode;
  private convolver?: ConvolverNode;
  private active = new Set<ActiveSound>();
  private muted = false;

  constructor(
    private readonly runtime: BCRuntime,
    private readonly store: SettingsStore,
    lifecycle: Lifecycle,
  ) {
    lifecycle.add(() => this.stopAll());
    lifecycle.add(() => void this.context?.close());
  }

  async unlock(): Promise<void> {
    const context = this.ensureContext();
    if (!context) return;
    if (context.state === "suspended") await context.resume();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master) this.master.gain.setTargetAtTime(muted ? 0 : this.store.value.audio.masterVolume, this.master.context.currentTime, 0.02);
  }

  get isMuted(): boolean { return this.muted; }

  level(): number {
    if (!this.analyser) return 0;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data.reduce((sum, value) => sum + value, 0) / Math.max(1, data.length) / 255;
  }

  async playCategory(category: SoundCategory, options: { loop?: boolean; random?: boolean } = {}): Promise<void> {
    if (!this.store.value.audio.enabled || this.muted) return;
    const sounds = this.store.value.audio.sounds.filter((sound) => sound.enabled && sound.category === category);
    if (!sounds.length) return;
    const sound = options.random === false ? sounds[0]! : sounds[Math.floor(Math.random() * sounds.length)]!;
    await this.playSound({ ...sound, loop: options.loop ?? sound.loop });
  }

  async playSound(sound: SoundDefinition): Promise<void> {
    if (!this.store.value.audio.enabled || this.muted || !sound.enabled) return;
    try {
      await this.unlock();
      if (sound.url.startsWith("builtin:")) this.playBuiltin(sound);
      else await this.playExternal(sound);
    } catch (error) {
      this.runtime.recordError(`audio ${sound.name}`, error);
    }
  }

  stopCategory(category: SoundCategory): void {
    for (const active of [...this.active]) {
      if (active.category !== category) continue;
      active.stop();
      this.active.delete(active);
    }
  }

  stopAll(): void {
    for (const active of this.active) active.stop();
    this.active.clear();
  }

  private ensureContext(): AudioContext | undefined {
    if (this.context) return this.context;
    const AudioContextCtor = window.AudioContext ?? (window as any).webkitAudioContext;
    if (!AudioContextCtor) return undefined;
    const context = new AudioContextCtor() as AudioContext;
    const master = context.createGain();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    master.gain.value = this.muted ? 0 : this.store.value.audio.masterVolume;
    master.connect(analyser).connect(context.destination);
    this.context = context;
    this.master = master;
    this.analyser = analyser;
    this.convolver = context.createConvolver();
    this.convolver.buffer = this.createImpulse(context, 1.8, 2.5);
    return context;
  }

  private outputChain(sound: SoundDefinition): { input: AudioNode; cleanup: () => void } {
    const context = this.ensureContext();
    if (!context) throw new Error("Web Audio API is unavailable");
    const gain = context.createGain();
    gain.gain.value = sound.volume;
    const pan = context.createStereoPanner();
    pan.pan.value = sound.pan;
    const dry = context.createGain();
    dry.gain.value = 1 - sound.reverb * 0.55;
    const wet = context.createGain();
    wet.gain.value = sound.reverb * 0.55;
    const delay = context.createDelay(1);
    delay.delayTime.value = 0.16;
    const feedback = context.createGain();
    feedback.gain.value = sound.echo * 0.6;
    gain.connect(pan);
    pan.connect(dry).connect(this.master!);
    if (this.convolver) pan.connect(this.convolver).connect(wet).connect(this.master!);
    pan.connect(delay).connect(feedback).connect(delay);
    delay.connect(this.master!);
    return { input: gain, cleanup: () => { gain.disconnect(); pan.disconnect(); dry.disconnect(); wet.disconnect(); delay.disconnect(); feedback.disconnect(); } };
  }

  private playBuiltin(sound: SoundDefinition): void {
    const context = this.ensureContext();
    if (!context) { this.runtime.localMessage("Built-in sounds require Web Audio support.", "warn"); return; }
    const [_, kind, aRaw, bRaw] = sound.url.split(":");
    const a = Number(aRaw) || 220;
    const b = Number(bRaw) || 110;
    const chain = this.outputChain(sound);
    const nodes: AudioScheduledSourceNode[] = [];
    const timers: number[] = [];
    let stopped = false;

    const tone = (frequency: number, duration: number, type: OscillatorType = "sine", at = context.currentTime) => {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, at);
      envelope.gain.setValueAtTime(0.0001, at);
      envelope.gain.exponentialRampToValueAtTime(0.9, at + 0.02);
      envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      oscillator.connect(envelope).connect(chain.input);
      oscillator.start(at);
      oscillator.stop(at + duration + 0.05);
      nodes.push(oscillator);
    };

    const scheduleLoop = (callback: () => void, interval: number) => {
      callback();
      if (sound.loop) timers.push(window.setInterval(callback, interval));
    };

    switch (kind) {
      case "chime":
        tone(a, 0.8, "sine"); tone(a * 1.5, 0.65, "sine", context.currentTime + 0.12); break;
      case "pulse":
        scheduleLoop(() => { tone(a, 0.28, "sine"); tone(a / 2, 0.4, "triangle", context.currentTime + 0.12); }, 1100); break;
      case "sweep": {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(a, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, b), context.currentTime + 1.6);
        envelope.gain.setValueAtTime(0.001, context.currentTime);
        envelope.gain.exponentialRampToValueAtTime(0.8, context.currentTime + 0.1);
        envelope.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.8);
        oscillator.connect(envelope).connect(chain.input); oscillator.start(); oscillator.stop(context.currentTime + 1.9); nodes.push(oscillator); break;
      }
      case "drone": {
        const oscillator = context.createOscillator();
        const lfo = context.createOscillator();
        const lfoGain = context.createGain();
        oscillator.type = "sine"; oscillator.frequency.value = a;
        lfo.frequency.value = 0.12; lfoGain.gain.value = a * 0.05;
        lfo.connect(lfoGain).connect(oscillator.frequency);
        oscillator.connect(chain.input); oscillator.start(); lfo.start(); nodes.push(oscillator, lfo);
        if (!sound.loop) { oscillator.stop(context.currentTime + 8); lfo.stop(context.currentTime + 8); }
        break;
      }
      case "heartbeat": scheduleLoop(() => { tone(72, 0.1, "sine"); tone(55, 0.13, "sine", context.currentTime + 0.18); }, Math.max(450, 60_000 / a)); break;
      case "metronome": scheduleLoop(() => tone(900, 0.06, "square"), Math.max(300, 60_000 / a)); break;
      case "noise": {
        const length = Math.floor(context.sampleRate * Math.max(0.1, a));
        const buffer = context.createBuffer(1, length, context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
        const source = context.createBufferSource(); source.buffer = buffer; source.connect(chain.input); source.start(); nodes.push(source); break;
      }
      default: tone(a, 0.5);
    }

    const active: ActiveSound = {
      category: sound.category,
      loop: sound.loop,
      stop: () => {
        if (stopped) return; stopped = true;
        timers.forEach((timer) => window.clearInterval(timer));
        nodes.forEach((node) => { try { node.stop(); } catch { /* already stopped */ } });
        chain.cleanup();
      },
    };
    this.active.add(active);
    if (!sound.loop) window.setTimeout(() => { active.stop(); this.active.delete(active); }, kind === "drone" ? 8_500 : 3_000);
  }

  private async playExternal(sound: SoundDefinition): Promise<void> {
    const context = this.ensureContext();
    const audio = new Audio(sound.url);
    audio.crossOrigin = "anonymous";
    audio.loop = sound.loop;
    audio.playbackRate = sound.playbackRate;
    let chain: { input: AudioNode; cleanup: () => void } | undefined;
    let source: MediaElementAudioSourceNode | undefined;
    if (context) {
      try {
        chain = this.outputChain(sound);
        source = context.createMediaElementSource(audio);
        source.connect(chain.input);
      } catch {
        chain?.cleanup();
        chain = undefined;
        audio.volume = sound.volume * this.store.value.audio.masterVolume;
      }
    } else {
      audio.volume = sound.volume * this.store.value.audio.masterVolume;
    }
    const active: ActiveSound = {
      category: sound.category,
      loop: sound.loop,
      stop: () => { audio.pause(); audio.src = ""; source?.disconnect(); chain?.cleanup(); },
    };
    this.active.add(active);
    audio.addEventListener("ended", () => { active.stop(); this.active.delete(active); }, { once: true });
    await audio.play();
  }

  private createImpulse(context: AudioContext, duration: number, decay: number): AudioBuffer {
    const length = context.sampleRate * duration;
    const impulse = context.createBuffer(2, length, context.sampleRate);
    for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
    return impulse;
  }
}
