// src/components/live/liveAudience.ts

import type {
  Participant,
  Room,
} from "livekit-client";

import type {
  AuthUser,
  ViewerIdentity,
} from "../../auth/types";

import {
  getParticipantRole,
} from "./liveParticipantRole";

export type LiveAudienceUser = {
  id: string;
  username: string;
};

export type LiveAudience = {
  total: number;
  users: LiveAudienceUser[];
  guestCount: number;
};

export type LocalViewer = {
  identity: ViewerIdentity;
  user: AuthUser | null;
};

const EMPTY_AUDIENCE:
  LiveAudience = {
  total: 0,
  users: [],
  guestCount: 0,
};

type ParticipantIdentity = {
  actorType:
    | "user"
    | "guest";
  actorId: string;
  username?: string;
};

function getParticipantIdentity(
  participant: Participant,
): ParticipantIdentity | null {
  const actorType =
    participant.attributes
      ?.actorType;

  const actorId =
    participant.attributes
      ?.actorId;

  const username =
    participant.attributes
      ?.username;

  if (
    (actorType === "user" ||
      actorType === "guest") &&
    actorId
  ) {
    return {
      actorType,
      actorId,
      username,
    };
  }

  if (participant.metadata) {
    try {
      const parsed =
        JSON.parse(
          participant.metadata,
        );

      if (
        (parsed?.actorType ===
          "user" ||
          parsed?.actorType ===
            "guest") &&
        typeof parsed.actorId ===
          "string"
      ) {
        return {
          actorType:
            parsed.actorType,

          actorId:
            parsed.actorId,

          username:
            typeof parsed.username ===
            "string"
              ? parsed.username
              : undefined,
        };
      }
    } catch {
      // Participante legacy.
    }
  }

  if (
    getParticipantRole(
      participant,
    ) !== "viewer"
  ) {
    return null;
  }

  /*
   * Compatibilidad con viewers
   * anteriores al nuevo sistema.
   *
   * Los tratamos como invitados
   * independientes.
   */
  return {
    actorType: "guest",
    actorId:
      participant.identity,
  };
}

export function buildLiveAudience(
  room: Room,
  localViewer: LocalViewer | null,
): LiveAudience {
  const users =
    new Map<
      string,
      LiveAudienceUser
    >();

  const guests =
    new Set<string>();

  room.remoteParticipants.forEach(
    (participant) => {
      if (
        getParticipantRole(
          participant,
        ) !== "viewer"
      ) {
        return;
      }

      const identity =
        getParticipantIdentity(
          participant,
        );

      if (!identity) {
        return;
      }

      if (
        identity.actorType ===
        "user"
      ) {
        users.set(
          identity.actorId,
          {
            id: identity.actorId,

            username:
              identity.username ??
              "usuario",
          },
        );

        return;
      }

      guests.add(
        identity.actorId,
      );
    },
  );

  if (localViewer) {
    if (
      localViewer.identity
        .type === "user"
    ) {
      users.set(
        localViewer.identity.id,
        {
          id:
            localViewer
              .identity.id,

          username:
            localViewer.user
              ?.username ??
            "usuario",
        },
      );
    } else {
      guests.add(
        localViewer.identity.id,
      );
    }
  }

  const audienceUsers =
    Array.from(
      users.values(),
    ).sort((a, b) =>
      a.username.localeCompare(
        b.username,
      ),
    );

  return {
    total:
      audienceUsers.length +
      guests.size,

    users:
      audienceUsers,

    guestCount:
      guests.size,
  };
}

export function emptyLiveAudience() {
  return EMPTY_AUDIENCE;
}