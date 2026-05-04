import { useMediaQuery, useTheme } from '@mui/material'
import type { Breakpoint } from '@mui/material'

type Dir = 'up' | 'down'

export function useBreakpoint(bp: Breakpoint, dir: Dir = 'down'): boolean {
  const theme = useTheme()
  return useMediaQuery(dir === 'down' ? theme.breakpoints.down(bp) : theme.breakpoints.up(bp))
}
