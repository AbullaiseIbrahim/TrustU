import React, { useRef, useState } from 'react'
import { Box, Typography, Popover } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CheckIcon from '@mui/icons-material/Check'
import colors from '@/theme/colors'

// ── Shared input styling — exact pixel match to the prototype's form fields ────

export const authInputSx = {
  width: '100%',
  padding: '14px 16px',
  border: `1.5px solid ${colors.line}`,
  borderRadius: '13px',
  background: '#fff',
  fontFamily: 'inherit',
  fontSize: '14.5px',
  fontWeight: 500,
  color: colors.ink,
  outline: 'none',
  '&:focus': { borderColor: colors.accentGreen },
} as const

export const authSelectSx = {
  ...authInputSx,
  padding: '14px 34px 14px 14px',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
} as const

export const authLabelSx = {
  fontSize: '12.5px',
  fontWeight: 700,
  color: colors.ink2,
} as const

interface AuthFieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

/** Label + field + error-message wrapper, matching prototype spacing (8px gap). */
export const AuthField: React.FC<AuthFieldProps> = ({ label, error, children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <Typography component="span" sx={authLabelSx}>{label}</Typography>
    {children}
    {error && (
      <Typography sx={{ fontSize: '12px', fontWeight: 600, color: colors.urgent, marginTop: '-2px' }}>
        {error}
      </Typography>
    )}
  </Box>
)

interface AuthSelectFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: { value: string; label: string }[]
  onBlur?: () => void
  name?: string
  disabled?: boolean
}

/**
 * Themed dropdown for auth/onboarding forms — a MUI Popover menu (rounded
 * corners, moss-green selected/hover states, check mark) anchored to a
 * trigger box styled to match the other auth inputs, replacing the browser's
 * bare native <select> chrome.
 */
export const AuthSelectField: React.FC<AuthSelectFieldProps> = ({ value, onChange, placeholder, options, onBlur, disabled }) => {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)

  const handleClose = () => {
    setOpen(false)
    onBlur?.()
  }

  return (
    <>
      <Box
        ref={anchorRef}
        onClick={() => !disabled && setOpen(true)}
        sx={{
          ...authSelectSx,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          borderColor: open ? colors.accentGreen : colors.line,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <Typography
          component="span"
          sx={{
            flex: 1,
            fontSize: '14px',
            fontWeight: 600,
            color: selected ? colors.ink : colors.ink4,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {selected?.label ?? placeholder}
        </Typography>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: '1.15rem',
            color: open ? colors.moss : colors.ink3,
            transition: 'transform 0.2s ease, color 0.15s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
            position: 'absolute',
            right: 12,
          }}
        />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: anchorRef.current?.offsetWidth ?? 220,
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(20,20,15,0.13), 0 2px 8px rgba(20,20,15,0.07)',
              border: `1px solid ${colors.lineSoft}`,
              overflow: 'hidden',
              mt: '6px',
            },
          },
        }}
      >
        <Box sx={{ maxHeight: 240, overflowY: 'auto', py: '6px', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          {options.map((o) => {
            const isSelected = o.value === value
            return (
              <Box
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false); onBlur?.() }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: '16px',
                  py: '10px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? colors.moss : 'transparent',
                  transition: 'background-color 0.12s ease',
                  '&:hover': { backgroundColor: isSelected ? colors.mossDeep : colors.mossSoft },
                }}
              >
                <Typography sx={{ fontSize: '14px', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#fff' : colors.ink, lineHeight: 1 }}>
                  {o.label}
                </Typography>
                {isSelected && <CheckIcon sx={{ fontSize: '0.9rem', color: '#fff', flexShrink: 0 }} />}
              </Box>
            )
          })}
        </Box>
      </Popover>
    </>
  )
}

interface StepPillProps {
  step: string
}

/** "STEP X OF Y" badge — pixel match to the prototype's pill. */
export const StepPill: React.FC<StepPillProps> = ({ step }) => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 12px', background: '#fff', border: `1px solid ${colors.line}`, borderRadius: '999px' }}>
    <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: colors.accentGreen }} />
    <Typography component="span" sx={{ fontSize: '11.5px', fontWeight: 700, color: colors.moss, letterSpacing: '0.4px' }}>
      {step}
    </Typography>
  </Box>
)
