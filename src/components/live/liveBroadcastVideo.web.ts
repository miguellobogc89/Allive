// src/components/live/liveBroadcastVideo.web.ts

import type { Room } from "livekit-client";
import { Track } from "livekit-client";

function applyVideoElementStyles(element: HTMLVideoElement) {
  element.style.position = "absolute";
  element.style.inset = "0";
  element.style.width = "100%";
  element.style.height = "100%";
  element.style.objectFit = "cover";
}

export function attachPreviewStream(
  container: HTMLDivElement,
  stream: MediaStream
) {
  const video = document.createElement("video");

  video.autoplay = true;
  video.playsInline = true;
  video.muted = true;
  video.srcObject = stream;

  applyVideoElementStyles(video);

  container.innerHTML = "";
  container.appendChild(video);

  void video.play().catch((playError) => {
    console.warn("Preview play:", playError);
  });

  return video;
}

export function stopPreviewStream(
  stream: MediaStream | null,
  element: HTMLVideoElement | null
) {
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  if (element) {
    element.pause();
    element.srcObject = null;
    element.remove();
  }
}

export function detachLiveVideo(element: HTMLVideoElement | null) {
  if (!element) {
    return;
  }

  element.pause();
  element.remove();
}

export function attachLiveCamera(room: Room, container: HTMLDivElement) {
  const cameraPublication = room.localParticipant.getTrackPublication(
    Track.Source.Camera
  );

  const cameraTrack = cameraPublication?.track;

  if (!cameraTrack) {
    throw new Error("LiveKit no ha creado la pista de c\u00e1mara.");
  }

  const element = cameraTrack.attach() as HTMLVideoElement;

  element.autoplay = true;
  element.playsInline = true;
  element.muted = true;

  applyVideoElementStyles(element);

  container.innerHTML = "";
  container.appendChild(element);

  void element.play().catch((playError) => {
    console.warn("Live preview play:", playError);
  });

  return element;
}
