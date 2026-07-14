import { z } from "zod";
import { SH_PROTOCOL, type NetworkPacket, type NetworkPacketType } from "@/types";

const packetTypes: [NetworkPacketType, ...NetworkPacketType[]] = [
  "hello", "sync", "permission.query", "permission.response", "trigger.request", "depth.request", "wake.request", "effect.request", "settings.patch",
  "suggestion.install", "suggestion.remove", "suggestion.trigger", "session.invite", "session.control", "session.leave", "audit.ack",
];

export const networkPacketSchema = z.object({
  protocol: z.literal(SH_PROTOCOL),
  id: z.string().min(8).max(100),
  type: z.enum(packetTypes),
  sender: z.number().int().positive(),
  target: z.number().int().positive().optional(),
  timestamp: z.number().int().positive(),
  payload: z.unknown(),
}).strict();

export function createPacket<T>(type: NetworkPacketType, sender: number, payload: T, target?: number): NetworkPacket<T> {
  return {
    protocol: SH_PROTOCOL,
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    sender,
    target,
    timestamp: Date.now(),
    payload,
  };
}

export function parsePacket(value: unknown, expectedSender?: number): NetworkPacket | null {
  const result = networkPacketSchema.safeParse(value);
  if (!result.success) return null;
  if (expectedSender !== undefined && result.data.sender !== expectedSender) return null;
  if (Math.abs(Date.now() - result.data.timestamp) > 90_000) return null;
  return result.data as NetworkPacket;
}
