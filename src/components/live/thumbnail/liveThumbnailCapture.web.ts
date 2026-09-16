// src/components/live/thumbnail/liveThumbnailCapture.web.ts

import {
  captureLiveThumbnail,
} from "./captureLiveThumbnail.web";

import {
  uploadLiveThumbnail,
} from "./liveThumbnailApi";

const FIRST_CAPTURE_DELAY_MS =
  5_000;

const CAPTURE_INTERVAL_MS =
  5_000;

type StartLiveThumbnailCaptureOptions = {
  liveSessionId: string;
  getMediaStreamTrack: () =>
    MediaStreamTrack | null;
  authToken: string;
};

export type LiveThumbnailCaptureController = {
  stop: () => void;
};

export function startLiveThumbnailCapture({
  liveSessionId,
  getMediaStreamTrack,
  authToken,
}: StartLiveThumbnailCaptureOptions): LiveThumbnailCaptureController {
  let stopped = false;
  let captureRunning = false;

  let firstCaptureTimeout:
    | ReturnType<typeof setTimeout>
    | null = null;

  let captureInterval:
    | ReturnType<typeof setInterval>
    | null = null;

  async function captureAndUpload() {
    if (
      stopped ||
      captureRunning
    ) {
      return;
    }

    const mediaStreamTrack =
      getMediaStreamTrack();

    if (
      !mediaStreamTrack ||
      mediaStreamTrack.kind !== "video" ||
      mediaStreamTrack.readyState !== "live"
    ) {
      return;
    }

    captureRunning = true;

    try {
      const thumbnail =
        await captureLiveThumbnail(
          mediaStreamTrack,
        );

      if (stopped) {
        return;
      }

      const result =
        await uploadLiveThumbnail(
          liveSessionId,
          thumbnail,
          authToken,
        );

      if (stopped) {
        return;
      }

      console.log(
        "Allive thumbnail actualizada:",
        result.thumbnailUrl,
      );
    } catch (error) {
      if (stopped) {
        return;
      }

      console.warn(
        "No se pudo actualizar la thumbnail del LIVE:",
        error,
      );
    } finally {
      captureRunning = false;
    }
  }

  firstCaptureTimeout =
    setTimeout(() => {
      void captureAndUpload();

      if (stopped) {
        return;
      }

      captureInterval =
        setInterval(() => {
          void captureAndUpload();
        }, CAPTURE_INTERVAL_MS);
    }, FIRST_CAPTURE_DELAY_MS);

  return {
    stop() {
      if (stopped) {
        return;
      }

      stopped = true;

      if (
        firstCaptureTimeout
      ) {
        clearTimeout(
          firstCaptureTimeout,
        );

        firstCaptureTimeout =
          null;
      }

      if (
        captureInterval
      ) {
        clearInterval(
          captureInterval,
        );

        captureInterval =
          null;
      }
    },
  };
}