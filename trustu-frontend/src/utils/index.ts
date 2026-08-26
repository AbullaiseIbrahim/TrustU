export function getInitials(name: string): string {
  return name.split(' ').map(p => p[0]?.toUpperCase() ?? '').slice(0, 2).join('')
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  if (min < 1) return 'just now'
  if (min < 60) return min + 'm ago'
  if (hr < 24) return hr + 'h ago'
  if (day < 7) return day + 'd ago'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export function truncate(text: string, limit: number): string {
  return text.length <= limit ? text : text.slice(0, limit).trimEnd() + '\u2026'
}

/** Format an ISO date string as "1 May 2026" */
export function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ── Avatar gradient ───────────────────────────────────────────────────────────
// Every avatar in the prototype is a 150deg two-stop gradient circle with
// white initials — not a pastel background with colored text. This is the
// single source of truth for that palette; avatarGradient(seed) picks a
// deterministic pair from a user id (or name, as a fallback), and
// avatarSelfGradient is the fixed moss gradient the prototype always uses for
// the signed-in user's own avatar.

const AVATAR_GRADIENTS: [string, string][] = [
  ['#C77B3B', '#9A5520'], // orange/brown
  ['#B0497A', '#7A2D55'], // pink/mauve
  ['#3B6FC7', '#234C9A'], // blue
  ['#4A4A4A', '#2A2A2A'], // dark grey
  ['#7A5BB0', '#4A2D7A'], // purple
]

export const AVATAR_SELF_GRADIENT: [string, string] = ['#1E7A47', '#0F5630']

function hashSeed(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h
}

/** Deterministic 150deg gradient CSS string for a given user id / name seed. */
export function avatarGradient(seed: string): string {
  const [from, to] = AVATAR_GRADIENTS[hashSeed(seed) % AVATAR_GRADIENTS.length]
  return `linear-gradient(150deg, ${from}, ${to})`
}

/** The fixed gradient the prototype uses for the signed-in user's own avatar everywhere. */
export function selfAvatarGradient(): string {
  return `linear-gradient(150deg, ${AVATAR_SELF_GRADIENT[0]}, ${AVATAR_SELF_GRADIENT[1]})`
}
