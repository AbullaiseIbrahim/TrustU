import React, { useState } from 'react'
import {
  Box, Typography, Avatar, TextField, Button,
  Collapse, IconButton, Menu, MenuItem, ListItemIcon,
} from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { makeStyles } from 'tss-react/mui'
import { getInitials, formatRelativeTime } from '@/utils'
import type { Post } from '@/types/post.types'
import { useCreateReply, useReplies, useUpvotePost, useDeletePost } from '../hooks/usePostQueries'
import { useAuth } from '@/app/AuthProvider'
import colors from '@/theme/colors'

interface PostCardProps {
  post: Post
}

const useStyles = makeStyles()(() => ({
  root: {
    backgroundColor: colors.white,
    borderRadius: 18,
    margin: '0 0 10px',
    padding: '16px',
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
    width: 40,
    height: 40,
    fontSize: '0.875rem',
    background: `linear-gradient(135deg, ${colors.moss} 0%, ${colors.mossDeep} 100%)`,
    flexShrink: 0,
    fontWeight: 700,
    boxShadow: `0 2px 8px rgba(14,107,63,0.22)`,
  },
  userName: {
    fontWeight: 700,
    fontSize: '0.875rem',
    color: colors.ink,
    lineHeight: 1.3,
  },
  meta: {
    fontSize: '0.7rem',
    color: colors.ink3,
    marginTop: 1,
    fontWeight: 500,
  },
  postTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: colors.ink,
    lineHeight: 1.4,
    marginBottom: 5,
    letterSpacing: '-0.2px',
  },
  content: {
    fontSize: '0.845rem',
    lineHeight: 1.65,
    color: colors.ink,
    marginBottom: '14px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.76rem',
    fontWeight: 600,
    color: colors.ink3,
    cursor: 'pointer',
    padding: '5px 10px',
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
    backgroundColor: colors.mossSoft,
  },
  actionIcon: {
    fontSize: '0.9rem !important',
  },
  shareBtn: {
    marginLeft: 'auto',
  },
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
  moreBtn: {
    color: colors.ink4,
    width: 30,
    height: 30,
    borderRadius: 8,
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: colors.lineSoft, color: colors.ink },
  },
}))

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { classes, cx } = useStyles()
  const { user } = useAuth()
  const [showReplies, setShowReplies] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const createReplyMutation = useCreateReply(post.id)
  const upvoteMutation = useUpvotePost()
  const deleteMutation = useDeletePost()

  const { data: replies = [], isLoading: loadingReplies } = useReplies(
    showReplies ? post.id : '',
  )

  const isOwnPost = user?.id === post.userId

  const handleReply = () => {
    const trimmed = replyText.trim()
    if (!trimmed) return
    createReplyMutation.mutate({ content: trimmed }, { onSuccess: () => setReplyText('') })
  }

  const handleUpvote = () => upvoteMutation.mutate(post.id)

  const handleDeletePost = () => {
    setMenuAnchor(null)
    deleteMutation.mutate(post.id)
  }

  return (
    <Box className={classes.root}>

      {/* Header */}
      <Box className={classes.header}>
        <Box className={classes.headerLeft}>
          <Avatar className={classes.avatar}>{getInitials(post.userName)}</Avatar>
          <Box>
            <Typography className={classes.userName}>{post.userName}</Typography>
            <Typography className={classes.meta}>
              {post.userDesignation} · {formatRelativeTime(post.createdAt)}
            </Typography>
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

      {/* Title + Description */}
      <Typography className={classes.postTitle}>{post.title}</Typography>
      <Typography className={classes.content}>{post.description}</Typography>

      {/* Actions: heart | comment | upvote | share */}
      <Box className={classes.actions}>

        {/* Heart (maps to upvote API) */}
        <Box
          className={cx(classes.actionBtn, { [classes.actionBtnActive]: post.hasUpvoted })}
          onClick={handleUpvote}
          role="button"
          aria-label="like"
        >
          {post.hasUpvoted
            ? <FavoriteIcon className={classes.actionIcon} />
            : <FavoriteBorderIcon className={classes.actionIcon} />}
          <span>{post.upvotes > 0 ? post.upvotes : ''}</span>
        </Box>

        {/* Comment */}
        <Box
          className={classes.actionBtn}
          onClick={() => setShowReplies((prev) => !prev)}
          role="button"
          aria-label="comments"
        >
          <ChatBubbleOutlineIcon className={classes.actionIcon} />
          <span>{post.replyCount > 0 ? post.replyCount : ''}</span>
        </Box>

        {/* Upvote */}
        <Box
          className={cx(classes.actionBtn, { [classes.actionBtnActive]: post.hasUpvoted })}
          onClick={handleUpvote}
          role="button"
          aria-label="upvote"
        >
          {post.hasUpvoted
            ? <ThumbUpIcon className={classes.actionIcon} />
            : <ThumbUpOutlinedIcon className={classes.actionIcon} />}
          <span>{post.upvotes > 0 ? post.upvotes : 'Helpful'}</span>
        </Box>

        {/* Share (non-functional) */}
        <Box className={cx(classes.actionBtn, classes.shareBtn)} role="button" aria-label="share">
          <ShareOutlinedIcon className={classes.actionIcon} />
        </Box>
      </Box>

      {/* Replies section */}
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
            {replyText.trim() && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.postBtn}
                onClick={handleReply}
                disabled={createReplyMutation.isPending}
              >
                Reply
              </Button>
            )}
          </Box>

          {loadingReplies ? (
            <Typography sx={{ fontSize: '0.78rem', color: colors.ink3, pl: 1 }}>
              Loading…
            </Typography>
          ) : (
            replies.map((reply) => (
              <Box key={reply.id} className={classes.replyItem}>
                <Avatar className={classes.replyAvatar}>{getInitials(reply.userName)}</Avatar>
                <Box className={classes.replyBubble}>
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
