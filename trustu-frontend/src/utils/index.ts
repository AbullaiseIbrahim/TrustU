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
