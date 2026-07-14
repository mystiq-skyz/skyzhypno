import { describe, expect, it } from "vitest";
import { phraseMatches } from "@/hypno/triggers";

describe("phrase matching", () => {
  it("matches normalized complete phrases", () => {
    expect(phraseMatches("Please SINK FOR ME, now.", "sink for me")).toBe(true);
    expect(phraseMatches("deeper!", "deeper")).toBe(true);
  });
  it("does not match inside words", () => expect(phraseMatches("undeeper", "deeper")).toBe(false));
  it("ignores OOC parenthetical text", () => expect(phraseMatches("(sink for me)", "sink for me")).toBe(false));
  it("handles regex characters safely", () => expect(phraseMatches("focus [now]", "focus [now]")).toBe(true));
});
