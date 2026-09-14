import type {
  ReplayItem,
} from "../../api/replayApi";

import type {
  ActiveLive,
} from "../../components/live/types";

import type {
  MapContentGroup,
  MapContentItem,
} from "../types/mapTypes";

const MAP_GROUP_GRID_SIZE =
  0.002;

function hasValidCoordinate(
  latitude: unknown,
  longitude: unknown,
) {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    Math.abs(latitude) <= 90 &&
    typeof longitude === "number" &&
    Number.isFinite(longitude) &&
    Math.abs(longitude) <= 180
  );
}

export function normalizeLiveForMap(
  live: ActiveLive,
): MapContentItem | null {
  const {
    latitude,
    longitude,
  } = live;

  if (
    !hasValidCoordinate(
      latitude,
      longitude,
    )
  ) {
    return null;
  }

  const mapLatitude =
    latitude as number;

  const mapLongitude =
    longitude as number;

  return {
    id: live.id,
    kind: "live",
    latitude: mapLatitude,
    longitude: mapLongitude,
    title: live.title ?? null,
    description: null,
    eventName:
      live.eventName ?? null,
    placeName:
      live.placeName ?? null,
    thumbnailUrl:
      live.thumbnailUrl ?? null,
    startedAt: null,
    endedAt: null,
    replayVisibleUntil: null,
    viewerCount:
      live.viewerCount ?? null,
    likeCount:
      live.likeCount ?? null,
    creator:
      live.creator ?? null,
  };
}

export function normalizeReplayForMap(
  replay: ReplayItem,
): MapContentItem | null {
  const {
    latitude,
    longitude,
  } = replay;

  if (
    !hasValidCoordinate(
      latitude,
      longitude,
    )
  ) {
    return null;
  }

  const mapLatitude =
    latitude as number;

  const mapLongitude =
    longitude as number;

  return {
    id: replay.id,
    kind: "replay",
    latitude: mapLatitude,
    longitude: mapLongitude,
    title: replay.title,
    description:
      replay.description,
    eventName:
      replay.eventName,
    placeName:
      replay.placeName,
    thumbnailUrl:
      replay.thumbnailUrl,
    startedAt:
      replay.startedAt,
    endedAt: replay.endedAt,
    replayVisibleUntil:
      replay.replayVisibleUntil,
    viewerCount: null,
    likeCount:
      replay.likeCount,
    creator:
      replay.creator,
  };
}

function getGroupKey(
  item: MapContentItem,
) {
  const latCell =
    Math.round(
      item.latitude /
        MAP_GROUP_GRID_SIZE,
    );

  const lngCell =
    Math.round(
      item.longitude /
        MAP_GROUP_GRID_SIZE,
    );

  return `${latCell}:${lngCell}`;
}

export function groupMapContent(
  items: MapContentItem[],
): MapContentGroup[] {
  const groups =
    new Map<
      string,
      MapContentItem[]
    >();

  for (const item of items) {
    const key =
      getGroupKey(item);

    const current =
      groups.get(key) ?? [];

    current.push(item);
    groups.set(key, current);
  }

  return Array.from(
    groups.entries(),
  ).map(([key, groupItems]) => {
    const latitude =
      groupItems.reduce(
        (total, item) =>
          total + item.latitude,
        0,
      ) / groupItems.length;

    const longitude =
      groupItems.reduce(
        (total, item) =>
          total + item.longitude,
        0,
      ) / groupItems.length;

    return {
      id: key,
      latitude,
      longitude,
      items: groupItems,
    };
  });
}
