import React from 'react'
import { Box, Typography, Skeleton } from '@mui/material'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { makeStyles } from 'tss-react/mui'
import type { Community } from '@/types/community.types'
import colors from '@/theme/colors'

interface CommunityHeaderProps {
  community?: Community
  isLoading?: boolean
}

const useStyles = makeStyles()(() => ({
  root: {
    backgroundColor: colors.white,
    padding: '16px 16px 0',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
    borderBottom: `1px solid #F0F0F0`,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(46,125,50,0.25)',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontWeight: 700,
    fontSize: '1rem',
    color: colors.textPrimary,
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  memberRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  memberText: {
    fontSize: '0.72rem',
    color: colors.textSecondary,
  },
  memberIcon: {
    fontSize: '0.78rem !important',
    color: colors.textSecondary,
  },
}))

const CommunityIcon: React.FC = () => (
  <svg width={22} height={17} viewBox="0 0 36 28" fill="none" aria-hidden="true">
    <circle cx="9"  cy="8" r="5"   fill="white" />
    <path d="M0 26C0 21.029 4.029 17 9 17C11.09 17 13.02 17.716 14.55 18.92"  stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="27" cy="8" r="5"   fill="white" />
    <path d="M36 26C36 21.029 31.971 17 27 17C24.91 17 22.98 17.716 21.45 18.92" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="18" cy="7" r="5.5" fill="white" />
    <path d="M8 27C8 21.477 12.477 17 18 17C23.523 17 28 21.477 28 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ community, isLoading = false }) => {
  const { classes } = useStyles()

  return (
    <Box className={classes.root}>
      <Box className={classes.inner}>
        <Box className={classes.avatar}>
          <CommunityIcon />
        </Box>
        <Box className={classes.textBlock}>
          {isLoading ? (
            <>
              <Skeleton width={160} height={18} />
              <Skeleton width={90} height={13} sx={{ mt: 0.5 }} />
            </>
          ) : (
            <>
              <Typography className={classes.name}>
                {community?.name ?? 'Your Community'}
              </Typography>
              <Box className={classes.memberRow}>
                <PeopleAltOutlinedIcon className={classes.memberIcon} />
                <Typography className={classes.memberText}>
                  {community?.memberCount ?? 0} members
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default CommunityHeader
