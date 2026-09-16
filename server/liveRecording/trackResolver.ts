import {
  TrackType,
} from "livekit-server-sdk";

import {
  roomServiceClient,
} from "./clients";

import type {
  BroadcasterTracks,
  PublishedTrack,
} from "./types";

export async function resolveBroadcasterTracks(
  roomName: string,
  participantIdentity?: string,
): Promise<BroadcasterTracks> {
  const participants =
    await roomServiceClient
      .listParticipants(
        roomName,
      );

  const participant =
    participantIdentity
      ? participants.find(
          (item) =>
            item.identity ===
            participantIdentity,
        )
      : participants.find(
          (item) =>
            item.identity.startsWith(
              "broadcaster-",
            ),
        );

  if (!participant) {
    throw new Error(
      participantIdentity
        ? `No existe el participante ${participantIdentity} en ${roomName}.`
        : `No se encontró broadcaster en ${roomName}.`,
    );
  }

  let video:
    PublishedTrack | null =
      null;

  let audio:
    PublishedTrack | null =
      null;

  for (
    const track of
    participant.tracks
  ) {
    if (
      track.type ===
        TrackType.VIDEO &&
      !video
    ) {
      video = {
        sid: track.sid,
        mimeType:
          track.mimeType,
      };
    }

    if (
      track.type ===
        TrackType.AUDIO &&
      !audio
    ) {
      audio = {
        sid: track.sid,
        mimeType:
          track.mimeType,
      };
    }
  }

  if (!video && !audio) {
    throw new Error(
      `El broadcaster ${participant.identity} no tiene pistas publicadas.`,
    );
  }

  return {
    participantIdentity:
      participant.identity,

    video,
    audio,
  };
}
