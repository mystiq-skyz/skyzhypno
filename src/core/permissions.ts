import type { PermissionRule, RemoteCapability, SkyzHypnoSettings } from "@/types";
import { BCRuntime } from "./runtime";

export interface PermissionContext {
  sender: number;
  capability: RemoteCapability;
  activeBy?: number;
  depth: number;
  trance: boolean;
}

export class PermissionService {
  constructor(
    private readonly runtime: BCRuntime,
    private readonly getSettings: () => SkyzHypnoSettings,
  ) {}

  can(context: PermissionContext): boolean {
    if (context.sender === this.runtime.memberNumber) return true;
    const settings = this.getSettings();
    if (!settings.remote.enabled || settings.remote.blockedMemberIds.includes(context.sender)) return false;
    const rule = settings.remote.capabilities[context.capability];
    if (!rule?.enabled) return false;
    if (context.depth < rule.minDepth) return false;
    if (rule.requireTrance && !context.trance) return false;
    if (rule.requireActiveHypnotizer && context.activeBy !== context.sender) return false;
    return this.matchesRule(context.sender, rule);
  }

  private matchesRule(sender: number, rule: PermissionRule): boolean {
    if (rule.memberIds.includes(sender)) return true;
    const character = this.runtime.character(sender);
    const player = this.runtime.player;
    return rule.roles.some((role) => {
      switch (role) {
        case "self": return sender === this.runtime.memberNumber;
        case "whitelist": return rule.memberIds.includes(sender);
        case "everyone": return true;
        case "owner": return Boolean(player?.IsOwnedByMemberNumber?.(sender));
        case "lover": return Boolean(player?.IsLoverOfMemberNumber?.(sender));
        case "friend": return Boolean(player?.FriendList?.includes(sender));
        case "itemPermission":
          try { return Boolean(character && player && ServerChatRoomGetAllowItem(character, player)); }
          catch { return false; }
        default: return false;
      }
    });
  }
}
