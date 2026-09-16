// server/services/recordingEngineService.ts

import {
  startLiveRecording,
  stopLiveRecording,
} from "./liveRecordingService";

import {
  startTrackRecordingSession,
  stopTrackRecordingSession,
} from "../liveRecording";

import {
  finalizeTrackReplay,
} from "../liveRecording/trackFinalizer";


export type RecordingEngine =
  | "TRACK"
  | "LEGACY";


type StopRecordingResult = {
  recordingKey: string | null;
  recordingUrl: string | null;
};


function getRecordingEngine(): RecordingEngine {
  const configured =
    process.env.LIVE_RECORDING_ENGINE
      ?.trim()
      .toUpperCase();

  if (configured === "LEGACY") {
    return "LEGACY";
  }

  /*
   * TRACK es el motor principal.
   * LEGACY queda disponible como fallback
   * mediante LIVE_RECORDING_ENGINE=LEGACY.
   */
  return "TRACK";
}


export async function startRecording(
  roomName: string,
  liveSessionId: string,
) {
  const engine =
    getRecordingEngine();

  if (engine === "LEGACY") {
    const recording =
      await startLiveRecording(
        roomName,
        liveSessionId,
      );

    return {
      engine,

      recordingKey:
        recording.key,

      recordingUrl:
        recording.url,

      legacyEgressId:
        recording.egressId,

      videoEgressId: null,
      audioEgressId: null,

      videoKey: null,
      audioKey: null,
    };
  }

  const recording =
    await startTrackRecordingSession(
      roomName,
      liveSessionId,
    );

  return {
    engine,

    /*
     * TRACK genera primero las pistas RAW.
     * recording_key y recording_url se crearán
     * al finalizar el LIVE mediante el mux.
     */
    recordingKey: null,
    recordingUrl: null,
    legacyEgressId: null,

    videoEgressId:
      recording.videoEgressId,

    audioEgressId:
      recording.audioEgressId,

    videoKey:
      recording.videoKey,

    audioKey:
      recording.audioKey,
  };
}


export async function stopRecording(
  recording: {
    engine: string | null;

    legacyEgressId:
      string | null;

    videoEgressId:
      string | null;

    audioEgressId:
      string | null;

    videoKey:
      string | null;

    audioKey:
      string | null;

    roomName: string;

    liveSessionId: string;
  },
): Promise<StopRecordingResult> {
  if (
    recording.engine === "TRACK"
  ) {
    /*
     * Primero detenemos ambos Track Egress.
     *
     * LiveKit termina entonces de escribir
     * los archivos RAW en R2.
     */
    const stopResults =
      await stopTrackRecordingSession({
        roomName:
          recording.roomName,

        videoEgressId:
          recording.videoEgressId,

        audioEgressId:
          recording.audioEgressId,

        videoKey:
          recording.videoKey,

        audioKey:
          recording.audioKey,
      });

    /*
     * Si LiveKit no pudo detener alguno de los
     * Egress, no intentamos generar un replay
     * potencialmente incompleto.
     */
    const failedStop =
      stopResults.find(
        (result) =>
          result.status ===
          "rejected",
      );

    if (failedStop) {
      throw new Error(
        `No se pudo detener correctamente Track Egress: ${String(
          failedStop.reason,
        )}`,
      );
    }

    /*
     * Una vez cerrados los Egress, esperamos
     * los objetos de R2 y hacemos el mux.
     */
    const finalizedReplay =
      await finalizeTrackReplay(
        recording.liveSessionId,
        recording.videoKey,
        recording.audioKey,
      );

    return {
      recordingKey:
        finalizedReplay.key,

      recordingUrl:
        finalizedReplay.url,
    };
  }

  if (
    !recording.legacyEgressId
  ) {
    throw new Error(
      "La grabación LEGACY no tiene recording_egress_id.",
    );
  }

  await stopLiveRecording(
    recording.legacyEgressId,
  );

  /*
   * LEGACY ya tiene recording_key y recording_url
   * desde el inicio. No generamos nada adicional.
   */
  return {
    recordingKey: null,
    recordingUrl: null,
  };
}
