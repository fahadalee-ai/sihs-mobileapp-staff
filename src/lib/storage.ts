export function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(`sihs:${key}`);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`sihs:${key}`, value);
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearStorage(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(`sihs:${key}`);
  } catch {
    /* ignore */
  }
}
