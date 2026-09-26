import React from 'react'
import { Box, Avatar, Typography } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import classNames from 'classnames'
import { getInitials } from '@/utils'
import colors from '@/theme/colors'

export interface PosterBadgeProps {
  name: string
  avatarUrl?: string | null
  className?: string
}

const useStyles = makeStyles()(() => ({
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
    backgroundColor: colors.mossSoft,
    borderRadius: 20,
    padding: '4px 10px 4px 4px',
  },
  avatar: {
    width: 22,
    height: 22,
    fontSize: '0.6rem',
    fontWeight: 700,
    flexShrink: 0,
    background: `linear-gradient(135deg, ${colors.moss}, ${colors.mossDeep})`,
  },
  name: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: colors.mossDeep,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}))

/**
 * "Posted by <name>" badge -- an avatar-initial + name in a moss-tinted
 * pill. This was already designed once (as `posterChip`/`posterAvatar`/
 * `posterName` inside the unused src/components/ListingCard.tsx) but never
 * pulled out where other listing cards could reuse it, so every card ended
 * up re-inventing its own "posted by" treatment (plain text at various
 * weights/colors). This is that shared piece: a single place that defines
 * what "posted by" looks like, meant to be reused by every accommodation
 * (and future listing-type) card instead of each one styling its own label.
 * The chip shape also fixes a real bug a plain text label had: a long name
 * wrapping and breaking mid-name (e.g. "K" / "P" on separate lines) inside a
 * narrow card -- this truncates with an ellipsis on one line instead.
 */
const PosterBadge: React.FC<PosterBadgeProps> = ({ name, avatarUrl, className }) => {
  const { classes } = useStyles()

  return (
    <Box className={classNames(classes.chip, className)}>
      <Avatar src={avatarUrl ?? undefined} className={classes.avatar}>
        {getInitials(name)}
      </Avatar>
      <Typography className={classes.name}>{name}</Typography>
    </Box>
  )
}

export default PosterBadge
