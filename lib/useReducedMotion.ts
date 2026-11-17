// lib/useReducedMotion.ts
// The visitor's "reduce motion" system setting, kept live if they change it while the page is open.
// Server render assumes motion is fine; the real value is read as soon as the page hydrates.
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
