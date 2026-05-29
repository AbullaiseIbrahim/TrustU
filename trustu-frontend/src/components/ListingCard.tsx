import React from 'react'
import { Box, Typography, Avatar } from '@mui/material'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { makeStyles } from 'tss-react/mui'
import classNames from 'classnames'
import { getInitials, formatRelativeTime, truncate } from '@/utils'
import colors from '@/theme/colors'

export interface ListingCardProps {
  id: string
  title?: string
  userName?: string
  type: string
  location?: string
  description?: string
  createdAt: string
  isConnected?: boolean
  mutualFriends?: number
  onViewDetails?: (id: string) => void
  className?: string
  sx?: object
  extra?: React.ReactNode
  /** listing type key for photo hue: 'accommodation' | 'proxy' | 'marketplace' */
  listingTypeKey?: 'accommodation' | 'proxy' | 'marketplace'
  posterName?: string
}

// Hue by listing type
const TYPE_HUE: Record<string, number> = {
  accommodation: 110,
  proxy: 280,
  marketplace: 30,
}

const useStyles = makeStyles()(() => ({
  root: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 6px 22px rgba(20,20,15,0.05)',
    transition: 'all 0.22s ease',
    animation: 'fadeSlideUp 0.3s ease both',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 8px 28px rgba(20,20,15,0.10)',
      transform: 'translateY(-2px)',
    },
    '&:active': { transform: 'translateY(0)' },
  },
  photoBlock: {
    height: 140,
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: 10,
  },
  saveBtn: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.88)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.ink3,
    cursor: 'pointer',
    '&:hover': { color: colors.urgent },
  },
  body: {
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  title: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: colors.ink,
    letterSpacing: '-0.3px',
    lineHeight: 1.3,
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: '0.78rem',
    color: colors.ink3,
    '& svg': { fontSize: '0.8rem', color: colors.ink4 },
  },
  description: {
    fontSize: '0.8rem',
    color: colors.ink3,
    lineHeight: 1.55,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTop: `1px solid ${colors.lineSoft}`,
    marginTop: 2,
  },
  fromText: {
    fontSize: '0.72rem',
    color: colors.ink4,
    fontWeight: 500,
  },
  viewBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: '0.78rem',
    fontWeight: 700,
    color: colors.moss,
    cursor: 'pointer',
    padding: '4px 10px',
    borderRadius: 8,
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: colors.mossSoft },
  },
  posterChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.mossSoft,
    borderRadius: 20,
    padding: '4px 10px 4px 4px',
    marginTop: 2,
  },
  posterAvatar: {
    width: 22,
    height: 22,
    fontSize: '0.6rem',
    fontWeight: 700,
    background: `linear-gradient(135deg, ${colors.moss}, ${colors.mossDeep})`,
  },
  posterName: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: colors.mossDeep,
  },
  mutualText: {
    fontSize: '0.68rem',
    color: colors.ink3,
    fontWeight: 500,
  },
}))

const ListingCard: React.FC<ListingCardProps> = ({
  id, title, userName, type, location, description, createdAt,
  mutualFriends = 0, onViewDetails, className, sx, extra,
  listingTypeKey = 'accommodation', posterName,
}) => {
  const { classes } = useStyles()
  const hue = TYPE_HUE[listingTypeKey] ?? 110
  const photoGradient = `linear-gradient(160deg, oklch(86% 0.04 ${hue}), oklch(70% 0.07 ${hue}))`

  return (
    <Box className={classNames(classes.root, className)} sx={sx} onClick={() => onViewDetails?.(id)}>
      {/* Photo placeholder */}
      <Box className={classes.photoBlock} sx={{ background: photoGradient }}>
        <Box className={classes.saveBtn} onClick={(e) => e.stopPropagation()}>
          <FavoriteBorderIcon sx={{ fontSize: '1rem' }} />
        </Box>
      </Box>

      {/* Body */}
      <Box className={classes.body}>
        {title && <Typography className={classes.title}>{title}</Typography>}

        {location && (
          <Typography className={classes.locationRow}>
            <LocationOnOutlinedIcon /> {location} · {formatRelativeTime(createdAt)}
          </Typography>
        )}

        {extra}

        {description && (
          <Typography className={classes.description}>{truncate(description, 120)}</Typography>
        )}

        {/* Poster chip */}
        {(posterName ?? userName) && (
          <Box className={classes.posterChip}>
            <Avatar className={classes.posterAvatar}>{getInitials(posterName ?? userName ?? 'L')}</Avatar>
            <Typography className={classes.posterName}>{posterName ?? userName}</Typography>
            {mutualFriends > 0 && (
              <Typography className={classes.mutualText}>· {mutualFriends} mutual</Typography>
            )}
          </Box>
        )}

        {/* Footer */}
        <Box className={classes.footer}>
          <Typography className={classes.fromText}>
            {type}
          </Typography>
          <Box className={classes.viewBtn}>
            More details <ArrowForwardIcon sx={{ fontSize: '0.82rem' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ListingCard
