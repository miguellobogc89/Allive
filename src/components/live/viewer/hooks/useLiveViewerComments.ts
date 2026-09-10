// src/components/live/viewer/hooks/useLiveViewerComments.ts

import {
  RoomEvent,
  type Room,
} from "livekit-client";

import {
  useEffect,
  useState,
} from "react";

import type {
  ViewerIdentity,
} from "../../../../auth/types";

import {
  createLiveComment,
  getLiveComments,
  type LiveCommentModel,
} from "../../comments";

import {
  parseLiveRealtimeMessage,
  publishLiveRealtimeMessage,
} from "../../liveRealtime";

type Props = {
  liveId: string;
  room: Room | null;
  viewerIdentity: ViewerIdentity | null;
  authToken: string | null;
};

export function useLiveViewerComments({
  liveId,
  room,
  viewerIdentity,
  authToken,
}: Props) {
  const [
    commentValue,
    setCommentValue,
  ] = useState("");

  const [
    comments,
    setComments,
  ] = useState<LiveCommentModel[]>(
    [],
  );

  const [
    commentSending,
    setCommentSending,
  ] = useState(false);

  useEffect(() => {
    setCommentValue("");
    setComments([]);

    let cancelled = false;

    void getLiveComments(liveId)
      .then((items) => {
        if (!cancelled) {
          setComments(items);
        }
      })
      .catch((error) => {
        console.error(
          "Allive comments load error:",
          error,
        );
      });

    return () => {
      cancelled = true;
    };
  }, [liveId]);

  useEffect(() => {
    if (!room) {
      return;
    }

    const onData = (
      payload: Uint8Array,
    ) => {
      const message =
        parseLiveRealtimeMessage(
          payload,
        );

      if (
        !message ||
        message.comment
          .liveSessionId !== liveId
      ) {
        return;
      }

      setComments(
        (current) =>
          current.some(
            (item) =>
              item.id ===
              message.comment.id,
          )
            ? current
            : [
                ...current,
                message.comment,
              ],
      );
    };

    room.on(
      RoomEvent.DataReceived,
      onData,
    );

    return () => {
      room.off(
        RoomEvent.DataReceived,
        onData,
      );
    };
  }, [
    room,
    liveId,
  ]);

  async function sendComment() {
    const body =
      commentValue.trim();

    if (
      !body ||
      !viewerIdentity ||
      commentSending
    ) {
      return;
    }

    setCommentSending(true);

    try {
      const comment =
        await createLiveComment(
          liveId,
          body,
          viewerIdentity,
          authToken,
        );

      setComments(
        (current) =>
          current.some(
            (item) =>
              item.id === comment.id,
          )
            ? current
            : [
                ...current,
                comment,
              ],
      );

      setCommentValue("");

      if (room) {
        await publishLiveRealtimeMessage(
          room,
          {
            type: "live-comment",
            comment,
          },
        );
      }
    } catch (error) {
      console.error(
        "Allive comment send error:",
        error,
      );
    } finally {
      setCommentSending(false);
    }
  }

  return {
    comments,
    commentValue,
    commentSending,
    setCommentValue,
    sendComment,
  };
}