"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  // Mirror of the latest value, kept in sync inside the effect + `update` below
  // (never during render). This lets `update` compute the next value without a
  // functional setState updater, so the localStorage write / sync-event dispatch
  // runs in the caller (event handler / effect) rather than inside a render-phase
  // updater where it could setState other components mid-render.
  const valueRef = useRef<T>(value);

  useEffect(() => {
    // Deliberate: hydrate from localStorage after mount so server and first
    // client render both use `fallback` and never mismatch.
    const apply = () => {
      const next = read(key, fallback);
      valueRef.current = next;
      setValue(next);
    };
    apply();
    window.addEventListener(SYNC_EVENT, apply);
    window.addEventListener("storage", apply);
    return () => {
      window.removeEventListener(SYNC_EVENT, apply);
      window.removeEventListener("storage", apply);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (updater: T | ((prev: T) => T)) => {
      const next =
        typeof updater === "function" ? (updater as (p: T) => T)(valueRef.current) : updater;
      valueRef.current = next;
      setValue(next);
      write(key, next);
    },
    [key]
  );

  return [value, update] as const;
}
