import React from 'react'
import {
  Box,
  Avatar,
  Typography,
  Divider,
  Chip,
  Button,
  CircularProgress,
  IconButton,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LogoutIcon from '@mui/icons-material/Logout'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'

import { makeStyles } from 'tss-react/mui'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'
import { useProfileQuery } from '../hooks/useProfileMutations'
import { authApi } from '@/services/auth.api'
import { getInitials } from '@/utils'
import { PATHS } from '@/routes/paths'

const useStyles = makeStyles()((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5, 2),
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  topBarTitle: {
    fontWeight: 700,
    fontSize: '1rem',
  },
  card: {
    backgroundColor: theme.palette.background.paper,
    marginTop: '10px',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4, 2, 2),
    backgroundColor: theme.palette.primary.main + '10',
  },
  avatar: {
    width: 80,
    height: 80,
    fontSize: '1.75rem',
    backgroundColor: theme.palette.primary.main,
    marginBottom: theme.spacing(1.5),
  },
  name: {
    fontWeight: 700,
    fontSize: '1.2rem',
    textAlign: 'center',
  },
  communityChip: {
    marginTop: theme.spacing(0.75),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    fontWeight: 500,
    fontSize: '0.75rem',
    height: 24,
    padding: '0px 10px',
  },
  detailsSection: {
    padding: theme.spacing(2.5, 3),
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.25, 0),
  },
  detailIcon: {
    color: theme.palette.primary.main,
    fontSize: '1.2rem',
    flexShrink: 0,
  },
  detailLabel: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    display: 'block',
    lineHeight: 1,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  notSet: {
    fontSize: '0.85rem',
    color: theme.palette.text.disabled,
    fontStyle: 'italic',
  },
  editButton: {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 10,
    height: 44,
    marginTop: '15px !important',
  },
  logoutButton: {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 10,
    height: 44,
    color: theme.palette.error.main,
    borderColor: theme.palette.error.light,
    marginTop: '15px !important',
    '&:hover': {
      backgroundColor: theme.palette.error.main + '10',
      borderColor: theme.palette.error.main,
    },
  },
  container: {
    maxWidth: 1100,
    width: '100%',
    margin: '0 auto',
    padding: '0px 10px',
  },
}))

interface DetailRowProps {
  icon: React.ReactNode
  label: string
  value?: string | null
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => {
  const { classes } = useStyles()
  return (
    <>
      <Box className={classes.detailRow}>
        <Box className={classes.detailIcon}>{icon}</Box>
        <Box>
          <Typography component="span" className={classes.detailLabel}>
            {label}
          </Typography>
          {value ? (
            <Typography className={classes.detailValue}>{value}</Typography>
          ) : (
            <Typography className={classes.notSet}>Not set</Typography>
          )}
        </Box>
      </Box>
      <Divider />
    </>
  )
}

const ProfilePage: React.FC = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { data: profile, isLoading } = useProfileQuery()

  const displayUser = profile ?? user

  const handleLogout = async () => {
    try {
      await authApi.logout()  // invalidate Sanctum token on backend
    } catch {
      // ignore network errors — still clear local state
    } finally {
      logout()
      navigate(PATHS.landing)
    }
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box className={classes.root}>
      {/* Top bar */}
      <Box className={classes.topBar}>
        <Box className={classes.topBarLeft}>
          <IconButton size="small" onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography className={classes.topBarTitle}>My Profile</Typography>
        </Box>
      </Box>

      {/* Profile card */}
      <Box className={classes.container}>
        <Box className={classes.card}>
          {/* Avatar + name */}
          <Box className={classes.avatarSection}>
            <Avatar className={classes.avatar}>{getInitials(displayUser?.name ?? 'U')}</Avatar>
            <Typography className={classes.name}>{displayUser?.name ?? 'Unknown'}</Typography>
            {displayUser?.communityName && (
              <Chip
                label={displayUser.communityName}
                className={classes.communityChip}
                size="small"
                icon={<GroupsOutlinedIcon sx={{ fontSize: '0.9rem', color: 'white !important' }} />}
              />
            )}
          </Box>

          {/* Details */}
          <Box className={classes.detailsSection}>
            <Divider />
            <DetailRow
              icon={<BadgeOutlinedIcon />}
              label="Designation"
              value={displayUser?.designation}
            />
            <DetailRow
              icon={<EmailOutlinedIcon />}
              label="Email"
              value={displayUser?.email}
            />
            <DetailRow
              icon={<PhoneOutlinedIcon />}
              label="Phone Number"
              value={displayUser?.phone}
            />
            <DetailRow
              icon={<SchoolOutlinedIcon />}
              label="Institute / College"
              value={displayUser?.institute}
            />
            <DetailRow
              icon={<GroupsOutlinedIcon />}
              label="Gender"
              value={displayUser?.gender}
            />
          </Box>
        </Box>

        {/* Logout */}
        <Button
          variant="outlined"
          fullWidth
          className={classes.logoutButton}
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  )
}

export default ProfilePage
