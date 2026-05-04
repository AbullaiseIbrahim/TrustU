import React from 'react'
import { Box, Typography, Avatar, Link, Chip } from '@mui/material'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
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
}

const useStyles = makeStyles()(() => ({
  root: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: '16px',
    border: `1px solid ${colors.divider}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
    transition: 'box-shadow 0.15s',
    '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  avatar: {
    width: 38,
    height: 38,
    fontSize: '0.875rem',
    backgroundColor: colors.primary,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontWeight: 600,
    fontSize: '0.9rem',
    lineHeight: 1.3,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: 2,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: '0.75rem',
    color: colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    '& svg': { fontSize: '0.8rem' },
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: '50%',
    backgroundColor: colors.textDisabled,
    flexShrink: 0,
  },
  connectionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  connectionChip: {
    height: 20,
    fontSize: '0.7rem',
    fontWeight: 500,
  },
  connected: {
    backgroundColor: `${colors.successLight}30`,
    color: colors.successDark,
  },
  notConnected: {
    backgroundColor: colors.grey100,
    color: colors.textSecondary,
  },
  mutualText: {
    fontSize: '0.72rem',
    color: colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    '& svg': { fontSize: '0.8rem' },
  },
  title: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: colors.textPrimary,
    lineHeight: 1.3,
    marginBottom: 2,
  },
  description: {
    fontSize: '0.8rem',
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  viewLink: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: colors.primary,
    cursor: 'pointer',
    alignSelf: 'flex-start',
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
}))

const ListingCard: React.FC<ListingCardProps> = ({
  id, title, userName, type, location, description, createdAt,
  isConnected, mutualFriends = 0, onViewDetails, className, sx, extra,
}) => {
  const { classes } = useStyles()

  return (
    <Box className={classNames(classes.root, className)} sx={sx}>
      {/* Title */}
      {title && <Typography className={classes.title}>{title}</Typography>}

      <Box className={classes.topRow}>
        <Avatar className={classes.avatar}>{getInitials(title ?? userName ?? 'L')}</Avatar>
        <Box className={classes.info}>
          <Typography className={classes.name}>{type}</Typography>
          <Box className={classes.metaRow}>
            {location && (
              <Typography className={classes.metaText}>
                <LocationOnOutlinedIcon />{location}
              </Typography>
            )}
            {location && <Box className={classes.dot} />}
            <Typography className={classes.metaText}>
              <CalendarTodayOutlinedIcon />{formatRelativeTime(createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {extra}

      {/* Description */}
      {description && (
        <Typography className={classes.description}>
          {truncate(description, 140)}
        </Typography>
      )}

      <Box className={classes.connectionRow}>
        <Chip
          size="small"
          label={isConnected ? 'Connected' : 'Not Connected'}
          className={classNames(classes.connectionChip, {
            [classes.connected]: isConnected,
            [classes.notConnected]: !isConnected,
          })}
        />
        {mutualFriends > 0 && (
          <Typography className={classes.mutualText}>
            <PeopleAltOutlinedIcon />{mutualFriends} mutual friends
          </Typography>
        )}
      </Box>

      <Link component="button" className={classes.viewLink} onClick={() => onViewDetails?.(id)} underline="hover">
        View More Details
      </Link>
    </Box>
  )
}

export default ListingCard
