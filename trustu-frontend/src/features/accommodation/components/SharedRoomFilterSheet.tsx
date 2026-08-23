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
import { makeStyles } from 'tss-react/mui'
import colors from '@/theme/colors'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SharedRoomFilters {
  budgetMin: string
  budgetMax: string
  location: string         // free-text match against listing address
  gender: string          // '' | 'male' | 'female' | 'any'
  currentRoommates: string // '' | 'any' | '1' | '2' | '3+'
  roommatePref: string[]   // multi-select
}

export const EMPTY_SHARED_FILTERS: SharedRoomFilters = {
  budgetMin: '',
  budgetMax: '',
  location: '',
  gender: '',
  currentRoommates: '',
  roommatePref: [],
}

export function countActiveFilters(f: SharedRoomFilters): number {
  let n = 0
  if (f.budgetMin || f.budgetMax) n++
  if (f.location.trim()) n++
  if (f.gender) n++
  if (f.currentRoommates && f.currentRoommates !== 'any') n++
  if (f.roommatePref.length) n++
  return n
}

export function getActiveChips(f: SharedRoomFilters): string[] {
  const chips: string[] = []
  if (f.gender === 'female')  chips.push('Female only')
  if (f.gender === 'male')    chips.push('Male only')
  if (f.budgetMin || f.budgetMax) {
    const lo = f.budgetMin ? `₹${Math.round(Number(f.budgetMin) / 1000)}k` : '₹0'
    const hi = f.budgetMax ? `₹${Math.round(Number(f.budgetMax) / 1000)}k` : '+'
    chips.push(`${lo}–${hi}`)
  }
  if (f.location.trim()) chips.push(f.location.trim())
  if (f.currentRoommates && f.currentRoommates !== 'any' && f.currentRoommates !== '')
    chips.push(`${f.currentRoommates} roommate${f.currentRoommates === '1' ? '' : 's'}`)
  if (f.roommatePref.length)
    chips.push(...f.roommatePref.map(r => r.charAt(0).toUpperCase() + r.slice(1)))
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
  // Budget inputs
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
  // Chips
  chipsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
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
    '&:hover': {
      borderColor: colors.moss,
      color: colors.moss,
    },
  },
  chipActive: {
    borderColor: colors.moss,
    backgroundColor: colors.mossSoft,
    color: colors.mossDeep,
  },
  // Segmented control for gender
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    '&:first-of-type': {
      borderLeft: 'none',
    },
  },
  segBtnActive: {
    backgroundColor: colors.moss,
    color: '#fff',
  },
  // Footer
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

// ── Posted By options ─────────────────────────────────────────────────────────

const ROOMMATE_COUNTS = [
  { value: 'any', label: 'Any' },
  { value: '1',   label: '1' },
  { value: '2',   label: '2' },
  { value: '3+',  label: '3+' },
]

const ROOMMATE_PREFS = [
  { value: 'students', label: 'Students' },
  { value: 'working',  label: 'Working pros' },
  { value: 'family',   label: 'Family' },
  { value: 'none',     label: 'No preference' },
]

const GENDER_OPTIONS = [
  { value: 'male',   label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'any',    label: 'Any' },
]

const BUDGET_MAX = 20000

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
  filters: SharedRoomFilters
  onChange: (f: SharedRoomFilters) => void
  listingCount?: number
}

const SharedRoomFilterSheet: React.FC<Props> = ({
  open, onClose, filters, onChange, listingCount,
}) => {
  const { classes, cx } = useStyles()
  const [draft, setDraft] = React.useState<SharedRoomFilters>(filters)

  React.useEffect(() => { if (open) setDraft(filters) }, [open, filters])

  const set = (patch: Partial<SharedRoomFilters>) =>
    setDraft(prev => ({ ...prev, ...patch }))

  const toggleGender = (val: string) =>
    set({ gender: draft.gender === val ? '' : val })

  const toggleRoommateCount = (val: string) =>
    set({ currentRoommates: draft.currentRoommates === val ? '' : val })

  const toggleRoommatePref = (val: string) => {
    const arr = draft.roommatePref
    set({ roommatePref: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] })
  }

  const handleClear = () => setDraft(EMPTY_SHARED_FILTERS)

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

        {/* Budget Per Head */}
        <Box className={classes.section}>
          <Box className={classes.sectionRow}>
            <Typography className={classes.sectionTitle}>Budget Per Head</Typography>
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
            min={0} max={BUDGET_MAX} step={500}
            onChange={handleSlider}
            valueLabelDisplay="auto"
            valueLabelFormat={v => `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`}
            sx={{ color: colors.moss, mt: 0.5 }}
          />
        </Box>

        {/* Location */}
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle} sx={{ mb: 1.5 }}>Location</Typography>
          <TextField
            fullWidth size="small"
            placeholder="e.g. Batla House, Okhla…"
            value={draft.location}
            onChange={e => set({ location: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
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

        {/* Current Roommates */}
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle} sx={{ mb: 1.5 }}>Current Roommates</Typography>
          <Box className={classes.chipsWrap}>
            {ROOMMATE_COUNTS.map(o => (
              <Box
                key={o.value}
                component="button"
                className={cx(classes.chip, {
                  [classes.chipActive]: draft.currentRoommates === o.value ||
                    (o.value === 'any' && !draft.currentRoommates),
                })}
                onClick={() => toggleRoommateCount(o.value)}
              >
                {(draft.currentRoommates === o.value ||
                  (o.value === 'any' && !draft.currentRoommates)) && '✓ '}
                {o.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Roommate Preference */}
        <Box className={classes.section} style={{ borderBottom: 'none' }}>
          <Typography className={classes.sectionTitle} sx={{ mb: 1.5 }}>Roommate Preference</Typography>
          <Box className={classes.chipsWrap}>
            {ROOMMATE_PREFS.map(o => (
              <Box
                key={o.value}
                component="button"
                className={cx(classes.chip, {
                  [classes.chipActive]: draft.roommatePref.includes(o.value),
                })}
                onClick={() => toggleRoommatePref(o.value)}
              >
                {draft.roommatePref.includes(o.value) && '✓ '}
                {o.label}
              </Box>
            ))}
          </Box>
        </Box>

      </DialogContent>

      {/* Sticky CTA */}
      <Box className={classes.footer}>
        <Box component="button" className={classes.showBtn} onClick={handleApply}>
          {listingCount != null ? `Show ${listingCount} listings` : 'Show listings'}
        </Box>
      </Box>
    </Dialog>
  )
}

export default SharedRoomFilterSheet
