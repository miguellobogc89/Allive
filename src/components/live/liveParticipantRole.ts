// src/components/live/liveParticipantRole.ts

import type { Participant } from "livekit-client";

export function getParticipantRole(participant: Participant) {
  const attributeRole = participant.attributes?.role;

  if (attributeRole === "viewer" || attributeRole === "broadcaster") {
    return attributeRole;
  }

  if (participant.metadata) {
    try {
      const parsed = JSON.parse(participant.metadata);

      if (parsed?.role === "viewer" || parsed?.role === "broadcaster") {
        return parsed.role;
      }
    } catch {
      // Fallback a identity.
    }
  }

  if (participant.identity.startsWith("viewer-")) {
    return "viewer";
  }

  if (participant.identity.startsWith("broadcaster-")) {
    return "broadcaster";
  }

  return null;
}
