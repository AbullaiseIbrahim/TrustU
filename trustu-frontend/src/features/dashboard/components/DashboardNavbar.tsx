import React from 'react'
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
  useMediaQuery,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import { makeStyles } from 'tss-react/mui'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'
import { PATHS } from '@/routes/paths'
import { getInitials } from '@/utils'
import colors from '@/theme/colors'

const useStyles = makeStyles()(() => ({
  appBar: {
    backgroundColor: colors.white,
    color: colors.textPrimary,
  },
  toolbar: {
    minHeight: '48px !important',
    paddingLeft: '12px',
    paddingRight: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4px',
  },
  container: {
    maxWidth: 1100,
    width: '100%',
    margin: '0 auto',
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: 0,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandBlock: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    lineHeight: 1,
  },
  appName: {
    fontWeight: 700,
    fontSize: '0.95rem',
    lineHeight: 1.1,
    color: colors.textPrimary,
  },
  communitySubtitle: {
    fontSize: '0.7rem',
    color: colors.textSecondary,
    lineHeight: 1.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 180,
    '@media (max-width:600px)': {
      maxWidth: 110,
    },
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    flexShrink: 0,
  },
  iconBtn: {
    color: colors.textSecondary,
    padding: '6px',
    '&:hover': { color: colors.textPrimary },
  },
  navBtn: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.82rem',
    color: colors.textSecondary,
    padding: '4px 8px',
    minWidth: 'auto',
    '&:hover': { color: colors.primary, backgroundColor: 'transparent' },
  },
  navBtnIcon: {
    fontSize: '1rem !important',
  },
  avatar: {
    width: 30,
    height: 30,
    fontSize: '0.72rem',
    backgroundColor: colors.primary,
    cursor: 'pointer',
  },
}))

const DashboardNavbar: React.FC = () => {
  const { classes } = useStyles()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width:600px)')

  return (
    <AppBar position="static" className={classes.appBar} elevation={0}>
      <Box className={classes.container}>
        <Toolbar className={classes.toolbar} disableGutters>

          {/* ── Left: logo + brand name + community ── */}
          <Box className={classes.left}>
            <Box className={classes.logoCircle}>
              <svg width={18} height={14} viewBox="0 0 36 28" fill="none" aria-hidden="true">
                <circle cx="9" cy="8" r="5" fill="white" />
                <path d="M0 26C0 21.029 4.029 17 9 17C11.09 17 13.02 17.716 14.55 18.92" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="27" cy="8" r="5" fill="white" />
                <path d="M36 26C36 21.029 31.971 17 27 17C24.91 17 22.98 17.716 21.45 18.92" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="18" cy="7" r="5.5" fill="white" />
                <path d="M8 27C8 21.477 12.477 17 18 17C23.523 17 28 21.477 28 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </Box>

            <Box className={classes.brandBlock}>
              <Typography className={classes.appName}>TrustU</Typography>
              {user?.communityName && (
                <Typography className={classes.communitySubtitle}>
                  {user.communityName}
                </Typography>
              )}
            </Box>
          </Box>

          {/* ── Right: actions ── */}
          <Box className={classes.right}>
            <IconButton className={classes.iconBtn} size="small" aria-label="Search">
              <SearchIcon fontSize="small" />
            </IconButton>

            <IconButton className={classes.iconBtn} size="small" aria-label="Notifications">
              <NotificationsNoneIcon fontSize="small" />
            </IconButton>

            {!isMobile ? (
              <>
                <Button
                  className={classes.navBtn}
                  startIcon={<PeopleAltOutlinedIcon className={classes.navBtnIcon} />}
                  onClick={() => navigate(PATHS.circle)}
                  disableRipple={false}
                >
                  My Circle
                </Button>
                <Button
                  className={classes.navBtn}
                  startIcon={<AccountCircleOutlinedIcon className={classes.navBtnIcon} />}
                  onClick={() => navigate(PATHS.profile)}
                  disableRipple={false}
                >
                  My Profile
                </Button>
              </>
            ) : (
              <Avatar
                className={classes.avatar}
                onClick={() => navigate(PATHS.profile)}
                aria-label="Profile"
              >
                {getInitials(user?.name ?? 'U')}
              </Avatar>
            )}
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  )
}

export default DashboardNavbar
