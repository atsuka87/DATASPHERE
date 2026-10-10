"use client";

import { useSyncExternalStore } from "react";

// Waktu sekarang yang ikut berdetak tiap detik. Bernilai null saat render server
// & hydration, supaya markup server dan client tetap sama.
let snapshot: number | null = null;

function subscribe(onChange: () => void) {
  snapshot = Date.now();
  onChange();
  const id = setInterval(() => {
    snapshot = Date.now();
    onChange();
  }, 1000);
  return () => clearInterval(id);
}

export function useNow(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => null
  );
}
