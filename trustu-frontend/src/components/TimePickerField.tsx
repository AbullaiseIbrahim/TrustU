import React, { useRef, useState } from 'react'
import { Box, Typography, Popover } from '@mui/material'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import CheckIcon from '@mui/icons-material/Check'
import colors from '@/theme/colors'

// ── Time helpers — value is stored/emitted as 24h "HH:MM" ─────────────────────

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
const PERIODS: ('AM' | 'PM')[] = ['AM', 'PM']

interface Parsed { h: number; m: number; period: 'AM' | 'PM' }

function parse(hhmm: string): Parsed | null {
  if (!hhmm) return null
  const [hStr, mStr] = hhmm.split(':')
  const h = Number(hStr)
  const m = Number(mStr)
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM'
  let h12 = h % 12
  if (h12 === 0) h12 = 12
  return { h: h12, m, period }
}

function toValue(h12: number, m: number, period: 'AM' | 'PM'): string {
  let h = h12 % 12
  if (period === 'PM') h += 12
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatTimeDisplay(hhmm: string): string {
  const t = parse(hhmm)
  if (!t) return ''
  return `${t.h}:${String(t.m).padStart(2, '0')} ${t.period}`
}

// ── Column list ─────────────────────────────────────────────────────────────

interface ColProps<T extends string | number> {
  items: T[]
  selected: T | null
  onSelect: (v: T) => void
  format?: (v: T) => string
}

function TimeColumn<T extends string | number>({ items, selected, onSelect, format }: ColProps<T>) {
  return (
    <Box sx={{
      flex: 1,
      maxHeight: 200,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
    }}>
      {items.map(item => {
        const isSelected = selected === item
        return (
          <Box
            key={String(item)}
            onClick={() => onSelect(item)}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '4px',
              padding: '9px 4px',
              margin: '0 4px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: isSelected ? colors.moss : 'transparent',
              transition: 'background-color 0.12s ease',
              '&:hover': { backgroundColor: isSelected ? colors.mossDeep : colors.mossSoft },
            }}
          >
            <Typography sx={{
              fontSize: '0.85rem',
              fontWeight: isSelected ? 700 : 500,
              color: isSelected ? '#fff' : colors.ink,
              lineHeight: 1,
            }}>
              {format ? format(item) : String(item)}
            </Typography>
            {isSelected && <CheckIcon sx={{ fontSize: '0.8rem', color: '#fff' }} />}
          </Box>
        )
      })}
    </Box>
  )
}

// ── TimePickerField ───────────────────────────────────────────────────────────

interface Props {
  label: string
  value: string          // 24h "HH:MM", empty = unset
  onChange: (val: string) => void
  helperText?: string
  size?: 'small' | 'medium'
}

const TimePickerField: React.FC<Props> = ({ label, value, onChange, helperText, size = 'small' }) => {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const hasValue = Boolean(value)
  const py = size === 'small' ? '8.5px' : '12px'

  const parsed = parse(value) ?? { h: 12, m: 0, period: 'PM' as const }

  const setPart = (patch: Partial<Parsed>) => {
    const next = { ...parsed, ...patch }
    onChange(toValue(next.h, next.m, next.period))
  }

  return (
    <Box>
      {/* ── Trigger field ── */}
      <Box
        ref={anchorRef}
        onClick={() => setOpen(true)}
        sx={{
          position: 'relative',
          display: 'flex', alignItems: 'center', gap: '8px',
          px: '14px', py,
          borderRadius: '12px',
          border: `1.5px solid ${open ? colors.moss : colors.line}`,
          backgroundColor: colors.white,
          cursor: 'pointer',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: open ? `0 0 0 3px ${colors.mossSoft}` : 'none',
          '&:hover': { borderColor: open ? colors.moss : colors.ink3 },
        }}
      >
        <AccessTimeOutlinedIcon sx={{
          fontSize: '1rem', flexShrink: 0,
          color: open ? colors.moss : colors.ink3,
          transition: 'color 0.15s ease',
        }} />

        {/* Floating label */}
        <Box component="span" sx={{
          position: 'absolute',
          top: hasValue || open ? '-9px' : '50%',
          left: '38px',
          transform: hasValue || open ? 'none' : 'translateY(-50%)',
          fontSize: hasValue || open ? '0.7rem' : '0.88rem',
          fontWeight: hasValue || open ? 600 : 500,
          color: open ? colors.moss : hasValue ? colors.ink3 : colors.ink4,
          backgroundColor: colors.white,
          px: '3px',
          pointerEvents: 'none',
          transition: 'all 0.15s ease',
          lineHeight: 1,
        }}>
          {label}
        </Box>

        <Typography sx={{
          fontSize: '0.88rem', fontWeight: 500,
          color: hasValue ? colors.ink : 'transparent',
          lineHeight: 1,
        }}>
          {hasValue ? formatTimeDisplay(value) : 'placeholder'}
        </Typography>
      </Box>

      {/* ── Time popover ── */}
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: 220,
              borderRadius: '18px',
              boxShadow: '0 8px 40px rgba(20,20,15,0.14), 0 2px 8px rgba(20,20,15,0.08)',
              border: `1px solid ${colors.lineSoft}`,
              overflow: 'hidden',
              mt: '6px',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', padding: '10px 4px', gap: '2px' }}>
          <TimeColumn items={HOURS_12} selected={parsed.h} onSelect={h => setPart({ h })} />
          <TimeColumn items={MINUTES} selected={parsed.m} onSelect={m => setPart({ m })} format={v => String(v).padStart(2, '0')} />
          <TimeColumn items={PERIODS} selected={parsed.period} onSelect={period => setPart({ period })} />
        </Box>

        <Box sx={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 16px 14px',
          borderTop: `1px solid ${colors.lineSoft}`,
        }}>
          <Box
            component="button"
            onClick={() => { onChange(''); setOpen(false) }}
            sx={{
              border: 'none', backgroundColor: 'transparent',
              fontSize: '0.82rem', fontWeight: 600, color: colors.ink3,
              cursor: 'pointer', fontFamily: 'inherit', padding: '6px 10px',
              borderRadius: 8,
              '&:hover': { backgroundColor: colors.cream, color: colors.ink },
            }}
          >
            Clear
          </Box>
          <Box
            component="button"
            onClick={() => setOpen(false)}
            sx={{
              border: 'none', backgroundColor: 'transparent',
              fontSize: '0.82rem', fontWeight: 700, color: colors.moss,
              cursor: 'pointer', fontFamily: 'inherit', padding: '6px 10px',
              borderRadius: 8,
              '&:hover': { backgroundColor: colors.mossSoft },
            }}
          >
            Done
          </Box>
        </Box>
      </Popover>

      {helperText && (
        <Typography sx={{ fontSize: '0.72rem', color: colors.ink4, mt: '4px', ml: '4px' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

export default TimePickerField
