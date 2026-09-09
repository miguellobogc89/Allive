// src/components/search/result-card/SearchResultCard.tsx

import type {
  SearchLive,
  SearchUser,
} from "../../../api/searchApi";

import { LiveSearchCard } from "./LiveSearchCard";
import { PersonSearchCard } from "./PersonSearchCard";

type Props =
  | {
      type: "live";
      live: SearchLive;
      onPress?: () => void;
    }
  | {
      type: "user";
      user: SearchUser;
    };

export function SearchResultCard(
  props: Props,
) {
  if (props.type === "live") {
    return (
      <LiveSearchCard
        live={props.live}
        onPress={props.onPress}
      />
    );
  }

  return (
    <PersonSearchCard
      user={props.user}
    />
  );
}