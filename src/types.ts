export const SH_PROTOCOL = 1 as const;
export const SH_STORAGE_VERSION = 1 as const;

export type ThemeMode = "pinky" | "dark" | "hybrid" | "custom";
export type PerformanceMode = "low" | "balanced" | "high";
export type RestrictionMode = "off" | "trance" | "suggestion" | "both" | "depth";
export type PermissionRole = "self" | "owner" | "lover" | "friend" | "itemPermission" | "whitelist" | "everyone";
export type RemoteCapability =
  | "viewStatus"
  | "trigger"
  | "deepen"
  | "wake"
  | "testEffect"
  | "installSuggestion"
  | "editOwnSuggestion"
  | "removeOwnSuggestion"
  | "editSettings"
  | "startSession"
  | "controlSession";

export type HypnoStage = "awake" | "influenced" | "dazed" | "deep" | "critical" | "trance";
export type TriggerKind = "trigger" | "deepen" | "wake" | "speechBlock" | "speechAllow" | "suggestion" | "combo";
export type TriggerSource = "chat" | "whisper" | "voice" | "activity" | "item" | "api" | "remote";

export interface ThemeSettings {
  mode: ThemeMode;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  glow: number;
  darkness: number;
  animations: boolean;
}

export interface HypnoSettings {
  enabled: boolean;
  depth: number;
  decayPerMinute: number;
  decayDelaySeconds: number;
  autoWakeMinutes: number;
  aftereffectsMinutes: number;
  enterTranceAt: number;
  wakeToDepth: number;
  lucidTrance: boolean;
  preserveDepthAcrossRooms: boolean;
  showPublicStatus: boolean;
}

export interface TriggerDefinition {
  id: string;
  name: string;
  phrase: string;
  kind: TriggerKind;
  enabled: boolean;
  source: TriggerSource[];
  minDepth: number;
  maxDepth: number;
  depthDelta: number;
  cooldownMs: number;
  delayMs: number;
  requiredRepeats: number;
  repeatWindowMs: number;
  comboPhrases: string[];
  effectPresetId?: string;
  suggestionId?: string;
  allowedMemberIds: number[];
  requireNameMention: boolean;
  oneShot: boolean;
  expiresAt?: number;
}

export interface EffectsSettings {
  enabled: boolean;
  intensity: number;
  performance: PerformanceMode;
  reducedMotion: boolean;
  flashProtection: boolean;
  spiral: boolean;
  spiralStyle: "classic" | "double" | "tunnel" | "fracture" | "rings";
  spiralSpeed: number;
  reverseSpiral: boolean;
  vignette: boolean;
  blur: boolean;
  tint: boolean;
  waves: boolean;
  particles: boolean;
  chromatic: boolean;
  doubleVision: boolean;
  trails: boolean;
  glitch: boolean;
  tunnelVision: boolean;
  focusLock: boolean;
  roomAura: boolean;
  dreamMode: boolean;
  memoryFragments: boolean;
  chatEcho: boolean;
  chatDistort: boolean;
  fadeOthers: boolean;
  eyeGlow: boolean;
  characterAura: boolean;
  audioReactive: boolean;
}

export interface SoundDefinition {
  id: string;
  name: string;
  category: SoundCategory;
  url: string;
  enabled: boolean;
  volume: number;
  loop: boolean;
  playbackRate: number;
  pan: number;
  reverb: number;
  echo: number;
  builtIn: boolean;
}

export type SoundCategory = "induction" | "deepen" | "trigger" | "trance" | "suggestion" | "wake" | "ambient" | "heartbeat" | "metronome" | "glitch";

export interface AudioSettings {
  enabled: boolean;
  masterVolume: number;
  duckGameAudio: boolean;
  muteOnEmergency: boolean;
  sounds: SoundDefinition[];
}

export interface RestrictionSettings {
  speech: RestrictionMode;
  walk: RestrictionMode;
  pose: RestrictionMode;
  wardrobe: RestrictionMode;
  interact: RestrictionMode;
  hearing: RestrictionMode;
  sight: RestrictionMode;
  names: RestrictionMode;
  menus: RestrictionMode;
  threshold: number;
  replacementResponses: string[];
  allowedPhrases: string[];
}

export type ResistanceGame = "timing" | "reaction" | "pulse" | "classic" | "multi";
export interface ResistanceSettings {
  enabled: boolean;
  game: ResistanceGame;
  baseDifficulty: number;
  durationMs: number;
  whitelistAutoAccept: number[];
  autoAcceptCapabilities: SuggestionInstructionType[];
  autoAcceptDepth: number;
  askOncePerSession: boolean;
}

export interface InfluenceEntry {
  memberId: number;
  memberName: string;
  trigger: number;
  suggestion: number;
  deepen: number;
  wake: number;
  lastChangedAt: number;
}

export interface PermissionRule {
  enabled: boolean;
  roles: PermissionRole[];
  memberIds: number[];
  minDepth: number;
  requireTrance: boolean;
  requireActiveHypnotizer: boolean;
}

