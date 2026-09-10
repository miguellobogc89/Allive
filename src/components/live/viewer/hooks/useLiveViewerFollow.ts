// src/components/live/viewer/hooks/useLiveViewerFollow.ts

import {
  useEffect,
  useState,
} from "react";

import type {
  ViewerIdentity,
} from "../../../../auth/types";

import {
  followUser,
  getUserProfile,
  unfollowUser,
} from "../../../../api/userProfileApi";

type Props = {
  creatorId?: string;
  viewerIdentity: ViewerIdentity | null;
  authToken: string | null;
};

export function useLiveViewerFollow({
  creatorId,
  viewerIdentity,
  authToken,
}: Props) {
  const [
    followingCreator,
    setFollowingCreator,
  ] = useState(false);

  const [
    followLoading,
    setFollowLoading,
  ] = useState(false);

  const canFollow =
    Boolean(creatorId) &&
    Boolean(authToken) &&
    viewerIdentity?.type === "user" &&
    viewerIdentity.id !== creatorId;

  useEffect(() => {
    if (
      !creatorId ||
      !authToken ||
      viewerIdentity?.type !== "user" ||
      viewerIdentity.id === creatorId
    ) {
      setFollowingCreator(false);
      setFollowLoading(false);
      return;
    }

    let cancelled = false;

    setFollowLoading(true);

    void getUserProfile(
      creatorId,
      authToken,
    )
      .then((profile) => {
        if (!cancelled) {
          setFollowingCreator(
            profile.isFollowing,
          );
        }
      })
      .catch((error) => {
        console.error(
          "No se pudo cargar el estado de follow:",
          error,
        );
      })
      .finally(() => {
        if (!cancelled) {
          setFollowLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    authToken,
    creatorId,
    viewerIdentity,
  ]);

  async function toggleFollow() {
    if (
      !creatorId ||
      !authToken ||
      viewerIdentity?.type !== "user" ||
      viewerIdentity.id === creatorId ||
      followLoading
    ) {
      return;
    }

    const previous =
      followingCreator;

    setFollowLoading(true);
    setFollowingCreator(!previous);

    try {
      const result = previous
        ? await unfollowUser(
            creatorId,
            authToken,
          )
        : await followUser(
            creatorId,
            authToken,
          );

      setFollowingCreator(
        result.isFollowing,
      );
    } catch (error) {
      console.error(
        "No se pudo actualizar follow:",
        error,
      );

      setFollowingCreator(previous);
    } finally {
      setFollowLoading(false);
    }
  }

  return {
    followingCreator,
    followLoading,
    canFollow,
    toggleFollow,
  };
}