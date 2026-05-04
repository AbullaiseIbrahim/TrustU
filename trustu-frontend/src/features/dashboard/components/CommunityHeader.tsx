import React from 'react'
import {
  Box, Typography, Button, Skeleton,
  IconButton, Tooltip, useMediaQuery,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { makeStyles } from 'tss-react/mui'
import type { Community } from '@/types/community.types'
import colors from '@/theme/colors'

interface CommunityHeaderProps {
  community?: Community
  isLoading?: boolean
  onAddService?: () => void
  onSellProduct?: () => void
}

const useStyles = makeStyles()(() => ({
  root: {
    backgroundColor: colors.white,
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    margin: '10px 0px',
    borderRadius: 10,
    boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 24px rgba(0,0,0,0.06)',
    '@media (max-width:600px)': {
      padding: '12px 14px',
      gap: '8px',
    },
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: 0,                  // allows text-overflow to work
  },
  communityIcon: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '@media (max-width:600px)': {
      width: 36,
      height: 36,
    },
  },
  textBlock: {
    minWidth: 0,
    flex: 1,
  },
  communityName: {
    fontWeight: 700,
    fontSize: '1rem',
    lineHeight: 1.25,
    color: colors.textPrimary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '@media (max-width:600px)': {
      fontSize: '0.88rem',
    },
  },
  memberLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    color: colors.textSecondary,
    fontSize: '0.72rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  memberIcon: {
    fontSize: '0.78rem',
    flexShrink: 0,
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    '@media (max-width:600px)': {
      gap: '6px',
    },
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: '0.72rem',
    color: colors.primaryDark,
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  statItemBox: {
    border: `1px solid ${colors.primary}`,
    borderRadius: 4,
    padding: '2px 6px',
    backgroundColor: colors.blue,
    color: colors.white,
    fontSize: '0.72rem',
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.divider,
    flexShrink: 0,
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
    alignItems: 'center',
  },

  // Desktop buttons
  addBtn: {
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'none',
    height: 32,
    borderRadius: 8,
    paddingLeft: '12px',
    paddingRight: '12px',
    whiteSpace: 'nowrap',
    backgroundColor: colors.blue,
    '&:hover': { backgroundColor: colors.blueDark },
  },
  sellBtn: {
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'none',
    height: 32,
    borderRadius: 8,
    paddingLeft: '12px',
    paddingRight: '12px',
    whiteSpace: 'nowrap',
    backgroundColor: colors.success,
    '&:hover': { backgroundColor: colors.successDark },
  },

  // Mobile icon buttons
  addIconBtn: {
    width: 34,
    height: 34,
    backgroundColor: colors.blue,
    color: '#fff',
    borderRadius: 8,
    '&:hover': { backgroundColor: colors.blueDark },
  },
  sellIconBtn: {
    width: 34,
    height: 34,
    backgroundColor: colors.success,
    color: '#fff',
    borderRadius: 8,
    '&:hover': { backgroundColor: colors.successDark },
  },
}))

const CommunityIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size * 0.78} viewBox="0 0 36 28" fill="none" aria-hidden="true">
    <circle cx="9"  cy="8" r="5"   fill="white" />
    <path d="M0 26C0 21.029 4.029 17 9 17C11.09 17 13.02 17.716 14.55 18.92"  stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="27" cy="8" r="5"   fill="white" />
    <path d="M36 26C36 21.029 31.971 17 27 17C24.91 17 22.98 17.716 21.45 18.92" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="18" cy="7" r="5.5" fill="white" />
    <path d="M8 27C8 21.477 12.477 17 18 17C23.523 17 28 21.477 28 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  community,
  isLoading = false,
  onAddService,
  onSellProduct,
}) => {
  const { classes } = useStyles()
  const isMobile = useMediaQuery('(max-width:600px)')

  return (
    <Box className={classes.root}>

      {/* ── Left: icon + text ── */}
      <Box className={classes.left}>
        <Box className={classes.communityIcon}>
          <CommunityIcon size={isMobile ? 20 : 24} />
        </Box>

        <Box className={classes.textBlock}>
          {isLoading ? (
            <>
              <Skeleton width={140} height={18} />
              <Skeleton width={100} height={14} sx={{ mt: 0.5 }} />
            </>
          ) : (
            <>
              <Typography className={classes.communityName}>
                {community?.name ?? 'Your Community'}
              </Typography>

              <Box className={classes.memberLine}>
                <PeopleAltOutlinedIcon className={classes.memberIcon} />
                <span>{community?.memberCount ?? 0} members</span>
              </Box>

            </>
          )}
        </Box>
      </Box>

      {/* ── Right: actions — icon-only on mobile, full text on desktop ── */}
      <Box className={classes.actions}>
        {isMobile ? (
          <>
            <Tooltip title="Add Service">
              <IconButton
                size="small"
                className={classes.addIconBtn}
                onClick={onAddService}
                aria-label="Add service"
              >
                <AddIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sell Product">
              <IconButton
                size="small"
                className={classes.sellIconBtn}
                onClick={onSellProduct}
                aria-label="Sell product"
              >
                <SellOutlinedIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              size="small"
              className={classes.addBtn}
              startIcon={<AddIcon sx={{ fontSize: '1rem !important' }} />}
              onClick={onAddService}
            >
              Add Service
            </Button>
            <Button
              variant="contained"
              size="small"
              className={classes.sellBtn}
              startIcon={<SellOutlinedIcon sx={{ fontSize: '1rem !important' }} />}
              onClick={onSellProduct}
            >
              Sell Product
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}

export default CommunityHeader
