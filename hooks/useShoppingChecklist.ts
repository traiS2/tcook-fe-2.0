"use client";

import { useLocalStorageState } from "./useLocalStorageState";

const CHECKED_KEY = "tcook_shop_checked";
const SERVINGS_KEY = "tcook_shop_serv";

export function useShoppingChecklist() {
  const [checked, setChecked] = useLocalStorageState<Record<string, boolean>>(CHECKED_KEY, {});
  const [servings, setServingsRaw] = useLocalStorageState<number>(SERVINGS_KEY, 4);

  const toggle = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetChecks = () => setChecked({});

  const setServings = (n: number) => setServingsRaw(Math.max(1, Math.min(20, n)));

  return { checked, toggle, resetChecks, servings, setServings };
}
