import React, { useRef, useState } from 'react'
import { Box, Typography, Popover } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CheckIcon from '@mui/icons-material/Check'
import colors from '@/theme/colors'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  label: string
  value: string
  onChange: (val: string) => void
  options: SelectOption[]
  size?: 'small' | 'medium'
  helperText?: string
  error?: boolean
  placeholder?: string
}

const SelectField: React.FC<Props> = ({
  label,
  value,
  onChange,
  options,
  size = 'small',
  helperText,
  error = false,
  placeholder,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const selected = options.find(o => o.value === value)
  const hasValue = Boolean(selected)
  const py = size === 'small' ? '8.5px' : '12px'

  const borderColor = error
    ? colors.urgent
    : open
    ? colors.moss
    : colors.line

  const shadowColor = error ? `${colors.urgent}20` : colors.mossSoft

  return (
    <Box>
      {/* ── Trigger ── */}
      <Box
        ref={anchorRef}
        onClick={() => setOpen(true)}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          px: '14px',
          py,
          borderRadius: '12px',
          border: `1.5px solid ${borderColor}`,
          backgroundColor: colors.white,
          cursor: 'pointer',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: open ? `0 0 0 3px ${shadowColor}` : 'none',
          '&:hover': { borderColor: open ? borderColor : error ? colors.urgent : colors.ink3 },
          userSelect: 'none',
        }}
      >
        {/* Floating label */}
        <Box
          component="span"
          sx={{
            position: 'absolute',
            top: hasValue || open ? '-9px' : '50%',
            left: '14px',
            transform: hasValue || open ? 'none' : 'translateY(-50%)',
            fontSize: hasValue || open ? '0.7rem' : '0.88rem',
            fontWeight: hasValue || open ? 600 : 500,
            color: error
              ? colors.urgent
              : open
              ? colors.moss
              : hasValue
              ? colors.ink3
              : colors.ink4,
            backgroundColor: colors.white,
            px: '3px',
            pointerEvents: 'none',
            transition: 'all 0.15s ease',
            lineHeight: 1,
          }}
        >
          {label}
        </Box>

        {/* Value or placeholder */}
        <Typography
          sx={{
            flex: 1,
            fontSize: '0.88rem',
            fontWeight: 500,
            color: hasValue ? colors.ink : colors.ink4,
            lineHeight: 1,
            mt: hasValue || open ? '2px' : 0,
          }}
        >
          {selected?.label ?? placeholder ?? ''}
        </Typography>

        {/* Chevron */}
        <KeyboardArrowDownIcon
          sx={{
            fontSize: '1.1rem',
            color: open ? colors.moss : colors.ink4,
            transition: 'transform 0.2s ease, color 0.15s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        />
      </Box>

      {/* ── Dropdown popover ── */}
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: anchorRef.current?.offsetWidth ?? 240,
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(20,20,15,0.13), 0 2px 8px rgba(20,20,15,0.07)',
              border: `1px solid ${colors.lineSoft}`,
              overflow: 'hidden',
              mt: '6px',
            },
          },
        }}
      >
        <Box
          sx={{
            maxHeight: 220,
            overflowY: 'auto',
            py: '6px',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {options.map(opt => {
            const isSelected = opt.value === value
            return (
              <Box
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: '16px',
                  py: '10px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? colors.moss : 'transparent',
                  transition: 'background-color 0.12s ease',
                  '&:hover': {
                    backgroundColor: isSelected ? colors.mossDeep : colors.mossSoft,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#fff' : colors.ink,
                    lineHeight: 1,
                  }}
                >
                  {opt.label}
                </Typography>
                {isSelected && (
                  <CheckIcon sx={{ fontSize: '0.9rem', color: '#fff', flexShrink: 0 }} />
                )}
              </Box>
            )
          })}
        </Box>
      </Popover>

      {/* Helper / error text */}
      {helperText && (
        <Typography
          sx={{
            fontSize: '0.72rem',
            color: error ? colors.urgent : colors.ink4,
            mt: '4px',
            ml: '4px',
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

export default SelectField
