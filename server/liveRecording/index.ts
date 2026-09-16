import {
  resolveBroadcasterTracks,
} from "./trackResolver";

import {
  startTrackRecording,
  stopTrackRecording,
} from "./trackRecorder";

import type {
  ParallelRecording,
} from "./types";

export async function startParallelRecording(
  roomName: string,
  liveSessionId: string,
  participantIdentity?: string,
): Promise<ParallelRecording> {
  const tracks =
    await resolveBroadcasterTracks(
      roomName,
      participantIdentity,
    );

  /*
   * Arrancamos secuencialmente de forma
   * deliberada durante la prueba.
   *
   * Si el audio falla después del vídeo,
   * detenemos el vídeo para no dejar un
   * Egress huérfano.
   */
  let video:
    ParallelRecording["video"] =
      null;

  let audio:
    ParallelRecording["audio"] =
      null;

  try {
    if (tracks.video) {
      video =
        await startTrackRecording(
          roomName,
          liveSessionId,
          "video",
          tracks.video,
        );
    }

    if (tracks.audio) {
      audio =
        await startTrackRecording(
          roomName,
          liveSessionId,
          "audio",
          tracks.audio,
        );
    }

    return {
      roomName,

      participantIdentity:
        tracks.participantIdentity,

      video,
      audio,
    };
  } catch (error) {
    if (video?.egressId) {
      try {
        await stopTrackRecording(
          video.egressId,
        );
      } catch (
        stopError
      ) {
        console.error(
          "No se pudo detener el Egress de vídeo tras el fallo:",
          stopError,
        );
      }
    }

    throw error;
  }
}

export async function stopParallelRecording(
  recording: ParallelRecording,
) {
  const egressIds = [
    recording.video?.egressId,
    recording.audio?.egressId,
  ].filter(
    (
      value,
    ): value is string =>
      Boolean(value),
  );

  const results =
    await Promise.allSettled(
      egressIds.map(
        (egressId) =>
          stopTrackRecording(
            egressId,
          ),
      ),
    );

  return results;
}

export type {
  BroadcasterTracks,
  ParallelRecording,
  PublishedTrack,
  TrackRecording,
} from "./types";
