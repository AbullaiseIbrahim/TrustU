/**
 * Generic filter bar used across all dashboard tabs.
 */
import React from 'react'
import {
  Box, Typography, Select, MenuItem,
  FormControl, InputLabel, Button, TextField, SelectChangeEvent,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import FilterListIcon from '@mui/icons-material/FilterList'
import { makeStyles } from 'tss-react/mui'
import colors from '@/theme/colors'

export interface FilterOption  { label: string; value: string }
export interface FilterField   { key: string; label: string; type: 'select' | 'text' | 'date'; options?: FilterOption[]; placeholder?: string }
export interface FilterValues  { [key: string]: string }

interface FilterBarProps {
  title: string
  fields: FilterField[]
  values: FilterValues
  onChange: (key: string, value: string) => void
  onClear: () => void
}

const useStyles = makeStyles()(() => ({
  root: {
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.divider}`,
    padding: '12px 16px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  titleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  title: {
    fontWeight: 600,
    fontSize: '0.875rem',
  },
  clearButton: {
    fontSize: '0.78rem',
    fontWeight: 500,
    textTransform: 'none',
    color: colors.textSecondary,
    minWidth: 'auto',
    padding: '4px 8px',
    '&:hover': { color: colors.error },
  },
  fieldsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'flex-end',
  },
  field: {
    minWidth: 120,
    flex: '1 1 120px',
    maxWidth: 220,
    '& .MuiInputBase-root': { fontSize: '0.82rem', height: 36 },
    '& .MuiInputLabel-root': { fontSize: '0.82rem' },
    '@media (max-width:400px)': {
      minWidth: '100%',
      maxWidth: '100%',
    },
  },
  dateField: {
    minWidth: 120,
    flex: '1 1 120px',
    maxWidth: 200,
    '& .MuiInputBase-root': { fontSize: '0.82rem', height: 36 },
    '@media (max-width:400px)': {
      minWidth: '100%',
    },
  },
}))

const FilterBar: React.FC<FilterBarProps> = ({ title, fields, values, onChange, onClear }) => {
  const { classes } = useStyles()
  const hasActiveFilters = Object.values(values).some((v) => v !== '')

  return (
    <Box className={classes.root}>
      <Box className={classes.titleRow}>
        <Box className={classes.titleLeft}>
          <FilterListIcon sx={{ fontSize: '1rem', color: colors.textSecondary }} />
          <Typography className={classes.title}>{title}</Typography>
        </Box>
        {hasActiveFilters && (
          <Button size="small" className={classes.clearButton} startIcon={<ClearIcon fontSize="small" />} onClick={onClear}>
            Clear
          </Button>
        )}
      </Box>

      <Box className={classes.fieldsRow}>
        {fields.map((field) => {
          if (field.type === 'select') {
            return (
              <FormControl key={field.key} size="small" className={classes.field}>
                <InputLabel shrink>{field.label}</InputLabel>
                <Select
                  label={field.label}
                  notched
                  value={values[field.key] ?? ''}
                  onChange={(e: SelectChangeEvent<string>) => onChange(field.key, e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">All</MenuItem>
                  {field.options?.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
          }

          if (field.type === 'date') {
            return (
              <TextField
                key={field.key}
                size="small"
                type="date"
                label={field.label}
                className={classes.dateField}
                InputLabelProps={{ shrink: true }}
                value={values[field.key] ?? ''}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
            )
          }

          return (
            <TextField
              key={field.key}
              size="small"
              label={field.label}
              placeholder={field.placeholder}
              className={classes.field}
              value={values[field.key] ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default FilterBar
