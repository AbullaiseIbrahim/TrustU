import React, { useState } from 'react'
import { Box, Snackbar } from '@mui/material'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate, useLocation } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import { PATHS } from '@/routes/paths'
import colors from '@/theme/colors'
import AddServiceModal from './AddServiceModal'

const useStyles = makeStyles()(() => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1200,
    backgroundColor: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderTop: `1px solid ${colors.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  item: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    cursor: 'pointer',
    height: '100%',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    transition: 'opacity 0.15s ease',
    position: 'relative',
    '&:active': { opacity: 0.7 },
  },
  icon: {
    color: colors.ink4,
    fontSize: '1.35rem !important',
    transition: 'color 0.2s ease',
  },
  iconActive: {
    color: colors.moss,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    backgroundColor: colors.moss,
    transition: 'opacity 0.2s ease',
  },
  dotHidden: {
    opacity: 0,
  },
  // Center + button
  centerBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    background: `linear-gradient(135deg, ${colors.moss} 0%, ${colors.mossDeep} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: `0 6px 18px rgba(14,107,63,0.40)`,
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': {
      transform: 'translateY(-2px) scale(1.05)',
      boxShadow: `0 8px 24px rgba(14,107,63,0.45)`,
    },
    '&:active': {
      transform: 'scale(0.92)',
      boxShadow: `0 2px 8px rgba(14,107,63,0.30)`,
    },
  },
  centerItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
}))

interface NavItem {
  label: string
  path?: string
  icon: React.ReactElement
  iconActive: React.ReactElement
  onPress?: () => void
}

const BottomNav: React.FC = () => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const [addOpen, setAddOpen] = useState(false)
  const [msgSnack, setMsgSnack] = useState(false)

  const isActive = (path?: string) => !!path && location.pathname.startsWith(path)

  const NAV_ITEMS_LEFT: NavItem[] = [
    {
      label: 'Community',
      path: PATHS.dashboard.community,
      icon: <PeopleAltOutlinedIcon />,
      iconActive: <PeopleAltIcon />,
    },
    {
      label: 'Explore',
      path: PATHS.dashboard.accommodation,
      icon: <HomeOutlinedIcon />,
      iconActive: <HomeIcon />,
    },
  ]

  const NAV_ITEMS_RIGHT: NavItem[] = [
    {
      label: 'Messages',
      icon: <ChatBubbleOutlineIcon />,
      iconActive: <ChatBubbleIcon />,
      onPress: () => setMsgSnack(true),
    },
    {
      label: 'Profile',
      path: PATHS.profile,
      icon: <PersonOutlineIcon />,
      iconActive: <PersonIcon />,
    },
  ]

  const renderItem = (item: NavItem) => {
    const active = isActive(item.path)
    const handleClick = () => {
      if (item.onPress) { item.onPress(); return }
      if (item.path) navigate(item.path)
    }
    return (
      <Box key={item.label} className={classes.item} onClick={handleClick}>
        {React.cloneElement(active ? item.iconActive : item.icon, {
          className: cx(classes.icon, { [classes.iconActive]: active }),
        })}
        <Box className={cx(classes.dot, { [classes.dotHidden]: !active })} />
      </Box>
    )
  }

  return (
    <>
      <Box className={classes.root}>
        {NAV_ITEMS_LEFT.map(renderItem)}

        {/* Center action button */}
        <Box className={classes.centerItem}>
          <Box className={classes.centerBtn} onClick={() => setAddOpen(true)}>
            <AddIcon sx={{ color: '#fff', fontSize: '1.5rem' }} />
          </Box>
        </Box>

        {NAV_ITEMS_RIGHT.map(renderItem)}
      </Box>

      <AddServiceModal open={addOpen} onClose={() => setAddOpen(false)} />

      <Snackbar
        open={msgSnack}
        autoHideDuration={2500}
        onClose={() => setMsgSnack(false)}
        message="Messages — coming soon!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  )
}

export default BottomNav
