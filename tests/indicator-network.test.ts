import { describe, expect, it, vi } from "vitest";
import { EventBus } from "@/core/bus";
import { Lifecycle } from "@/core/lifecycle";
import { createPacket } from "@/core/protocol";
import { createDefaultSettings } from "@/defaults";
import type { AppEvents } from "@/events";
import { NetworkManager } from "@/network/manager";

describe("remote indicator control", () => {
  it("requires both recipient permission and local indicator opt-in", async () => {
    const settings = createDefaultSettings();
    settings.remote.enabled = true;
    settings.remote.capabilities.controlIndicator.enabled = true;
    settings.extreme.allowRemoteIndicatorControl = false;

    const runtime: any = {
      memberNumber: 123, hook: () => () => undefined, inChatRoom: () => false,
      sendHidden: vi.fn(), diagnostics: { networkPacketsRejected: 0, networkPacketsReceived: 0 },
      recordError: vi.fn(), characterName: () => "Trusted", auditEntry: vi.fn(),
    };
    const store: any = { value: settings, update: (fn: (value: typeof settings) => void) => fn(settings) };
    const hypno: any = { snapshot: { depth: 80, trance: true, activeBy: 456 }, publicStatus: vi.fn() };
    const permissions: any = { can: () => true };
    const manager = new NetworkManager(runtime, store, hypno, permissions, {} as any, {} as any, {} as any, new EventBus<AppEvents>(), new Lifecycle());
    const packet = createPacket("indicator.request", 456, { hidden: true }, 123);

    await expect((manager as any).dispatch(packet)).rejects.toThrow(/disabled locally/i);
    settings.extreme.allowRemoteIndicatorControl = true;
    await expect((manager as any).dispatch(packet)).resolves.toBeUndefined();
    expect(settings.extreme.hideOwnIndicator).toBe(true);
  });
});
