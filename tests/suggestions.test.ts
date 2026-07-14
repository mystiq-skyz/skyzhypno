import { describe, expect, it } from "vitest";
import { validateSuggestion } from "@/suggestions/schema";

const base = () => ({
  id: "suggestion-123", name: "Test", description: "", trigger: "obey", installedBy: 123, installedByName: "Tester", installedAt: Date.now(),
  exclusive: false, enabled: true, requiredDepth: 0, cooldownMs: 0, maxUses: 0, uses: 0, lastUsedAt: 0,
  instructions: [{ id: "instruction-1", type: "message", config: { text: "Hello" } }],
});

describe("suggestion validation", () => {
  it("accepts known data-only instructions", () => expect(validateSuggestion(base()).name).toBe("Test"));
  it("accepts implanted command instructions", () => {
    const suggestion = base();
    suggestion.instructions[0] = { id: "command-1", type: "command", config: { mode: "say", text: "Yes, I understand." } } as any;
    expect(validateSuggestion(suggestion).instructions[0]?.type).toBe("command");
  });
  it("rejects unknown executable instruction types", () => {
    const suggestion = base();
    suggestion.instructions[0] = { id: "bad", type: "javascript", config: { code: "alert(1)" } } as any;
    expect(() => validateSuggestion(suggestion)).toThrow();
  });
  it("rejects prototype pollution keys", () => {
    const suggestion = base();
    suggestion.instructions[0]!.config = JSON.parse('{"__proto__":{"polluted":true}}');
    expect(() => validateSuggestion(suggestion)).toThrow();
  });
  it("rejects excessive nesting", () => {
    const suggestion = base();
    let node: any = { id: "root", type: "condition", config: { kind: "depth", then: [] } };
    suggestion.instructions = [node];
    for (let i = 0; i < 6; i++) {
      const child = { id: `child-${i}`, type: "condition", config: { kind: "depth", then: [] } };
      node.config.then = [child]; node = child;
    }
    expect(() => validateSuggestion(suggestion)).toThrow(/nesting/i);
  });
});
