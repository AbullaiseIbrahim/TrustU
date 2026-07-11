import React, { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material'
import DatePickerField from '@/components/DatePickerField'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined'
import NightShelterOutlinedIcon from '@mui/icons-material/NightShelterOutlined'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import { makeStyles } from 'tss-react/mui'
import colors from '@/theme/colors'
import SelectField from '@/components/SelectField'
import { useCreateAccommodation } from '../hooks/useAccommodationQueries'
import { useAmenities } from '../hooks/useAmenityQueries'
import { useAuth } from '@/app/AuthProvider'
import { useSnackbar } from '@/app/SnackbarProvider'
import { INDIA_STATES } from '@/constants/states'

// ── Styles ────────────────────────────────────────────────────────────────────

const useStyles = makeStyles()(() => ({
  paper: {
    borderRadius: '0',
    height: '100%',
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 !important',
    width: '100% !important',
    maxWidth: '480px !important',
  },
  // Step 1 styles
  s1Header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: `1px solid ${colors.lineSoft}`,
    flexShrink: 0,
  },
  s1Step: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: colors.ink3,
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
  s1Body: {
    padding: '24px 20px 120px',
    overflowY: 'auto',
    flex: 1,
    '&::-webkit-scrollbar': { display: 'none' },
    scrollbarWidth: 'none',
  },
  s1Title: {
    fontWeight: 700,
    fontSize: '1.5rem',
    color: colors.ink,
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
    marginBottom: 8,
  },
  s1Sub: {
    fontSize: '0.82rem',
    color: colors.ink3,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  // Type row (Step 1)
  typeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '16px 18px',
    borderRadius: 16,
    border: `1.5px solid ${colors.line}`,
    backgroundColor: colors.white,
    cursor: 'pointer',
    marginBottom: 10,
    transition: 'all 0.15s ease',
    '&:hover': { borderColor: colors.moss },
  },
  typeRowActive: {
    borderColor: colors.moss,
    backgroundColor: `${colors.mossSoft}`,
  },
  typeIconTile: {
    width: 48,
    height: 48,
    borderRadius: 13,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: colors.cream,
    color: colors.ink3,
    '& svg': { fontSize: '1.4rem' },
  },
  typeIconTileActive: {
    backgroundColor: colors.moss,
    color: '#fff',
  },
  typeLabel: {
    fontWeight: 700,
    fontSize: '0.92rem',
    color: colors.ink,
    letterSpacing: '-0.2px',
  },
  typeDesc: {
    fontSize: '0.75rem',
    color: colors.ink3,
    marginTop: 2,
  },
  typeRadio: {
    marginLeft: 'auto',
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: `2px solid ${colors.line}`,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  typeRadioActive: {
    border: `2px solid ${colors.moss}`,
    backgroundColor: colors.moss,
  },
  // Sticky footer
  stickyFooter: {
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '14px 20px 20px',
    backgroundColor: colors.white,
    borderTop: `1px solid ${colors.lineSoft}`,
    flexShrink: 0,
  },
  continueBtn: {
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: colors.mossDeep },
    '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
  },
  // Step 2 header
  s2Header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 20px',
    borderBottom: `1px solid ${colors.lineSoft}`,
    flexShrink: 0,
  },
  s2Title: {
    flex: 1,
    fontWeight: 700,
    fontSize: '0.95rem',
    color: colors.ink,
    letterSpacing: '-0.2px',
  },
  s2Step: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: colors.ink3,
    backgroundColor: colors.cream,
    padding: '4px 10px',
    borderRadius: 20,
  },
  s2Body: {
    overflowY: 'auto',
    flex: 1,
    '&::-webkit-scrollbar': { display: 'none' },
    scrollbarWidth: 'none',
  },
  // Form field block
  fBlock: {
    padding: '18px 20px 14px',
    borderBottom: `1px solid ${colors.lineSoft}`,
  },
  fLabel: {
    fontWeight: 700,
    fontSize: '0.88rem',
    color: colors.ink,
    marginBottom: 10,
    letterSpacing: '-0.2px',
  },
  fHint: {
    fontSize: '0.72rem',
    color: colors.ink4,
    fontWeight: 500,
    marginTop: 4,
  },
  // Photos
  photosRow: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  photoAdd: {
    width: 80,
    height: 80,
    borderRadius: 12,
    border: `2px dashed ${colors.line}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    cursor: 'pointer',
    color: colors.ink4,
    flexShrink: 0,
    transition: 'all 0.15s ease',
    backgroundColor: colors.cream,
    fontFamily: 'inherit',
    '&:hover': { borderColor: colors.moss, color: colors.moss },
  },
  photoAddLabel: {
    fontSize: '0.65rem',
    fontWeight: 600,
  },
  // Steppers
  stepperRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: `1px solid ${colors.lineSoft}`,
    '&:last-child': { borderBottom: 'none', paddingBottom: 0 },
    '&:first-of-type': { paddingTop: 0 },
  },
  stepperLabel: {
    fontWeight: 500,
    fontSize: '0.85rem',
    color: colors.ink2,
  },
  stepperControls: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  stepperBtn: {
    width: 32,
    height: 32,
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
  stepperValue: {
    fontWeight: 700,
    fontSize: '0.9rem',
    color: colors.ink,
    minWidth: 20,
    textAlign: 'center',
  },
  // Segmented
  segmented: {
    display: 'flex',
    border: `1.5px solid ${colors.line}`,
    borderRadius: 10,
    overflow: 'hidden',
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
    '&:hover': { borderColor: colors.moss, color: colors.moss },
  },
  chipActive: {
    borderColor: colors.moss,
    backgroundColor: colors.mossSoft,
    color: colors.mossDeep,
  },
  // Visible To rows
  visibleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 0',
    borderBottom: `1px solid ${colors.lineSoft}`,
    cursor: 'pointer',
    '&:last-child': { borderBottom: 'none', paddingBottom: 0 },
    '&:first-of-type': { paddingTop: 0 },
  },
  visibleIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: colors.cream,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: colors.ink3,
    '& svg': { fontSize: '1.1rem' },
  },
  visibleLabel: {
    fontWeight: 700,
    fontSize: '0.85rem',
    color: colors.ink,
  },
  visibleDesc: {
    fontSize: '0.72rem',
    color: colors.ink3,
    marginTop: 2,
  },
  visibleRadio: {
    marginLeft: 'auto',
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: `2px solid ${colors.line}`,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  visibleRadioActive: {
    border: `2px solid ${colors.moss}`,
    backgroundColor: colors.moss,
  },
  // Footer 2-button
  s2Footer: {
    display: 'flex',
    gap: 10,
    padding: '14px 20px 20px',
    borderTop: `1px solid ${colors.lineSoft}`,
    flexShrink: 0,
  },
  previewBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: 14,
    border: `1.5px solid ${colors.line}`,
    backgroundColor: colors.white,
    color: colors.ink,
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: colors.cream },
  },
  postBtn: {
    flex: 2,
    padding: '14px',
    borderRadius: 14,
    border: 'none',
    backgroundColor: colors.moss,
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: colors.mossDeep },
    '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
  },
}))

// ── Constants ─────────────────────────────────────────────────────────────────

const STAY_TYPES = [
  {
    value: 'shared-room',
    label: 'Shared Room',
    desc: 'Flatmate / roommate',
    icon: <KingBedOutlinedIcon />,
  },
  {
    value: 'short-stay',
    label: 'Short Stay',
    desc: 'Few nights, per head',
    icon: <NightShelterOutlinedIcon />,
  },
  {
    value: 'flat-for-rent',
    label: 'Flat for Rent',
    desc: 'Whole flat / BHK',
    icon: <ApartmentOutlinedIcon />,
  },
  {
    value: 'hostel-pg',
    label: 'Hostel / PG',
    desc: 'Beds, monthly',
    icon: <HolidayVillageOutlinedIcon />,
  },
  {
    value: 'hotel',
    label: 'Hotel',
    desc: 'Rooms, nightly',
    icon: <HotelOutlinedIcon />,
  },
]

const ROOMMATE_PREFS_OPTIONS = [
  { value: 'students', label: 'Students' },
  { value: 'working',  label: 'Working pros' },
  { value: 'family',   label: 'Family' },
]

const FLAT_TYPE_OPTIONS = [
  { value: '1bhk', label: '1BHK' },
  { value: '2bhk', label: '2BHK' },
  { value: '3bhk', label: '3BHK' },
  { value: '4bhk', label: '4BHK' },
]

// Shown when the API returns no amenities
const FALLBACK_AMENITY_OPTIONS = [
  { value: 'wifi',    label: 'Wifi' },
  { value: 'ac',      label: 'AC' },
  { value: 'bed',     label: 'Bed' },
  { value: 'cot',     label: 'Cot' },
  { value: 'fridge',  label: 'Fridge' },
  { value: 'washing', label: 'Washing M.' },
  { value: 'iron',    label: 'Iron' },
]

const GENDER_OPTIONS = [
  { value: 'male',   label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'any',    label: 'Any' },
]

const VISIBLE_TO_OPTIONS = [
  {
    value: 'friends',
    label: 'Friends only',
    desc: 'Only your friends can see this listing',
    icon: <LockOutlinedIcon />,
  },
  {
    value: 'friends-mutuals',
    label: 'Friends + Mutuals',
    desc: 'Your friends and their connections',
    icon: <PeopleOutlinedIcon />,
  },
  {
    value: 'community',
    label: 'Whole community',
    desc: 'Everyone in Jamia Nagar community',
    icon: <HolidayVillageOutlinedIcon />,
  },
  {
    value: 'network',
    label: 'Entire network',
    desc: 'All Delhi Malayali Network members',
    icon: <PublicOutlinedIcon />,
  },
]

// ── Type / gender maps (string UI value → API numeric value) ─────────────────

const STAY_TYPE_MAP: Record<string, number> = {
  'shared-room':  0,
  'short-stay':   1,
  'flat-for-rent': 2,
  'hostel-pg':    3,
  'hotel':        4,
}

const GENDER_MAP: Record<string, number> = {
  male:   0,
  female: 1,
  any:    2,
}

const FLAT_TYPE_MAP: Record<string, number> = {
  '1bhk': 1,
  '2bhk': 2,
  '3bhk': 3,
  '4bhk': 4,
}

// ── Form state ────────────────────────────────────────────────────────────────

interface ListingForm {
  photoFiles: File[]   // actual File objects for upload
  photos: string[]     // preview object URLs — revoked on remove / close
  title: string
  description: string
  availableSpots: number
  currentRoommates: number
  gender: string
  roommatePref: string[]
  flatType: string
  availableFrom: string
  cityId: string
  locality: string
  rentPerPerson: string
  depositAmount: string
  amenities: string[]
  visibleTo: string
  phone: string
}

const EMPTY_FORM: ListingForm = {
  photoFiles: [],
  photos: [],
  title: '',
  description: '',
  availableSpots: 1,
  currentRoommates: 2,
  gender: 'any',
  roommatePref: [],
  flatType: '',
  availableFrom: '',
  cityId: '',
  locality: '',
  rentPerPerson: '',
  depositAmount: '',
  amenities: [],
  visibleTo: 'friends-mutuals',
  phone: '',
}

// ── Stepper control ───────────────────────────────────────────────────────────

interface StepperProps {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (v: number) => void
}

const StepperField: React.FC<StepperProps> = ({ label, value, min = 0, max = 10, onChange }) => {
  const { classes } = useStyles()
  return (
    <Box className={classes.stepperRow}>
      <Typography className={classes.stepperLabel}>{label}</Typography>
      <Box className={classes.stepperControls}>
        <Box
          component="button"
          className={classes.stepperBtn}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <RemoveIcon sx={{ fontSize: '0.9rem' }} />
        </Box>
        <Typography className={classes.stepperValue}>{value}</Typography>
        <Box
          component="button"
          className={classes.stepperBtn}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          <AddIcon sx={{ fontSize: '0.9rem' }} />
        </Box>
      </Box>
    </Box>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
}

const MAX_PHOTOS = 8

const PostListingFlow: React.FC<Props> = ({ open, onClose }) => {
  const { classes, cx } = useStyles()
  const { user } = useAuth()
  const { showError } = useSnackbar()
  const createMutation = useCreateAccommodation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Amenities: API data when available, hardcoded fallback otherwise
  const { data: apiAmenities = [] } = useAmenities()
  const amenityOptions = apiAmenities.length > 0
    ? apiAmenities.map(a => ({ value: String(a.id), label: a.name }))
    : FALLBACK_AMENITY_OPTIONS

  const [step, setStep] = useState<1 | 2>(1)
  const [stayType, setStayType] = useState('shared-room')
  const [form, setForm] = useState<ListingForm>(EMPTY_FORM)

  // Revoke all object URLs when the dialog closes to avoid memory leaks
  useEffect(() => {
    if (!open && form.photos.length) {
      form.photos.forEach(url => URL.revokeObjectURL(url))
    }
  }, [open])

  const setF = (patch: Partial<ListingForm>) =>
    setForm(prev => ({ ...prev, ...patch }))

  const toggleMulti = (key: 'roommatePref' | 'amenities', val: string) => {
    const arr = form[key]
    setF({ [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] })
  }

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const remaining = MAX_PHOTOS - form.photos.length
    const toAdd = files.slice(0, remaining)
    const urls = toAdd.map(f => URL.createObjectURL(f))
    setF({ photoFiles: [...form.photoFiles, ...toAdd], photos: [...form.photos, ...urls] })
    e.target.value = ''
  }

  const handleRemovePhoto = (index: number) => {
    URL.revokeObjectURL(form.photos[index])
    setF({
      photoFiles: form.photoFiles.filter((_, i) => i !== index),
      photos:     form.photos.filter((_, i) => i !== index),
    })
  }

  const handleClose = () => {
    form.photos.forEach(url => URL.revokeObjectURL(url))
    setStep(1)
    setStayType('shared-room')
    setForm(EMPTY_FORM)
    onClose()
  }

  const handlePost = () => {
    if (!form.cityId) {
      showError('Please select a city / state.')
      return
    }
    if (!form.locality.trim()) {
      showError('Please enter the address / locality.')
      return
    }
    createMutation.mutate(
      {
        title:           form.title || `${typeLabel} — Listing`,
        description:     form.description,
        amount:          Number(form.rentPerPerson) || 0,
        deposit_amount:  Number(form.depositAmount) || undefined,
        city_id:         Number(form.cityId),
        community_id:    user?.communityId != null ? Number(user.communityId) : null,
        type:            STAY_TYPE_MAP[stayType] ?? 0,
        is_negotiable:   false,
        address:         form.locality.trim(),
        available_from:  form.availableFrom || new Date().toISOString().split('T')[0],
        gender:          GENDER_MAP[form.gender] ?? 2,
        flat_type:       FLAT_TYPE_MAP[form.flatType] ?? null,
        available_spots: form.availableSpots,
        people_allowed:  form.currentRoommates + form.availableSpots,
        furnishing:      0,
        security_deposit: false,
        // When API amenities are loaded, values are numeric ID strings → convert back to numbers
        amenity_ids: apiAmenities.length > 0
          ? form.amenities.map(v => Number(v)).filter(Boolean)
          : [],
        photos:          form.photoFiles,
        phone:           form.phone.trim() || undefined,
      },
      { onSuccess: handleClose },
    )
  }

  // ── Step 1 ─────────────────────────────────────────────────────────────────

  const renderStep1 = () => (
    <>
      <Box className={classes.s1Header}>
        <Box component="button" className={classes.closeBtn} onClick={handleClose}>
          <CloseIcon sx={{ fontSize: '1rem' }} />
        </Box>
        <Typography className={classes.s1Step}>Step 1 of 2</Typography>
        <Box sx={{ width: 34 }} />
      </Box>

      <Box className={classes.s1Body}>
        <Typography className={classes.s1Title}>What are you listing?</Typography>
        <Typography className={classes.s1Sub}>
          Choose the type of stay you provide. It will be shared with your trusted circle in Jamia Nagar.
        </Typography>

        {STAY_TYPES.map(t => (
          <Box
            key={t.value}
            className={cx(classes.typeRow, { [classes.typeRowActive]: stayType === t.value })}
            onClick={() => setStayType(t.value)}
          >
            <Box className={cx(classes.typeIconTile, { [classes.typeIconTileActive]: stayType === t.value })}>
              {t.icon}
            </Box>
            <Box>
              <Typography className={classes.typeLabel}>{t.label}</Typography>
              <Typography className={classes.typeDesc}>{t.desc}</Typography>
            </Box>
            <Box className={cx(classes.typeRadio, { [classes.typeRadioActive]: stayType === t.value })}>
              {stayType === t.value && <CheckIcon sx={{ fontSize: '0.75rem', color: '#fff' }} />}
            </Box>
          </Box>
        ))}
      </Box>

      <Box className={classes.stickyFooter}>
        <Box
          component="button"
          className={classes.continueBtn}
          onClick={() => setStep(2)}
        >
          Continue <ArrowForwardIcon sx={{ fontSize: '1rem' }} />
        </Box>
      </Box>
    </>
  )

  // ── Step 2 ─────────────────────────────────────────────────────────────────

  const typeLabel = STAY_TYPES.find(t => t.value === stayType)?.label ?? 'Shared Room'

  const renderStep2 = () => (
    <>
      <Box className={classes.s2Header}>
        <Box
          component="button"
          className={classes.closeBtn}
          onClick={() => setStep(1)}
          aria-label="back"
        >
          <ArrowBackIcon sx={{ fontSize: '1rem' }} />
        </Box>
        <Typography className={classes.s2Title}>List a {typeLabel}</Typography>
        <Typography className={classes.s2Step}>2 of 2</Typography>
      </Box>

      <DialogContent className={classes.s2Body} sx={{ p: 0 }}>

        {/* Photos */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>
            Photos
            <Typography component="span" sx={{ fontWeight: 400, fontSize: '0.72rem', color: colors.ink4, ml: 1 }}>
              {form.photos.length}/{MAX_PHOTOS}
            </Typography>
          </Typography>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleAddPhotos}
          />

          <Box className={classes.photosRow}>
            {/* Add tile — hidden when max reached */}
            {form.photos.length < MAX_PHOTOS && (
              <Box
                component="button"
                className={classes.photoAdd}
                onClick={() => fileInputRef.current?.click()}
              >
                <AddPhotoAlternateOutlinedIcon sx={{ fontSize: '1.4rem' }} />
                <Typography className={classes.photoAddLabel}>Add</Typography>
              </Box>
            )}

            {/* Uploaded image thumbnails */}
            {form.photos.map((url, idx) => (
              <Box
                key={url}
                sx={{
                  width: 80, height: 80, borderRadius: '12px', flexShrink: 0,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src={url}
                  alt="listing photo"
                  sx={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', display: 'block',
                  }}
                />
                <Box
                  component="button"
                  onClick={() => handleRemovePhoto(idx)}
                  sx={{
                    position: 'absolute', top: 4, right: 4,
                    width: 20, height: 20, borderRadius: '50%',
                    backgroundColor: 'rgba(22,25,15,0.72)',
                    backdropFilter: 'blur(4px)',
                    color: '#fff', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontFamily: 'inherit', lineHeight: 1,
                    transition: 'background-color 0.15s ease',
                    '&:hover': { backgroundColor: 'rgba(199,55,47,0.88)' },
                  }}
                >
                  ×
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Title */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>Title</Typography>
          <TextField
            fullWidth size="small"
            placeholder="e.g. Female Flatmate Needed — Student"
            value={form.title}
            onChange={e => setF({ title: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
        </Box>

        {/* Description */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>Description</Typography>
          <TextField
            fullWidth size="small" multiline minRows={3}
            placeholder="Describe the place, nearby landmarks, rules, what's included…"
            value={form.description}
            onChange={e => setF({ description: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
        </Box>

        {/* Availability */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>Availability</Typography>
          <StepperField
            label="Available spots"
            value={form.availableSpots}
            min={1} max={10}
            onChange={v => setF({ availableSpots: v })}
          />
          <StepperField
            label="Current roommates"
            value={form.currentRoommates}
            min={0} max={10}
            onChange={v => setF({ currentRoommates: v })}
          />
        </Box>

        {/* Gender Preference */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>Gender Preference</Typography>
          <Box className={classes.segmented}>
            {GENDER_OPTIONS.map((o, i) => (
              <Box
                key={o.value}
                component="button"
                className={cx(classes.segBtn, { [classes.segBtnActive]: form.gender === o.value })}
                style={i === 0 ? { borderLeft: 'none' } : {}}
                onClick={() => setF({ gender: o.value })}
              >
                {o.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Roommate Preference */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>Roommate Preference</Typography>
          <Box className={classes.chipsWrap}>
            {ROOMMATE_PREFS_OPTIONS.map(o => (
              <Box
                key={o.value}
                component="button"
                className={cx(classes.chip, { [classes.chipActive]: form.roommatePref.includes(o.value) })}
                onClick={() => toggleMulti('roommatePref', o.value)}
              >
                {form.roommatePref.includes(o.value) && <CheckIcon sx={{ fontSize: '0.72rem' }} />}
                {o.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Type of Flat */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>Type of Flat</Typography>
          <Box className={classes.chipsWrap}>
            {FLAT_TYPE_OPTIONS.map(o => (
              <Box
                key={o.value}
                component="button"
                className={cx(classes.chip, { [classes.chipActive]: form.flatType === o.value })}
                onClick={() => setF({ flatType: form.flatType === o.value ? '' : o.value })}
              >
                {form.flatType === o.value && <CheckIcon sx={{ fontSize: '0.72rem' }} />}
                {o.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Available From */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>Available From</Typography>
          <DatePickerField
            label="Select date"
            value={form.availableFrom}
            onChange={v => setF({ availableFrom: v })}
          />
        </Box>

        {/* Location */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>Location</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <SelectField
              label="City / State"
              value={form.cityId}
              onChange={v => setF({ cityId: v })}
              options={INDIA_STATES.map(s => ({ value: String(s.id), label: s.name }))}
              placeholder="Select city / state"
            />
            <TextField
              fullWidth size="small"
              placeholder="Locality / address (e.g. Plot 12, Okhla, Jamia Nagar)"
              value={form.locality}
              onChange={e => setF({ locality: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnOutlinedIcon sx={{ fontSize: '1rem', color: colors.ink3 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Box>
        </Box>

        {/* Rent */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>Rent</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TextField
              size="small" label="Rent / amount"
              value={form.rentPerPerson}
              onChange={e => setF({ rentPerPerson: e.target.value.replace(/\D/g, '') })}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              inputProps={{ inputMode: 'numeric' }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            <TextField
              size="small" label="Deposit amount (optional)"
              value={form.depositAmount}
              onChange={e => setF({ depositAmount: e.target.value.replace(/\D/g, '') })}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              inputProps={{ inputMode: 'numeric' }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Box>
        </Box>

        {/* WhatsApp / Contact number */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>WhatsApp Number</Typography>
          <TextField
            fullWidth size="small"
            placeholder="e.g. 9876543210"
            value={form.phone}
            onChange={e => setF({ phone: e.target.value.replace(/\D/g, '').slice(0, 15) })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WhatsAppIcon sx={{ fontSize: '1rem', color: '#25D366' }} />
                </InputAdornment>
              ),
            }}
            inputProps={{ inputMode: 'tel', maxLength: 15 }}
            helperText="Interested people will contact you directly via WhatsApp"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
        </Box>

        {/* Amenities — from API when available, hardcoded fallback otherwise */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>Amenities Available</Typography>
          <Box className={classes.chipsWrap}>
            {amenityOptions.map(o => (
              <Box
                key={o.value}
                component="button"
                className={cx(classes.chip, { [classes.chipActive]: form.amenities.includes(o.value) })}
                onClick={() => toggleMulti('amenities', o.value)}
              >
                {form.amenities.includes(o.value) && <CheckIcon sx={{ fontSize: '0.72rem' }} />}
                {o.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Visible To */}
        <Box className={classes.fBlock} style={{ borderBottom: 'none' }}>
          <Typography className={classes.fLabel}>Visible To</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: colors.ink3, mb: 1.5, lineHeight: 1.5 }}>
            Choose who can see this listing so it never leaks to strangers.
          </Typography>
          {VISIBLE_TO_OPTIONS.map(o => (
            <Box
              key={o.value}
              className={classes.visibleRow}
              onClick={() => setF({ visibleTo: o.value })}
            >
              <Box className={classes.visibleIcon}>{o.icon}</Box>
              <Box sx={{ flex: 1 }}>
                <Typography className={classes.visibleLabel}>{o.label}</Typography>
                <Typography className={classes.visibleDesc}>{o.desc}</Typography>
              </Box>
              <Box className={cx(classes.visibleRadio, { [classes.visibleRadioActive]: form.visibleTo === o.value })}>
                {form.visibleTo === o.value && <CheckIcon sx={{ fontSize: '0.65rem', color: '#fff' }} />}
              </Box>
            </Box>
          ))}
        </Box>

      </DialogContent>

      <Box className={classes.s2Footer}>
        <Box component="button" className={classes.previewBtn}>
          Preview
        </Box>
        <Box
          component="button"
          className={classes.postBtn}
          onClick={handlePost}
          disabled={createMutation.isPending}
        >
          <CheckIcon sx={{ fontSize: '1rem' }} />
          {createMutation.isPending ? 'Posting…' : 'Post listing'}
        </Box>
      </Box>
    </>
  )

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      PaperProps={{ className: classes.paper }}
      sx={{ '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center' } }}
    >
      {step === 1 ? renderStep1() : renderStep2()}
    </Dialog>
  )
}

export default PostListingFlow
