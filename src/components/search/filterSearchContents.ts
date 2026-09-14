// src/components/search/filterSearchContents.ts

import type {
  SearchContent,
} from "../../api/searchApi";

import type {
  SearchTab,
} from "./SearchTabs";

export function filterSearchContents(
  contents: SearchContent[],
  activeTab: SearchTab,
): SearchContent[] {
  if (activeTab === "live") {
    return contents.filter(
      (content) =>
        content.contentType ===
        "live",
    );
  }

  if (activeTab === "nearby") {
    return contents.filter(
      (content) =>
        content.latitude !== null &&
        content.longitude !== null,
    );
  }

  return contents;
}