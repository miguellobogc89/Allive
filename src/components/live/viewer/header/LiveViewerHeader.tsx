// src/components/live/viewer/header/LiveViewerHeader.tsx

import {
  VideoViewerHeader,
} from "../../../video/viewer/VideoViewerHeader";

type Props = {
  viewers: number;

  onClose?: () => void;
};

export function LiveViewerHeader({
  viewers,
  onClose,
}: Props) {
  return (
    <VideoViewerHeader
      mode="live"
      viewers={viewers}
      onClose={onClose}
    />
  );
}