import React, { useState } from 'react'
import {
  Box, Typography, Avatar, TextField, Button,
  Collapse, IconButton, Menu, MenuItem, ListItemIcon,
} from '@mui/material'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { makeStyles } from 'tss-react/mui'
import { getInitials, formatRelativeTime } from '@/utils'
import type { Post } from '@/types/post.types'
import { useCreateComment, useComments, useLikePost, useDeletePost, useDeleteComment } from '../hooks/usePostQueries'
import { useAuth } from '@/app/AuthProvider'
import colors from '@/theme/colors'

interface PostCardProps {
  post: Post
}

// Deterministic avatar color from user id
const PALETTE = [
  { bg: '#FBE3D0', fg: '#C9762E' },
  { bg: '#DCEAFE', fg: '#3B6FB6' },
  { bg: '#F6DDEB', fg: '#B0568E' },
  { bg: '#E1EFE0', fg: '#5C8A5E' },
  { bg: '#FFF3D6', fg: '#C99A2E' },
  { bg: '#E6E1F7', fg: '#7660B8' },
]
function avatarColor(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return PALETTE[h % PALETTE.length]
}

const useStyles = makeStyles()(() => ({
  root: {
    backgroundColor: colors.white,
    borderRadius: 18,
    margin: '0 0 10px',
    padding: '16px 16px 12px',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 6px 22px rgba(20,20,15,0.05)',
    animation: 'fadeSlideUp 0.3s ease both',
    transition: 'box-shadow 0.2s ease',
    '&:hover': { boxShadow: '0 4px 20px rgba(20,20,15,0.09)' },
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    fontSize: '0.875rem',
    flexShrink: 0,
    fontWeight: 700,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  userName: {
    fontWeight: 700,
    fontSize: '0.9rem',
    color: colors.ink,
    lineHeight: 1.25,
  },
  userSub: {
    fontSize: '0.72rem',
    color: colors.ink3,
    fontWeight: 500,
    lineHeight: 1.3,
  },
  mutualChip: {
    display: 'inline-block',
    fontSize: '0.68rem',
    fontWeight: 600,
    color: colors.mossDeep,
    backgroundColor: colors.mossSoft,
    borderRadius: 8,
    padding: '1px 7px',
    marginTop: 2,
  },
  content: {
    fontSize: '0.9rem',
    lineHeight: 1.65,
    color: colors.ink,
    marginBottom: '14px',
    whiteSpace: 'pre-wrap',
  },
  divider: {
    height: 1,
    backgroundColor: colors.lineSoft,
    margin: '0 -2px 2px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 2,
  },
  actionBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    fontSize: '0.78rem',
    fontWeight: 600,
    color: colors.ink3,
    cursor: 'pointer',
    padding: '7px 4px',
    borderRadius: 10,
    userSelect: 'none',
    transition: 'all 0.18s ease',
    '&:hover': {
      backgroundColor: colors.mossSoft,
      color: colors.moss,
    },
    '&:active': { transform: 'scale(0.96)' },
  },
  actionBtnActive: {
    color: colors.moss,
  },
  actionIcon: {
    fontSize: '1rem !important',
  },
  moreBtn: {
    color: colors.ink4,
    width: 30,
    height: 30,
    borderRadius: 8,
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: colors.lineSoft, color: colors.ink },
  },
  // Reply section
  replySection: {
    marginTop: '14px',
    paddingTop: '14px',
    borderTop: `1px solid ${colors.line}`,
  },
  replyInputRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  replyAvatar: {
    width: 32,
    height: 32,
    fontSize: '0.72rem',
    background: `linear-gradient(135deg, ${colors.moss} 0%, ${colors.mossDeep} 100%)`,
    flexShrink: 0,
    marginTop: 4,
    fontWeight: 700,
  },
  replyInput: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      fontSize: '0.82rem',
      borderRadius: 12,
      backgroundColor: colors.lineSoft,
      '& fieldset': { borderColor: 'transparent' },
      '&:hover fieldset': { borderColor: `${colors.moss}40` },
      '&.Mui-focused fieldset': { borderColor: colors.moss, borderWidth: 1.5 },
    },
  },
  postBtn: {
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.78rem',
    height: 34,
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 4,
    flexShrink: 0,
  },
  replyItem: {
    display: 'flex',
    gap: 10,
    marginBottom: 10,
    animation: 'fadeSlideUp 0.25s ease both',
  },
  replyBubble: {
    flex: 1,
    backgroundColor: colors.lineSoft,
    borderRadius: '0 14px 14px 14px',
    padding: '9px 13px',
  },
  replyMeta: {
    fontSize: '0.68rem',
    color: colors.ink3,
    marginBottom: 3,
    fontWeight: 500,
  },
  replyContent: {
    fontSize: '0.82rem',
    color: colors.ink,
    lineHeight: 1.5,
  },
}))

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { classes, cx } = useStyles()
  const { user } = useAuth()
  const [showReplies, setShowReplies] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const createCommentMutation = useCreateComment(post.id)
  const likeMutation = useLikePost()
  const deleteMutation = useDeletePost()
  const deleteCommentMutation = useDeleteComment(post.id)

  const { data: comments = [], isLoading: loadingComments } = useComments(
    showReplies ? post.id : '',
  )

  const isOwnPost = user?.id === post.userId
  const av = avatarColor(post.userId || post.id)

  // Combine title + description as single readable content
  const contentText = post.title && post.description
    ? `${post.title}\n\n${post.description}`
    : post.title || post.description || ''

  // Parse designation: "Location · Institution" format
  const designation = post.userDesignation ?? ''

  const handleComment = () => {
    const trimmed = replyText.trim()
    if (!trimmed) return
    createCommentMutation.mutate({ content: trimmed }, { onSuccess: () => setReplyText('') })
  }

  const handleLike = () => likeMutation.mutate({ postId: post.id, hasLiked: post.hasLiked })

  const handleDeletePost = () => {
    setMenuAnchor(null)
    deleteMutation.mutate(post.id)
  }

  return (
    <Box className={classes.root}>

      {/* Header */}
      <Box className={classes.header}>
        <Box className={classes.headerLeft}>
          <Avatar
            className={classes.avatar}
            src={post.userAvatarUrl ?? undefined}
            sx={{ bgcolor: av.bg, color: av.fg }}
          >
            {getInitials(post.userName)}
          </Avatar>
          <Box className={classes.userInfo}>
            <Typography className={classes.userName}>{post.userName}</Typography>
            {designation ? (
              <Typography className={classes.userSub}>{designation}</Typography>
            ) : (
              <Typography className={classes.userSub}>{formatRelativeTime(post.createdAt)}</Typography>
            )}
            {post.mutualCount != null && post.mutualCount > 0 && (
              <Box component="span" className={classes.mutualChip}>
                {post.mutualCount} Mutuals
              </Box>
            )}
          </Box>
        </Box>

        {isOwnPost ? (
          <>
            <IconButton
              size="small"
              className={classes.moreBtn}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              aria-label="post options"
            >
              <MoreHorizIcon sx={{ fontSize: '1.1rem' }} />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              PaperProps={{ sx: { borderRadius: 2, minWidth: 148 } }}
            >
              <MenuItem
                onClick={handleDeletePost}
                disabled={deleteMutation.isPending}
                sx={{ fontSize: '0.85rem', color: colors.urgent, gap: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 'auto', color: 'inherit' }}>
                  <DeleteOutlineIcon sx={{ fontSize: '1.1rem' }} />
                </ListItemIcon>
                Delete post
              </MenuItem>
            </Menu>
          </>
        ) : (
          <IconButton size="small" className={classes.moreBtn}>
            <MoreHorizIcon sx={{ fontSize: '1.1rem' }} />
          </IconButton>
        )}
      </Box>

      {/* Content — combined title + description as single readable block */}
      <Typography className={classes.content}>{contentText}</Typography>

      {/* Divider */}
      <Box className={classes.divider} />

      {/* Action row: Like | Comment | Upvote */}
      <Box className={classes.actions}>

        {/* Like */}
        <Box
          className={cx(classes.actionBtn, { [classes.actionBtnActive]: post.hasLiked })}
          onClick={handleLike}
          role="button"
          aria-label="like"
        >
          {post.hasLiked
            ? <ThumbUpIcon className={classes.actionIcon} />
            : <ThumbUpOutlinedIcon className={classes.actionIcon} />}
          <span>{post.likes > 0 ? `Like ${post.likes}` : 'Like'}</span>
        </Box>

        {/* Comment */}
        <Box
          className={classes.actionBtn}
          onClick={() => setShowReplies((prev) => !prev)}
          role="button"
          aria-label="comment"
        >
          <ChatBubbleOutlineIcon className={classes.actionIcon} />
          <span>{post.commentCount > 0 ? `Comment ${post.commentCount}` : 'Comment'}</span>
        </Box>

        {/* Upvote */}
        <Box
          className={cx(classes.actionBtn, { [classes.actionBtnActive]: post.hasLiked })}
          onClick={handleLike}
          role="button"
          aria-label="upvote"
        >
          <KeyboardDoubleArrowUpIcon className={classes.actionIcon} />
          <span>{post.likes > 0 ? `Upvote ${post.likes}` : 'Upvote'}</span>
        </Box>
      </Box>

      {/* Replies section */}
      <Collapse in={showReplies}>
        <Box className={classes.replySection}>
          <Box className={classes.replyInputRow}>
            <Avatar className={classes.replyAvatar} src={user?.avatarUrl ?? undefined}>{getInitials(user?.name ?? 'U')}</Avatar>
            <TextField
              className={classes.replyInput}
              placeholder="Write a reply..."
              multiline
              maxRows={3}
              size="small"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            {replyText.trim() && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.postBtn}
                onClick={handleComment}
                disabled={createCommentMutation.isPending}
              >
                Reply
              </Button>
            )}
          </Box>

          {loadingComments ? (
            <Typography sx={{ fontSize: '0.78rem', color: colors.ink3, pl: 1 }}>
              Loading…
            </Typography>
          ) : (
            comments.map((comment) => {
              const cav = avatarColor(comment.userId || comment.id)
              return (
                <Box key={comment.id} className={classes.replyItem}>
                  <Avatar
                    className={classes.replyAvatar}
                    src={comment.userAvatarUrl ?? undefined}
                    sx={{ bgcolor: cav.bg, color: cav.fg }}
                  >
                    {getInitials(comment.userName)}
                  </Avatar>
                  <Box className={classes.replyBubble}>
                    <Typography className={classes.replyMeta}>
                      <strong>{comment.userName}</strong> · {formatRelativeTime(comment.createdAt)}
                    </Typography>
                    <Typography className={classes.replyContent}>{comment.content}</Typography>
                    {comment.userId === user?.id && (
                      <Typography
                        onClick={() => deleteCommentMutation.mutate(comment.id)}
                        sx={{ fontSize: '0.68rem', color: colors.urgent, cursor: 'pointer', mt: '4px', display: 'inline-block' }}
                      >
                        Delete
                      </Typography>
                    )}
                  </Box>
                </Box>
              )
            })
          )}
        </Box>
      </Collapse>
    </Box>
  )
}

export default PostCard
