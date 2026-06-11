import React, { useState, useRef } from 'react'
import { Box, Typography, Popover } from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import colors from '@/theme/colors'

// ── Calendar helpers ───────────────────────────────────────────────────────────

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAYS = ['Mo','Tu','We','Th','Fr','Sa','Su']

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate()
}

// Returns 0=Mon … 6=Sun for the 1st of the given month
function firstWeekday(y: number, m: number) {
  const d = new Date(y, m, 1).getDay()   // 0=Sun
  return d === 0 ? 6 : d - 1
}

function parseDate(iso: string): Date | null {
  if (!iso) return null
  const d = new Date(iso + 'T00:00:00')
  return isNaN(d.getTime()) ? null : d
}

function toISO(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDisplay(iso: string) {
  const d = parseDate(iso)
  if (!d) return ''
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface NavBtnProps { onClick: () => void; children: React.ReactNode }
const NavBtn: React.FC<NavBtnProps> = ({ onClick, children }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      width: 32, height: 32, borderRadius: '50%',
      border: 'none', backgroundColor: 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: colors.ink2, fontFamily: 'inherit',
      transition: 'background-color 0.15s ease',
      '&:hover': { backgroundColor: colors.cream },
    }}
  >
    {children}
  </Box>
)

interface CalendarProps {
  value: string
  onChange: (iso: string) => void
  onClose: () => void
}

const Calendar: React.FC<CalendarProps> = ({ value, onChange, onClose }) => {
  const today = new Date()
  const selected = parseDate(value)
  const init = selected ?? today

  const [viewY, setViewY] = useState(init.getFullYear())
  const [viewM, setViewM] = useState(init.getMonth())

  const prevMonth = () => {
    if (viewM === 0) { setViewY(y => y - 1); setViewM(11) }
    else setViewM(m => m - 1)
  }
  const nextMonth = () => {
    if (viewM === 11) { setViewY(y => y + 1); setViewM(0) }
    else setViewM(m => m + 1)
  }

  const totalDays  = daysInMonth(viewY, viewM)
  const startAt    = firstWeekday(viewY, viewM)

  // Build grid: nulls for leading empty cells, then day numbers
  const cells: (number | null)[] = [
    ...Array(startAt).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  const handleDay = (day: number) => {
    onChange(toISO(new Date(viewY, viewM, day)))
    onClose()
  }

  const isSelected = (day: number) =>
    selected &&
    selected.getFullYear() === viewY &&
    selected.getMonth() === viewM &&
    selected.getDate() === day

  const isToday = (day: number) =>
    today.getFullYear() === viewY &&
    today.getMonth() === viewM &&
    today.getDate() === day

  return (
    <Box sx={{ width: 300, userSelect: 'none' }}>

      {/* ── Header ── */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px 10px',
        borderBottom: `1px solid ${colors.lineSoft}`,
      }}>
        <NavBtn onClick={prevMonth}><ChevronLeftIcon sx={{ fontSize: '1.1rem' }} /></NavBtn>

        <Typography sx={{
          fontWeight: 700, fontSize: '0.92rem',
          color: colors.ink, letterSpacing: '-0.2px',
        }}>
          {MONTHS[viewM]}, {viewY}
        </Typography>

        <NavBtn onClick={nextMonth}><ChevronRightIcon sx={{ fontSize: '1.1rem' }} /></NavBtn>
      </Box>

      {/* ── Week day labels ── */}
      <Box sx={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        padding: '10px 12px 4px',
        gap: '2px',
      }}>
        {DAYS.map(d => (
          <Typography key={d} sx={{
            textAlign: 'center',
            fontSize: '0.7rem', fontWeight: 700,
            color: colors.ink4,
            textTransform: 'uppercase', letterSpacing: '0.4px',
          }}>
            {d}
          </Typography>
        ))}
      </Box>

      {/* ── Day grid ── */}
      <Box sx={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        padding: '2px 12px 8px',
        gap: '2px',
      }}>
        {cells.map((day, i) => {
          if (day === null) return <Box key={`e-${i}`} />

          const sel   = isSelected(day)
          const todayMark = isToday(day)

          return (
            <Box
              key={day}
              component="button"
              onClick={() => handleDay(day)}
              sx={{
                width: '100%', aspectRatio: '1',
                borderRadius: '10px',
                border: todayMark && !sel
                  ? `1.5px solid ${colors.moss}`
                  : '1.5px solid transparent',
                backgroundColor: sel ? colors.moss : 'transparent',
                color: sel ? '#fff' : todayMark ? colors.moss : colors.ink,
                fontWeight: sel || todayMark ? 700 : 400,
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.13s ease',
                '&:hover': {
                  backgroundColor: sel ? colors.mossDeep : colors.mossSoft,
                  color: sel ? '#fff' : colors.mossDeep,
                },
              }}
            >
              {day}
            </Box>
          )
        })}
      </Box>

      {/* ── Footer actions ── */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 16px 14px',
        borderTop: `1px solid ${colors.lineSoft}`,
      }}>
        <Box
          component="button"
          onClick={() => { onChange(''); onClose() }}
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
          onClick={() => {
            onChange(toISO(today))
            onClose()
          }}
          sx={{
            border: 'none', backgroundColor: 'transparent',
            fontSize: '0.82rem', fontWeight: 700, color: colors.moss,
            cursor: 'pointer', fontFamily: 'inherit', padding: '6px 10px',
            borderRadius: 8,
            '&:hover': { backgroundColor: colors.mossSoft },
          }}
        >
          Today
        </Box>
      </Box>
    </Box>
  )
}

// ── DatePickerField ───────────────────────────────────────────────────────────

interface Props {
  label: string
  value: string
  onChange: (val: string) => void
  helperText?: string
  size?: 'small' | 'medium'
}

const DatePickerField: React.FC<Props> = ({
  label, value, onChange, helperText, size = 'small',
}) => {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const hasValue = Boolean(value)
  const py = size === 'small' ? '8.5px' : '12px'

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
        <CalendarTodayOutlinedIcon sx={{
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

        {/* Displayed value */}
        <Typography sx={{
          fontSize: '0.88rem', fontWeight: 500,
          color: hasValue ? colors.ink : 'transparent',
          lineHeight: 1,
        }}>
          {hasValue ? formatDisplay(value) : 'placeholder'}
        </Typography>
      </Box>

      {/* ── Calendar popover ── */}
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '18px',
              boxShadow: '0 8px 40px rgba(20,20,15,0.14), 0 2px 8px rgba(20,20,15,0.08)',
              border: `1px solid ${colors.lineSoft}`,
              overflow: 'hidden',
              mt: '6px',
            },
          },
        }}
      >
        <Calendar
          value={value}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      </Popover>

      {helperText && (
        <Typography sx={{ fontSize: '0.72rem', color: colors.ink4, mt: '4px', ml: '4px' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

export default DatePickerField
