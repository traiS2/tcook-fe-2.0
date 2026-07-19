"use client";

import { useCallback, useEffect, useState } from "react";

const SYNC_EVENT = "tcook-sync";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: key }));
  } catch {
    // localStorage unavailable (private mode / SSR) — state stays in-memory only.
  }
}

/**
 * localStorage-backed state, kept in sync across components/tabs via a
 * shared "tcook-sync" event (same-tab) and the native "storage" event
 * (cross-tab). Server and first client render both use `fallback`, so
 * hydration never mismatches — the real value loads in an effect.
 */
export function useLocalStorageState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    // Deliberate: hydrate from localStorage after mount so server and first
    // client render both use `fallback` and never mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(read(key, fallback));
    const sync = () => setValue(read(key, fallback));
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
        write(key, next);
        return next;
      });
    },
    [key]
  );

  return [value, update] as const;
}
