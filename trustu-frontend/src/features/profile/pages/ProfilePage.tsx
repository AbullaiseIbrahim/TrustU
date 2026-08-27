import React, { useState } from 'react'
import {
  Box, Avatar, Typography, CircularProgress,
  Dialog, DialogContent, Chip,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { makeStyles } from 'tss-react/mui'
import SelectField from '@/components/SelectField'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'
import { useProfileQuery, useUpdateProfile } from '../hooks/useProfileMutations'
import { authApi } from '@/services/auth.api'
import { getInitials, avatarGradient, selfAvatarGradient, formatINR, formatDate, formatCommunityName } from '@/utils'
import { PATHS } from '@/routes/paths'
import colors from '@/theme/colors'
import type { Designation, Gender } from '@/types/auth.types'
import { useFriends, useMutualFriendsAggregate } from '@/features/circle/hooks/useFriendshipQueries'
import type { Friend } from '@/services/friendship.api'
import {
  useUserAccommodations, useDeleteAccommodation,
} from '@/features/accommodation/hooks/useAccommodationQueries'
import { accommodationTypeLabel } from '@/services/accommodation.api'
import EditListingDialog from '@/features/accommodation/components/EditListingDialog'
import type { Accommodation } from '@/services/accommodation.api'

const DESIGNATION_OPTIONS: Designation[] = ['Student', 'Faculty', 'Staff', 'Alumni', 'Other']
const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say']

// ── Styles ────────────────────────────────────────────────────────────────────

const useStyles = makeStyles()(() => ({
  page: {
    backgroundColor: colors.cream,
    minHeight: '100%',
    paddingBottom: 24,
  },
  pageTitle: {
    fontWeight: 800,
    fontSize: '30px',
    letterSpacing: '-0.7px',
    lineHeight: 1.12,
    color: colors.ink,
    padding: '18px 20px 0',
  },

  // ── Unified profile card ──────────────────────────────────────────────────
  profileCard: {
    position: 'relative',
    backgroundColor: colors.white,
    borderRadius: 24,
    margin: '14px 16px 0',
    padding: '22px 20px 24px',
    boxShadow: '0 6px 20px rgba(26,29,26,0.07)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  signOutPill: {
    position: 'absolute',
    top: 16,
    right: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    border: `1.5px solid ${colors.line}`,
    backgroundColor: 'transparent',
    color: colors.ink2,
    fontWeight: 700,
    fontSize: '0.72rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: '7px 13px',
    borderRadius: 999,
    '&:hover': { backgroundColor: colors.lineSoft, borderColor: colors.ink3 },
  },
  avatarWrap: {
    position: 'relative',
    marginTop: 4,
    marginBottom: 14,
  },
  avatar: {
    width: 84,
    height: 84,
    fontSize: '1.8rem',
    fontWeight: 800,
  },
  editAvatarFab: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: '50%',
    backgroundColor: colors.moss,
    border: `2.5px solid ${colors.white}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '& svg': { fontSize: '0.75rem', color: '#fff' },
  },
  profileName: {
    fontWeight: 800,
    fontSize: '21px',
    color: colors.ink,
    letterSpacing: '-0.4px',
  },
  statsInlineRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    marginTop: 12,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNum: {
    fontWeight: 800,
    fontSize: '1.25rem',
    color: colors.ink,
    letterSpacing: '-0.4px',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '0.72rem',
    color: colors.ink3,
    fontWeight: 600,
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.line,
  },
  profileCaption: {
    fontSize: '0.82rem',
    color: colors.ink3,
    fontWeight: 500,
    marginTop: 10,
  },

  // ── Section header (shared by Personal Details / Listings / Friends / Mutuals) ──
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '22px 16px 10px',
  },
  sectionTitle: {
    fontWeight: 800,
    fontSize: '19px',
    color: colors.ink,
    letterSpacing: '-0.3px',
  },
  sectionCount: {
    fontSize: '0.72rem',
    color: colors.ink3,
    fontWeight: 600,
  },
  editPillBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    border: `1.5px solid ${colors.line}`,
    backgroundColor: 'transparent',
    color: colors.moss,
    fontWeight: 700,
    fontSize: '0.76rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: '6px 14px',
    borderRadius: 999,
    '&:hover': { backgroundColor: colors.mossSoft },
  },
  seeAllLink: {
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.moss,
    fontWeight: 700,
    fontSize: '0.78rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  // ── Personal Details card (plain rows, green-stroke icons, no tile bg) ──────
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    margin: '0 16px',
    padding: '4px 18px',
    boxShadow: '0 6px 20px rgba(26,29,26,0.07)',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 13,
    padding: '13px 0',
    borderBottom: `1px solid #F0ECE1`,
    '&:last-child': { borderBottom: 'none' },
  },
  detailIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: colors.accentGreen,
    '& svg': { fontSize: '1.2rem' },
  },
  detailText: {
    flex: 1,
    minWidth: 0,
  },
  detailLabel: {
    fontSize: '0.66rem',
    fontWeight: 700,
    color: colors.ink4,
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: '0.88rem',
    fontWeight: 700,
    color: colors.ink,
  },
  detailNotSet: {
    fontSize: '0.88rem',
    color: colors.ink4,
    fontStyle: 'italic',
  },

  // ── My Listings ──────────────────────────────────────────────────────────
  listingsEmptyCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    margin: '0 16px',
    padding: '26px 18px',
    textAlign: 'center',
    boxShadow: '0 6px 20px rgba(26,29,26,0.07)',
  },
  listingsEmptyText: {
    fontSize: '0.85rem',
    color: colors.ink3,
    fontWeight: 500,
  },
  listingCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    margin: '0 16px 10px',
    padding: '15px 16px',
    boxShadow: '0 6px 20px rgba(26,29,26,0.07)',
  },
  listingTitle: {
    fontWeight: 700,
    fontSize: '0.92rem',
    color: colors.ink,
    lineHeight: 1.35,
  },
  listingMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
    fontSize: '0.76rem',
    color: colors.ink3,
    fontWeight: 500,
    '& svg': { fontSize: '0.85rem' },
  },
  listingChip: {
    height: 22,
    fontSize: '0.68rem',
    fontWeight: 700,
    backgroundColor: colors.mossSoft,
    color: colors.moss,
    marginTop: 8,
    borderRadius: 8,
  },
  listingPrice: {
    fontWeight: 800,
    fontSize: '1rem',
    color: colors.moss,
    marginTop: 6,
    letterSpacing: '-0.2px',
  },
  listingActions: {
    display: 'flex',
    gap: 8,
    marginTop: 12,
  },
  listingEditBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    border: `1.5px solid ${colors.line}`,
    backgroundColor: 'transparent',
    color: colors.ink2,
    fontWeight: 700,
    fontSize: '0.78rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: '8px 12px',
    borderRadius: 12,
    '&:hover': { backgroundColor: colors.lineSoft },
  },
  listingDeleteBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    border: '1.5px solid #E7C3BC',
    backgroundColor: 'transparent',
    color: '#B5462E',
    fontWeight: 700,
    fontSize: '0.78rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: '8px 12px',
    borderRadius: 12,
    '&:hover': { backgroundColor: '#FBEEEC' },
    '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
  },

  // ── Friends / Mutual Friends strips ─────────────────────────────────────
  friendsRow: {
    display: 'flex',
    gap: 14,
    margin: '0 16px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    padding: '2px 2px 4px',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  friendItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  friendAvatar: {
    width: 68,
    height: 68,
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  friendName: {
    fontSize: '12.5px',
    fontWeight: 600,
    color: colors.ink2,
    textAlign: 'center',
    lineHeight: 1.2,
    maxWidth: 68,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  emptyStripText: {
    margin: '0 16px',
    fontSize: '0.82rem',
    color: colors.ink4,
    fontStyle: 'italic',
  },

  // ── Edit Profile sheet ─────────────────────────────────────────────────────
  sheetPaper: {
    borderRadius: 0,
    height: '100%',
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 !important',
    width: '100% !important',
    maxWidth: '480px !important',
  },
  sheetHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px',
    borderBottom: `1px solid ${colors.lineSoft}`,
    flexShrink: 0,
  },
  sheetBack: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    backgroundColor: colors.cream,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: colors.ink,
    fontFamily: 'inherit',
    '&:hover': { backgroundColor: colors.line },
  },
  sheetTitle: {
    fontWeight: 700,
    fontSize: '1rem',
    color: colors.ink,
    letterSpacing: '-0.3px',
  },
  saveBtn: {
    border: 'none',
    backgroundColor: colors.moss,
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.82rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: '8px 18px',
    borderRadius: 20,
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: colors.mossDeep },
    '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
  },
  sheetBody: {
    overflowY: 'auto',
    flex: 1,
    '&::-webkit-scrollbar': { display: 'none' },
    scrollbarWidth: 'none',
  },
  editAvatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 18px 16px',
    borderBottom: `1px solid ${colors.lineSoft}`,
  },
  editAvatarWrap: {
    position: 'relative',
    marginBottom: 8,
  },
  editAvatar: {
    width: 80,
    height: 80,
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  editAvatarFab2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: '50%',
    backgroundColor: colors.moss,
    border: `2.5px solid ${colors.white}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '& svg': { fontSize: '0.72rem', color: '#fff' },
  },
  changePhotoLabel: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: colors.moss,
    cursor: 'pointer',
  },
  fieldGroup: {
    margin: '16px 16px 0',
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 4px 14px rgba(20,20,15,0.05)',
  },
  fieldRow: {
    padding: '12px 16px',
    borderBottom: `1px solid ${colors.lineSoft}`,
    '&:last-child': { borderBottom: 'none' },
  },
  fieldLabel: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: colors.ink4,
    marginBottom: 4,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldHint: {
    fontSize: '0.68rem',
    color: colors.ink4,
    fontWeight: 500,
  },
  fieldInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: colors.ink,
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    padding: '2px 0',
  },
  deactivateArea: {
    margin: '20px 16px 8px',
  },
  deactivateBtn: {
    width: '100%',
    padding: '13px',
    borderRadius: 14,
    border: `1.5px solid ${colors.urgent}40`,
    backgroundColor: 'transparent',
    color: colors.urgent,
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: `${colors.urgent}08`, borderColor: colors.urgent },
  },
}))

// ── Detail row ────────────────────────────────────────────────────────────────

interface DetailRowProps {
  icon: React.ReactNode
  label: string
  value?: string | null
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => {
  const { classes } = useStyles()
  return (
    <Box className={classes.detailRow}>
      <Box className={classes.detailIcon}>{icon}</Box>
      <Box className={classes.detailText}>
        <Typography className={classes.detailLabel}>{label}</Typography>
        {value
          ? <Typography className={classes.detailValue}>{value}</Typography>
          : <Typography className={classes.detailNotSet}>Not set</Typography>}
      </Box>
    </Box>
  )
}

// ── Edit Profile Sheet ────────────────────────────────────────────────────────

interface EditForm {
  firstName: string
  lastName: string
  phone: string
  gender: string
  designation: string
  institute: string
}

interface EditSheetProps {
  open: boolean
  onClose: () => void
  user: { name: string; email: string | null; phone: string | null; gender: string | null; designation: string | null; institute: string | null }
}

const EditProfileSheet: React.FC<EditSheetProps> = ({ open, onClose, user }) => {
  const { classes } = useStyles()
  const updateProfile = useUpdateProfile()

  const [form, setForm] = React.useState<EditForm>({
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    designation: '',
    institute: '',
  })

  React.useEffect(() => {
    if (open) {
      const parts = (user.name ?? '').split(' ')
      setForm({
        firstName: parts[0] ?? '',
        lastName: parts.slice(1).join(' ') ?? '',
        phone: user.phone ?? '',
        gender: user.gender ?? '',
        designation: user.designation ?? '',
        institute: user.institute ?? '',
      })
      setSaveError(null)
    }
  }, [open])

  const set = (key: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const [saveError, setSaveError] = React.useState<string | null>(null)

  const handleSave = () => {
    setSaveError(null)
    if (!form.phone.trim()) {
      setSaveError('Phone number is required.')
      return
    }
    const fullName = [form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(' ')
    updateProfile.mutate(
      {
        name:        fullName || undefined,
        // Sent lowercase to match what registration originally submits
        // ('male', 'student', ...) — the backend's validation may be case-sensitive.
        designation: form.designation ? form.designation.toLowerCase() : undefined,
        gender:      form.gender ? form.gender.toLowerCase() : undefined,
        phone:       form.phone.trim() || undefined,
        institute:   form.institute.trim() || undefined,
      },
      {
        onSuccess: onClose,
        // The global snackbar also fires on error, but it's easy to miss at the
        // bottom of the viewport while sitting inside a full-screen sheet — show
        // an impossible-to-miss inline banner right under the header too.
        onError: (err) => setSaveError((err as Error)?.message || 'Could not save changes. Please try again.'),
      },
    )
  }

  const initials = getInitials([form.firstName, form.lastName].filter(Boolean).join(' ') || 'U')

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{ className: classes.sheetPaper }}
      sx={{ '& .MuiDialog-container': { justifyContent: 'center' } }}
    >
      {/* Header */}
      <Box className={classes.sheetHeader}>
        <Box component="button" className={classes.sheetBack} onClick={onClose}>
          <ArrowBackIcon sx={{ fontSize: '1rem' }} />
        </Box>
        <Typography className={classes.sheetTitle}>Edit Profile</Typography>
        <Box
          component="button"
          className={classes.saveBtn}
          onClick={handleSave}
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? 'Saving…' : 'Save'}
        </Box>
      </Box>

      {saveError && (
        <Box sx={{
          mx: '16px', mt: '14px', p: '12px 14px', borderRadius: '12px',
          backgroundColor: `${colors.urgent}12`, border: `1px solid ${colors.urgent}40`,
        }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: colors.urgent }}>
            {saveError}
          </Typography>
        </Box>
      )}

      <DialogContent className={classes.sheetBody} sx={{ p: 0 }}>

        {/* Avatar */}
        <Box className={classes.editAvatarSection}>
          <Box className={classes.editAvatarWrap}>
            <Avatar
              className={classes.editAvatar}
              sx={{ background: selfAvatarGradient(), color: '#fff' }}
            >
              {initials}
            </Avatar>
            <Box className={classes.editAvatarFab2}>
              <CameraAltOutlinedIcon />
            </Box>
          </Box>
          <Typography className={classes.changePhotoLabel}>Change photo</Typography>
        </Box>

        {/* Name fields */}
        <Box className={classes.fieldGroup}>
          <Box className={classes.fieldRow}>
            <Typography className={classes.fieldLabel}>First Name</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="input" className={classes.fieldInput} value={form.firstName} onChange={set('firstName')} placeholder="First name" />
              <ChevronRightIcon sx={{ fontSize: '1rem', color: colors.ink4, flexShrink: 0 }} />
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Typography className={classes.fieldLabel}>Last Name</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="input" className={classes.fieldInput} value={form.lastName} onChange={set('lastName')} placeholder="Last name" />
              <ChevronRightIcon sx={{ fontSize: '1rem', color: colors.ink4, flexShrink: 0 }} />
            </Box>
          </Box>
        </Box>

        {/* Contact fields */}
        <Box className={classes.fieldGroup}>
          <Box className={classes.fieldRow}>
            <Typography className={classes.fieldLabel}>
              Email
              <Typography component="span" className={classes.fieldHint}>Not visible to others</Typography>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="input" className={classes.fieldInput} value={user.email ?? ''} readOnly placeholder="Email" sx={{ color: colors.ink3 }} />
              <ChevronRightIcon sx={{ fontSize: '1rem', color: colors.ink4, flexShrink: 0 }} />
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Typography className={classes.fieldLabel}>
              Phone Number
              <Typography component="span" className={classes.fieldHint}>Partially visible</Typography>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="input" className={classes.fieldInput} value={form.phone} onChange={set('phone')} placeholder="+91 ···· ····" />
              <ChevronRightIcon sx={{ fontSize: '1rem', color: colors.ink4, flexShrink: 0 }} />
            </Box>
          </Box>
        </Box>

        {/* Personal fields */}
        <Box className={classes.fieldGroup}>
          <Box className={classes.fieldRow}>
            <SelectField
              label="Gender"
              value={form.gender}
              onChange={v => setForm(prev => ({ ...prev, gender: v }))}
              options={GENDER_OPTIONS.map(g => ({ value: g, label: g }))}
            />
          </Box>
          <Box className={classes.fieldRow}>
            <SelectField
              label="Designation"
              value={form.designation}
              onChange={v => setForm(prev => ({ ...prev, designation: v }))}
              options={DESIGNATION_OPTIONS.map(d => ({ value: d, label: d }))}
            />
          </Box>
          <Box className={classes.fieldRow}>
            <Typography className={classes.fieldLabel}>Institution</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="input" className={classes.fieldInput} value={form.institute} onChange={set('institute')} placeholder="Your college / university" />
              <ChevronRightIcon sx={{ fontSize: '1rem', color: colors.ink4, flexShrink: 0 }} />
            </Box>
          </Box>
        </Box>

        {/* Deactivate */}
        <Box className={classes.deactivateArea}>
          <Box component="button" className={classes.deactivateBtn}>
            Deactivate account
          </Box>
        </Box>

      </DialogContent>
    </Dialog>
  )
}

// ── My Listings section ──────────────────────────────────────────────────────

const MyListingsSection: React.FC = () => {
  const { classes } = useStyles()
  const { data, isLoading } = useUserAccommodations()
  const deleteMutation = useDeleteAccommodation()
  const listings: Accommodation[] = data?.data ?? []
  const [editingListing, setEditingListing] = useState<Accommodation | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (isLoading) return null

  return (
    <>
      <Box className={classes.sectionHeader}>
        <Typography className={classes.sectionTitle}>My Listings</Typography>
        {listings.length > 0 && (
          <Typography className={classes.sectionCount}>{listings.length}</Typography>
        )}
      </Box>

      {listings.length === 0 ? (
        <Box className={classes.listingsEmptyCard}>
          <Typography className={classes.listingsEmptyText}>
            No accommodation listings yet.
          </Typography>
        </Box>
      ) : (
        listings.map(acc => (
          <Box key={acc.id} className={classes.listingCard}>
            <Typography className={classes.listingTitle}>{acc.title || 'Untitled listing'}</Typography>
            {acc.address && (
              <Box className={classes.listingMetaRow}>
                <LocationOnIcon /> {acc.address}
              </Box>
            )}
            <Box>
              <Chip label={accommodationTypeLabel(acc.type)} size="small" className={classes.listingChip} />
            </Box>
            <Typography className={classes.listingPrice}>{formatINR(acc.amount)}/mo</Typography>
            {acc.availableFrom && (
              <Typography sx={{ fontSize: '0.74rem', color: colors.ink3, mt: '4px' }}>
                Available from {formatDate(acc.availableFrom)}
              </Typography>
            )}
            <Box className={classes.listingActions}>
              <Box component="button" className={classes.listingEditBtn} onClick={() => setEditingListing(acc)}>
                <EditOutlinedIcon sx={{ fontSize: '0.95rem' }} /> Edit
              </Box>
              <Box
                component="button"
                className={classes.listingDeleteBtn}
                disabled={deleteMutation.isPending && deletingId === acc.id}
                onClick={() => {
                  setDeletingId(acc.id)
                  deleteMutation.mutate(acc.id, { onSettled: () => setDeletingId(null) })
                }}
              >
                <DeleteOutlineIcon sx={{ fontSize: '0.95rem' }} /> Delete
              </Box>
            </Box>
          </Box>
        ))
      )}

      <EditListingDialog
        open={!!editingListing}
        onClose={() => setEditingListing(null)}
        accommodation={editingListing}
      />
    </>
  )
}

// ── Main ProfilePage ──────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { data: profile, isLoading } = useProfileQuery()
  const [editOpen, setEditOpen] = useState(false)
  const { data: friends = [] } = useFriends()

  const displayUser = profile ?? user
  const name = displayUser?.name ?? 'Unknown'
  const first8 = (friends as Friend[]).slice(0, 8)
  const friendCount = (friends as Friend[]).length
  const { people: mutualPeople } = useMutualFriendsAggregate((friends as Friend[]).map(f => f.userId))
  const mutualCount = mutualPeople.length
  const first8Mutual = mutualPeople.slice(0, 8)

  const handleLogout = async () => {
    try { await authApi.logout() } catch { /* ignore */ } finally {
      logout(); navigate(PATHS.landing)
    }
  }

  const genderIcon = displayUser?.gender === 'Female'
    ? <FemaleIcon />
    : <MaleIcon />

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={28} sx={{ color: colors.moss }} />
      </Box>
    )
  }

  return (
    <Box className={classes.page}>

      <Typography className={classes.pageTitle}>Profile</Typography>

      {/* ── Unified profile card ── */}
      <Box className={classes.profileCard}>
        <Box component="button" className={classes.signOutPill} onClick={handleLogout}>
          <LogoutIcon sx={{ fontSize: '0.85rem' }} />
          Sign out
        </Box>

        <Box className={classes.avatarWrap}>
          <Avatar
            className={classes.avatar}
            src={displayUser?.avatarUrl ?? undefined}
            sx={{ background: selfAvatarGradient(), color: '#fff' }}
          >
            {getInitials(name)}
          </Avatar>
          <Box className={classes.editAvatarFab} onClick={() => setEditOpen(true)}>
            <EditOutlinedIcon />
          </Box>
        </Box>

        <Typography className={classes.profileName}>{name}</Typography>

        <Box className={classes.statsInlineRow}>
          <Box className={classes.statItem}>
            <Typography className={classes.statNum}>{friendCount.toLocaleString('en-IN')}</Typography>
            <Typography className={classes.statLabel}>Friends</Typography>
          </Box>
          <Box className={classes.statDivider} />
          <Box className={classes.statItem}>
            <Typography className={classes.statNum}>{mutualCount.toLocaleString('en-IN')}</Typography>
            <Typography className={classes.statLabel}>Mutuals</Typography>
          </Box>
        </Box>

        <Typography className={classes.profileCaption}>
          {displayUser?.communityName ? `Member of ${formatCommunityName(displayUser.communityName)}` : 'Complete your profile to connect with your community'}
        </Typography>
      </Box>

      {/* ── Personal Details ── */}
      <Box className={classes.sectionHeader}>
        <Typography className={classes.sectionTitle}>Personal Details</Typography>
        <Box component="button" className={classes.editPillBtn} onClick={() => setEditOpen(true)}>
          <EditOutlinedIcon sx={{ fontSize: '0.8rem' }} />
          Edit
        </Box>
      </Box>

      <Box className={classes.detailCard}>
        <DetailRow icon={genderIcon} label="Gender" value={displayUser?.gender ?? null} />
        <DetailRow icon={<FlagOutlinedIcon />} label="From" value={displayUser?.nativeStateName ?? null} />
        <DetailRow icon={<LocationOnOutlinedIcon />} label="Living in" value={displayUser?.communityName ? formatCommunityName(displayUser.communityName) : null} />
        <DetailRow icon={<BadgeOutlinedIcon />} label="Designation" value={displayUser?.designation ?? null} />
        <DetailRow icon={<SchoolOutlinedIcon />} label="Institution" value={displayUser?.institute ?? null} />
      </Box>

      {/* ── My Listings ── */}
      <MyListingsSection />

      {/* ── Friends ── */}
      <Box className={classes.sectionHeader}>
        <Typography className={classes.sectionTitle}>Friends</Typography>
        {first8.length > 0 && (
          <Box
            component="button"
            className={classes.seeAllLink}
            onClick={() => navigate(`${PATHS.dashboard.community}?tab=friends`)}
          >
            See all
          </Box>
        )}
      </Box>
      {first8.length > 0 ? (
        <Box className={classes.friendsRow}>
          {first8.map(f => (
            <Box key={f.id} className={classes.friendItem}>
              <Avatar
                className={classes.friendAvatar}
                src={f.avatarUrl ?? undefined}
                sx={{ background: avatarGradient(f.userId), color: '#fff' }}
              >
                {getInitials(f.name)}
              </Avatar>
              <Typography className={classes.friendName}>{f.name.split(' ')[0]}</Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography className={classes.emptyStripText}>No friends yet.</Typography>
      )}

      {/* ── Mutual Friends ── */}
      <Box className={classes.sectionHeader}>
        <Typography className={classes.sectionTitle}>Mutual Friends</Typography>
        {first8Mutual.length > 0 && (
          <Box
            component="button"
            className={classes.seeAllLink}
            onClick={() => navigate(`${PATHS.dashboard.community}?tab=mutual`)}
          >
            See all
          </Box>
        )}
      </Box>
      {first8Mutual.length > 0 ? (
        <Box className={classes.friendsRow}>
          {first8Mutual.map(f => (
            <Box key={f.id} className={classes.friendItem}>
              <Avatar
                className={classes.friendAvatar}
                src={f.avatarUrl ?? undefined}
                sx={{ background: avatarGradient(f.userId), color: '#fff' }}
              >
                {getInitials(f.name)}
              </Avatar>
              <Typography className={classes.friendName}>{f.name.split(' ')[0]}</Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography className={classes.emptyStripText}>No mutual friends yet.</Typography>
      )}

      {/* ── Edit Profile sheet ── */}
      <EditProfileSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={{
          name: displayUser?.name ?? '',
          email: displayUser?.email ?? null,
          phone: displayUser?.phone ?? null,
          gender: displayUser?.gender ?? null,
          designation: displayUser?.designation ?? null,
          institute: displayUser?.institute ?? null,
        }}
      />
    </Box>
  )
}

export default ProfilePage
