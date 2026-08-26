import React, { useState, useEffect } from 'react'
import { Box, Avatar, Typography, CircularProgress, Button, IconButton } from '@mui/material'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { makeStyles } from 'tss-react/mui'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'
import { useCreatePost } from '../hooks/usePostQueries'
import { getInitials, selfAvatarGradient } from '@/utils'
import colors from '@/theme/colors'

const useStyles = makeStyles()(() => ({
  wrapper: {
    padding: '0 16px 10px',
  },

  // ── Collapsed pill ────────────────────────────────────────────────────────────
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 50,
    padding: '8px 8px 8px 8px',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 4px 14px rgba(20,20,15,0.06)',
    cursor: 'pointer',
    border: `1px solid ${colors.line}`,
    transition: 'all 0.18s ease',
    '&:hover': {
      borderColor: `${colors.moss}50`,
      boxShadow: `0 2px 14px ${colors.moss}15`,
    },
  },
  pillAvatar: {
    width: 36,
    height: 36,
    fontSize: '0.82rem',
    background: selfAvatarGradient(),
    flexShrink: 0,
    fontWeight: 700,
  },
  pillText: {
    flex: 1,
    fontSize: '0.875rem',
    color: colors.ink3,
    userSelect: 'none',
    fontWeight: 500,
  },
  pillImg: {
    color: colors.ink4,
    width: 34,
    height: 34,
    borderRadius: 10,
    transition: 'color 0.15s ease',
    flexShrink: 0,
    '&:hover': { color: colors.moss, backgroundColor: colors.mossSoft },
  },

  // ── Expanded card ─────────────────────────────────────────────────────────────
  expandedCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    border: `1.5px solid ${colors.moss}`,
    boxShadow: `0 4px 20px ${colors.moss}18`,
    overflow: 'hidden',
    animation: 'fadeSlideUp 0.2s ease both',
  },
  expandedHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 16px 10px',
    borderBottom: `1px solid ${colors.lineSoft}`,
  },
  expandedAvatar: {
    width: 36,
    height: 36,
    fontSize: '0.82rem',
    background: selfAvatarGradient(),
    flexShrink: 0,
    fontWeight: 700,
  },
  userName: {
    fontWeight: 700,
    fontSize: '0.85rem',
    color: colors.ink,
  },
  userMeta: {
    fontSize: '0.7rem',
    color: colors.ink3,
  },
  titleInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.98rem',
    fontWeight: 700,
    lineHeight: 1.4,
    color: colors.ink,
    fontFamily: 'inherit',
    padding: '12px 16px 4px',
    resize: 'none',
    boxSizing: 'border-box',
  },
  bodyInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.875rem',
    lineHeight: 1.65,
    color: colors.ink3,
    fontFamily: 'inherit',
    padding: '4px 16px 12px',
    resize: 'none',
    minHeight: 68,
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px 12px',
    borderTop: `1px solid ${colors.lineSoft}`,
    backgroundColor: colors.cream,
  },
  charCount: {
    fontSize: '0.7rem',
    color: colors.ink4,
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
    color: colors.ink3,
    textTransform: 'none',
    '&:hover': { backgroundColor: colors.lineSoft },
  },
  postBtn: {
    borderRadius: 10,
    fontWeight: 700,
    fontSize: '0.82rem',
    height: 34,
    paddingLeft: 20,
    paddingRight: 20,
    textTransform: 'none',
    boxShadow: `0 3px 10px ${colors.moss}30`,
    '&:hover': { boxShadow: `0 5px 14px ${colors.moss}40` },
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
      <Box sx={{ px: 2, pt: 0.5, pb: 1.5 }}>
        <Box className={classes.expandedCard}>
          {/* Author header */}
          <Box className={classes.expandedHeader}>
            <Avatar className={classes.expandedAvatar} src={user?.avatarUrl ?? undefined}>
              {getInitials(user?.name ?? 'U')}
            </Avatar>
            <Box>
              <Typography className={classes.userName}>{user?.name ?? 'You'}</Typography>
              <Typography className={classes.userMeta}>{user?.communityName ?? 'Community'}</Typography>
            </Box>
          </Box>

          {/* Title */}
          <textarea
            className={classes.titleInput}
            placeholder="What's on your mind? Add a title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={1}
            maxLength={120}
            autoFocus
          />
          {/* Body */}
          <textarea
            className={classes.bodyInput}
            placeholder="Share the details with your community…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={1000}
          />

          {/* Footer actions */}
          <Box className={classes.actions}>
            <Typography className={classes.charCount}>{title.length}/120</Typography>
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
        <Avatar className={classes.pillAvatar} src={user?.avatarUrl ?? undefined}>
          {getInitials(user?.name ?? 'U')}
        </Avatar>
        <Typography className={classes.pillText}>
          Write Something...
        </Typography>
        <IconButton
          className={classes.pillImg}
          size="small"
          onClick={(e) => { e.stopPropagation(); setExpanded(true) }}
          aria-label="Add image"
        >
          <ImageOutlinedIcon sx={{ fontSize: '1.15rem' }} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default CreatePostInput
