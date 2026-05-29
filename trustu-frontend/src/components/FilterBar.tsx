/**
 * Filter bar — pill chips with smooth active states.
 */
import React from 'react'
import { Box, Typography } from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import CheckIcon from '@mui/icons-material/Check'
import { makeStyles } from 'tss-react/mui'
import colors from '@/theme/colors'

export interface FilterOption  { label: string; value: string }
export interface FilterField   { key: string; label: string; type: 'select' | 'text' | 'date'; options?: FilterOption[]; placeholder?: string }
export interface FilterValues  { [key: string]: string }

interface FilterBarProps {
  title?: string
  fields: FilterField[]
  values: FilterValues
  onChange: (key: string, value: string) => void
  onClear: () => void
}

const useStyles = makeStyles()(() => ({
  root: {
    backgroundColor: 'rgba(255,255,255,0.80)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  filterIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 10,
    border: '1px solid rgba(0,0,0,0.10)',
    backgroundColor: colors.white,
    flexShrink: 0,
    cursor: 'pointer',
    color: colors.textSecondary,
    transition: 'all 0.18s ease',
    '&:hover': {
      borderColor: colors.primary,
      color: colors.primary,
      backgroundColor: `${colors.primary}08`,
    },
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    height: 32,
    paddingLeft: 14,
    paddingRight: 14,
    borderRadius: 10,
    border: '1px solid rgba(0,0,0,0.10)',
    backgroundColor: colors.white,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.18s ease',
    userSelect: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    '&:hover': {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}06`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
  },
  pillActive: {
    border: `1.5px solid ${colors.primary}`,
    backgroundColor: `${colors.primary}12`,
    boxShadow: `0 1px 4px ${colors.primary}20`,
  },
  pillLabel: {
    fontSize: '0.76rem',
    fontWeight: 600,
    color: colors.textSecondary,
    whiteSpace: 'nowrap',
  },
  pillLabelActive: {
    color: colors.primary,
  },
  checkIcon: {
    fontSize: '0.8rem !important',
    color: colors.primary,
  },
  // Hidden native select overlaid on pill
  nativeSelect: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    fontSize: '0.78rem',
    border: 'none',
    appearance: 'none',
  },
  clearPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    height: 32,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 10,
    border: `1px solid ${colors.error}40`,
    backgroundColor: '#FFF5F5',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: '#FFE8E8', borderColor: colors.error },
  },
  clearLabel: {
    fontSize: '0.74rem',
    fontWeight: 600,
    color: colors.error,
    whiteSpace: 'nowrap',
  },
}))

const FilterBar: React.FC<FilterBarProps> = ({ fields, values, onChange, onClear }) => {
  const { classes, cx } = useStyles()
  const hasActiveFilters = Object.values(values).some((v) => v !== '')

  return (
    <Box className={classes.root}>
      {/* Filter icon */}
      <Box className={classes.filterIcon}>
        <TuneIcon sx={{ fontSize: '1rem' }} />
      </Box>

      {/* Pill per filter field */}
      {fields.map((field) => {
        const currentValue = values[field.key] ?? ''
        const isActive = currentValue !== ''
        const activeLabel = field.options?.find(o => o.value === currentValue)?.label

        return (
          <Box
            key={field.key}
            className={cx(classes.pill, { [classes.pillActive]: isActive })}
            sx={{ position: 'relative' }}
          >
            {isActive && <CheckIcon className={classes.checkIcon} />}
            <Typography className={cx(classes.pillLabel, { [classes.pillLabelActive]: isActive })}>
              {isActive ? activeLabel : field.label}
            </Typography>

            {field.type === 'select' && (
              <select
                className={classes.nativeSelect}
                value={currentValue}
                onChange={(e) => onChange(field.key, e.target.value)}
              >
                <option value="">All</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
          </Box>
        )
      })}

      {/* Clear pill */}
      {hasActiveFilters && (
        <Box className={classes.clearPill} onClick={onClear}>
          <Typography className={classes.clearLabel}>✕ Clear</Typography>
        </Box>
      )}
    </Box>
  )
}

export default FilterBar
