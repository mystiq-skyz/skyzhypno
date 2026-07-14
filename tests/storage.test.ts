import { describe, expect, it } from "vitest";
import { createDefaultSettings } from "@/defaults";
import { deepMerge, sanitizeSettings } from "@/core/storage";

describe("settings", () => {
  it("deep merges imported settings without losing defaults", () => {
    const merged = deepMerge(createDefaultSettings(), { theme: { mode: "dark" }, hypno: { depth: 44 } });
    expect(merged.theme.mode).toBe("dark");
    expect(merged.theme.primary).toBeTruthy();
    expect(merged.hypno.depth).toBe(44);
    expect(merged.effects.spiral).toBe(true);
  });
  it("clamps unsafe numeric settings", () => {
    const settings = createDefaultSettings();
    settings.hypno.depth = 400;
    settings.effects.intensity = -5;
    settings.audio.masterVolume = 10;
    sanitizeSettings(settings);
    expect(settings.hypno.depth).toBe(100);
    expect(settings.effects.intensity).toBe(0);
    expect(settings.audio.masterVolume).toBe(1);
  });
});
