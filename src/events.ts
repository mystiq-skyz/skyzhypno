import type {
  HypnoRuntimeState,
  NetworkPacket,
  SuggestionDefinition,
  TriggerDefinition,
  TriggerSource,
} from "./types";

export interface AppEvents {
  "state.changed": HypnoRuntimeState;
  "depth.changed": { previous: number; current: number; delta: number; source?: number; reason: string };
  "trance.enter": HypnoRuntimeState;
  "trance.wake": HypnoRuntimeState;
  "trigger.matched": { trigger: TriggerDefinition; sender: number; source: TriggerSource; message: string };
  "suggestion.request": { suggestion: SuggestionDefinition; sender: number; command: string };
  "suggestion.executed": { suggestion: SuggestionDefinition; sender: number };
  "network.packet": NetworkPacket;
  "emergency.stop": { reason: string };
  "settings.open": { tab?: string };
}
