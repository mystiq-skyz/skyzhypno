import bcModSDKRef from "bondage-club-mod-sdk";
import type { AuditEntry, RuntimeDiagnostics } from "@/types";

export type HookCallback = (args: any[], next: (args: any[]) => any) => any;

export class BCRuntime {
  private readonly sdk = bcModSDKRef.registerMod({
    name: "SkyzHypno",
    fullName: "SkyzHypno",
    version: __SH_VERSION__,
    repository: "https://github.com/mystiq-skyz/skyzhypno",
  });

  readonly diagnostics: RuntimeDiagnostics = {
    hooks: [],
    conflicts: [],
    lastErrors: [],
    networkPacketsReceived: 0,
    networkPacketsRejected: 0,
  };

  private readonly hookCleanups: Array<() => void> = [];
  private readonly audit: AuditEntry[] = [];

  exists(path: string): boolean {
    return this.get(path) !== undefined;
  }

  get<T = any>(path: string): T | undefined {
    let value: any = globalThis;
    for (const segment of path.split(".")) {
      if (value == null || !(segment in value)) return undefined;
      value = value[segment];
    }
    return value as T;
  }

  hook(path: string, priority: number, callback: HookCallback): () => void {
    if (!this.exists(path)) {
      this.diagnostics.conflicts.push(`Missing hook target: ${path}`);
      return () => undefined;
    }
    try {
      const remove = this.sdk.hookFunction(path as any, priority, callback as any);
      this.hookCleanups.push(remove);
      this.diagnostics.hooks.push(path);
      return remove;
    } catch (error) {
      this.recordError(`Hook ${path}`, error);
      return () => undefined;
    }
  }

  callOriginal(path: string, args: any[]): any {
    return this.sdk.callOriginal(path as any, args as any);
  }

  unload(): void {
    for (const cleanup of this.hookCleanups.splice(0).reverse()) {
      try { cleanup(); } catch (error) { this.recordError("hook cleanup", error); }
    }
    try { this.sdk.unload(); } catch (error) { this.recordError("sdk unload", error); }
  }

  recordError(context: string, error: unknown): void {
    const message = `${context}: ${error instanceof Error ? error.message : String(error)}`;
    this.diagnostics.lastErrors.unshift(message);
    this.diagnostics.lastErrors.length = Math.min(this.diagnostics.lastErrors.length, 20);
    console.error(`[SkyzHypno] ${message}`, error);
  }

  get player(): Character | undefined {
    return typeof Player === "undefined" ? undefined : Player;
  }

  get memberNumber(): number {
    return this.player?.MemberNumber ?? -1;
  }

  get playerName(): string {
    const player = this.player;
    if (!player) return "Unknown";
    try { return typeof CharacterNickname === "function" ? CharacterNickname(player) : player.Nickname || player.Name || "Unknown"; }
    catch { return player.Nickname || player.Name || "Unknown"; }
  }

  character(memberNumber: number): Character | undefined {
    if (memberNumber === this.memberNumber) return this.player;
    return typeof ChatRoomCharacter === "undefined" ? undefined : ChatRoomCharacter.find((character) => character.MemberNumber === memberNumber);
  }

  characterName(memberNumber: number): string {
    const character = this.character(memberNumber);
    if (!character) return `#${memberNumber}`;
    try { return CharacterNickname(character); } catch { return character.Nickname || character.Name || `#${memberNumber}`; }
  }

  inChatRoom(): boolean {
    return typeof CurrentScreen !== "undefined" && CurrentScreen === "ChatRoom";
  }

  sendHidden(message: unknown, target?: number): void {
    if (typeof ServerSend !== "function") return;
    const dictionary = [{ Tag: "SkyzHypno", message }];
    ServerSend("ChatRoomChat", { Type: "Hidden", Content: "SkyzHypno", Target: target, Dictionary: dictionary });
  }

  sendAction(text: string): void {
    if (typeof ServerSend !== "function") return;
    ServerSend("ChatRoomChat", {
      Type: "Action",
      Content: "Beep",
      Dictionary: [{ Tag: "Beep", Text: "msg" }, { Tag: "msg", Text: text }],
    });
  }

  localMessage(text: string, kind: "info" | "warn" | "error" = "info"): void {
    const container = document.querySelector("#TextAreaChatLog") ?? document.querySelector("#ChatRoomChatLog");
    const element = document.createElement("div");
    element.className = `ChatMessage ChatMessageLocalMessage sh-local sh-${kind}`;
    element.textContent = `[SH] ${text}`;
    if (container) container.appendChild(element);
    else console[kind === "error" ? "error" : kind === "warn" ? "warn" : "info"](`[SH] ${text}`);
  }

  auditEntry(entry: AuditEntry): void {
    this.audit.unshift(entry);
    this.audit.length = Math.min(200, this.audit.length);
  }

  getAudit(): readonly AuditEntry[] {
    return this.audit;
  }

  syncExtensionSettings(): void {
    try {
      if (typeof ServerPlayerExtensionSettingsSync === "function") ServerPlayerExtensionSettingsSync("SkyzHypno");
    } catch (error) { this.recordError("settings sync", error); }
  }

  syncOnlineSettings(): void {
    try {
      if (typeof ServerPlayerOnlineSync === "function") ServerPlayerOnlineSync();
    } catch (error) { this.recordError("online settings sync", error); }
  }
}
