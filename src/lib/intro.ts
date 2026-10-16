declare global {
  interface Window {
    __sihsSplashDone?: boolean;
  }
}

export function markSplashSeen() {
  if (typeof window !== "undefined") window.__sihsSplashDone = true;
}

export function hasSeenSplash() {
  return typeof window !== "undefined" && window.__sihsSplashDone === true;
}
