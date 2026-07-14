import { describe, expect, it } from "vitest";
import { stageForDepth } from "@/hypno/engine";

describe("stageForDepth", () => {
  it.each([
    [0, "awake"], [19.9, "awake"], [20, "influenced"], [40, "dazed"], [60, "deep"], [80, "critical"], [100, "trance"],
  ])("maps %s to %s", (depth, stage) => expect(stageForDepth(depth as number)).toBe(stage));
  it("uses trance state regardless of depth", () => expect(stageForDepth(10, true)).toBe("trance"));
});
