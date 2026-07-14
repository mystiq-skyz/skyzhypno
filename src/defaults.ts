import type {
  EffectPreset,
  PermissionRule,
  RemoteCapability,
  SessionPreset,
  SkyzHypnoSettings,
  SoundDefinition,
  TriggerDefinition,
} from "./types";
import { SH_STORAGE_VERSION } from "./types";

const id = (prefix: string) => `${prefix}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;

const disabledPermission = (): PermissionRule => ({
  enabled: false,
  roles: ["whitelist"],
  memberIds: [],
  minDepth: 0,
  requireTrance: false,
  requireActiveHypnotizer: false,
});

const capabilities: RemoteCapability[] = [
  "viewStatus",
  "trigger",
  "deepen",
  "wake",
  "testEffect",
  "installSuggestion",
  "editOwnSuggestion",
  "removeOwnSuggestion",
  "editSettings",
  "startSession",
  "controlSession",
];

const defaultSounds = (): SoundDefinition[] => [
  { id: id("sound"), name: "Induction shimmer", category: "induction", url: "builtin:sweep:760:180", enabled: true, volume: 0.42, loop: false, playbackRate: 1, pan: 0, reverb: 0.48, echo: 0.16, builtIn: true },
  { id: id("sound"), name: "Soft trigger chime", category: "trigger", url: "builtin:chime:523.25", enabled: true, volume: 0.55, loop: false, playbackRate: 1, pan: 0, reverb: 0.2, echo: 0.08, builtIn: true },
  { id: id("sound"), name: "Deepening pulse", category: "deepen", url: "builtin:pulse:110", enabled: true, volume: 0.45, loop: false, playbackRate: 1, pan: 0, reverb: 0.35, echo: 0.18, builtIn: true },
  { id: id("sound"), name: "Trance drop", category: "trance", url: "builtin:sweep:420:72", enabled: true, volume: 0.65, loop: false, playbackRate: 1, pan: 0, reverb: 0.5, echo: 0.15, builtIn: true },
  { id: id("sound"), name: "Suggestion bell", category: "suggestion", url: "builtin:chime:659.25", enabled: true, volume: 0.5, loop: false, playbackRate: 1, pan: 0.1, reverb: 0.4, echo: 0.2, builtIn: true },
  { id: id("sound"), name: "Wake shimmer", category: "wake", url: "builtin:sweep:180:720", enabled: true, volume: 0.55, loop: false, playbackRate: 1, pan: 0, reverb: 0.4, echo: 0.1, builtIn: true },
  { id: id("sound"), name: "Low ambient drone", category: "ambient", url: "builtin:drone:55", enabled: true, volume: 0.18, loop: true, playbackRate: 1, pan: 0, reverb: 0.6, echo: 0.05, builtIn: true },
  { id: id("sound"), name: "Heartbeat", category: "heartbeat", url: "builtin:heartbeat:68", enabled: true, volume: 0.3, loop: true, playbackRate: 1, pan: 0, reverb: 0.1, echo: 0, builtIn: true },
  { id: id("sound"), name: "Metronome", category: "metronome", url: "builtin:metronome:54", enabled: true, volume: 0.2, loop: true, playbackRate: 1, pan: 0, reverb: 0.05, echo: 0, builtIn: true },
  { id: id("sound"), name: "Dark glitch", category: "glitch", url: "builtin:noise:0.35", enabled: true, volume: 0.2, loop: false, playbackRate: 1, pan: 0, reverb: 0.2, echo: 0.12, builtIn: true },
];

const defaultTriggers = (): TriggerDefinition[] => [
  {
    id: id("trigger"), name: "Default induction", phrase: "sink for me", kind: "trigger", enabled: true,
    source: ["chat", "whisper", "voice", "remote"], minDepth: 0, maxDepth: 100, depthDelta: 35, cooldownMs: 10_000,
    delayMs: 0, requiredRepeats: 1, repeatWindowMs: 30_000, comboPhrases: [], allowedMemberIds: [], requireNameMention: false, oneShot: false,
    effectPresetId: "preset-soft-induction",
  },
  {
    id: id("trigger"), name: "Default deepener", phrase: "deeper", kind: "deepen", enabled: true,
    source: ["chat", "whisper", "voice", "remote"], minDepth: 10, maxDepth: 100, depthDelta: 18, cooldownMs: 4_000,
    delayMs: 0, requiredRepeats: 1, repeatWindowMs: 20_000, comboPhrases: [], allowedMemberIds: [], requireNameMention: false, oneShot: false,
    effectPresetId: "preset-deep-trance",
  },
  {
    id: id("trigger"), name: "Default awakener", phrase: "wide awake", kind: "wake", enabled: true,
    source: ["chat", "whisper", "voice", "remote"], minDepth: 0, maxDepth: 100, depthDelta: 0, cooldownMs: 1_000,
    delayMs: 0, requiredRepeats: 1, repeatWindowMs: 20_000, comboPhrases: [], allowedMemberIds: [], requireNameMention: false, oneShot: false,
    effectPresetId: "preset-wake",
  },
];

const defaultPresets = (): EffectPreset[] => [
  {
    id: "preset-soft-induction", name: "Soft Induction", description: "Gentle pink glow, soft spiral and a calm chime.",
    effects: { spiral: true, vignette: true, particles: true, blur: true, intensity: 0.35, glitch: false },
    soundCategory: "induction", durationMs: 12_000, depthDelta: 10,
  },
  {
    id: "preset-deep-trance", name: "Deep Trance", description: "Dark tunnel, double vision, waves and a deep pulse.",
    theme: { mode: "hybrid", darkness: 0.75, glow: 0.85 },
    effects: { spiral: true, tunnelVision: true, doubleVision: true, waves: true, vignette: true, blur: true, intensity: 0.78 },
    soundCategory: "deepen", durationMs: 18_000, depthDelta: 18,
  },
  {
    id: "preset-dream", name: "Dream Mode", description: "Soft drifting text, particles and memory fragments.",
    effects: { dreamMode: true, particles: true, chatEcho: true, memoryFragments: true, trails: true, intensity: 0.55 },
    soundCategory: "ambient", durationMs: 60_000, depthDelta: 8,
  },
  {
    id: "preset-glitch", name: "Glitch Hypnosis", description: "Creepy chromatic distortion and sharp visual glitches.",
    theme: { mode: "dark", primary: "#ff2f92", secondary: "#3b001f", accent: "#8c4cff" },
    effects: { glitch: true, chromatic: true, doubleVision: true, chatDistort: true, eyeGlow: true, intensity: 0.72 },
    soundCategory: "glitch", durationMs: 14_000, depthDelta: 12,
  },
  {
    id: "preset-wake", name: "Gentle Wake", description: "A bright shimmer that clears visual effects.",
    effects: { spiral: false, blur: false, vignette: false, particles: true, intensity: 0.25 },
    soundCategory: "wake", durationMs: 4_000, depthDelta: -100,
  },
];

const defaultSessions = (): SessionPreset[] => [
  {
    id: "session-soft", name: "Soft Induction", description: "Five-minute gradual induction with a gentle wake-up.", durationMs: 300_000,
    steps: [
      { id: id("step"), atMs: 0, action: "sound", config: { category: "ambient", loop: true } },
      { id: id("step"), atMs: 5_000, action: "effect", config: { presetId: "preset-soft-induction" } },
      { id: id("step"), atMs: 30_000, action: "depth", config: { delta: 10 } },
      { id: id("step"), atMs: 75_000, action: "effect", config: { presetId: "preset-dream" } },
      { id: id("step"), atMs: 120_000, action: "depth", config: { delta: 20 } },
      { id: id("step"), atMs: 200_000, action: "effect", config: { presetId: "preset-deep-trance" } },
      { id: id("step"), atMs: 285_000, action: "wake", config: {} },
    ],
  },
];

export function createDefaultSettings(): SkyzHypnoSettings {
  return {
    storageVersion: SH_STORAGE_VERSION,
    general: { enabled: true, language: "en", emergencyHotkey: "Alt+Shift+H", showHud: true, diagnostics: false },
    theme: { mode: "hybrid", primary: "#ff58bd", secondary: "#731dff", accent: "#ff9fe2", background: "#09030f", glow: 0.8, darkness: 0.65, animations: true },
    hypno: { enabled: true, depth: 0, decayPerMinute: 1.5, decayDelaySeconds: 45, autoWakeMinutes: 10, aftereffectsMinutes: 2, enterTranceAt: 100, wakeToDepth: 0, lucidTrance: false, preserveDepthAcrossRooms: true, showPublicStatus: true },
    triggers: defaultTriggers(),
    effects: {
      enabled: true, intensity: 0.7, performance: "balanced", reducedMotion: false, flashProtection: true,
      spiral: true, spiralStyle: "double", spiralSpeed: 0.65, reverseSpiral: false, vignette: true, blur: true, tint: true,
      waves: true, particles: true, chromatic: true, doubleVision: true, trails: true, glitch: true, tunnelVision: true,
      focusLock: true, roomAura: true, dreamMode: true, memoryFragments: true, chatEcho: true, chatDistort: true,
      fadeOthers: true, eyeGlow: true, characterAura: true, audioReactive: true,
    },
    audio: { enabled: true, masterVolume: 0.7, duckGameAudio: false, muteOnEmergency: true, sounds: defaultSounds() },
    restrictions: {
      speech: "trance", walk: "off", pose: "suggestion", wardrobe: "suggestion", interact: "off", hearing: "off", sight: "depth", names: "depth", menus: "off",
      threshold: 75, replacementResponses: ["...", "Yes...", "Deeper...", "I understand."], allowedPhrases: ["/", "*", "(", "."],
    },
    resistance: { enabled: true, game: "timing", baseDifficulty: 35, durationMs: 8_000, whitelistAutoAccept: [], autoAcceptCapabilities: [], autoAcceptDepth: 101, askOncePerSession: false },
    influence: [],
    remote: {
      enabled: false,
      capabilities: Object.fromEntries(capabilities.map((capability) => [capability, disabledPermission()])) as SkyzHypnoSettings["remote"]["capabilities"],
      blockedMemberIds: [], auditLog: true,
    },
    suggestionPolicy: {
      enabled: true,
      allowedInstructionTypes: ["effect", "sound", "depth", "trance", "wake", "message", "expression", "pose", "activity", "follow", "say", "strip", "restriction", "wait", "random", "condition", "memory", "aftereffect", "status"],
      allowSelfRemoval: true, maxSuggestions: 100, requireTranceForInstall: true, requireActiveHypnotizerForInstall: true,
    },
    suggestions: [],
    presets: defaultPresets(),
    sessions: defaultSessions(),
    accessibility: { enabled: false, reducedMotion: false, noFlashes: true, maxBlur: 8, maxRotation: 2, highContrastText: true },
    streaming: { enabled: false, hideMemberNumbers: true, hideNames: false, hideSuggestionText: true },
    compatibility: { replaceHSC: true, replaceLSCGHypno: true, importHSC: true, importLSCG: true, bcxVoice: true, wceCoexistence: true },
  };
}
