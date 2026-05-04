/**
 * TrustU design tokens — all colours in one place.
 *
 * Dark-mode-ready: when you want dark mode, create a `darkColors`
 * object with the same keys and different values, then export the
 * correct one based on the active theme.
 *
 * Example (future):
 *   export const darkColors: typeof colors = { ...colors, white: '#1e1e1e', ... }
 *   export default isDark ? darkColors : colors
 */

const colors = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  primary:     '#2E7D32',   // main green
  primaryDark: '#1B5E20',   // darker green (hover states, text on white)

  // ── Accent (used in buttons / highlights) ──────────────────────────────────
  blue:     '#1976D2',
  blueDark: '#1565C0',

  // ── Backgrounds ────────────────────────────────────────────────────────────
  white:   '#ffffff',   // cards, navbar, paper surfaces
  bgMint:  '#f1f8f1',   // page background

  // ── Text ───────────────────────────────────────────────────────────────────
  textPrimary:   '#1a1a1a',
  textSecondary: '#757575',
  textDisabled:  '#bdbdbd',

  // ── Borders & dividers ─────────────────────────────────────────────────────
  divider: '#e0e0e0',

  // ── Status ─────────────────────────────────────────────────────────────────
  error:        '#d32f2f',
  success:      '#2E7D32',   // same as primary — intentional
  successDark:  '#1b5e20',
  successLight: '#81c784',

  // ── Warning ────────────────────────────────────────────────────────────────
  warningLight: '#ffb74d',
  warningDark:  '#e65100',

  // ── Secondary / Purple (proxy chips) ───────────────────────────────────────
  secondaryLight: '#ce93d8',
  secondaryDark:  '#7b1fa2',

  // ── Neutral ────────────────────────────────────────────────────────────────
  grey100:     '#f5f5f5',
  actionHover: 'rgba(0,0,0,0.04)',
} as const

export type Colors = typeof colors
export default colors
