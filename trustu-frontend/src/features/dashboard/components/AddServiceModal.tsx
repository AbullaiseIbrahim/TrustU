import React from 'react'
import { Dialog, DialogContent, Box, Typography, IconButton, Slide } from '@mui/material'
import type { TransitionProps } from '@mui/material/transitions'
import CloseIcon from '@mui/icons-material/Close'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import { makeStyles } from 'tss-react/mui'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import colors from '@/theme/colors'

interface AddServiceModalProps {
  open: boolean
  onClose: () => void
}

// iOS-style spring easing — used by Apple for sheet presentations
const ENTER_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'
const EXIT_EASING  = 'cubic-bezier(0.4, 0, 0.6, 1)'
const ENTER_MS     = 440
const EXIT_MS      = 380

/**
 * Slide-up transition with proper spring easing.
 * Easing is applied AFTER the props spread so it wins over MUI defaults.
 */
const SlideUp = React.forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
      easing={{ enter: ENTER_EASING, exit: EXIT_EASING }}
    />
  )
})

const useStyles = makeStyles()(() => ({
  paper: {
    borderRadius: '24px 24px 0 0 !important',
    width: '100% !important',
    maxWidth: '480px !important',
    margin: '0 !important',
    position: 'fixed !important' as 'fixed',
    bottom: '0 !important',
    // GPU layer — critical for smooth slide on mobile
    willChange: 'transform',
    // Prevent any layout-triggered repaints during animation
    backfaceVisibility: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#D8D8D8',
    margin: '12px auto 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px 8px',
  },
  title: {
    fontWeight: 800,
    fontSize: '1.05rem',
    color: colors.textPrimary,
    letterSpacing: '-0.3px',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    color: colors.textSecondary,
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: '#F3F4F6' },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    padding: '8px 20px 32px',
  },
  tile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    padding: '18px 16px',
    borderRadius: 20,
    border: '1.5px solid rgba(0,0,0,0.07)',
    backgroundColor: '#FAFAFA',
    cursor: 'pointer',
    // Use transform only — avoids layout recalculation during animation
    transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background-color 0.18s ease',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    '&:hover': {
      borderColor: `${colors.primary}50`,
      backgroundColor: `${colors.primary}06`,
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 20px ${colors.primary}14`,
    },
    '&:active': {
      transform: 'scale(0.96)',
      boxShadow: 'none',
      transition: 'transform 0.08s ease',
    },
  },
  tileIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': { fontSize: '1.4rem' },
  },
  tileLabel: {
    fontWeight: 700,
    fontSize: '0.88rem',
    color: colors.textPrimary,
    lineHeight: 1.3,
  },
  tileDesc: {
    fontSize: '0.72rem',
    color: colors.textSecondary,
    lineHeight: 1.4,
    marginTop: -4,
  },
}))

const SERVICE_OPTIONS = [
  {
    label: 'Ask Community',
    description: 'Post a question or discussion',
    icon: <ForumOutlinedIcon />,
    path: PATHS.dashboard.community,
    action: 'create-post',
    iconBg: '#E8F5E9',
    iconColor: colors.primary,
  },
  {
    label: 'List Accommodation',
    description: 'Add your room or flat',
    icon: <HomeWorkOutlinedIcon />,
    path: PATHS.dashboard.accommodation,
    action: 'create-accommodation',
    iconBg: '#E3F2FD',
    iconColor: '#1565C0',
  },
  {
    label: 'Offer a Service',
    description: 'Errands, tutoring & more',
    icon: <DeliveryDiningOutlinedIcon />,
    path: PATHS.dashboard.proxy,
    action: 'create-proxy',
    iconBg: '#F3E5F5',
    iconColor: '#7B1FA2',
  },
  {
    label: 'Sell an Item',
    description: 'Books, electronics & more',
    icon: <StorefrontOutlinedIcon />,
    path: PATHS.dashboard.marketplace,
    action: 'create-marketplace',
    iconBg: '#FFF3E0',
    iconColor: '#E65100',
  },
]

const AddServiceModal: React.FC<AddServiceModalProps> = ({ open, onClose }) => {
  const { classes } = useStyles()
  const navigate = useNavigate()

  const handleSelect = (path: string, action: string) => {
    navigate(`${path}?action=${action}`)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={SlideUp}
      // Longer enter so the spring settles; snappy exit feels responsive
      transitionDuration={{ enter: ENTER_MS, exit: EXIT_MS }}
      PaperProps={{ className: classes.paper }}
      // No backdrop blur — blur forces GPU compositing of everything behind it
      // which tanks smoothness on mid-range phones
      BackdropProps={{ sx: { backgroundColor: 'rgba(0,0,0,0.32)' } }}
      sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
    >
      <Box className={classes.handle} />

      <Box className={classes.header}>
        <Typography className={classes.title}>What would you like to do?</Typography>
        <IconButton size="small" className={classes.closeBtn} onClick={onClose}>
          <CloseIcon sx={{ fontSize: '1.1rem' }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box className={classes.grid}>
          {SERVICE_OPTIONS.map((opt) => (
            <Box
              key={opt.action}
              className={classes.tile}
              onClick={() => handleSelect(opt.path, opt.action)}
            >
              <Box
                className={classes.tileIcon}
                sx={{ backgroundColor: opt.iconBg, color: opt.iconColor }}
              >
                {opt.icon}
              </Box>
              <Box>
                <Typography className={classes.tileLabel}>{opt.label}</Typography>
                <Typography className={classes.tileDesc}>{opt.description}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default AddServiceModal
