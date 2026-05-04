import React from 'react'
import { Box, Typography, Button, SvgIcon } from '@mui/material'
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
    padding: '48px 24px',
    textAlign: 'center',
  },
  compact: {
    padding: '32px 16px',
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    backgroundColor: `${colors.primary}14`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    '& svg': {
      fontSize: 36,
      color: colors.primary,
    },
  },
  title: {
    fontWeight: 600,
    color: colors.textPrimary,
    marginBottom: '8px',
  },
  description: {
    color: colors.textSecondary,
    fontSize: '0.875rem',
    maxWidth: 320,
    marginBottom: '20px',
  },
  actionButton: {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 10,
    paddingLeft: '24px',
    paddingRight: '24px',
  },
}))

const DefaultIcon = () => (
  <SvgIcon viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.1 15.9 0 13.34 0c-1.3 0-2.43.52-3.34 1.33C9.09.52 7.96 0 6.66 0 4.1 0 2 2.1 2 4.66c0 .46.11.9.18 1.34H0v14h20V6zm-6.66-4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM6.66 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM2 18V8h16v10H2z"
    />
  </SvgIcon>
)

const EmptyState: React.FC<EmptyStateProps> = ({
  title, description, actionLabel, onAction, icon, compact = false, className,
}) => {
  const { classes } = useStyles()

  return (
    <Box className={classNames(classes.root, { [classes.compact]: compact }, className)}>
      <Box className={classes.iconWrapper}>{icon ?? <DefaultIcon />}</Box>
      <Typography variant={compact ? 'body1' : 'h6'} className={classes.title}>{title}</Typography>
      {description && <Typography className={classes.description}>{description}</Typography>}
      {actionLabel && onAction && (
        <Button variant="contained" color="primary" className={classes.actionButton} onClick={onAction} size={compact ? 'small' : 'medium'}>
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}

export default EmptyState
