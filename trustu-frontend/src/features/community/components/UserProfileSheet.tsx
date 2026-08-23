import React, { useEffect, useState } from 'react'
import { Dialog, Box, Typography, IconButton, Avatar, CircularProgress, Slide } from '@mui/material'
import type { TransitionProps } from '@mui/material/transitions'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { makeStyles } from 'tss-react/mui'
import colors from '@/theme/colors'
import { getInitials } from '@/utils'
import { useMutualFriends } from '@/features/circle/hooks/useFriendshipQueries'

const SlideUp = React.forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} easing={{ enter: 'cubic-bezier(0.32, 0.72, 0, 1)', exit: 'cubic-bezier(0.4, 0, 0.6, 1)' }} />
})

const useStyles = makeStyles()(() => ({
  paper: {
    borderRadius: '24px 24px 0 0 !important',
    width: '100% !important',
    maxWidth: '480px !important',
    margin: '0 !important',
    position: 'fixed !important' as 'fixed',
    bottom: '0 !important',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#D8D8D8',
    margin: '12px auto 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '8px 12px 0',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    color: colors.ink3,
    '&:hover': { backgroundColor: colors.cream },
  },
  body: {
    padding: '0 24px 28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  avatar: {
    width: 76,
    height: 76,
    fontSize: '1.6rem',
    fontWeight: 700,
    marginBottom: 12,
  },
  name: {
    fontWeight: 800,
    fontSize: '1.15rem',
    color: colors.ink,
  },
  designation: {
    fontSize: '0.82rem',
    color: colors.ink3,
    marginTop: 2,
  },
  communityRow: {
    fontSize: '0.78rem',
    color: colors.ink4,
    marginTop: 4,
  },
  mutualRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    padding: '7px 14px',
    borderRadius: 20,
    backgroundColor: colors.cream,
    color: colors.ink2,
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  actionRow: {
    display: 'flex',
    gap: 10,
    marginTop: 20,
    width: '100%',
  },
  addBtn: {
    flex: 1,
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.85rem',
    borderRadius: 12,
    padding: '11px 0',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    backgroundColor: colors.moss,
    color: '#fff',
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: colors.mossDeep },
    '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
  },
  neutralBtn: {
    flex: 1,
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.85rem',
    borderRadius: 12,
    padding: '11px 0',
    border: `1.5px solid ${colors.line}`,
    cursor: 'default',
    fontFamily: 'inherit',
    backgroundColor: colors.white,
    color: colors.ink3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
}))

export interface ProfileSheetUser {
  userId: string
  name: string
  designation?: string | null
  avatarUrl?: string | null
  communityName?: string | null
}

interface Props {
  open: boolean
  onClose: () => void
  user: ProfileSheetUser | null
  friendStatus: 'friends' | 'requested' | 'none'
  onAddFriend?: () => void
  isAdding?: boolean
}

const UserProfileSheet: React.FC<Props> = ({ open, onClose, user, friendStatus, onAddFriend, isAdding }) => {
  const { classes } = useStyles()

  // Callers null out `user` the same tick `open` flips to false (setState(null)
  // doubles as both "close" and "clear"). Retaining the last non-null user lets
  // the sheet's content stay put while MUI's Slide exit transition plays,
  // instead of the whole dialog vanishing instantly mid-animation.
  const [lastUser, setLastUser] = useState<ProfileSheetUser | null>(null)
  useEffect(() => { if (user) setLastUser(user) }, [user])
  const displayUser = user ?? lastUser

  const { data: mutuals = [], isLoading } = useMutualFriends(displayUser?.userId ?? '')

  if (!displayUser) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={SlideUp}
      transitionDuration={{ enter: 320, exit: 260 }}
      PaperProps={{ className: classes.paper }}
      sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
    >
      <Box className={classes.handle} />
      <Box className={classes.header}>
        <IconButton size="small" className={classes.closeBtn} onClick={onClose}>
          <CloseIcon sx={{ fontSize: '1.1rem' }} />
        </IconButton>
      </Box>

      <Box className={classes.body}>
        <Avatar src={displayUser.avatarUrl ?? undefined} className={classes.avatar} sx={{ bgcolor: colors.mossSoft, color: colors.moss }}>
          {getInitials(displayUser.name)}
        </Avatar>
        <Typography className={classes.name}>{displayUser.name}</Typography>
        {displayUser.designation && <Typography className={classes.designation}>{displayUser.designation}</Typography>}
        {displayUser.communityName && <Typography className={classes.communityRow}>{displayUser.communityName}</Typography>}

        {isLoading ? (
          <CircularProgress size={18} sx={{ color: colors.moss, mt: 2 }} />
        ) : (
          <Box className={classes.mutualRow}>
            <PeopleAltOutlinedIcon sx={{ fontSize: '0.9rem' }} />
            {mutuals.length > 0 ? `${mutuals.length} mutual friends` : 'No mutual friends yet'}
          </Box>
        )}

        <Box className={classes.actionRow}>
          {friendStatus === 'friends' ? (
            <Box className={classes.neutralBtn}>
              <CheckIcon sx={{ fontSize: '0.9rem', color: colors.moss }} />
              Friends
            </Box>
          ) : friendStatus === 'requested' ? (
            <Box className={classes.neutralBtn}>Request Sent</Box>
          ) : (
            <button className={classes.addBtn} onClick={onAddFriend} disabled={isAdding}>
              Add Friend
            </button>
          )}
        </Box>
      </Box>
    </Dialog>
  )
}

export default UserProfileSheet