export interface RemoteSettings {
  enabled: boolean;
  capabilities: Record<RemoteCapability, PermissionRule>;
  blockedMemberIds: number[];
  auditLog: boolean;
}

export type SuggestionInstructionType =
  | "effect"
  | "sound"
  | "depth"
  | "trance"
  | "wake"
  | "message"
  | "expression"
  | "pose"
  | "activity"
  | "follow"
  | "say"
  | "strip"
  | "restriction"
  | "wait"
  | "random"
  | "condition"
  | "memory"
  | "aftereffect"
  | "status";

export interface SuggestionInstruction {
  id: string;
  type: SuggestionInstructionType;
  config: Record<string, unknown>;
}


export interface SuggestionPolicy {
  enabled: boolean;
  allowedInstructionTypes: SuggestionInstructionType[];
  allowSelfRemoval: boolean;
  maxSuggestions: number;
  requireTranceForInstall: boolean;
  requireActiveHypnotizerForInstall: boolean;
}

export interface SuggestionDefinition {
  id: string;
  name: string;
  description: string;
  trigger: string;
  installedBy: number;
  installedByName: string;
  installedAt: number;
  exclusive: boolean;
  enabled: boolean;
  requiredDepth: number;
  cooldownMs: number;
  expiresAt?: number;
  maxUses: number;
  uses: number;
  lastUsedAt: number;
  instructions: SuggestionInstruction[];
}

export interface EffectPreset {
  id: string;
  name: string;
  description: string;
  theme?: Partial<ThemeSettings>;
  effects: Partial<EffectsSettings>;
  soundCategory?: SoundCategory;
  durationMs: number;
  depthDelta: number;
}

export interface SessionStep {
  id: string;
  atMs: number;
  action: "effect" | "sound" | "depth" | "message" | "suggestion" | "restriction" | "wake";
  config: Record<string, unknown>;
}

export interface SessionPreset {
  id: string;
  name: string;
  description: string;
  durationMs: number;
  steps: SessionStep[];
}

export interface AccessibilitySettings {
  enabled: boolean;
  reducedMotion: boolean;
  noFlashes: boolean;
  maxBlur: number;
  maxRotation: number;
  highContrastText: boolean;
}

export interface StreamingSettings {
  enabled: boolean;
  hideMemberNumbers: boolean;
  hideNames: boolean;
  hideSuggestionText: boolean;
}

export interface CompatibilitySettings {
  replaceHSC: boolean;
  replaceLSCGHypno: boolean;
  importHSC: boolean;
  importLSCG: boolean;
  bcxVoice: boolean;
  wceCoexistence: boolean;
}

export interface SkyzHypnoSettings {
  storageVersion: number;
  general: {
    enabled: boolean;
    language: "en" | "de";
    emergencyHotkey: string;
    showHud: boolean;
    diagnostics: boolean;
  };
  theme: ThemeSettings;
  hypno: HypnoSettings;
  triggers: TriggerDefinition[];
  effects: EffectsSettings;
  audio: AudioSettings;
  restrictions: RestrictionSettings;
  resistance: ResistanceSettings;
  influence: InfluenceEntry[];
  remote: RemoteSettings;
  suggestionPolicy: SuggestionPolicy;
  suggestions: SuggestionDefinition[];
  presets: EffectPreset[];
  sessions: SessionPreset[];
  accessibility: AccessibilitySettings;
  streaming: StreamingSettings;
  compatibility: CompatibilitySettings;
}

export interface HypnoRuntimeState {
  depth: number;
  stage: HypnoStage;
  trance: boolean;
  lucid: boolean;
  activeBy?: number;
  activeByName?: string;
  enteredAt?: number;
  wakeAt?: number;
  lastDepthChangeAt: number;
  aftereffectsUntil?: number;
  speechAllowed: boolean;
  forcedPhrase?: string;
  focusMemberId?: number;
  sessionId?: string;
}

export interface PublicStatus {
  protocol: number;
  version: string;
  depthBucket: number;
  stage: HypnoStage;
  trance: boolean;
  activeBy?: number;
  capabilities: RemoteCapability[];
  theme: ThemeMode;
}

export type NetworkPacketType =
  | "hello"
  | "sync"
  | "permission.query"
  | "permission.response"
  | "trigger.request"
  | "depth.request"
  | "wake.request"
  | "effect.request"
  | "settings.patch"
  | "suggestion.install"
  | "suggestion.remove"
  | "suggestion.trigger"
  | "session.invite"
  | "session.control"
  | "session.leave"
  | "audit.ack";

export interface NetworkPacket<T = unknown> {
  protocol: number;
  id: string;
  type: NetworkPacketType;
  sender: number;
  target?: number;
  timestamp: number;
  payload: T;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  sender: number;
  senderName: string;
  action: string;
  allowed: boolean;
  detail: string;
}

export interface RuntimeDiagnostics {
  hooks: string[];
  conflicts: string[];
  lastErrors: string[];
  networkPacketsReceived: number;
  networkPacketsRejected: number;
}
