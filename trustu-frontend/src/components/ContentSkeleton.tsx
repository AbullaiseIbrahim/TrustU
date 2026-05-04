import React from 'react'
import { Box, Skeleton } from '@mui/material'
import { makeStyles } from 'tss-react/mui'

interface ContentSkeletonProps {
  count?: number
  variant?: 'card' | 'post'
}

const useStyles = makeStyles()((theme) => ({
  card: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 12,
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(1.5),
  },
  topRow: {
    display: 'flex',
    gap: theme.spacing(1.5),
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1),
  },
}))

const CardSkeleton: React.FC = () => {
  const { classes } = useStyles()
  return (
    <Box className={classes.card}>
      <Box className={classes.topRow}>
        <Skeleton variant="circular" width={38} height={38} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="45%" height={18} />
          <Skeleton variant="text" width="65%" height={14} sx={{ mt: 0.5 }} />
        </Box>
      </Box>
      <Skeleton variant="text" width="30%" height={14} />
      <Skeleton variant="text" width="20%" height={14} sx={{ mt: 0.5 }} />
    </Box>
  )
}

const PostSkeleton: React.FC = () => {
  const { classes } = useStyles()
  return (
    <Box className={classes.card}>
      <Box className={classes.topRow}>
        <Skeleton variant="circular" width={38} height={38} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="35%" height={18} />
          <Skeleton variant="text" width="25%" height={14} sx={{ mt: 0.5 }} />
        </Box>
      </Box>
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="15%" height={14} sx={{ mt: 1 }} />
    </Box>
  )
}

const ContentSkeleton: React.FC<ContentSkeletonProps> = ({
  count = 3,
  variant = 'card',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) =>
        variant === 'post' ? <PostSkeleton key={i} /> : <CardSkeleton key={i} />,
      )}
    </>
  )
}

export default ContentSkeleton
