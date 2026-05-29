import React, { useState } from 'react'
import {
  Box, Avatar, Typography, Divider, Chip, Button,
  CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, IconButton,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import WcOutlinedIcon from '@mui/icons-material/WcOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import CloseIcon from '@mui/icons-material/Close'
import { makeStyles } from 'tss-react/mui'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'
import { useProfileQuery, useUpdateProfile } from '../hooks/useProfileMutations'
import { authApi } from '@/services/auth.api'
import { getInitials } from '@/utils'
import { PATHS } from '@/routes/paths'
import colors from '@/theme/colors'
import type { Designation } from '@/types/auth.types'
import { useFriends } from '@/features/circle/hooks/useFriendshipQueries'
import type { Friend } from '@/services/friendship.api'

const DESIGNATION_OPTIONS: Designation[] = ['Student', 'Faculty', 'Staff', 'Alumni', 'Other']

const useStyles = makeStyles()(() => ({
  page: {
    backgroundColor: colors.cream,
    minHeight: '100%',
    paddingBottom: 16,
  },
  // Hero with gradient banner
  heroBanner: {
    height: 100,
    background: `linear-gradient(135deg, ${colors.moss} 0%, ${colors.mossDeep} 100%)`,
    position: 'relative',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: -52,
  },
  avatarRing: {
    padding: 3,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #fff 0%, #e8f5e9 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    marginBottom: 12,
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    fontSize: '1.9rem',
    background: `linear-gradient(135deg, ${colors.moss} 0%, ${colors.mossDeep} 100%)`,
    fontWeight: 800,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${colors.moss} 0%, ${colors.mossDeep} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: `2.5px solid #fff`,
    boxShadow: '0 2px 8px rgba(46,125,50,0.3)',
    transition: 'transform 0.2s ease',
    '&:hover': { transform: 'scale(1.1)' },
  },
  userName: {
    fontWeight: 800,
    fontSize: '1.2rem',
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: '-0.4px',
  },
  userDesignation: {
    fontSize: '0.8rem',
    color: colors.ink3,
    marginTop: 2,
    fontWeight: 500,
  },
  communityChip: {
    marginTop: 8,
    backgroundColor: colors.mossSoft,
    color: colors.moss,
    fontWeight: 700,
    fontSize: '0.72rem',
    height: 26,
    border: `1.5px solid ${colors.moss}30`,
    borderRadius: 8,
  },
  // Stats row
  statsRow: {
    display: 'flex',
    gap: 10,
    margin: '16px 16px 0',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: '14px 12px',
    textAlign: 'center',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 6px 22px rgba(20,20,15,0.05)',
  },
  statCardGreen: {
    backgroundColor: colors.moss,
  },
  statVal: {
    fontWeight: 800,
    fontSize: '1.3rem',
    color: colors.ink,
    letterSpacing: '-0.4px',
    lineHeight: 1,
  },
  statValGreen: {
    color: '#fff',
  },
  statLbl: {
    fontSize: '0.68rem',
    color: colors.ink3,
    marginTop: 3,
    fontWeight: 500,
  },
  statLblGreen: {
    color: 'rgba(255,255,255,0.8)',
  },
  // Friends grid
  friendsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
    padding: '12px 18px 14px',
  },
  friendItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
  },
  friendAvatar: {
    width: 46,
    height: 46,
    fontSize: '0.88rem',
    fontWeight: 700,
    background: `linear-gradient(135deg, ${colors.moss}, ${colors.mossDeep})`,
    boxShadow: `0 2px 8px rgba(14,107,63,0.20)`,
  },
  friendName: {
    fontSize: '0.62rem',
    fontWeight: 600,
    color: colors.ink2,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  // Info card
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    margin: '16px 16px 0',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px 10px',
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: '0.78rem',
    color: colors.ink3,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  editBtn: {
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.76rem',
    color: colors.primary,
    padding: '4px 12px',
    borderRadius: 10,
    border: `1.5px solid ${colors.moss}40`,
    '&:hover': { backgroundColor: `${colors.moss}08`, borderColor: colors.primary },
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '11px 18px',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: `${colors.moss}10`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  detailLabel: {
    fontSize: '0.7rem',
    color: colors.ink3,
    lineHeight: 1.2,
    marginBottom: 2,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  detailValue: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: colors.ink,
    lineHeight: 1.3,
  },
  notSet: {
    fontSize: '0.85rem',
    color: colors.ink4,
    fontStyle: 'italic',
  },
  // Nav card
  navCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    margin: '12px 16px 0',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  navRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 18px',
    cursor: 'pointer',
    transition: 'background 0.18s ease',
    '&:hover': { backgroundColor: '#F7F9F7' },
    '&:active': { backgroundColor: `${colors.moss}08` },
  },
  navLabel: {
    flex: 1,
    fontWeight: 600,
    fontSize: '0.9rem',
    color: colors.ink,
  },
  logoutArea: {
    padding: '16px 16px 4px',
  },
  logoutBtn: {
    borderRadius: 14,
    textTransform: 'none',
    fontWeight: 700,
    height: 50,
    fontSize: '0.9rem',
    color: colors.urgent,
    borderColor: `${colors.urgent}40`,
    '&:hover': { backgroundColor: `${colors.urgent}06`, borderColor: colors.urgent },
  },
}))

