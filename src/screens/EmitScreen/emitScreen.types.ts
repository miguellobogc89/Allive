// src/screens/EmitScreen/emitScreen.types.ts

export type EmitScreenStatus = {
  isLive: boolean;
  isConnecting: boolean;
  cameraReady: boolean;
};

export type EmitScreenProps = {
  onStatusChange?: (
    status: EmitScreenStatus,
  ) => void;

  onClose?: () => void;

  onFinishLiveReady?: (
    finishLive:
      | (() => void)
      | null,
  ) => void;

  onStartLiveReady?: (
    startLive:
      | (() => void)
      | null,
  ) => void;
};
