// src/components/live/broadcast/LiveBroadcastStage.tsx

import type {
  ComponentProps,
  ReactNode,
} from "react";

import {
  View,
} from "react-native";

import {
  LiveFinishModal,
} from "./finish";

import {
  LiveBroadcastOverlay,
} from "./overlay/LiveBroadcastOverlay";

import {
  liveBroadcastStageStyles as styles,
} from "./LiveBroadcastStage.styles";

type LiveBroadcastStageProps = {
  media: ReactNode;

  overlay: ComponentProps<
    typeof LiveBroadcastOverlay
  >;

  finishModal?: ComponentProps<
    typeof LiveFinishModal
  > | null;

  children?: ReactNode;
};

export function LiveBroadcastStage({
  media,
  overlay,
  finishModal = null,
  children,
}: LiveBroadcastStageProps) {
  return (
    <View
      style={
        styles.container
      }
    >
      {media}

      <LiveBroadcastOverlay
        {...overlay}
      />

      {children}

      {finishModal ? (
        <LiveFinishModal
          {...finishModal}
        />
      ) : null}
    </View>
  );
}