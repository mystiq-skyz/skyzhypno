import { describe, expect, it } from "vitest";
import { PermissionService } from "@/core/permissions";
import { createDefaultSettings } from "@/defaults";

describe("receiver permissions", () => {
  it("denies while remote is disabled", () => {
    const settings = createDefaultSettings();
    const runtime = { memberNumber: 1, player: {}, character: () => ({}) } as any;
    const service = new PermissionService(runtime, () => settings);
    expect(service.can({ sender: 2, capability: "wake", depth: 100, trance: true })).toBe(false);
  });
  it("allows exact member only when all conditions pass", () => {
    const settings = createDefaultSettings();
    settings.remote.enabled = true;
    settings.remote.capabilities.wake = { enabled: true, roles: ["whitelist"], memberIds: [2], minDepth: 50, requireTrance: true, requireActiveHypnotizer: true };
    const runtime = { memberNumber: 1, player: {}, character: () => ({}) } as any;
    const service = new PermissionService(runtime, () => settings);
    expect(service.can({ sender: 2, capability: "wake", activeBy: 2, depth: 60, trance: true })).toBe(true);
    expect(service.can({ sender: 2, capability: "wake", activeBy: 3, depth: 60, trance: true })).toBe(false);
    expect(service.can({ sender: 2, capability: "wake", activeBy: 2, depth: 20, trance: true })).toBe(false);
  });
});
