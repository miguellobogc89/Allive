// server/services/recordingEngineService.ts

import {
  startLiveRecording,
  stopLiveRecording,
} from "./liveRecordingService";

import {
  startTrackRecordingSession,
  stopTrackRecordingSession,
} from "../liveRecording";

export type RecordingEngine =
  | "TRACK"
  | "LEGACY";

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
     * TRACK todavía no produce el replay final.
     * recording_key / recording_url se rellenarán
     * después del proceso de mux/finalización.
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
  },
) {
  if (
    recording.engine === "TRACK"
  ) {
    return stopTrackRecordingSession({
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

  return [];
}