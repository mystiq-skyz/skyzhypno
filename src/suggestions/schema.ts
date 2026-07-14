import { z } from "zod";
import type { SuggestionDefinition, SuggestionInstruction } from "@/types";

export const instructionTypes = [
  "effect", "sound", "depth", "trance", "wake", "message", "expression", "pose", "activity", "follow", "say", "strip",
  "restriction", "wait", "random", "condition", "memory", "aftereffect", "status",
] as const;

export const instructionSchema = z.object({
  id: z.string().min(1).max(100),
  type: z.enum(instructionTypes),
  config: z.record(z.unknown()),
}).strict();

export const suggestionSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  trigger: z.string().min(1).max(160),
  installedBy: z.number().int().positive(),
  installedByName: z.string().min(1).max(100),
  installedAt: z.number().int().positive(),
  exclusive: z.boolean(),
  enabled: z.boolean(),
  requiredDepth: z.number().min(0).max(100),
  cooldownMs: z.number().int().min(0).max(86_400_000),
  expiresAt: z.number().int().positive().optional(),
  maxUses: z.number().int().min(0).max(100_000),
  uses: z.number().int().min(0).max(100_000),
  lastUsedAt: z.number().int().min(0),
  instructions: z.array(instructionSchema).min(1).max(30),
}).strict();

export function validateSuggestion(value: unknown): SuggestionDefinition {
  assertNoUnsafeKeys(value);
  let encoded: string;
  try { encoded = JSON.stringify(value); }
  catch { throw new Error("Suggestion must be serializable"); }
  if (encoded.length > 100_000) throw new Error("Suggestion is too large");
  const parsed = suggestionSchema.parse(value) as SuggestionDefinition;
  validateInstructionTree(parsed.instructions, 0, { count: 0 });
  return parsed;
}

export function validateInstructionTree(instructions: SuggestionInstruction[], depth: number, state = { count: 0 }): void {
  if (depth > 4) throw new Error("Suggestion nesting is too deep");
  state.count += instructions.length;
  if (state.count > 200) throw new Error("Suggestion contains too many instructions");
  for (const instruction of instructions) {
    const encoded = JSON.stringify(instruction.config);
    if (encoded.length > 20_000) throw new Error("Instruction configuration is too large");
    for (const key of Object.keys(instruction.config)) if (["__proto__", "prototype", "constructor"].includes(key)) throw new Error("Unsafe instruction key");
    for (const nestedKey of ["instructions", "options", "then", "else"] as const) {
      const nested = instruction.config[nestedKey];
      if (!Array.isArray(nested)) continue;
      const parsed = z.array(instructionSchema).max(20).parse(nested) as SuggestionInstruction[];
      validateInstructionTree(parsed, depth + 1, state);
    }
  }
}

function assertNoUnsafeKeys(value: unknown, seen = new WeakSet<object>()): void {
  if (value === null || typeof value !== "object") return;
  if (seen.has(value as object)) return;
  seen.add(value as object);
  for (const key of Reflect.ownKeys(value as object)) {
    if (typeof key === "string" && ["__proto__", "prototype", "constructor"].includes(key)) throw new Error(`Unsafe key: ${key}`);
    assertNoUnsafeKeys((value as Record<PropertyKey, unknown>)[key], seen);
  }
}
