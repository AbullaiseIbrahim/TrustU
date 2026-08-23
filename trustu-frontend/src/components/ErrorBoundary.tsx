import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import colors from '@/theme/colors'

const CHUNK_RELOAD_KEY = 'trustu_chunk_reload_at'
const CHUNK_RELOAD_COOLDOWN_MS = 10_000

function isChunkLoadError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error)
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(msg)
}

interface State {
  error: Error | null
}

/**
 * Catches render-time errors anywhere below it. Without this, a single failed
 * lazy-loaded chunk (e.g. after a redeploy invalidates old chunk hashes while a
 * user's tab is still open, or any dev-server hiccup) takes down the entire app
 * with a blank white screen and no way to recover short of the user guessing to
 * manually reload.
 */
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    // Stale-chunk errors are self-healing — a hard reload picks up the current
    // build. Reload at most once per cooldown window to avoid a refresh loop if
    // the failure is persistent rather than a one-off stale reference.
    if (isChunkLoadError(error)) {
      const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? 0)
      if (Date.now() - lastReload > CHUNK_RELOAD_COOLDOWN_MS) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()))
        window.location.reload()
      }
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.error) {
      return (
        <Box sx={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 2, px: 3,
          textAlign: 'center', backgroundColor: colors.cream,
        }}>
          <ErrorOutlineIcon sx={{ fontSize: 40, color: colors.urgent }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: colors.ink }}>
            Something went wrong
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: colors.ink3, maxWidth: 320 }}>
            The app hit an unexpected error. Reloading usually fixes this.
          </Typography>
          <Button
            variant="contained" disableElevation onClick={this.handleReload}
            sx={{ mt: 1, textTransform: 'none', fontWeight: 700, borderRadius: 2, backgroundColor: colors.moss, '&:hover': { backgroundColor: colors.mossDeep } }}
          >
            Reload app
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
