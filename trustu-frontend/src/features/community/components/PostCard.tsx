import React, { useState } from 'react'
import { Box, Typography, Avatar, TextField, Button, Collapse } from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import { makeStyles } from 'tss-react/mui'
import { getInitials, formatRelativeTime } from '@/utils'
import type { Post } from '@/types/post.types'
import { useCreateReply, useReplies } from '../hooks/usePostQueries'
import { useAuth } from '@/app/AuthProvider'
import colors from '@/theme/colors'

interface PostCardProps {
  post: Post
}

const useStyles = makeStyles()(() => ({
  root: {
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.divider}`,
    padding: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  avatar: {
    width: 38,
    height: 38,
    fontSize: '0.875rem',
    backgroundColor: colors.primary,
    flexShrink: 0,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontWeight: 600,
    fontSize: '0.9rem',
    lineHeight: 1.3,
  },
  meta: {
    fontSize: '0.75rem',
    color: colors.textSecondary,
  },
  content: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    color: colors.textPrimary,
    marginBottom: '12px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.8rem',
    color: colors.textSecondary,
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: 6,
    '&:hover': { backgroundColor: colors.actionHover },
  },
  actionIcon: {
    fontSize: '1rem',
  },
  replySection: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${colors.divider}`,
  },
  replyInputRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  replyAvatar: {
    width: 30,
    height: 30,
    fontSize: '0.7rem',
    backgroundColor: colors.primary,
    flexShrink: 0,
    marginTop: 4,
  },
  replyInput: {
    flex: 1,
    '& .MuiInputBase-root': { fontSize: '0.82rem' },
  },
  replyBtn: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.8rem',
    height: 32,
    borderRadius: 8,
    marginTop: 4,
  },
  replyCard: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
  },
  replyContent: {
    fontSize: '0.82rem',
    color: colors.textPrimary,
  },
  replyMeta: {
    fontSize: '0.7rem',
    color: colors.textSecondary,
  },
}))

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { classes } = useStyles()
  const { user } = useAuth()
  const [showReplies, setShowReplies] = useState(false)
  const [replyText, setReplyText] = useState('')

  const createReplyMutation = useCreateReply(post.id)
  const { data: replies = [], isLoading: loadingReplies } = useReplies(
    showReplies ? post.id : '',
  )

  const handleReply = () => {
    const trimmed = replyText.trim()
    if (!trimmed) return
    createReplyMutation.mutate({ content: trimmed }, { onSuccess: () => setReplyText('') })
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Avatar className={classes.avatar}>{getInitials(post.userName)}</Avatar>
        <Box className={classes.headerInfo}>
          <Typography className={classes.userName}>{post.userName}</Typography>
          <Typography className={classes.meta}>
            {post.userDesignation} · {formatRelativeTime(post.createdAt)}
          </Typography>
        </Box>
      </Box>

      <Typography className={classes.content}>{post.content}</Typography>

      <Box className={classes.actions}>
        {/* Post likes/upvotes are on hold — will be enabled in a future release */}

        <Box
          className={classes.actionBtn}
          onClick={() => setShowReplies((prev) => !prev)}
          role="button"
          aria-label="replies"
        >
          <ChatBubbleOutlineIcon className={classes.actionIcon} />
          <span>{showReplies ? 'Hide' : 'Respond'} ({post.replyCount})</span>
        </Box>
      </Box>

      <Collapse in={showReplies}>
        <Box className={classes.replySection}>
          <Box className={classes.replyInputRow}>
            <Avatar className={classes.replyAvatar}>{getInitials(user?.name ?? 'U')}</Avatar>
            <TextField
              className={classes.replyInput}
              placeholder="Write a reply..."
              multiline
              maxRows={3}
              size="small"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.replyBtn}
              onClick={handleReply}
              disabled={!replyText.trim() || createReplyMutation.isPending}
            >
              Reply
            </Button>
          </Box>

          {loadingReplies ? (
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: colors.textSecondary }}>
              Loading replies...
            </Typography>
          ) : (
            replies.map((reply) => (
              <Box key={reply.id} className={classes.replyCard}>
                <Avatar className={classes.replyAvatar}>{getInitials(reply.userName)}</Avatar>
                <Box>
                  <Typography className={classes.replyMeta}>
                    <strong>{reply.userName}</strong> · {formatRelativeTime(reply.createdAt)}
                  </Typography>
                  <Typography className={classes.replyContent}>{reply.content}</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Collapse>
    </Box>
  )
}

export default PostCard
