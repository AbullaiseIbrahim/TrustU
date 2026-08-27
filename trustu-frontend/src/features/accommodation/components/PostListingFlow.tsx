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
import TimePickerField, { formatTimeDisplay } from '@/components/TimePickerField'
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
import { FURNISHING_OPTIONS } from '@/services/accommodation.api'
import { formatINR } from '@/utils'
import { useAuth } from '@/app/AuthProvider'
import { useSnackbar } from '@/app/SnackbarProvider'
import { SIGNUP_ENABLED_STATES } from '@/constants/states'

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

/** Only applies to Short Stay — per GET /accommodations/schema's guest_preference field. */
const GUEST_PREFERENCE_OPTIONS = [
  { value: 'male',     label: 'Male' },
  { value: 'female',   label: 'Female' },
  { value: 'family',   label: 'Family' },
  { value: 'students', label: 'Students' },
  { value: 'any',      label: 'Any' },
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

/** Hostel / PG only — Girls/Boys reuses the same gender field & values as GENDER_MAP. */
const HOSTEL_INMATE_OPTIONS = [
  { value: 'female', label: 'Girls' },
  { value: 'male',   label: 'Boys' },
]

/**
 * Hostel / PG only. No dedicated backend column exists for occupancy type, so
 * each option maps onto the real `available_spots` field (spots per room) —
 * "Any" leaves it unset rather than guessing a number.
 */
const HOSTEL_OCCUPANCY_OPTIONS: { value: string; label: string; spots?: number }[] = [
  { value: 'single', label: 'Single',      spots: 1 },
  { value: 'double', label: 'Double',      spots: 2 },
  { value: 'triple', label: 'Triple',      spots: 3 },
  { value: '4plus',  label: '4+ Sharing',  spots: 4 },
  { value: 'any',    label: 'Any' },
]

/** Hostel / PG only — no backend column; folded into the description on submit. */
const ROOM_FEATURES_OPTIONS = [
  { value: 'spacious',        label: 'Spacious Rooms' },
  { value: 'balcony',         label: 'Balcony' },
  { value: 'scooty_parking',  label: 'Scooty Parking' },
  { value: 'roof_access',     label: 'Fully Access to Roof' },
]

/** Hotel only — no backend column; folded into the description on submit. */
const HOTEL_SERVICES_OPTIONS = [
  { value: 'room_service',     label: 'Room Service' },
  { value: 'laundry',          label: 'Laundry Service' },
  { value: 'airport_shuttle',  label: 'Airport Shuttle' },
  { value: 'parking',          label: 'Parking' },
  { value: 'restaurant',       label: 'Restaurant' },
]

/** Hotel only — no backend column; folded into the description on submit. */
const STAR_RATING_OPTIONS = [
  { value: '1', label: '1 Star' },
  { value: '2', label: '2 Star' },
  { value: '3', label: '3 Star' },
  { value: '4', label: '4 Star' },
  { value: '5', label: '5 Star' },
]

/** Flat for Rent only — no backend columns; folded into the description on submit. */
const VENTILATION_OPTIONS = [
  { value: 'good',    label: 'Good' },
  { value: 'average', label: 'Average' },
  { value: 'poor',    label: 'Poor' },
]
const ELECTRICITY_TYPE_OPTIONS = [
  { value: 'included', label: 'Included in rent' },
  { value: 'prepaid',  label: 'Prepaid meter' },
  { value: 'postpaid', label: 'Postpaid meter' },
]
const WATER_SUPPLY_OPTIONS = [
  { value: '24x7',    label: '24x7 supply' },
  { value: 'limited', label: 'Limited hours' },
  { value: 'tanker',  label: 'Tanker supply' },
]

/** Flat for Rent & Hostel/PG — maps directly onto the real `security_deposit` boolean column. */
const YES_NO_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no',  label: 'No' },
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

const ROOMMATE_PREF_MAP: Record<string, number> = {
  students: 1,
  working:  2,
  family:   3,
}

const FLAT_TYPE_MAP: Record<string, number> = {
  '1bhk': 1,
  '2bhk': 2,
  '3bhk': 3,
  '4bhk': 4,
}

/**
 * Maps the UI's 4 visibility choices to the backend's actual `visible_to`
 * enum (0=Private · 1=Public · 2=Friends · 3=Mutual Friends — see
 * GET /accommodations/schema). The backend has no separate "community" vs
 * "network" scope, so both collapse to Public until the backend adds one.
 */
const VISIBLE_TO_MAP: Record<string, number> = {
  friends: 2,
  'friends-mutuals': 3,
  community: 1,
  network: 1,
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
  /** Backend accepts a single value, not a set — see ROOMMATE_PREF_MAP */
  roommatePref: string
  flatType: string
  /** Required by the backend for Flat for Rent listings */
  floor: string
  availableFrom: string
  cityId: string
  locality: string
  rentPerPerson: string
  depositAmount: string
  amenities: string[]
  /** Only applies to Short Stay */
  guestPreference: string[]
  visibleTo: string
  phone: string
  /** Short Stay / Flat for Rent — reuses availableSpots as the raw number, shown as "People Allowed" */
  /** Shared Room only — no backend column for a second figure; folded into description */
  totalRent: string
  /** Short Stay / Hotel — no backend column; folded into description */
  nearbyLandmark: string
  /** Flat for Rent — wired to the real `furnishing` column */
  furnishing: string
  /** Flat for Rent / Hostel — wired to the real `security_deposit` boolean column */
  securityDeposit: string
  /** Flat for Rent — no backend columns; folded into description */
  ventilation: string
  electricityType: string
  waterSupply: string
  /** Hostel/PG — maps onto available_spots (see HOSTEL_OCCUPANCY_OPTIONS) */
  occupancyType: string
  /** Hostel/PG — no backend column; folded into description */
  roomFeatures: string[]
  roomFeaturesNote: string
  /** Hotel — no backend columns; folded into description */
  checkin: string
  checkout: string
  starRating: string
  hotelServices: string[]
  hotelServicesNote: string
}

const EMPTY_FORM: ListingForm = {
  photoFiles: [],
  photos: [],
  title: '',
  description: '',
  availableSpots: 1,
  currentRoommates: 2,
  gender: 'any',
  roommatePref: '',
  flatType: '',
  floor: '',
  availableFrom: '',
  cityId: '',
  locality: '',
  rentPerPerson: '',
  depositAmount: '',
  amenities: [],
  guestPreference: [],
  visibleTo: 'friends-mutuals',
  phone: '',
  totalRent: '',
  nearbyLandmark: '',
  furnishing: '',
  securityDeposit: '',
  ventilation: '',
  electricityType: '',
  waterSupply: '',
  occupancyType: '',
  roomFeatures: [],
  roomFeaturesNote: '',
  checkin: '',
  checkout: '',
  starRating: '',
  hotelServices: [],
  hotelServicesNote: '',
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
  const [showPreview, setShowPreview] = useState(false)

  // Revoke all object URLs when the dialog closes to avoid memory leaks
  useEffect(() => {
    if (!open && form.photos.length) {
      form.photos.forEach(url => URL.revokeObjectURL(url))
    }
  }, [open])

  const setF = (patch: Partial<ListingForm>) =>
    setForm(prev => ({ ...prev, ...patch }))

  const toggleMulti = (key: 'amenities' | 'guestPreference' | 'roomFeatures' | 'hotelServices', val: string) => {
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
    setShowPreview(false)
    onClose()
  }

  // Per GET /accommodations/schema: current_roommates only applies to Shared Room,
  // and roommate_preference doesn't apply to Short Stay or Hotel at all.
  const showCurrentRoommates = stayType === 'shared-room'
  const showRoommatePref = stayType === 'shared-room' || stayType === 'flat-for-rent' || stayType === 'hostel-pg'

  // ── Per-type field visibility (see the 5 reference screenshots) ────────────
  const showFlatType = stayType === 'shared-room' || stayType === 'short-stay' || stayType === 'flat-for-rent'
  const showTotalRent = stayType === 'shared-room'
  const showGuestPreference = stayType === 'short-stay' || stayType === 'flat-for-rent'
  const showAvailability = stayType !== 'hostel-pg' && stayType !== 'hotel'
  const availabilityLabel = stayType === 'shared-room' ? 'Available spots' : 'People allowed'
  const showAvailableFrom = stayType !== 'hotel'
  const showOccupancyType = stayType === 'hostel-pg'
  const showFurnishing = stayType === 'flat-for-rent'
  const showSecurityDepositField = stayType === 'flat-for-rent' || stayType === 'hostel-pg'
  const showVentilationEtc = stayType === 'flat-for-rent'
  const showNearbyLandmark = stayType === 'short-stay' || stayType === 'hotel'
  const showRoomFeatures = stayType === 'hostel-pg'
  const showCheckInOut = stayType === 'hotel'
  const showStarRating = stayType === 'hotel'
  const showHotelServices = stayType === 'hotel'
  // Gender field: full Male/Female/Any for most types, Girls/Boys for Hostel/PG, hidden for Hotel
  const genderMode: 'full' | 'hostel' | 'none' =
    stayType === 'hotel' ? 'none' : stayType === 'hostel-pg' ? 'hostel' : 'full'
  const titleLabel =
    stayType === 'hostel-pg' ? 'Hostel Name' : stayType === 'hotel' ? 'Hotel Name' : 'Title'
  const rentLabel =
    stayType === 'short-stay' ? 'Rent per day — per person'
    : stayType === 'flat-for-rent' ? 'Rent per month'
    : stayType === 'hostel-pg' ? 'Rent starting'
    : stayType === 'hotel' ? 'Starting price'
    : 'Rent per person'

  // ── Fold fields the backend has no dedicated column for into the description
  // so the information is still captured somewhere real (see the const comments
  // above: VENTILATION_OPTIONS, ROOM_FEATURES_OPTIONS, HOTEL_SERVICES_OPTIONS, etc).
  // Shared by handlePost (what actually gets submitted) and the Preview screen
  // (so the preview shows exactly what will be posted).
  const buildFullDescription = () => {
    const extraDetailLines: string[] = []
    if (showTotalRent && form.totalRent.trim()) {
      extraDetailLines.push(`Total rent: ₹${form.totalRent.trim()}`)
    }
    if (showNearbyLandmark && form.nearbyLandmark.trim()) {
      extraDetailLines.push(`Nearby landmark: ${form.nearbyLandmark.trim()}`)
    }
    if (showVentilationEtc) {
      if (form.ventilation) extraDetailLines.push(`Ventilation: ${VENTILATION_OPTIONS.find(o => o.value === form.ventilation)?.label}`)
      if (form.electricityType) extraDetailLines.push(`Electricity: ${ELECTRICITY_TYPE_OPTIONS.find(o => o.value === form.electricityType)?.label}`)
      if (form.waterSupply) extraDetailLines.push(`Water supply: ${WATER_SUPPLY_OPTIONS.find(o => o.value === form.waterSupply)?.label}`)
    }
    if (showOccupancyType && form.occupancyType) {
      extraDetailLines.push(`Occupancy: ${HOSTEL_OCCUPANCY_OPTIONS.find(o => o.value === form.occupancyType)?.label}`)
    }
    if (showRoomFeatures) {
      const labels = form.roomFeatures.map(v => ROOM_FEATURES_OPTIONS.find(o => o.value === v)?.label).filter(Boolean)
      if (labels.length) extraDetailLines.push(`Room features: ${labels.join(', ')}`)
      if (form.roomFeaturesNote.trim()) extraDetailLines.push(form.roomFeaturesNote.trim())
    }
    if (showCheckInOut && (form.checkin || form.checkout)) {
      const ci = form.checkin ? formatTimeDisplay(form.checkin) : '—'
      const co = form.checkout ? formatTimeDisplay(form.checkout) : '—'
      extraDetailLines.push(`Check-in: ${ci} · Check-out: ${co}`)
    }
    if (showStarRating && form.starRating) {
      extraDetailLines.push(`Star rating: ${STAR_RATING_OPTIONS.find(o => o.value === form.starRating)?.label}`)
    }
    if (showHotelServices) {
      const labels = form.hotelServices.map(v => HOTEL_SERVICES_OPTIONS.find(o => o.value === v)?.label).filter(Boolean)
      if (labels.length) extraDetailLines.push(`Hotel services: ${labels.join(', ')}`)
      if (form.hotelServicesNote.trim()) extraDetailLines.push(form.hotelServicesNote.trim())
    }
    return [form.description.trim(), extraDetailLines.join('\n')].filter(Boolean).join('\n\n')
  }

  // Hostel/PG has no Available Spots / People Allowed field of its own — Occupancy
  // Type stands in for it and maps onto the same real `available_spots` column.
  const occupancySpots = showOccupancyType
    ? HOSTEL_OCCUPANCY_OPTIONS.find(o => o.value === form.occupancyType)?.spots
    : undefined

  let availableSpotsOut: number | undefined
  let peopleAllowedOut: number | undefined
  if (stayType === 'shared-room') {
    availableSpotsOut = form.availableSpots
    peopleAllowedOut = form.availableSpots + form.currentRoommates
  } else if (showAvailability) {
    // Short Stay / Flat for Rent — the stepper is relabeled "People allowed"
    availableSpotsOut = form.availableSpots
    peopleAllowedOut = form.availableSpots
  } else if (showOccupancyType) {
    availableSpotsOut = occupancySpots
    peopleAllowedOut = occupancySpots
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
    if (!form.phone.trim()) {
      showError('Please enter a WhatsApp / contact number.')
      return
    }
    if (showRoommatePref && stayType === 'shared-room' && !form.roommatePref) {
      showError('Please select a roommate preference.')
      return
    }
    if (stayType === 'flat-for-rent' && !form.floor.trim()) {
      showError('Please enter the floor number — it\'s required for Flat for Rent listings.')
      return
    }
    const fullDescription = buildFullDescription()

    createMutation.mutate(
      {
        title:           form.title.trim() || `${typeLabel} — Listing`,
        description:     fullDescription,
        amount:          Number(form.rentPerPerson) || 0,
        deposit_amount:  Number(form.depositAmount) || undefined,
        city_id:         Number(form.cityId),
        community_id:    user?.communityId != null ? Number(user.communityId) : null,
        type:            STAY_TYPE_MAP[stayType] ?? 0,
        is_negotiable:   false,
        address:         form.locality.trim(),
        available_from:  form.availableFrom || new Date().toISOString().split('T')[0],
        gender:          genderMode === 'none' ? 2 : (GENDER_MAP[form.gender] ?? 2),
        flat_type:       FLAT_TYPE_MAP[form.flatType] ?? null,
        floor:           form.floor.trim() ? Number(form.floor) : null,
        available_spots: availableSpotsOut,
        people_allowed:  peopleAllowedOut,
        current_roommates:   showCurrentRoommates ? form.currentRoommates : undefined,
        roommate_preference: showRoommatePref ? ROOMMATE_PREF_MAP[form.roommatePref] : undefined,
        furnishing:      showFurnishing && form.furnishing !== '' ? Number(form.furnishing) : 0,
        security_deposit: showSecurityDepositField
          ? form.securityDeposit === 'yes'
          : Number(form.depositAmount) > 0,
        // When API amenities are loaded, values are numeric ID strings → convert back to numbers
        amenity_ids: apiAmenities.length > 0
          ? form.amenities.map(v => Number(v)).filter(Boolean)
          : [],
        guest_preference: showGuestPreference && form.guestPreference.length
          ? form.guestPreference
          : undefined,
        photos:          form.photoFiles,
        phone:           form.phone.trim() || undefined,
        visible_to:      [VISIBLE_TO_MAP[form.visibleTo] ?? 1],
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
            onClick={() => {
              // Switching category — clear the previous category's field values so
              // e.g. a "Flat for Rent" title/BHK can't linger onto a Hostel/PG
              // listing. Photos are kept since they aren't category-specific.
              if (t.value !== stayType) {
                setForm(prev => ({ ...EMPTY_FORM, photoFiles: prev.photoFiles, photos: prev.photos }))
              }
              setStayType(t.value)
            }}
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

        {/* Title (relabeled Hostel Name / Hotel Name for those types) */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>{titleLabel}</Typography>
          <TextField
            fullWidth size="small"
            placeholder={
              stayType === 'hostel-pg' ? 'Maximum 25 words'
              : stayType === 'hotel' ? 'Maximum 25 words'
              : 'e.g. Female Flatmate Needed — Student'
            }
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

        {/* Availability — hidden for Hostel/PG (Occupancy Type stands in) and Hotel */}
        {showAvailability && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Availability</Typography>
            <StepperField
              label={availabilityLabel}
              value={form.availableSpots}
              min={1} max={10}
              onChange={v => setF({ availableSpots: v })}
            />
            {showCurrentRoommates && (
              <StepperField
                label="Current roommates"
                value={form.currentRoommates}
                min={0} max={10}
                onChange={v => setF({ currentRoommates: v })}
              />
            )}
          </Box>
        )}

        {/* Occupancy Type — Hostel/PG only, stands in for Availability */}
        {showOccupancyType && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Occupancy Type</Typography>
            <Box className={classes.chipsWrap}>
              {HOSTEL_OCCUPANCY_OPTIONS.map(o => (
                <Box
                  key={o.value}
                  component="button"
                  className={cx(classes.chip, { [classes.chipActive]: form.occupancyType === o.value })}
                  onClick={() => setF({ occupancyType: form.occupancyType === o.value ? '' : o.value })}
                >
                  {form.occupancyType === o.value && <CheckIcon sx={{ fontSize: '0.72rem' }} />}
                  {o.label}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Gender Preference — full Male/Female/Any, Girls/Boys for Hostel/PG, hidden for Hotel */}
        {genderMode !== 'none' && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>
              {genderMode === 'hostel' ? 'Inmates Preference' : 'Gender Preference'}
            </Typography>
            <Box className={classes.segmented}>
              {(genderMode === 'hostel' ? HOSTEL_INMATE_OPTIONS : GENDER_OPTIONS).map((o, i) => (
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
        )}

        {/* Roommate Preference — doesn't apply to Short Stay or Hotel */}
        {showRoommatePref && (
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>Roommate Preference</Typography>
          <Box className={classes.chipsWrap}>
            {ROOMMATE_PREFS_OPTIONS.map(o => (
              <Box
                key={o.value}
                component="button"
                className={cx(classes.chip, { [classes.chipActive]: form.roommatePref === o.value })}
                onClick={() => setF({ roommatePref: form.roommatePref === o.value ? '' : o.value })}
              >
                {form.roommatePref === o.value && <CheckIcon sx={{ fontSize: '0.72rem' }} />}
                {o.label}
              </Box>
            ))}
          </Box>
        </Box>
        )}

        {/* Guest Preference — Short Stay & Flat for Rent */}
        {showGuestPreference && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Guest Preference</Typography>
            <Box className={classes.chipsWrap}>
              {GUEST_PREFERENCE_OPTIONS.map(o => (
                <Box
                  key={o.value}
                  component="button"
                  className={cx(classes.chip, { [classes.chipActive]: form.guestPreference.includes(o.value) })}
                  onClick={() => toggleMulti('guestPreference', o.value)}
                >
                  {form.guestPreference.includes(o.value) && <CheckIcon sx={{ fontSize: '0.72rem' }} />}
                  {o.label}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Flat Type — Shared Room, Short Stay, Flat for Rent */}
        {showFlatType && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Flat Type</Typography>
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
        )}

        {/* Floor + Furnishing — Flat for Rent only */}
        {stayType === 'flat-for-rent' && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Floor</Typography>
            <TextField
              fullWidth size="small"
              placeholder="e.g. 2 (0 for ground floor)"
              value={form.floor}
              onChange={e => setF({ floor: e.target.value.replace(/\D/g, '') })}
              inputProps={{ inputMode: 'numeric' }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Box>
        )}

        {showFurnishing && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Furnishing</Typography>
            <SelectField
              label="Furnishing"
              value={form.furnishing}
              onChange={v => setF({ furnishing: v })}
              options={FURNISHING_OPTIONS.map(o => ({ value: String(o.value), label: o.label }))}
              placeholder="Options"
            />
          </Box>
        )}

        {/* Security Deposit — Flat for Rent & Hostel/PG */}
        {showSecurityDepositField && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Security Deposit</Typography>
            <SelectField
              label="Security deposit required?"
              value={form.securityDeposit}
              onChange={v => setF({ securityDeposit: v })}
              options={YES_NO_OPTIONS}
              placeholder="Options"
            />
          </Box>
        )}

        {/* Ventilation / Electricity / Water Supply — Flat for Rent only */}
        {showVentilationEtc && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Ventilation</Typography>
            <SelectField
              label="Ventilation"
              value={form.ventilation}
              onChange={v => setF({ ventilation: v })}
              options={VENTILATION_OPTIONS}
              placeholder="Options"
            />
            <Typography className={classes.fLabel} sx={{ mt: 1.5 }}>Electricity Type</Typography>
            <SelectField
              label="Electricity type"
              value={form.electricityType}
              onChange={v => setF({ electricityType: v })}
              options={ELECTRICITY_TYPE_OPTIONS}
              placeholder="Options"
            />
            <Typography className={classes.fLabel} sx={{ mt: 1.5 }}>Water Supply</Typography>
            <SelectField
              label="Water supply"
              value={form.waterSupply}
              onChange={v => setF({ waterSupply: v })}
              options={WATER_SUPPLY_OPTIONS}
              placeholder="Options"
            />
          </Box>
        )}

        {/* Room Features — Hostel/PG only */}
        {showRoomFeatures && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Room Features</Typography>
            <Box className={classes.chipsWrap} sx={{ mb: 1.25 }}>
              {ROOM_FEATURES_OPTIONS.map(o => (
                <Box
                  key={o.value}
                  component="button"
                  className={cx(classes.chip, { [classes.chipActive]: form.roomFeatures.includes(o.value) })}
                  onClick={() => toggleMulti('roomFeatures', o.value)}
                >
                  {form.roomFeatures.includes(o.value) && <CheckIcon sx={{ fontSize: '0.72rem' }} />}
                  {o.label}
                </Box>
              ))}
            </Box>
            <TextField
              fullWidth size="small"
              placeholder="Maximum 15 words"
              value={form.roomFeaturesNote}
              onChange={e => setF({ roomFeaturesNote: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Box>
        )}

        {/* Check-in / Check-out — Hotel only */}
        {showCheckInOut && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Check-in / Check-out</Typography>
            <Box sx={{ display: 'flex', gap: 1.25 }}>
              <Box sx={{ flex: 1 }}>
                <TimePickerField
                  label="Check-in"
                  value={form.checkin}
                  onChange={v => setF({ checkin: v })}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TimePickerField
                  label="Check-out"
                  value={form.checkout}
                  onChange={v => setF({ checkout: v })}
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* Nearby Landmark — Short Stay & Hotel */}
        {showNearbyLandmark && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Nearby Landmark</Typography>
            <TextField
              fullWidth size="small"
              placeholder="Maximum 25 words"
              value={form.nearbyLandmark}
              onChange={e => setF({ nearbyLandmark: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Box>
        )}

        {/* Star Rating — Hotel only */}
        {showStarRating && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Star Rating</Typography>
            <SelectField
              label="Star rating"
              value={form.starRating}
              onChange={v => setF({ starRating: v })}
              options={STAR_RATING_OPTIONS}
              placeholder="Options"
            />
          </Box>
        )}

        {/* Hotel Services — Hotel only */}
        {showHotelServices && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Hotel Services</Typography>
            <Box className={classes.chipsWrap} sx={{ mb: 1.25 }}>
              {HOTEL_SERVICES_OPTIONS.map(o => (
                <Box
                  key={o.value}
                  component="button"
                  className={cx(classes.chip, { [classes.chipActive]: form.hotelServices.includes(o.value) })}
                  onClick={() => toggleMulti('hotelServices', o.value)}
                >
                  {form.hotelServices.includes(o.value) && <CheckIcon sx={{ fontSize: '0.72rem' }} />}
                  {o.label}
                </Box>
              ))}
            </Box>
            <TextField
              fullWidth size="small"
              placeholder="Maximum 15 words"
              value={form.hotelServicesNote}
              onChange={e => setF({ hotelServicesNote: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Box>
        )}

        {/* Available From — hidden for Hotel */}
        {showAvailableFrom && (
          <Box className={classes.fBlock}>
            <Typography className={classes.fLabel}>Available From</Typography>
            <DatePickerField
              label="Select date"
              value={form.availableFrom}
              onChange={v => setF({ availableFrom: v })}
            />
          </Box>
        )}

        {/* Location */}
        <Box className={classes.fBlock}>
          <Typography className={classes.fLabel}>Location</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <SelectField
              label="City / State"
              value={form.cityId}
              onChange={v => setF({ cityId: v })}
              options={SIGNUP_ENABLED_STATES.map(s => ({ value: String(s.id), label: s.name }))}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              size="small" label={rentLabel}
              value={form.rentPerPerson}
              onChange={e => setF({ rentPerPerson: e.target.value.replace(/\D/g, '') })}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              inputProps={{ inputMode: 'numeric' }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            {showTotalRent && (
              <TextField
                size="small" label="Total rent"
                value={form.totalRent}
                onChange={e => setF({ totalRent: e.target.value.replace(/\D/g, '') })}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                inputProps={{ inputMode: 'numeric' }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            )}
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
            fullWidth size="small" required
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
        <Box component="button" className={classes.previewBtn} onClick={() => setShowPreview(true)}>
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

  // ── Preview — shows the listing exactly as it will look once posted ─────────

  const renderPreview = () => {
    const description = buildFullDescription()
    const amount = Number(form.rentPerPerson) || 0
    const cityName = SIGNUP_ENABLED_STATES.find(s => String(s.id) === form.cityId)?.name

    const selectedAmenityLabels = form.amenities
      .map(v => amenityOptions.find(o => o.value === v)?.label)
      .filter((v): v is string => Boolean(v))

    const genderLabel =
      genderMode === 'hostel' ? HOSTEL_INMATE_OPTIONS.find(o => o.value === form.gender)?.label
      : genderMode === 'full'  ? GENDER_OPTIONS.find(o => o.value === form.gender)?.label
      : null

    const infoChips: string[] = []
    if (showFlatType && form.flatType) {
      infoChips.push(FLAT_TYPE_OPTIONS.find(o => o.value === form.flatType)?.label ?? '')
    }
    if (genderLabel) infoChips.push(genderLabel)
    if (showGuestPreference && form.guestPreference.length) {
      infoChips.push(
        form.guestPreference.map(v => GUEST_PREFERENCE_OPTIONS.find(o => o.value === v)?.label).filter(Boolean).join(', '),
      )
    }
    if (showOccupancyType && form.occupancyType) {
      infoChips.push(HOSTEL_OCCUPANCY_OPTIONS.find(o => o.value === form.occupancyType)?.label ?? '')
    }
    if (showAvailability) infoChips.push(`${form.availableSpots} ${availabilityLabel}`)
    if (showFurnishing && form.furnishing) {
      infoChips.push(FURNISHING_OPTIONS.find(o => String(o.value) === form.furnishing)?.label ?? '')
    }
    if (showStarRating && form.starRating) {
      infoChips.push(STAR_RATING_OPTIONS.find(o => o.value === form.starRating)?.label ?? '')
    }

    const hue = form.gender === 'female' ? 340 : form.gender === 'male' ? 210 : 110
    const heroGrad = `linear-gradient(155deg, oklch(82% 0.06 ${hue}), oklch(66% 0.09 ${hue + 30}))`

    return (
      <>
        <Box className={classes.s2Header}>
          <Box component="button" className={classes.closeBtn} onClick={() => setShowPreview(false)} aria-label="back">
            <ArrowBackIcon sx={{ fontSize: '1rem' }} />
          </Box>
          <Typography className={classes.s2Title}>Preview</Typography>
          <Box sx={{ width: 34 }} />
        </Box>

        <DialogContent className={classes.s2Body} sx={{ p: 0 }}>
          <Box sx={{
            height: 200,
            background: form.photos[0] ? `url("${form.photos[0]}") center/cover no-repeat` : heroGrad,
          }} />

          <Box sx={{ p: '20px' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: colors.ink, letterSpacing: '-0.3px', mb: 0.5 }}>
              {form.title.trim() || `${typeLabel} — Listing`}
            </Typography>

            {description && (
              <Typography sx={{ fontSize: '0.85rem', color: colors.ink3, whiteSpace: 'pre-line', lineHeight: 1.5, mb: 1.5 }}>
                {description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: colors.moss }}>
                {formatINR(amount)}
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: colors.ink4, fontWeight: 600 }}>
                {rentLabel}
              </Typography>
            </Box>

            {infoChips.length > 0 && (
              <Box className={classes.chipsWrap} sx={{ mb: 2 }}>
                {infoChips.map((c, i) => (
                  <Box key={i} className={classes.chip} sx={{ cursor: 'default', pointerEvents: 'none' }}>
                    {c}
                  </Box>
                ))}
              </Box>
            )}

            {(form.locality.trim() || cityName) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: '1rem', color: colors.ink4, flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.82rem', color: colors.ink2 }}>
                  {[form.locality.trim(), cityName].filter(Boolean).join(', ')}
                </Typography>
              </Box>
            )}

            {showAvailableFrom && form.availableFrom && (
              <Typography sx={{ fontSize: '0.8rem', color: colors.ink3, mb: 2 }}>
                Available from{' '}
                {new Date(form.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Typography>
            )}

            {selectedAmenityLabels.length > 0 && (
              <>
                <Typography className={classes.fLabel} sx={{ mt: 1 }}>Amenities Available</Typography>
                <Box className={classes.chipsWrap} sx={{ mb: 2 }}>
                  {selectedAmenityLabels.map((label, i) => (
                    <Box key={i} className={cx(classes.chip, classes.chipActive)} sx={{ cursor: 'default', pointerEvents: 'none' }}>
                      {label}
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {form.phone.trim() && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <WhatsAppIcon sx={{ fontSize: '1rem', color: '#25D366', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.82rem', color: colors.ink2 }}>{form.phone.trim()}</Typography>
              </Box>
            )}

            <Typography sx={{ fontSize: '0.72rem', color: colors.ink4, mt: 3, fontStyle: 'italic' }}>
              This is a preview — visible to {VISIBLE_TO_OPTIONS.find(o => o.value === form.visibleTo)?.label.toLowerCase()}.
            </Typography>
          </Box>
        </DialogContent>

        <Box className={classes.s2Footer}>
          <Box component="button" className={classes.previewBtn} onClick={() => setShowPreview(false)}>
            Edit
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
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      PaperProps={{ className: classes.paper }}
      sx={{ '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center' } }}
    >
      {step === 1 ? renderStep1() : showPreview ? renderPreview() : renderStep2()}
    </Dialog>
  )
}

export default PostListingFlow
