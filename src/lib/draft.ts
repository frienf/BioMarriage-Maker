import type { Biodata } from './biodata';

/**
 * The draft lives in the visitor's own browser until they choose to pay.
 *
 * Every access is wrapped: in a private window, or with site data blocked,
 * localStorage throws rather than returning null, and an editor that crashes
 * on load is worse than one that forgets.
 */

const KEY = 'biodata-maker.draft.v1';
const TTL_DAYS = 30;

type Stored = { savedAt: number; data: Biodata };

export function loadDraft(): Biodata | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed?.data || typeof parsed.savedAt !== 'number') return null;
    const age = Date.now() - parsed.savedAt;
    if (age > TTL_DAYS * 24 * 60 * 60 * 1000) {
      clearDraft();
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

/** Returns false when the browser refused to store, so the editor can say so. */
export function saveDraft(data: Biodata): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), data } satisfies Stored));
    return true;
  } catch {
    // Most often a quota error from a large photo, or a private window.
    return false;
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to do: if it cannot be removed it could not have been written.
  }
}
