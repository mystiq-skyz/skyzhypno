import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const noop = vi.fn();

function expose(name: string, value: any) {
  Object.defineProperty(globalThis, name, { value, writable: true, configurable: true });
  Object.defineProperty(window, name, { value, writable: true, configurable: true });
}

describe("browser-like bootstrap", () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '<div id="TextAreaChatLog"></div>';
    const player: any = {
      MemberNumber: 123,
      Name: "Sky",
      Nickname: "Sky",
      ExtensionSettings: {},
      OnlineSettings: {},
      OnlineSharedSettings: {},
      FriendList: [],
      CanTalk: () => true,
      CanWalk: () => true,
      CanChangeClothesOn: () => true,
      CanInteract: () => true,
      CanChangeOwnClothes: () => true,
      IsOwnedByMemberNumber: () => false,
      IsLoverOfMemberNumber: () => false,
    };
    expose("__SH_VERSION__", "0.1.0-test");
    expose("Player", player);
    expose("ChatRoomCharacter", [player]);
    expose("ChatRoomData", {});
    expose("CurrentScreen", "ChatRoom");
    expose("CurrentModule", "Online");
    expose("CurrentTime", Date.now());
    expose("CommonTime", () => Date.now());
    expose("TimerRunInterval", 16);
    expose("ChatRoomTargetMemberNumber", -1);
    expose("ChatRoomHideIconState", 0);
    expose("ChatRoomCharacterViewCharacterCount", 1);
    expose("ServerSend", noop);
    expose("ServerPlayerExtensionSettingsSync", noop);
    expose("CharacterNickname", (c: any) => c.Nickname ?? c.Name ?? "Unknown");
    expose("CharacterRefresh", noop);
    expose("CharacterLoadCanvas", noop);
    expose("ChatRoomCharacterUpdate", noop);
    expose("ServerChatRoomGetAllowItem", () => false);
    expose("ChatRoomMessage", noop);
    expose("ChatRoomSync", noop);
    expose("PreferenceRun", noop);
    expose("PreferenceClick", noop);
    expose("PreferenceRegisterExtensionSetting", vi.fn());
    expose("PreferenceSubscreenExtensionsClear", noop);
    expose("InformationSheetRun", noop);
    expose("InformationSheetClick", noop);
    expose("DrawCharacter", noop);
    expose("ServerSend", noop);
    expose("PoseCanChangeUnaided", () => true);
    expose("CommonSetScreen", noop);
    expose("ChatRoomSafewordRevert", noop);
    expose("ChatRoomSafewordRelease", noop);
    expose("DrawButton", noop);
    expose("MouseIn", () => false);
    expose("WardrobeGetExpression", () => ({}));
    expose("CharacterSetFacialExpression", noop);
    expose("InventoryRemove", noop);
    expose("MainCanvas", {
      save: noop, restore: noop, clearRect: noop, setTransform: noop, translate: noop, rotate: noop,
      beginPath: noop, moveTo: noop, lineTo: noop, arcTo: noop, closePath: noop, stroke: noop, arc: noop, fill: noop, fillText: noop,
      createLinearGradient: () => ({ addColorStop: noop }),
      globalAlpha: 1, globalCompositeOperation: "source-over", strokeStyle: "", fillStyle: "", lineWidth: 1, shadowBlur: 0, shadowColor: "",
    });
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", { configurable: true, value: () => ({
      clearRect: noop, setTransform: noop, save: noop, restore: noop, translate: noop, rotate: noop,
      beginPath: noop, moveTo: noop, lineTo: noop, arcTo: noop, closePath: noop, stroke: noop, arc: noop, fill: noop, fillText: noop,
      createLinearGradient: () => ({ addColorStop: noop }),
      globalAlpha: 1, globalCompositeOperation: "source-over", strokeStyle: "", fillStyle: "", lineWidth: 1, shadowBlur: 0, shadowColor: "",
    }) });
    expose("requestAnimationFrame", () => 1);
    expose("cancelAnimationFrame", noop);
    window.SH = undefined;
    window.SkyzHypno = undefined;
    localStorage.clear();
  });

  afterEach(() => {
    window.SH?.unload();
    document.querySelector("#sh-overlay-root")?.remove();
    document.querySelector("#sh-preferences")?.remove();
  });

  it("initializes, exposes API, opens preferences and emergency-stops", async () => {
    await import("@/main");
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(window.SH).toBeDefined();
    const overlay = document.querySelector<HTMLElement>("#sh-overlay-root");
    expect(overlay).not.toBeNull();
    expect(overlay!.style.display).toBe("none");
    expect(((globalThis as any).PreferenceRegisterExtensionSetting as any)).toHaveBeenCalledWith(expect.objectContaining({ Identifier: "SkyzHypno", ButtonText: "SkyzHypno" }));
    expect(window.SH!.setDepth(65, "test")).toBe(65);
    expect(window.SH!.state.stage).toBe("deep");
    expect(overlay!.style.display).not.toBe("none");
    expect(() => DrawCharacter(Player, 100, 100, 1)).not.toThrow();
    window.SH!.open("effects");
    expect(document.querySelector("#sh-preferences")).not.toBeNull();
    window.SH!.emergencyStop("test");
    expect(window.SH!.state.depth).toBe(0);
  });
});
