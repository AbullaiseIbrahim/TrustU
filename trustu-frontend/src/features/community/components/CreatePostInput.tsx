import React, { useState } from 'react'
import { Box, TextField, Button, Avatar, CircularProgress } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { useAuth } from '@/app/AuthProvider'
import { useCreatePost } from '../hooks/usePostQueries'
import { getInitials } from '@/utils'
import colors from '@/theme/colors'

const useStyles = makeStyles()(() => ({
  root: {
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.divider}`,
    padding: '16px',
    marginBottom: '12px',
  },
  inputRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 38,
    height: 38,
    fontSize: '0.875rem',
    backgroundColor: colors.primary,
    flexShrink: 0,
    marginTop: 4,
  },
  inputWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: colors.bgMint,
      borderRadius: '10px',
      fontSize: '0.875rem',
    },
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  postButton: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.85rem',
    height: 34,
    borderRadius: '8px',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

const CreatePostInput: React.FC = () => {
  const { classes } = useStyles()
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const createPost = useCreatePost()

  const handlePost = () => {
    const trimmed = content.trim()
    if (!trimmed) return
    createPost.mutate({ content: trimmed }, { onSuccess: () => setContent('') })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePost()
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.inputRow}>
        <Avatar className={classes.avatar}>{getInitials(user?.name ?? 'U')}</Avatar>
        <Box className={classes.inputWrapper}>
          <TextField
            className={classes.textField}
            placeholder="Ask any query to your community..."
            multiline
            minRows={1}
            maxRows={4}
            fullWidth
            size="small"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {content.trim() && (
            <Box className={classes.actionRow}>
              <Button
                variant="contained"
                color="primary"
                className={classes.postButton}
                onClick={handlePost}
                disabled={createPost.isPending}
              >
                {createPost.isPending ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  'Post Query'
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default CreatePostInput
