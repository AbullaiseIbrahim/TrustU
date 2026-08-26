import React from 'react'
import { Box, Typography, IconButton, Badge } from '@mui/material'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import FilterListIcon from '@mui/icons-material/FilterList'
import { makeStyles } from 'tss-react/mui'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import colors from '@/theme/colors'

const useStyles = makeStyles()(() => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    height: 56,
    maxWidth: 480,
    margin: '0 auto',
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 10,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    fontWeight: 800,
    fontSize: '1.1rem',
    color: colors.ink,
    letterSpacing: '-0.4px',
    lineHeight: 1,
    '& span': {
      color: colors.moss,
    },
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  communityPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.moss,
    color: '#fff',
    borderRadius: 20,
    padding: '5px 12px 5px 9px',
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'inherit',
    fontSize: '0.8rem',
    fontWeight: 700,
    WebkitTapHighlightColor: 'transparent',
    transition: 'all 0.18s ease',
    flexShrink: 0,
    '&:hover': {
      backgroundColor: colors.mossDeep,
    },
    '&:active': {
      transform: 'scale(0.96)',
    },
  },
  iconBtn: {
    color: colors.ink3,
    width: 38,
    height: 38,
    borderRadius: 10,
    transition: 'all 0.18s ease',
    '&:hover': {
      color: colors.moss,
      backgroundColor: colors.mossSoft,
    },
  },
}))

const AppTopBar: React.FC = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // The pill is a Community ⇄ Network toggle. On the Community page it reads
  // the current mode from ?view=network; from anywhere else it always offers
  // "Network" as a jump-in. Toggling off network mode just drops the query
  // param — it doesn't touch user.communityId, so it always lands back on
  // whichever community the user actually belongs to.
  const isOnCommunityPage = location.pathname === PATHS.dashboard.community
  const isNetworkView = isOnCommunityPage && searchParams.get('view') === 'network'

  const handleTogglePill = () => {
    navigate(isNetworkView ? PATHS.dashboard.community : `${PATHS.dashboard.community}?view=network`)
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.logoRow}>
        {/* Shield logo */}
        <svg width={28} height={28} viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M14 2l11 4v8c0 7-5 11-11 12-6-1-11-5-11-12V6z" fill={colors.moss} />
          <path d="M9 14l3.5 3.5L20 10" stroke="#fff" strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Typography className={classes.wordmark}>
          Trust<span>U</span>
        </Typography>
      </Box>

      <Box className={classes.actions}>
        {/* Community ⇄ Network toggle */}
        <Box
          component="button"
          className={classes.communityPill}
          onClick={handleTogglePill}
          aria-label={isNetworkView ? 'Switch to your community' : 'Switch to network view'}
        >
          <FilterListIcon sx={{ fontSize: '0.95rem', color: '#fff' }} />
          {isNetworkView ? 'Community' : 'Network'}
        </Box>

        {/* Notifications */}
        <IconButton size="small" className={classes.iconBtn} aria-label="Notifications">
          <Badge variant="dot" color="error" invisible>
            <NotificationsNoneOutlinedIcon sx={{ fontSize: '1.3rem' }} />
          </Badge>
        </IconButton>
      </Box>
    </Box>
  )
}

export default AppTopBar
