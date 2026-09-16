// server/liveRecording/types.ts
 
export type PublishedTrack = {
  sid: string;
  mimeType: string;
};

export type BroadcasterTracks = {
  participantIdentity: string;
  video: PublishedTrack | null;
  audio: PublishedTrack | null;
};

export type TrackRecording = {
  egressId: string;
  trackSid: string;
  key: string;
  publicUrl: string;
};

export type ParallelRecording = {
  roomName: string;
  participantIdentity: string;
  video: TrackRecording | null;
  audio: TrackRecording | null;
};

/*
 * Resultado que consume la capa de aplicación.
 *
 * A diferencia de ParallelRecording, esta estructura
 * está pensada para persistirse directamente en
 * LiveSession.
 */
export type TrackRecordingSession = {
  engine: "TRACK";

  roomName: string;
  participantIdentity: string;

  videoEgressId: string | null;
  audioEgressId: string | null;

  videoKey: string | null;
  audioKey: string | null;
};

export type PersistedTrackRecording = {
  roomName: string;

  videoEgressId: string | null;
  audioEgressId: string | null;

  videoKey: string | null;
  audioKey: string | null;
};
