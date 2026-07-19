"use client";

import { useLocalStorageState } from "./useLocalStorageState";

const KEY = "tcook_favs";

export function useFavorites() {
  const [favoriteSlugs, setFavoriteSlugs] = useLocalStorageState<string[]>(KEY, []);

  const isFavorite = (slug: string) => favoriteSlugs.includes(slug);

  const toggleFavorite = (slug: string) => {
    setFavoriteSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const removeFavorite = (slug: string) => {
    setFavoriteSlugs((prev) => prev.filter((s) => s !== slug));
  };

  const clearFavorites = () => setFavoriteSlugs([]);

  return { favoriteSlugs, isFavorite, toggleFavorite, removeFavorite, clearFavorites };
}
