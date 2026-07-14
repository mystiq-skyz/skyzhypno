import { describe, expect, it, vi } from "vitest";
import { createPacket, parsePacket } from "@/core/protocol";

describe("network protocol", () => {
  it("creates and parses a current packet", () => {
    const packet = createPacket("wake.request", 123, {}, 456);
    expect(parsePacket(packet, 123)).toEqual(packet);
  });
  it("supports recipient-validated indicator control packets", () => {
    const packet = createPacket("indicator.request", 123, { hidden: true }, 456);
    expect(parsePacket(packet, 123)?.type).toBe("indicator.request");
  });
  it("rejects forged sender", () => {
    const packet = createPacket("wake.request", 123, {});
    expect(parsePacket(packet, 999)).toBeNull();
  });
  it("rejects stale packets", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const packet = createPacket("wake.request", 123, {});
    vi.setSystemTime(new Date("2026-01-01T00:02:00Z"));
    expect(parsePacket(packet, 123)).toBeNull();
    vi.useRealTimers();
  });
});
