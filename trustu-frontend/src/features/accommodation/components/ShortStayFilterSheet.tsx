import React from 'react'
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Slider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { makeStyles } from 'tss-react/mui'
import DatePickerField from '@/components/DatePickerField'
import colors from '@/theme/colors'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ShortStayFilters {
  budgetMin: string
  budgetMax: string
  dateFrom: string
  dateTo: string
  guests: number
  postedBy: string   // '' | 'friends' | 'mutuals' | 'anyone'
  gender: string     // '' | 'male' | 'female' | 'any'
  flatType: string[] // '1bhk' | '2bhk' | '3bhk' | 'hotel-room'
}

export const EMPTY_SHORT_STAY_FILTERS: ShortStayFilters = {
  budgetMin: '', budgetMax: '',
  dateFrom: '', dateTo: '',
  guests: 1,
  postedBy: '', gender: '',
  flatType: [],
}

export function countShortStayFilters(f: ShortStayFilters): number {
  let n = 0
  if (f.budgetMin || f.budgetMax) n++
  if (f.dateFrom || f.dateTo) n++
  if (f.guests > 1) n++
  if (f.postedBy) n++
  if (f.gender) n++
  if (f.flatType.length) n++
  return n
}

export function getShortStayActiveChips(f: ShortStayFilters): string[] {
  const chips: string[] = []
  if (f.dateFrom || f.dateTo) {
    const from = f.dateFrom ? new Date(f.dateFrom).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''
    const to   = f.dateTo   ? new Date(f.dateTo).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''
    chips.push(from && to ? `${from}–${to}` : from || to)
  }
  if (f.guests > 1) chips.push(`${f.guests} guests`)
  if (f.budgetMin || f.budgetMax) {
    const lo = f.budgetMin ? `₹${Math.round(Number(f.budgetMin) / 1000)}k` : '₹0'
    const hi = f.budgetMax ? `₹${Math.round(Number(f.budgetMax) / 1000)}k` : '+'
    chips.push(`${lo}–${hi}`)
  }
  if (f.postedBy === 'friends')  chips.push('Friends only')
  if (f.postedBy === 'mutuals')  chips.push('Mutuals')
  if (f.gender === 'female')     chips.push('Female only')
  if (f.gender === 'male')       chips.push('Male only')
  if (f.flatType.length)         chips.push(...f.flatType.map(t => t.toUpperCase()))
  return chips
}

// ── Styles ────────────────────────────────────────────────────────────────────

const useStyles = makeStyles()(() => ({
  paper: {
    borderRadius: '20px 20px 0 0',
    maxHeight: '92vh',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 !important',
    width: '100% !important',
    maxWidth: '480px !important',
    position: 'fixed !important' as 'fixed',
    bottom: '0 !important',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px 12px',
    borderBottom: `1px solid ${colors.lineSoft}`,
    flexShrink: 0,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    backgroundColor: colors.cream,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    color: colors.ink,
    fontFamily: 'inherit',
    '&:hover': { backgroundColor: colors.line },
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: '1rem',
    color: colors.ink,
    letterSpacing: '-0.3px',
  },
  clearBtn: {
    fontWeight: 600,
    fontSize: '0.82rem',
    color: colors.moss,
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 8,
    background: 'none',
    border: 'none',
    fontFamily: 'inherit',
    '&:hover': { backgroundColor: colors.mossSoft },
  },
  body: {
    overflowY: 'auto',
    flex: 1,
    '&::-webkit-scrollbar': { display: 'none' },
    scrollbarWidth: 'none',
  },
  section: {
    padding: '18px 20px 16px',
    borderBottom: `1px solid ${colors.lineSoft}`,
  },
  sectionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: '0.9rem',
    color: colors.ink,
    letterSpacing: '-0.2px',
  },
  sectionMeta: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: colors.ink4,
  },
  trustLabel: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: colors.ink3,
    letterSpacing: '0.2px',
  },
  budgetInputRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  budgetSep: {
    color: colors.ink4,
    fontWeight: 500,
    fontSize: '0.9rem',
    flexShrink: 0,
  },
  // Dates row
  datesRow: {
    display: 'flex',
    gap: 10,
  },
  dateInput: {
    flex: 1,
    '& .MuiOutlinedInput-root': { borderRadius: '10px' },
    '& .MuiInputAdornment-root': { color: colors.ink3 },
  },
  // Guests stepper
  guestsStepper: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  stepperBtn: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    border: `1.5px solid ${colors.line}`,
    backgroundColor: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: colors.ink2,
    transition: 'all 0.15s ease',
    '&:hover': { borderColor: colors.moss, color: colors.moss },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  },
  guestsLabel: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: colors.ink,
    minWidth: 72,
    textAlign: 'center',
  },
  // Chips
  chipsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '7px 14px',
    borderRadius: 999,
    border: `1.5px solid ${colors.line}`,
    backgroundColor: colors.white,
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: colors.ink2,
    transition: 'all 0.15s ease',
    userSelect: 'none',
    fontFamily: 'inherit',
    lineHeight: 1,
    '&:hover': { borderColor: colors.moss, color: colors.moss },
  },
  chipActive: {
    borderColor: colors.moss,
    backgroundColor: colors.mossSoft,
    color: colors.mossDeep,
  },
  // Segmented
  segmented: {
    display: 'flex',
    border: `1.5px solid ${colors.line}`,
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  segBtn: {
    flex: 1,
    padding: '9px 8px',
    border: 'none',
    borderLeft: `1px solid ${colors.line}`,
    backgroundColor: colors.white,
    color: colors.ink2,
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    '&:first-of-type': { borderLeft: 'none' },
  },
  segBtnActive: {
    backgroundColor: colors.moss,
    color: '#fff',
  },
  footer: {
    padding: '14px 20px 20px',
    borderTop: `1px solid ${colors.lineSoft}`,
    flexShrink: 0,
  },
  showBtn: {
    width: '100%',
    padding: '15px',
    borderRadius: 14,
    backgroundColor: colors.moss,
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '-0.2px',
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: colors.mossDeep },
  },
}))

