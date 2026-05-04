import React, { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchIcon from '@mui/icons-material/Search'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { makeStyles } from 'tss-react/mui'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'
import { PATHS } from '@/routes/paths'
import { getInitials } from '@/utils'
import colors from '@/theme/colors'
import {
  useFriends,
  usePendingRequests,
  useSendFriendRequest,
  useAcceptRequest,
  useRejectRequest,
  useRemoveFriend,
} from '../hooks/useFriendshipQueries'
import type { Friend, PendingRequest } from '@/services/friendship.api'

// ── Styles ────────────────────────────────────────────────────────────────────

const useStyles = makeStyles()(() => ({
  page: {
    minHeight: '100vh',
    backgroundColor: colors.bgMint,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.divider}`,
  },
  headerInner: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 12px',
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    overflow: 'hidden',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerBtn: {
    textTransform: 'none',
    fontSize: '0.85rem',
    color: colors.textSecondary,
    fontWeight: 500,
    padding: '4px 8px',
    minWidth: 'auto',
    '&:hover': {
      color: colors.textPrimary,
      backgroundColor: colors.actionHover,
    },
  },

  // ── Page content ─────────────────────────────────────────────────────────────
  content: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    '@media (max-width:600px)': {
      padding: '16px 12px',
      gap: 16,
    },
  },

  // ── Section card ─────────────────────────────────────────────────────────────
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    border: `1px solid ${colors.divider}`,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 20px 14px',
    '@media (max-width:600px)': {
      padding: '14px 14px 12px',
    },
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    backgroundColor: colors.grey100,
    borderRadius: '50%',
    width: 26,
    height: 26,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  searchWrapper: {
    padding: '0 20px 16px',
    '@media (max-width:600px)': {
      padding: '0 14px 14px',
    },
  },

  // ── Member / friend grid ──────────────────────────────────────────────────────
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 14,
    padding: '0 20px 20px',
    '@media (max-width:960px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width:600px)': {
      gridTemplateColumns: '1fr',
      padding: '0 14px 14px',
      gap: 12,
    },
  },

  // ── Card ──────────────────────────────────────────────────────────────────────
  card: {
    border: `1px solid ${colors.divider}`,
    borderRadius: 10,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    backgroundColor: colors.white,
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
  memberAvatar: {
    width: 46,
    height: 46,
    fontSize: '1rem',
    backgroundColor: colors.primary,
    flexShrink: 0,
  },
  memberInfo: {
    flex: 1,
    minWidth: 0,
  },
  memberName: {
    fontWeight: 600,
    fontSize: '0.88rem',
    lineHeight: 1.3,
    color: colors.textPrimary,
  },
  memberDesignation: {
    fontSize: '0.78rem',
    color: colors.textSecondary,
    lineHeight: 1.4,
    marginTop: 1,
  },
  communityRow: {
    fontSize: '0.75rem',
    color: colors.textSecondary,
    lineHeight: 1.4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // Buttons
  connectBtn: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.8rem',
    backgroundColor: colors.textPrimary,
    color: colors.white,
    borderRadius: 8,
    marginTop: 6,
    '&:hover': { backgroundColor: '#333333' },
    '&:disabled': { backgroundColor: colors.grey100, color: colors.textSecondary },
  },
  connectionActions: {
    display: 'flex',
    gap: 8,
    marginTop: 6,
  },
  acceptBtn: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.8rem',
    flex: 1,
    borderRadius: 8,
    backgroundColor: colors.primary,
    color: colors.white,
    '&:hover': { backgroundColor: colors.primaryDark },
  },
  rejectBtn: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.8rem',
    flex: 1,
    borderRadius: 8,
    color: colors.textSecondary,
    borderColor: colors.divider,
    '&:hover': { borderColor: colors.textSecondary, backgroundColor: colors.actionHover },
  },
  removeBtn: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.8rem',
    flex: 1,
    borderRadius: 8,
    backgroundColor: colors.error,
    color: colors.white,
    '&:hover': { backgroundColor: '#b71c1c' },
  },
}))

// ── Empty placeholder ─────────────────────────────────────────────────────────
const EmptySection: React.FC<{ message: string }> = ({ message }) => (
  <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 5 }}>
    <Typography sx={{ color: colors.textSecondary, fontSize: '0.875rem' }}>{message}</Typography>
  </Box>
)

// ── Component ─────────────────────────────────────────────────────────────────
const CirclePage: React.FC = () => {
  const { classes } = useStyles()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width:600px)')

  const communityName = user?.communityName ?? 'Your Community'

  const [search, setSearch] = useState('')
  const [sendingTo, setSendingTo] = useState<string | null>(null)

  // ── API hooks ────────────────────────────────────────────────────────────────
  const { data: friends = [],  isLoading: loadingFriends  } = useFriends()
  const { data: pending = [],  isLoading: loadingPending  } = usePendingRequests()
  const sendRequestMutation  = useSendFriendRequest()
  const acceptMutation       = useAcceptRequest()
  const rejectMutation       = useRejectRequest()
  const removeMutation       = useRemoveFriend()

  // ── Filtered friends list (client-side search) ────────────────────────────
  const filteredFriends = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return friends
    return friends.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.designation ?? '').toLowerCase().includes(q) ||
        (f.communityName ?? '').toLowerCase().includes(q),
    )
  }, [friends, search])

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSendRequest = (userId: string) => {
    setSendingTo(userId)
    sendRequestMutation.mutate(userId, { onSettled: () => setSendingTo(null) })
  }

  const handleAccept = (requestId: string) => acceptMutation.mutate(requestId)
  const handleReject = (requestId: string) => rejectMutation.mutate(requestId)
  const handleRemove = (userId: string) => removeMutation.mutate(userId)

  // ── Sub-components ────────────────────────────────────────────────────────────
  const FriendCard: React.FC<{ friend: Friend }> = ({ friend }) => (
    <Box className={classes.card}>
      <Box className={classes.cardTop}>
        <Avatar className={classes.memberAvatar}>{getInitials(friend.name)}</Avatar>
        <Box className={classes.memberInfo}>
          <Typography className={classes.memberName}>{friend.name}</Typography>
          {friend.designation && (
            <Typography className={classes.memberDesignation}>{friend.designation}</Typography>
          )}
        </Box>
      </Box>
      {friend.communityName && (
        <Typography className={classes.communityRow}>{friend.communityName}</Typography>
      )}
      <Box className={classes.connectionActions}>
        <Button
          variant="contained"
          disableElevation
          className={classes.removeBtn}
          onClick={() => handleRemove(friend.userId)}
          disabled={removeMutation.isPending}
        >
          Remove
        </Button>
      </Box>
    </Box>
  )

  const PendingCard: React.FC<{ req: PendingRequest }> = ({ req }) => (
    <Box className={classes.card}>
      <Box className={classes.cardTop}>
        <Avatar className={classes.memberAvatar}>{getInitials(req.name)}</Avatar>
        <Box className={classes.memberInfo}>
          <Typography className={classes.memberName}>{req.name}</Typography>
          {req.designation && (
            <Typography className={classes.memberDesignation}>{req.designation}</Typography>
          )}
        </Box>
      </Box>
      {req.communityName && (
        <Typography className={classes.communityRow}>{req.communityName}</Typography>
      )}
      <Box className={classes.connectionActions}>
        <Button
          variant="contained"
          disableElevation
          className={classes.acceptBtn}
          startIcon={<CheckIcon sx={{ fontSize: '0.9rem !important' }} />}
          onClick={() => handleAccept(req.id)}
          disabled={acceptMutation.isPending}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          className={classes.rejectBtn}
          startIcon={<CloseIcon sx={{ fontSize: '0.9rem !important' }} />}
          onClick={() => handleReject(req.id)}
          disabled={rejectMutation.isPending}
        >
          Ignore
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box className={classes.page}>

      {/* ── Sticky header ── */}
      <Box className={classes.header}>
        <Box className={classes.headerInner}>

          <Box className={classes.headerLeft}>
            <Button
              className={classes.headerBtn}
              startIcon={<ArrowBackIcon sx={{ fontSize: '1rem !important' }} />}
              onClick={() => navigate(PATHS.dashboard.community)}
            >
              {!isMobile && 'Back to Feed'}
            </Button>
          </Box>

          <Box className={classes.headerCenter}>
            <Box className={classes.logoCircle}>
              <svg width={18} height={14} viewBox="0 0 36 28" fill="none" aria-hidden="true">
                <circle cx="9" cy="8" r="5" fill="white" />
                <path d="M0 26C0 21.029 4.029 17 9 17C11.09 17 13.02 17.716 14.55 18.92" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="27" cy="8" r="5" fill="white" />
                <path d="M36 26C36 21.029 31.971 17 27 17C24.91 17 22.98 17.716 21.45 18.92" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="18" cy="7" r="5.5" fill="white" />
                <path d="M8 27C8 21.477 12.477 17 18 17C23.523 17 28 21.477 28 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2, color: colors.textPrimary }}>
                My Circle
              </Typography>
              <Typography sx={{
                fontSize: '0.68rem', color: colors.textSecondary, lineHeight: 1.2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160,
              }}>
                {communityName}
              </Typography>
            </Box>
          </Box>

          <Box className={classes.headerRight}>
            <Button
              className={classes.headerBtn}
              startIcon={<SettingsOutlinedIcon sx={{ fontSize: '1rem !important' }} />}
              onClick={() => navigate(PATHS.profile)}
            >
              {!isMobile && 'My Profile'}
            </Button>
          </Box>

        </Box>
      </Box>

      {/* ── Page content ── */}
      <Box className={classes.content}>

        {/* ── Pending Requests section — only shown when there are pending requests ── */}
        {(loadingPending || pending.length > 0) && (
          <Box className={classes.section}>
            <Box className={classes.sectionHeader}>
              <Box className={classes.sectionTitle}>
                <PersonAddOutlinedIcon sx={{ fontSize: '1.1rem', color: colors.textPrimary }} />
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: colors.textPrimary }}>
                  Friend Requests
                </Typography>
                <Box className={classes.countBadge}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: colors.textSecondary }}>
                    {pending.length}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className={classes.grid}>
              {loadingPending ? (
                <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : (
                pending.map(req => <PendingCard key={req.id} req={req} />)
              )}
            </Box>
          </Box>
        )}

        {/* ── My Connections section ── */}
        <Box className={classes.section}>
          <Box className={classes.sectionHeader}>
            <Box className={classes.sectionTitle}>
              <PeopleAltOutlinedIcon sx={{ fontSize: '1.1rem', color: colors.textPrimary }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: colors.textPrimary }}>
                My Connections
              </Typography>
              <Box className={classes.countBadge}>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: colors.textSecondary }}>
                  {friends.length}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Search */}
          <Box className={classes.searchWrapper}>
            <TextField
              fullWidth size="small"
              placeholder="Search connections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: colors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }}
            />
          </Box>

          <Box className={classes.grid}>
            {loadingFriends ? (
              <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={28} />
              </Box>
            ) : filteredFriends.length === 0 ? (
              <EmptySection
                message={
                  search.trim()
                    ? `No connections found for "${search}".`
                    : 'No connections yet. Send a friend request to someone!'
                }
              />
            ) : (
              filteredFriends.map(friend => <FriendCard key={friend.id} friend={friend} />)
            )}
          </Box>
        </Box>

        {/* ── Find People — send requests by user ID ── */}
        <Box className={classes.section}>
          <Box className={classes.sectionHeader}>
            <Box className={classes.sectionTitle}>
              <PersonAddOutlinedIcon sx={{ fontSize: '1.1rem', color: colors.textPrimary }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: colors.textPrimary }}>
                Send Friend Request
              </Typography>
            </Box>
          </Box>

          <SendRequestForm
            onSend={handleSendRequest}
            isSending={sendRequestMutation.isPending}
            sendingTo={sendingTo}
          />
        </Box>

      </Box>
    </Box>
  )
}

// ── Send Request Form ─────────────────────────────────────────────────────────
interface SendFormProps {
  onSend: (userId: string) => void
  isSending: boolean
  sendingTo: string | null
}

const SendRequestForm: React.FC<SendFormProps> = ({ onSend, isSending, sendingTo }) => {
  const [userId, setUserId] = useState('')

  const handleSend = () => {
    const trimmed = userId.trim()
    if (!trimmed) return
    onSend(trimmed)
    setUserId('')
  }

  return (
    <Box sx={{ px: { xs: '14px', sm: '20px' }, pb: { xs: '14px', sm: '20px' } }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small" fullWidth
          placeholder="Enter user ID to send a request"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }}
        />
        <Button
          variant="contained" disableElevation
          onClick={handleSend}
          disabled={!userId.trim() || (isSending && sendingTo === userId.trim())}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2.5, flexShrink: 0 }}
        >
          {isSending ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Send'}
        </Button>
      </Box>
      <Typography sx={{ fontSize: '0.72rem', color: colors.textSecondary, mt: 0.75 }}>
        Ask your friend for their user ID to connect with them.
      </Typography>
    </Box>
  )
}

export default CirclePage
