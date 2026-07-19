"use client";

import { useLocalStorageState } from "./useLocalStorageState";

const KEY = "tcook_views";
const MAX_VIEWS = 12;

export function useRecentViews() {
  const [viewedSlugs, setViewedSlugs] = useLocalStorageState<string[]>(KEY, []);

  const recordView = (slug: string) => {
    setViewedSlugs((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX_VIEWS));
  };

  return { viewedSlugs, recordView };
}
