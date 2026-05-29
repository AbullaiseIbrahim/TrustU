import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import classNames from 'classnames'
import colors from '@/theme/colors'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
  compact?: boolean
  className?: string
}

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '52px 24px',
    textAlign: 'center',
    animation: 'fadeIn 0.35s ease both',
  },
  compact: {
    padding: '32px 16px',
  },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 24,
    background: `linear-gradient(135deg, ${colors.primary}18 0%, ${colors.primary}0a 100%)`,
    border: `1.5px solid ${colors.primary}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    '& svg': {
      fontSize: 36,
      color: colors.primary,
      opacity: 0.85,
    },
  },
  compactRing: {
    width: 60,
    height: 60,
    borderRadius: 18,
    marginBottom: 14,
    '& svg': { fontSize: 26 },
  },
  title: {
    fontWeight: 700,
    fontSize: '1rem',
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: '-0.2px',
  },
  description: {
    color: colors.textSecondary,
    fontSize: '0.85rem',
    maxWidth: 280,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 12,
    fontWeight: 700,
    paddingLeft: 24,
    paddingRight: 24,
    boxShadow: `0 4px 14px ${colors.primary}30`,
  },
}))

const EmptyState: React.FC<EmptyStateProps> = ({
  title, description, actionLabel, onAction, icon, compact = false, className,
}) => {
  const { classes, cx } = useStyles()

  return (
    <Box className={classNames(classes.root, { [classes.compact]: compact }, className)}>
      <Box className={cx(classes.iconRing, { [classes.compactRing]: compact })}>
        {icon ?? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="currentColor" opacity="0.7" />
          </svg>
        )}
      </Box>
      <Typography className={classes.title}>{title}</Typography>
      {description && (
        <Typography className={classes.description}>{description}</Typography>
      )}
      {actionLabel && onAction && (
        <Button
          variant="contained"
          color="primary"
          className={classes.actionButton}
          onClick={onAction}
          size={compact ? 'small' : 'medium'}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}

export default EmptyState
