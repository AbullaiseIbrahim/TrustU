import React from 'react'
import { Box, Skeleton } from '@mui/material'
import { makeStyles } from 'tss-react/mui'

interface ContentSkeletonProps {
  count?: number
  variant?: 'card' | 'post'
}

const useStyles = makeStyles()(() => ({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    border: '1px solid rgba(0,0,0,0.05)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    marginBottom: 12,
  },
  topRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
}))

const CardSkeleton: React.FC = () => {
  const { classes } = useStyles()
  return (
    <Box className={classes.card}>
      <Box className={classes.topRow}>
        <Skeleton variant="circular" width={42} height={42} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="rounded" width="50%" height={14} sx={{ borderRadius: 6 }} />
          <Skeleton variant="rounded" width="70%" height={12} sx={{ mt: 0.8, borderRadius: 6 }} />
        </Box>
      </Box>
      <Skeleton variant="rounded" width="35%" height={12} sx={{ borderRadius: 6 }} />
      <Skeleton variant="rounded" width="25%" height={12} sx={{ mt: 0.8, borderRadius: 6 }} />
      <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
        <Skeleton variant="rounded" width={70} height={22} sx={{ borderRadius: 8 }} />
        <Skeleton variant="rounded" width={90} height={22} sx={{ borderRadius: 8 }} />
      </Box>
    </Box>
  )
}

const PostSkeleton: React.FC = () => {
  const { classes } = useStyles()
  return (
    <Box className={classes.card}>
      <Box className={classes.topRow}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="rounded" width="40%" height={14} sx={{ borderRadius: 6 }} />
          <Skeleton variant="rounded" width="28%" height={11} sx={{ mt: 0.7, borderRadius: 6 }} />
        </Box>
      </Box>
      <Skeleton variant="rounded" width="80%" height={14} sx={{ borderRadius: 6 }} />
      <Skeleton variant="rounded" width="90%" height={12} sx={{ mt: 0.8, borderRadius: 6 }} />
      <Skeleton variant="rounded" width="65%" height={12} sx={{ mt: 0.6, borderRadius: 6 }} />
      <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
        <Skeleton variant="rounded" width={80} height={30} sx={{ borderRadius: 10 }} />
        <Skeleton variant="rounded" width={80} height={30} sx={{ borderRadius: 10 }} />
      </Box>
    </Box>
  )
}

const ContentSkeleton: React.FC<ContentSkeletonProps> = ({ count = 3, variant = 'card' }) => (
  <>
    {Array.from({ length: count }).map((_, i) =>
      variant === 'post' ? <PostSkeleton key={i} /> : <CardSkeleton key={i} />,
    )}
  </>
)

export default ContentSkeleton
