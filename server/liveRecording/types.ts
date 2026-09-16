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
