// ── Global API error bus ────────────────────────────────────────────────────
//
// React Query's QueryClient is created once at module scope, outside the React
// tree (see src/app/QueryProvider.tsx), so it can't call the useSnackbar() hook
// directly. This tiny pub/sub bridges the two: QueryProvider's global
// QueryCache/MutationCache onError handlers call emitGlobalApiError(), and
// SnackbarProvider registers itself as the listener on mount. The net effect —
// every failed API call (query or mutation, anywhere in the app) surfaces a
// snackbar, even from hooks that never call useSnackbar themselves.

type ErrorHandler = (message: string) => void

let handler: ErrorHandler | null = null
let warningHandler: ErrorHandler | null = null

/** Called by SnackbarProvider on mount/unmount to wire itself up as the sink. */
export function setGlobalApiErrorHandler(fn: ErrorHandler | null) {
  handler = fn
}

/** Called by QueryProvider's cache-level onError handlers. */
export function emitGlobalApiError(message: string) {
  handler?.(message)
}

/** Same wiring as above, but for non-fatal API failures (see AuthProvider's
 *  syncProfile — login/register already succeeded, so a failed profile fetch
 *  shouldn't read as a hard error, just a heads-up). */
export function setGlobalApiWarningHandler(fn: ErrorHandler | null) {
  warningHandler = fn
}

export function emitGlobalApiWarning(message: string) {
  warningHandler?.(message)
}

/**
 * apiClient's response interceptor (src/services/apiClient.ts) normalizes every
 * failure — HTTP error, network error, timeout — into a plain Error with a
 * human-readable `.message` (backend's own message when available). This just
 * extracts that safely, with a generic fallback for anything unexpected.
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong. Please try again.'
}
