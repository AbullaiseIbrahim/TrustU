import React, { useState } from 'react'
import {
  Box, Avatar, Typography, CircularProgress,
  Dialog, DialogContent,
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
import { makeStyles } from 'tss-react/mui'
import SelectField from '@/components/SelectField'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'
import { useProfileQuery, useUpdateProfile } from '../hooks/useProfileMutations'
import { authApi } from '@/services/auth.api'
import { getInitials } from '@/utils'
import { PATHS } from '@/routes/paths'
import colors from '@/theme/colors'
import type { Designation, Gender } from '@/types/auth.types'
import { useFriends } from '@/features/circle/hooks/useFriendshipQueries'
import type { Friend } from '@/services/friendship.api'

const DESIGNATION_OPTIONS: Designation[] = ['Student', 'Faculty', 'Staff', 'Alumni', 'Other']
const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say']

// ── Styles ────────────────────────────────────────────────────────────────────

const useStyles = makeStyles()(() => ({
  page: {
    backgroundColor: colors.cream,
    minHeight: '100%',
    paddingBottom: 24,
  },
  // Page header
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px 10px',
    backgroundColor: colors.cream,
  },
  pageTitle: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: colors.ink,
    letterSpacing: '-0.3px',
  },
  signOutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.moss,
    fontWeight: 600,
    fontSize: '0.82rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: '4px 8px',
    borderRadius: 8,
    '&:hover': { backgroundColor: colors.mossSoft },
  },
  // Avatar area
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    fontSize: '1.7rem',
    fontWeight: 700,
    border: `3px solid ${colors.moss}`,
    background: `linear-gradient(140deg, oklch(82% 0.07 20), oklch(72% 0.09 60))`,
    color: `oklch(28% 0.07 20)`,
  },
  editAvatarFab: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: '50%',
    backgroundColor: colors.moss,
    border: `2.5px solid ${colors.cream}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '& svg': { fontSize: '0.75rem', color: '#fff' },
  },
  userName: {
    fontWeight: 700,
    fontSize: '1.2rem',
    color: colors.ink,
    letterSpacing: '-0.4px',
    textAlign: 'center',
  },
  userLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: '0.75rem',
    color: colors.ink3,
    fontWeight: 500,
    marginTop: 4,
    textAlign: 'center',
  },
  // Stats row
  statsRow: {
    display: 'flex',
    gap: 8,
    margin: '0 16px 16px',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: '14px 10px',
    textAlign: 'center',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 4px 14px rgba(20,20,15,0.05)',
  },
  statCardGreen: {
    backgroundColor: colors.moss,
  },
  statNum: {
    fontWeight: 700,
    fontSize: '1.25rem',
    color: colors.ink,
    letterSpacing: '-0.4px',
    lineHeight: 1,
  },
  statNumGreen: { color: '#fff' },
  statLabel: {
    fontSize: '0.68rem',
    color: colors.ink3,
    fontWeight: 500,
    marginTop: 4,
  },
  statLabelGreen: { color: 'rgba(255,255,255,0.75)' },
  // Section
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 18px 8px',
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: colors.ink,
    letterSpacing: '-0.2px',
  },
  editLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.moss,
    fontWeight: 600,
    fontSize: '0.78rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: '3px 6px',
    borderRadius: 6,
    '&:hover': { backgroundColor: colors.mossSoft },
  },
  // Detail card
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    margin: '0 16px',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 4px 14px rgba(20,20,15,0.05)',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '13px 16px',
    borderBottom: `1px solid ${colors.lineSoft}`,
    '&:last-child': { borderBottom: 'none' },
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.cream,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '& svg': { fontSize: '1rem', color: colors.ink3 },
  },
  detailText: {
    flex: 1,
    minWidth: 0,
  },
  detailLabel: {
    fontSize: '0.68rem',
    fontWeight: 600,
    color: colors.ink4,
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: '0.88rem',
    fontWeight: 600,
    color: colors.ink,
  },
  detailNotSet: {
    fontSize: '0.88rem',
    color: colors.ink4,
    fontStyle: 'italic',
  },
  // Friends strip
  friendsCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    margin: '12px 16px 0',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 4px 14px rgba(20,20,15,0.05)',
    padding: '14px 16px',
  },
  friendsRow: {
    display: 'flex',
    gap: 10,
    marginTop: 10,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  friendItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  friendAvatar: {
    width: 46,
    height: 46,
    fontSize: '0.88rem',
    fontWeight: 700,
  },
  friendName: {
    fontSize: '0.62rem',
    fontWeight: 600,
    color: colors.ink2,
    textAlign: 'center',
    lineHeight: 1.2,
    maxWidth: 50,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  // Edit Profile sheet
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
  // Edit avatar section
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
    border: `3px solid ${colors.moss}`,
    background: `linear-gradient(140deg, oklch(82% 0.07 20), oklch(72% 0.09 60))`,
    color: `oklch(28% 0.07 20)`,
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
  // Edit field rows
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
  // Deactivate
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

// ── Avatar hues per first letter ─────────────────────────────────────────────

function avatarGrad(name: string) {
  const hue = ((name.charCodeAt(0) ?? 0) * 37) % 360
  return `linear-gradient(140deg, oklch(82% 0.07 ${hue}), oklch(72% 0.09 ${hue + 40}))`
}
function avatarColor(name: string) {
  const hue = ((name.charCodeAt(0) ?? 0) * 37) % 360
  return `oklch(28% 0.07 ${hue})`
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
    }
  }, [open])

  const set = (key: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSave = () => {
    const fullName = [form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(' ')
    updateProfile.mutate(
      {
        name:        fullName || undefined,
        designation: (form.designation as never) || undefined,
        phone:       form.phone.trim() || undefined,
        institute:   form.institute.trim() || undefined,
      },
      { onSuccess: onClose },
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

      <DialogContent className={classes.sheetBody} sx={{ p: 0 }}>

        {/* Avatar */}
        <Box className={classes.editAvatarSection}>
          <Box className={classes.editAvatarWrap}>
            <Avatar
              className={classes.editAvatar}
              sx={{ background: avatarGrad(form.firstName || 'U'), color: avatarColor(form.firstName || 'U') }}
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

// ── Main ProfilePage ──────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { data: profile, isLoading } = useProfileQuery()
  const [editOpen, setEditOpen] = useState(false)
  const { data: friends = [] } = useFriends()

  const displayUser = profile ?? user
  const name = displayUser?.name ?? 'Unknown'
  const first8 = (friends as Friend[]).slice(0, 8)
  const friendCount = (friends as Friend[]).length

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

      {/* ── Page header ── */}
      <Box className={classes.pageHeader}>
        <Typography className={classes.pageTitle}>Profile</Typography>
        <Box component="button" className={classes.signOutBtn} onClick={handleLogout}>
          <LogoutIcon sx={{ fontSize: '0.9rem' }} />
          Sign out
        </Box>
      </Box>

      {/* ── Avatar + name + location ── */}
      <Box className={classes.avatarSection}>
        <Box className={classes.avatarWrap}>
          <Avatar
            className={classes.avatar}
            src={displayUser?.avatarUrl ?? undefined}
            sx={{ background: avatarGrad(name), color: avatarColor(name) }}
          >
            {getInitials(name)}
          </Avatar>
          <Box className={classes.editAvatarFab} onClick={() => setEditOpen(true)}>
            <EditOutlinedIcon />
          </Box>
        </Box>

        <Typography className={classes.userName}>{name}</Typography>

        <Box className={classes.userLocation}>
          <LocationOnOutlinedIcon sx={{ fontSize: '0.85rem' }} />
          {displayUser?.institute ? `${displayUser.institute}` : 'Location not set'}
          {displayUser?.communityName && ` · Living in ${displayUser.communityName}`}
        </Box>
      </Box>

      {/* ── Stats row ── */}
      <Box className={classes.statsRow}>
        <Box className={classes.statCard}>
          <Typography className={classes.statNum}>{friendCount.toLocaleString('en-IN')}</Typography>
          <Typography className={classes.statLabel}>Friends</Typography>
        </Box>
        <Box className={classes.statCard}>
          <Typography className={classes.statNum}>{(displayUser as unknown as { mutualCount?: number })?.mutualCount?.toLocaleString('en-IN') ?? '0'}</Typography>
          <Typography className={classes.statLabel}>Mutuals</Typography>
        </Box>
        <Box className={cx(classes.statCard, classes.statCardGreen)}>
          <Typography className={cx(classes.statNum, classes.statNumGreen)}>
            {(displayUser as unknown as { inCommon?: number })?.inCommon?.toLocaleString('en-IN') ?? '0'}
          </Typography>
          <Typography className={cx(classes.statLabel, classes.statLabelGreen)}>In common</Typography>
        </Box>
      </Box>

      {/* ── Personal Details ── */}
      <Box className={classes.sectionHeader}>
        <Typography className={classes.sectionTitle}>Personal Details</Typography>
        <Box component="button" className={classes.editLink} onClick={() => setEditOpen(true)}>
          <EditOutlinedIcon sx={{ fontSize: '0.82rem' }} />
          Edit
        </Box>
      </Box>

      <Box className={classes.detailCard}>
        <DetailRow icon={genderIcon} label="Gender" value={displayUser?.gender ?? null} />
        <DetailRow icon={<FlagOutlinedIcon />} label="From" value={displayUser?.institute ?? null} />
        <DetailRow icon={<LocationOnOutlinedIcon />} label="Living in" value={displayUser?.communityName ?? null} />
        <DetailRow icon={<BadgeOutlinedIcon />} label="Designation" value={displayUser?.designation ?? null} />
        <DetailRow icon={<SchoolOutlinedIcon />} label="Institution" value={displayUser?.institute ?? null} />
      </Box>

      {/* ── Friends ── */}
      {first8.length > 0 && (
        <Box className={classes.friendsCard}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography className={classes.sectionTitle}>Friends</Typography>
            <Box
              component="button"
              onClick={() => navigate(PATHS.circle)}
              sx={{
                border: 'none', backgroundColor: 'transparent',
                color: colors.moss, fontWeight: 600, fontSize: '0.78rem',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              See all
            </Box>
          </Box>
          <Box className={classes.friendsRow}>
            {first8.map(f => (
              <Box key={f.id} className={classes.friendItem}>
                <Avatar
                  className={classes.friendAvatar}
                  src={f.avatarUrl ?? undefined}
                  sx={{ background: avatarGrad(f.name), color: avatarColor(f.name) }}
                >
                  {getInitials(f.name)}
                </Avatar>
                <Typography className={classes.friendName}>{f.name.split(' ')[0]}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
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