interface DetailRowItemProps {
  icon: React.ReactNode
  label: string
  value?: string | null
  showDivider?: boolean
}

const DetailRowItem: React.FC<DetailRowItemProps> = ({ icon, label, value, showDivider = true }) => {
  const { classes } = useStyles()
  return (
    <>
      <Box className={classes.detailRow}>
        <Box className={classes.iconWrap}>{icon}</Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography className={classes.detailLabel}>{label}</Typography>
          {value ? (
            <Typography className={classes.detailValue}>{value}</Typography>
          ) : (
            <Typography className={classes.notSet}>Not set</Typography>
          )}
        </Box>
      </Box>
      {showDivider && <Divider sx={{ mx: 2 }} />}
    </>
  )
}

// ── Edit Profile Dialog ───────────────────────────────────────────────────────
interface EditDialogProps {
  open: boolean
  onClose: () => void
  current: { name: string; designation: string; phone: string; institute: string }
}

const EditProfileDialog: React.FC<EditDialogProps> = ({ open, onClose, current }) => {
  const updateProfile = useUpdateProfile()
  const [form, setForm] = useState(current)

  // Reset form when dialog opens with fresh data
  React.useEffect(() => {
    if (open) setForm(current)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    updateProfile.mutate(
      {
        name: form.name.trim() || undefined,
        designation: form.designation || undefined,
        phone: form.phone.trim() || undefined,
        institute: form.institute.trim() || undefined,
      },
      { onSuccess: onClose },
    )
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography fontWeight={700} fontSize="1rem">Edit Profile</Typography>
        <IconButton size="small" onClick={onClose} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField
          label="Name"
          fullWidth size="small"
          value={form.name}
          onChange={set('name')}
          inputProps={{ maxLength: 80 }}
        />
        <TextField
          select label="Designation"
          fullWidth size="small"
          value={form.designation}
          onChange={set('designation')}
        >
          {DESIGNATION_OPTIONS.map(d => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Phone number"
          fullWidth size="small"
          value={form.phone}
          onChange={set('phone')}
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          label="Institute / College"
          fullWidth size="small"
          value={form.institute}
          onChange={set('institute')}
          inputProps={{ maxLength: 120 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" size="small"
          sx={{ borderRadius: 20, textTransform: 'none', fontWeight: 500 }}>
          Cancel
        </Button>
        <Button
          variant="contained" size="small"
          onClick={handleSave}
          disabled={updateProfile.isPending || !form.name.trim()}
          sx={{ borderRadius: 20, textTransform: 'none', fontWeight: 600, px: 3 }}
        >
          {updateProfile.isPending ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const ProfilePage: React.FC = () => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { data: profile, isLoading } = useProfileQuery()
  const [editOpen, setEditOpen] = useState(false)
  const { data: friends = [] } = useFriends()

  const displayUser = profile ?? user
  const friendCount = (friends as Friend[]).length
  const first8Friends = (friends as Friend[]).slice(0, 8)

  const handleLogout = async () => {
    try { await authApi.logout() } catch { /* ignore */ } finally {
      logout()
      navigate(PATHS.landing)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box className={classes.page}>

      {/* Gradient banner + avatar hero */}
      <Box className={classes.heroBanner} />
      <Box className={classes.heroContent}>
        <Box className={classes.avatarRing}>
          <Avatar className={classes.avatar}>{getInitials(displayUser?.name ?? 'U')}</Avatar>
          <Box className={classes.editAvatarBtn} onClick={() => setEditOpen(true)}>
            <EditOutlinedIcon sx={{ fontSize: '0.8rem', color: '#fff' }} />
          </Box>
        </Box>
        <Typography className={classes.userName}>{displayUser?.name ?? 'Unknown'}</Typography>
        {displayUser?.designation && (
          <Typography className={classes.userDesignation}>{displayUser.designation}</Typography>
        )}
        {displayUser?.communityName && (
          <Chip
            label={displayUser.communityName}
            className={classes.communityChip}
            size="small"
            icon={<GroupsOutlinedIcon sx={{ fontSize: '0.85rem', color: `${colors.moss} !important` }} />}
          />
        )}
      </Box>

      {/* Stats row */}
      <Box className={classes.statsRow}>
        <Box className={classes.statCard}>
          <Typography className={classes.statVal}>{friendCount}</Typography>
          <Typography className={classes.statLbl}>Friends</Typography>
        </Box>
        <Box className={classes.statCard}>
          <Typography className={classes.statVal}>{(displayUser as any)?.mutualCount ?? 0}</Typography>
          <Typography className={classes.statLbl}>Mutuals</Typography>
        </Box>
        <Box className={cx(classes.statCard, classes.statCardGreen)}>
          <Typography className={cx(classes.statVal, classes.statValGreen)}>{(displayUser as any)?.inCommon ?? 0}</Typography>
          <Typography className={cx(classes.statLbl, classes.statLblGreen)}>In Common</Typography>
        </Box>
      </Box>

      {/* Account details card */}
      <Box className={classes.card}>
        <Box className={classes.cardHeader}>
          <Typography className={classes.cardTitle}>Account Details</Typography>
          <Button
            className={classes.editBtn}
            startIcon={<EditOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />}
            onClick={() => setEditOpen(true)}
            size="small"
          >
            Edit
          </Button>
        </Box>
        <Divider />
        <DetailRowItem icon={<BadgeOutlinedIcon sx={{ fontSize: '1.1rem', color: colors.primary }} />} label="Designation" value={displayUser?.designation} />
        <DetailRowItem icon={<EmailOutlinedIcon sx={{ fontSize: '1.1rem', color: colors.primary }} />} label="Email" value={displayUser?.email} />
        <DetailRowItem icon={<PhoneOutlinedIcon sx={{ fontSize: '1.1rem', color: colors.primary }} />} label="Phone Number" value={displayUser?.phone} />
        <DetailRowItem icon={<SchoolOutlinedIcon sx={{ fontSize: '1.1rem', color: colors.primary }} />} label="Institute / College" value={displayUser?.institute} />
        <DetailRowItem icon={<WcOutlinedIcon sx={{ fontSize: '1.1rem', color: colors.primary }} />} label="Gender" value={displayUser?.gender} showDivider={false} />
      </Box>

      {/* Friends grid */}
      {first8Friends.length > 0 && (
        <Box className={classes.card} sx={{ mt: 0 }}>
          <Box className={classes.cardHeader}>
            <Typography className={classes.cardTitle}>Friends</Typography>
          </Box>
          <Divider />
          <Box className={classes.friendsGrid}>
            {first8Friends.map((f) => (
              <Box key={f.id} className={classes.friendItem}>
                <Avatar className={classes.friendAvatar}>{getInitials(f.name)}</Avatar>
                <Typography className={classes.friendName}>{f.name.split(' ')[0]}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Navigation rows */}
      <Box className={classes.navCard}>
        <Box className={classes.navRow} onClick={() => navigate(PATHS.myListings)}>
          <Box className={classes.iconWrap}>
            <FormatListBulletedIcon sx={{ fontSize: '1.1rem', color: colors.primary }} />
          </Box>
          <Typography className={classes.navLabel}>My Listings</Typography>
          <ChevronRightIcon sx={{ fontSize: '1.2rem', color: colors.ink3 }} />
        </Box>
      </Box>

      {/* Sign out */}
      <Box className={classes.logoutArea}>
        <Button
          variant="outlined" fullWidth className={classes.logoutBtn}
          startIcon={<LogoutIcon />} onClick={handleLogout}
        >
          Sign Out
        </Button>
      </Box>

      {/* Edit profile dialog */}
      <EditProfileDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        current={{
          name: displayUser?.name ?? '',
          designation: displayUser?.designation ?? '',
          phone: displayUser?.phone ?? '',
          institute: displayUser?.institute ?? '',
        }}
      />
    </Box>
  )
}

export default ProfilePage
