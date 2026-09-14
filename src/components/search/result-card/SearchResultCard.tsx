// src/components/search/result-card/SearchResultCard.tsx

import type {
  SearchContent,
  SearchUser,
} from "../../../api/searchApi";

import { LiveSearchCard } from "./LiveSearchCard";
import { PersonSearchCard } from "./PersonSearchCard";
import { ReplaySearchCard } from "./ReplaySearchCard";

type Props =
  | {
      type: "content";
      content: SearchContent;
      onPress?: () => void;
    }
  | {
      type: "user";
      user: SearchUser;
      onPress?: () => void;
    };

export function SearchResultCard(
  props: Props,
) {
  if (props.type === "user") {
    return (
      <PersonSearchCard
        user={props.user}
        onPress={props.onPress}
      />
    );
  }

  if (
    props.content.contentType ===
    "live"
  ) {
    return (
      <LiveSearchCard
        content={props.content}
        onPress={props.onPress}
      />
    );
  }

  return (
    <ReplaySearchCard
      content={props.content}
      onPress={props.onPress}
    />
  );
}