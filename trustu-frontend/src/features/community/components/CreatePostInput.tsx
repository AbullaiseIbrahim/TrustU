import React, { useState, useEffect } from 'react'
import { Box, Avatar, Typography, CircularProgress, Button } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'
import { useCreatePost } from '../hooks/usePostQueries'
import { getInitials } from '@/utils'
import colors from '@/theme/colors'

const useStyles = makeStyles()(() => ({
  wrapper: {
    padding: '12px 16px 8px',
  },
  // Collapsed pill row
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: '10px 16px',
    border: '1.5px solid rgba(0,0,0,0.07)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    cursor: 'text',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: `${colors.primary}50`,
      boxShadow: `0 2px 14px ${colors.primary}15`,
    },
  },
  avatar: {
    width: 36,
    height: 36,
    fontSize: '0.82rem',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    flexShrink: 0,
    fontWeight: 700,
    boxShadow: '0 2px 6px rgba(46,125,50,0.25)',
  },
  pillText: {
    flex: 1,
    fontSize: '0.875rem',
    color: colors.textSecondary,
    userSelect: 'none',
  },
  // Expanded card
  expandedCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    border: `2px solid ${colors.primary}`,
    boxShadow: `0 4px 20px ${colors.primary}18`,
    overflow: 'hidden',
    animation: 'fadeSlideUp 0.2s ease both',
  },
  expandedHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 16px 10px',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
  },
  expandedAvatar: {
    width: 36,
    height: 36,
    fontSize: '0.82rem',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    flexShrink: 0,
    fontWeight: 700,
    boxShadow: '0 2px 6px rgba(46,125,50,0.25)',
  },
  userName: {
    fontWeight: 700,
    fontSize: '0.85rem',
    color: colors.textPrimary,
  },
  userMeta: {
    fontSize: '0.7rem',
    color: colors.textSecondary,
  },
  titleInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.98rem',
    fontWeight: 700,
    lineHeight: 1.4,
    color: colors.textPrimary,
    fontFamily: 'inherit',
    padding: '12px 16px 6px',
    resize: 'none',
  },
  bodyInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.875rem',
    lineHeight: 1.65,
    color: colors.textSecondary,
    fontFamily: 'inherit',
    padding: '4px 16px 12px',
    resize: 'none',
    minHeight: 72,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px 12px',
    borderTop: '1px solid rgba(0,0,0,0.05)',
    backgroundColor: '#FAFFF9',
  },
  charCount: {
    fontSize: '0.7rem',
    color: colors.textDisabled,
    fontWeight: 500,
  },
  btnRow: {
    display: 'flex',
    gap: 8,
  },
  cancelBtn: {
    borderRadius: 10,
    fontWeight: 600,
    fontSize: '0.82rem',
    height: 34,
    color: colors.textSecondary,
    '&:hover': { backgroundColor: '#F3F4F6' },
  },
  postBtn: {
    borderRadius: 10,
    fontWeight: 700,
    fontSize: '0.82rem',
    height: 34,
    paddingLeft: 20,
    paddingRight: 20,
    boxShadow: `0 4px 12px ${colors.primary}35`,
    '&:hover': { boxShadow: `0 6px 16px ${colors.primary}40` },
    '&:disabled': { boxShadow: 'none' },
  },
}))

const CreatePostInput: React.FC = () => {
  const { classes } = useStyles()
  const { user } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const createPost = useCreatePost()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('action') === 'create-post') {
      setExpanded(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const handlePost = () => {
    const t = title.trim()
    const d = description.trim()
    if (!t || !d || !user?.communityId) return
    createPost.mutate(
      { community_id: user.communityId, title: t, description: d },
      { onSuccess: () => { setTitle(''); setDescription(''); setExpanded(false) } },
    )
  }

  const canPost = title.trim().length > 0 && description.trim().length > 0 && !!user?.communityId

  if (expanded) {
    return (
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <Box className={classes.expandedCard}>
          <Box className={classes.expandedHeader}>
            <Avatar className={classes.expandedAvatar}>{getInitials(user?.name ?? 'U')}</Avatar>
            <Box>
              <Typography className={classes.userName}>{user?.name ?? 'You'}</Typography>
              <Typography className={classes.userMeta}>{user?.communityName ?? 'Community'}</Typography>
            </Box>
          </Box>

          <textarea
            className={classes.titleInput}
            placeholder="What's your question? Add a title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={1}
            maxLength={120}
            autoFocus
          />
          <textarea
            className={classes.bodyInput}
            placeholder="Share the details with your community…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={1000}
          />

          <Box className={classes.actions}>
            <Typography className={classes.charCount}>
              {title.length}/120
            </Typography>
            <Box className={classes.btnRow}>
              <Button
                className={classes.cancelBtn}
                onClick={() => { setExpanded(false); setTitle(''); setDescription('') }}
                size="small"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.postBtn}
                onClick={handlePost}
                disabled={!canPost || createPost.isPending}
                size="small"
              >
                {createPost.isPending
                  ? <CircularProgress size={14} color="inherit" />
                  : 'Post'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.pill} onClick={() => setExpanded(true)}>
        <Avatar className={classes.avatar}>{getInitials(user?.name ?? 'U')}</Avatar>
        <Typography className={classes.pillText}>
          Ask your community something…
        </Typography>
      </Box>
    </Box>
  )
}

export default CreatePostInput