// ── Constants ─────────────────────────────────────────────────────────────────

const POSTED_BY = [
  { value: 'friends', label: 'Friends' },
  { value: 'mutuals', label: 'Mutual friends' },
  { value: 'anyone',  label: 'Anyone' },
]

const GENDER_OPTIONS = [
  { value: 'male',   label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'any',    label: 'Any' },
]

const FLAT_TYPES = [
  { value: '1bhk',       label: '1BHK' },
  { value: '2bhk',       label: '2BHK' },
  { value: '3bhk',       label: '3BHK' },
  { value: 'hotel-room', label: 'Hotel room' },
]

const BUDGET_MAX = 20000

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
  filters: ShortStayFilters
  onChange: (f: ShortStayFilters) => void
}

const ShortStayFilterSheet: React.FC<Props> = ({ open, onClose, filters, onChange }) => {
  const { classes, cx } = useStyles()
  const [draft, setDraft] = React.useState<ShortStayFilters>(filters)

  React.useEffect(() => { if (open) setDraft(filters) }, [open, filters])

  const set = (patch: Partial<ShortStayFilters>) =>
    setDraft(prev => ({ ...prev, ...patch }))

  const togglePostedBy = (val: string) =>
    set({ postedBy: draft.postedBy === val ? '' : val })

  const toggleGender = (val: string) =>
    set({ gender: draft.gender === val ? '' : val })

  const toggleFlatType = (val: string) => {
    const arr = draft.flatType
    set({ flatType: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] })
  }

  const handleClear = () => setDraft(EMPTY_SHORT_STAY_FILTERS)
  const handleApply = () => { onChange(draft); onClose() }

  const budgetRange: [number, number] = [
    draft.budgetMin ? Number(draft.budgetMin) : 0,
    draft.budgetMax ? Number(draft.budgetMax) : BUDGET_MAX,
  ]

  const handleSlider = (_: Event, val: number | number[]) => {
    const [lo, hi] = val as number[]
    set({
      budgetMin: lo === 0 ? '' : String(lo),
      budgetMax: hi === BUDGET_MAX ? '' : String(hi),
    })
  }

  const budgetLabel = () => {
    const lo = draft.budgetMin ? `₹${Number(draft.budgetMin).toLocaleString('en-IN')}` : '₹500'
    const hi = draft.budgetMax ? `₹${Number(draft.budgetMax).toLocaleString('en-IN')}` : `₹${BUDGET_MAX.toLocaleString('en-IN')}`
    return `${lo} - ${hi}`
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.paper }}
      sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
    >
      {/* Header */}
      <Box className={classes.header}>
        <Box component="button" className={classes.closeBtn} onClick={onClose} aria-label="close">
          <CloseIcon sx={{ fontSize: '1rem' }} />
        </Box>
        <Typography className={classes.headerTitle}>Filters</Typography>
        <Box component="button" className={classes.clearBtn} onClick={handleClear}>
          Clear
        </Box>
      </Box>

      <DialogContent className={classes.body} sx={{ p: 0 }}>

        {/* Budget Per Night */}
        <Box className={classes.section}>
          <Box className={classes.sectionRow}>
            <Typography className={classes.sectionTitle}>Budget Per Night</Typography>
            <Typography className={classes.sectionMeta}>{budgetLabel()}</Typography>
          </Box>
          <Box className={classes.budgetInputRow}>
            <TextField
              size="small" label="Minimum"
              value={draft.budgetMin}
              onChange={e => set({ budgetMin: e.target.value.replace(/\D/g, '') })}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              inputProps={{ inputMode: 'numeric' }}
              sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            <Typography className={classes.budgetSep}>–</Typography>
            <TextField
              size="small" label="Maximum"
              value={draft.budgetMax}
              onChange={e => set({ budgetMax: e.target.value.replace(/\D/g, '') })}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              inputProps={{ inputMode: 'numeric' }}
              sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Box>
          <Slider
            value={budgetRange}
            min={0} max={BUDGET_MAX} step={300}
            onChange={handleSlider}
            valueLabelDisplay="auto"
            valueLabelFormat={v => `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`}
            sx={{ color: colors.moss, mt: 0.5 }}
          />
        </Box>

        {/* Dates You Need */}
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle} sx={{ mb: 1.5 }}>Dates You Need</Typography>
          <Box className={classes.datesRow}>
            <Box sx={{ flex: 1 }}>
              <DatePickerField
                label="Check in"
                value={draft.dateFrom}
                onChange={v => set({ dateFrom: v })}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <DatePickerField
                label="Check out"
                value={draft.dateTo}
                onChange={v => set({ dateTo: v })}
              />
            </Box>
          </Box>
        </Box>

        {/* Guests */}
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle} sx={{ mb: 1.5 }}>Guests</Typography>
          <Box className={classes.guestsStepper}>
            <Box
              component="button"
              className={classes.stepperBtn}
              onClick={() => set({ guests: Math.max(1, draft.guests - 1) })}
              disabled={draft.guests <= 1}
            >
              <RemoveIcon sx={{ fontSize: '1rem' }} />
            </Box>
            <Typography className={classes.guestsLabel}>
              {draft.guests} {draft.guests === 1 ? 'guest' : 'guests'}
            </Typography>
            <Box
              component="button"
              className={classes.stepperBtn}
              onClick={() => set({ guests: Math.min(12, draft.guests + 1) })}
            >
              <AddIcon sx={{ fontSize: '1rem' }} />
            </Box>
          </Box>
        </Box>

        {/* Posted By */}
        <Box className={classes.section}>
          <Box className={classes.sectionRow}>
            <Typography className={classes.sectionTitle}>Posted By</Typography>
            <Typography className={classes.trustLabel}>Trust filter</Typography>
          </Box>
          <Box className={classes.chipsWrap}>
            {POSTED_BY.map(o => (
              <Box
                key={o.value}
                component="button"
                className={cx(classes.chip, { [classes.chipActive]: draft.postedBy === o.value })}
                onClick={() => togglePostedBy(o.value)}
              >
                {draft.postedBy === o.value && '✓ '}
                {o.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Gender Preference */}
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle} sx={{ mb: 1.5 }}>Gender Preference</Typography>
          <Box className={classes.segmented}>
            {GENDER_OPTIONS.map((o, i) => (
              <Box
                key={o.value}
                component="button"
                className={cx(classes.segBtn, { [classes.segBtnActive]: draft.gender === o.value })}
                style={i === 0 ? { borderLeft: 'none' } : {}}
                onClick={() => toggleGender(o.value)}
              >
                {o.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Type of Flat */}
        <Box className={classes.section} style={{ borderBottom: 'none' }}>
          <Typography className={classes.sectionTitle} sx={{ mb: 1.5 }}>Type of Flat</Typography>
          <Box className={classes.chipsWrap}>
            {FLAT_TYPES.map(o => (
              <Box
                key={o.value}
                component="button"
                className={cx(classes.chip, { [classes.chipActive]: draft.flatType.includes(o.value) })}
                onClick={() => toggleFlatType(o.value)}
              >
                {draft.flatType.includes(o.value) && '✓ '}
                {o.label}
              </Box>
            ))}
          </Box>
        </Box>

      </DialogContent>

      {/* Sticky CTA */}
      <Box className={classes.footer}>
        <Box component="button" className={classes.showBtn} onClick={handleApply}>
          Show stays
        </Box>
      </Box>
    </Dialog>
  )
}

export default ShortStayFilterSheet
