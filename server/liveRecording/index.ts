// server/liveRecording/index.ts

import {
  resolveBroadcasterTracks,
} from "./trackResolver";

import {
  startTrackRecording,
  stopTrackRecording,
} from "./trackRecorder";

import type {
  ParallelRecording,
  PersistedTrackRecording,
  TrackRecordingSession,
} from "./types";

/*
 * Motor TRACK de Allive.
 *
 * Graba directamente las pistas publicadas por
 * el broadcaster sin utilizar Room Composite.
 */
export async function startTrackRecordingSession(
  roomName: string,
  liveSessionId: string,
  participantIdentity?: string,
): Promise<TrackRecordingSession> {
  const tracks =
    await resolveBroadcasterTracks(
      roomName,
      participantIdentity,
    );

  let video:
    ParallelRecording["video"] =
      null;

  let audio:
    ParallelRecording["audio"] =
      null;

  try {
    /*
     * Arrancamos primero vídeo y después audio.
     *
     * Esta diferencia temporal se conservará
     * posteriormente para el proceso de mux.
     */
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

    if (!video && !audio) {
      throw new Error(
        "El broadcaster no tiene pistas publicadas para grabar.",
      );
    }

    return {
      engine: "TRACK",

      roomName,

      participantIdentity:
        tracks.participantIdentity,

      videoEgressId:
        video?.egressId ?? null,

      audioEgressId:
        audio?.egressId ?? null,

      videoKey:
        video?.key ?? null,

      audioKey:
        audio?.key ?? null,
    };
  } catch (error) {
    /*
     * Si hemos arrancado vídeo pero falla después
     * el audio, cerramos el Egress ya creado.
     *
     * Así evitamos grabaciones huérfanas y consumo
     * innecesario de LiveKit.
     */
    if (video?.egressId) {
      try {
        await stopTrackRecording(
          video.egressId,
        );
      } catch (stopError) {
        console.error(
          "No se pudo detener el Egress de vídeo tras el fallo:",
          stopError,
        );
      }
    }

    throw error;
  }
}

/*
 * Detiene una grabación TRACK previamente
 * persistida en LiveSession.
 *
 * Esto es importante: no dependemos de memoria
 * del proceso Node. Si el servidor se reinicia,
 * podemos reconstruir la parada desde Neon.
 */
export async function stopTrackRecordingSession(
  recording: PersistedTrackRecording,
) {
  const egressIds = [
    recording.videoEgressId,
    recording.audioEgressId,
  ].filter(
    (
      value,
    ): value is string =>
      Boolean(value),
  );

  if (egressIds.length === 0) {
    return [];
  }

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

/*
 * Compatibilidad temporal con el script de prueba
 * que ya utilizamos.
 *
 * Podemos eliminar estas funciones cuando el motor
 * TRACK esté completamente integrado.
 */
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
      } catch (stopError) {
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

  return Promise.allSettled(
    egressIds.map(
      (egressId) =>
        stopTrackRecording(
          egressId,
        ),
    ),
  );
}

export type {
  BroadcasterTracks,
  ParallelRecording,
  PersistedTrackRecording,
  PublishedTrack,
  TrackRecording,
  TrackRecordingSession,
} from "./types";