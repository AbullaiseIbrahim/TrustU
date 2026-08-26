/**
 * TrustU design tokens — extracted directly from the approved Figma/HTML
 * prototype (TrustU.html) for a pixel-accurate match. Every hex value below
 * was pulled from the prototype's inline styles, not eyeballed.
 */

const colors = {
  // ── Brand / Moss ───────────────────────────────────────────────────────────
  moss:      '#15703F',   // Primary Moss — links, icon strokes, CTAs
  mossDeep:  '#0F5630',   // Darkest — header/hero gradient bottom, hover states
  mossMid:   '#1E7A47',   // Button gradient top stop
  mossSoft:  'rgba(34,164,90,0.10)',   // Icon tile / soft chip backgrounds
  accentGreen: '#22A45A', // Bright accent — logo "U", badges, "Joined" pill

  // Legacy aliases (kept for backward compat)
  primary:     '#15703F',
  primaryDark: '#0F5630',

  // ── Backgrounds ────────────────────────────────────────────────────────────
  // Switched from a warm cream (#F1ECE0) to a near-neutral cool grey — the
  // cream read as dated; this keeps just enough tone for white cards to lift
  // off the page without looking like an accent color.
  cream:   '#F3F4F2',   // page background
  white:   '#ffffff',   // cards, navbar, paper surfaces

  // Legacy alias
  bgMint:  '#F3F4F2',

  // ── Text / Ink ─────────────────────────────────────────────────────────────
  ink:  '#16201A',   // text primary
  ink2: '#3A3E39',   // text secondary
  ink3: '#6E726C',   // icon grey / tertiary text
  ink4: '#9A9C94',   // placeholder / quaternary text

  // Legacy aliases
  textPrimary:   '#16201A',
  textSecondary: '#6E726C',
  textDisabled:  '#9A9C94',

  // ── Borders & dividers ─────────────────────────────────────────────────────
  // Shifted from a warm beige (#E4E0D3 family) to neutral cool-grey to match
  // the new page background — same lightness, no leftover warm/cream cast.
  line:     '#E3E5E1',
  lineSoft: '#EDEFEB',
  line2:    '#E8EAE6',
  divider:  '#E3E5E1',

  // ── Status ─────────────────────────────────────────────────────────────────
  urgent:       '#C0392B',
  amber:        '#F5A623',
  error:        '#C0392B',
  success:      '#15703F',
  successDark:  '#0F5630',
  successLight: '#F1ECE0',

  // ── Warning ────────────────────────────────────────────────────────────────
  warningLight: '#F5A623',
  warningDark:  '#9A5520',

  // ── Secondary ──────────────────────────────────────────────────────────────
  secondaryLight: '#8E87C6',
  secondaryDark:  '#7A2D55',

  // ── Neutral ────────────────────────────────────────────────────────────────
  grey100:     '#F5F5F5',
  actionHover: 'rgba(0,0,0,0.04)',

  // ── Accent ─────────────────────────────────────────────────────────────────
  blue:     '#3B6FC7',
  blueDark: '#234C9A',

  // Avatar gradient palette lives in src/utils/index.ts (avatarGradient /
  // selfAvatarGradient) — it's a function, not just color data, so it's kept
  // alongside its logic rather than duplicated here.

  // ── Shadows ────────────────────────────────────────────────────────────────
  shadowSm: '0 4px 14px rgba(26,29,26,0.05)',
  shadowMd: '0 6px 20px rgba(26,29,26,0.07)',
  shadowModal: '0 2px 10px rgba(0,0,0,0.25)',
  shadowFab: '0 10px 22px -8px rgba(15,86,48,0.6)',
} as const

export type Colors = typeof colors
export default colors
