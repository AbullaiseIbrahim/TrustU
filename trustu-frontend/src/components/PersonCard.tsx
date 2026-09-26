import React from 'react'
import { Box, Avatar, Typography } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import classNames from 'classnames'
import { getInitials, avatarGradient } from '@/utils'
import colors from '@/theme/colors'

export interface PersonCardProps {
  name: string
  avatarUrl?: string | null
  /**
   * Seed for the avatar's per-person gradient background (usually the
   * person's userId) -- pass a stable id so the same person always gets the
   * same color across every screen that uses this card.
   */
  colorSeed: string
  subtitle?: string | null
  /**
   * Capitalize the subtitle word-by-word -- for a designation like
   * "student" -> "Student". Off by default, since a full-sentence subtitle
   * like "Joined 5h ago" must NOT be capitalized word-by-word (it would
   * render "Joined 5H Ago").
   */
  capitalizeSubtitle?: boolean
  onClick?: () => void
  /**
   * Rendered below the subtitle -- a button, status pill, or row of
   * buttons. Clicks inside it are stopped from bubbling up to the card's
   * own onClick (so an "Add Friend" button inside a clickable card doesn't
   * also open the person's profile sheet).
   */
  action?: React.ReactNode
  /**
   * 'grid' (default) fills its grid cell (for a 2-up card grid, e.g.
   * Members/Friends/Requests). 'scroll' is a fixed width for a
   * horizontally-scrolling strip (e.g. Discover's New Members / Friends of
   * your friends).
   */
  variant?: 'grid' | 'scroll'
  className?: string
}

const useStyles = makeStyles()(() => ({
  root: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: '14px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 6px 22px rgba(20,20,15,0.05)',
    cursor: 'pointer',
  },
  gridVariant: {
    width: '100%',
  },
  scrollVariant: {
    width: 138,
    flexShrink: 0,
  },
  avatar: {
    width: 54,
    height: 54,
    fontSize: '1rem',
    fontWeight: 700,
  },
  name: {
    fontWeight: 700,
    fontSize: '0.82rem',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    fontSize: '0.68rem',
    color: colors.ink3,
    textAlign: 'center',
    lineHeight: 1.3,
  },
  subtitleCapitalize: {
    textTransform: 'capitalize',
  },
  actionSlot: {
    marginTop: 8,
  },
}))

/**
 * Shared "person in a box" card -- one avatar, name, optional subtitle, and
 * an optional action slot below (a button/pill/row of buttons).
 *
 * This is the single canonical look for every place the app shows a
 * community member as a boxed card: the Members / My Friends / Pending
 * Requests tabs (CommunityPage.tsx), and the Discover tab's "New members"
 * and "Friends of your friends" sections. All of these previously
 * duplicated this exact markup and styling independently (a `memberCard`
 * style block and an almost-pixel-identical `discoverCard` style block,
 * differing only in container width) -- per direct feedback to stop
 * duplicating these boxes and reuse one component everywhere, this is that
 * one component. Adding a new "person in a card" list anywhere else in the
 * app should reuse this rather than writing another near-copy.
 */
const PersonCard: React.FC<PersonCardProps> = ({
  name, avatarUrl, colorSeed, subtitle, capitalizeSubtitle, onClick, action,
  variant = 'grid', className,
}) => {
  const { classes } = useStyles()
  const avatarBg = avatarGradient(colorSeed)

  return (
    <Box
      className={classNames(classes.root, variant === 'scroll' ? classes.scrollVariant : classes.gridVariant, className)}
      onClick={onClick}
    >
      <Avatar src={avatarUrl ?? undefined} className={classes.avatar} sx={{ background: avatarBg, color: '#fff' }}>
        {getInitials(name)}
      </Avatar>
      <Typography className={classes.name}>{name}</Typography>
      {subtitle && (
        <Typography className={classNames(classes.subtitle, capitalizeSubtitle && classes.subtitleCapitalize)}>
          {subtitle}
        </Typography>
      )}
      {action && (
        <Box className={classes.actionSlot} onClick={(e) => e.stopPropagation()}>
          {action}
        </Box>
      )}
    </Box>
  )
}

export default PersonCard
