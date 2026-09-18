import {
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
} from "@livekit/react-native-webrtc";
import { ConnectionState, LocalVideoTrack, Room, TrackEvent } from "livekit-client";

const releasedTracks = new WeakSet<MediaStreamTrack>();
const releasedStreams = new WeakSet<MediaStream>();

function releaseStream(stream: unknown) {
  if (stream instanceof MediaStream && !releasedStreams.has(stream)) {
    releasedStreams.add(stream);
    // Remove stream references without releasing the capture still used by the sender.
    stream.release(false);
  }
}

function releaseCapture(capture: unknown) {
  if (capture instanceof MediaStreamTrack && !releasedTracks.has(capture)) {
    releasedTracks.add(capture);
    capture.stop();
    capture.release();
  }
}

// Only call after disconnect, or for resources no longer used by the published track.
export function releaseNativeCamera(track: LocalVideoTrack) {
  releaseStream(track.mediaStream);
  releaseCapture(track.mediaStreamTrack);
}

export async function replaceNativeCamera(
  room: Room,
  track: LocalVideoTrack,
  facingMode: "user" | "environment",
  canContinue: () => boolean,
) {
  const previousCapture = track.mediaStreamTrack;
  const previousStream = track.mediaStream;
  const settings = previousCapture.getSettings();
  // Additional codec tracks cannot be cloned by this installed RN WebRTC version.
  if (track.simulcastCodecs.size) {
    throw new Error("No se puede cambiar una cámara con pistas de códec adicionales.");
  }
  let acquiredStream: MediaStream | undefined;
  let replacementStarted = false;
  try {
    previousCapture.stop();
    acquiredStream = await mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode,
        width: settings.width,
        height: settings.height,
        frameRate: settings.frameRate,
      },
    });
    const nextCapture = acquiredStream.getVideoTracks()[0];
    if (!canContinue()) return;
    if (!nextCapture || nextCapture.readyState !== "live" ||
        nextCapture.getSettings().facingMode !== facingMode) {
      throw new Error("No se ha podido activar la cámara seleccionada.");
    }
    replacementStarted = true;
    // Retain the LocalVideoTrack, publication and sender. LiveKit updates its capture
    // constraints and encodings; false preserves its ownership/stop semantics.
    await track.replaceTrack(
      nextCapture as unknown as Parameters<LocalVideoTrack["replaceTrack"]>[0],
      false,
    );
  } catch (error) {
    if (replacementStarted) {
      // replaceTrack may fail after changing the sender. Disconnect before releasing
      // either capture; do not attempt another replacement on a partially changed sender.
      await room.disconnect();
      releaseNativeCamera(track);
    }
    throw error;
  } finally {
    // replaceTrack creates another MediaStream, even on some failure paths.
    // Notify RN VideoTrack, which subscribes to Restarted to update its RTCView.
    if (track.mediaStream !== previousStream) {
      track.emit(TrackEvent.Restarted, track);
      releaseStream(previousStream);
    }
    if (track.mediaStreamTrack !== previousCapture) releaseCapture(previousCapture);
    if (acquiredStream) {
      for (const capture of acquiredStream.getTracks()) {
        if (capture !== (track.mediaStreamTrack as unknown)) releaseCapture(capture);
      }
      releaseStream(acquiredStream);
    }
    // A remote disconnect can clear the publication while acquisition is pending.
    if (room.state === ConnectionState.Disconnected) releaseNativeCamera(track);
  }
}
