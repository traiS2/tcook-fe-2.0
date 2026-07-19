"use client";

import { useLocalStorageState } from "./useLocalStorageState";

const KEY = "tcook_planner";

export interface MealSlot {
  slug: string;
}

/** Plan keyed by `${dayIndex}-${mealId}`, e.g. "0-sang". */
export type MealPlan = Record<string, MealSlot>;

export const MEALS = [
  { id: "sang", label: "Bữa sáng" },
  { id: "trua", label: "Bữa trưa" },
  { id: "toi", label: "Bữa tối" },
] as const;

export const DAY_LABELS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];

export function useMealPlan() {
  const [plan, setPlan] = useLocalStorageState<MealPlan>(KEY, {});

  const setSlot = (key: string, slug: string) => {
    setPlan((prev) => ({ ...prev, [key]: { slug } }));
  };

  const removeSlot = (key: string) => {
    setPlan((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearPlan = () => setPlan({});

  const addToFirstEmpty = (slug: string) => {
    setPlan((prev) => {
      for (let day = 0; day < DAY_LABELS.length; day++) {
        for (const meal of MEALS) {
          const key = `${day}-${meal.id}`;
          if (!prev[key]) return { ...prev, [key]: { slug } };
        }
      }
      return prev;
    });
  };

  return { plan, setSlot, removeSlot, clearPlan, addToFirstEmpty };
}
