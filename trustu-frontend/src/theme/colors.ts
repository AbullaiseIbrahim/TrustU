/**
 * TrustU design tokens — v2 redesign palette.
 */

const colors = {
  // ── Brand / Moss ───────────────────────────────────────────────────────────
  moss:      '#0e6b3f',   // Primary Moss
  mossDeep:  '#0a4d2d',   // Primary Deep
  mossSoft:  '#e7f1ea',   // Primary Soft

  // Legacy aliases (kept for backward compat)
  primary:     '#0e6b3f',
  primaryDark: '#0a4d2d',

  // ── Backgrounds ────────────────────────────────────────────────────────────
  cream:   '#f7f3ea',   // page background
  white:   '#ffffff',   // cards, navbar, paper surfaces

  // Legacy alias
  bgMint:  '#f7f3ea',

  // ── Text / Ink ─────────────────────────────────────────────────────────────
  ink:  '#16190f',   // text primary
  ink2: '#3d4039',
  ink3: '#737970',   // text secondary
  ink4: '#9aa098',

  // Legacy aliases
  textPrimary:   '#16190f',
  textSecondary: '#737970',
  textDisabled:  '#9aa098',

  // ── Borders & dividers ─────────────────────────────────────────────────────
  line:     '#ece6d4',
  lineSoft: '#f1ebda',
  divider:  '#ece6d4',

  // ── Status ─────────────────────────────────────────────────────────────────
  urgent:       '#c7372f',
  amber:        '#e8a430',
  error:        '#c7372f',
  success:      '#0e6b3f',
  successDark:  '#0a4d2d',
  successLight: '#e7f1ea',

  // ── Warning ────────────────────────────────────────────────────────────────
  warningLight: '#e8a430',
  warningDark:  '#b87a20',

  // ── Secondary ──────────────────────────────────────────────────────────────
  secondaryLight: '#ce93d8',
  secondaryDark:  '#7b1fa2',

  // ── Neutral ────────────────────────────────────────────────────────────────
  grey100:     '#f5f5f5',
  actionHover: 'rgba(0,0,0,0.04)',

  // ── Accent ─────────────────────────────────────────────────────────────────
  blue:     '#1976D2',
  blueDark: '#1565C0',
} as const

export type Colors = typeof colors
export default colors
