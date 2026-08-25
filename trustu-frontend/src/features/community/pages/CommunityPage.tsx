import React, { useState } from 'react'
import { Box, Typography, Avatar } from '@mui/material'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import { makeStyles } from 'tss-react/mui'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import CreatePostInput from '../components/CreatePostInput'
import PostCard from '../components/PostCard'
import { usePosts } from '../hooks/usePostQueries'
import ContentSkeleton from '@/components/ContentSkeleton'
import EmptyState from '@/components/EmptyState'
import { useAuth } from '@/app/AuthProvider'
import {
  useFriends,
  usePendingRequests,
  useAcceptRequest,
  useRejectRequest,
  useRemoveFriend,
  useSendFriendRequest,
  useCancelFriendRequest,
  useMutualFriendsAggregate,
} from '@/features/circle/hooks/useFriendshipQueries'
import type { Friend, PendingRequest } from '@/services/friendship.api'
import UserProfileSheet, { type ProfileSheetUser } from '../components/UserProfileSheet'
import { useCommunityMembers, useCommunity } from '../hooks/useCommunityQueries'
import type { CommunityMember } from '@/types/community.types'
import { getInitials } from '@/utils'
import colors from '@/theme/colors'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

type Tab = 'feed' | 'members' | 'friends' | 'mutual'

// ── Avatar color palette (cycled by id hash, like the reference design) ────────
const AVATAR_PALETTE = [
  { bg: '#FBE3D0', fg: '#C9762E' },
  { bg: '#DCEAFE', fg: '#3B6FB6' },
  { bg: '#F6DDEB', fg: '#B0568E' },
  { bg: '#E1EFE0', fg: '#5C8A5E' },
  { bg: '#FFF3D6', fg: '#C99A2E' },
  { bg: '#E6E1F7', fg: '#7660B8' },
]

function avatarColor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length]
}

const useStyles = makeStyles()(() => ({
  // ── Community gradient card ────────────────────────────────────────────────
  communityCard: {
    background: `linear-gradient(155deg, #1a7a4a 0%, ${colors.mossDeep} 100%)`,
    borderRadius: 20,
    margin: '4px 16px 14px',
    padding: '20px 18px 16px',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    animation: 'fadeSlideUp 0.3s ease both',
    boxShadow: `0 8px 28px rgba(14,107,63,0.30)`,
  },
  leafDecor: {
    position: 'absolute',
    right: -30,
    top: -30,
    opacity: 0.1,
    pointerEvents: 'none',
  },
  communityName: {
    fontWeight: 800,
    fontSize: '1.45rem',
    letterSpacing: '-0.5px',
    lineHeight: 1.15,
    marginBottom: 10,
    color: '#fff',
  },
  membersPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    padding: '5px 12px',
    marginBottom: 8,
  },
  membersPillText: {
    fontWeight: 700,
    fontSize: '0.82rem',
    color: '#fff',
    lineHeight: 1,
  },
  friendsLine: {
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.80)',
    fontWeight: 500,
    marginBottom: 10,
    lineHeight: 1.4,
  },
  subCommLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: '5px 12px',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.20)',
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' },
  },
  subCommText: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#fff',
  },
  avatarStack: {
    display: 'flex',
    marginBottom: 8,
  },
  stackAvatar: {
    width: 26,
    height: 26,
    fontSize: '0.58rem',
    fontWeight: 700,
    border: '2px solid rgba(255,255,255,0.7)',
    marginLeft: -6,
    '&:first-of-type': { marginLeft: 0 },
    background: 'rgba(255,255,255,0.25)',
    color: '#fff',
  },

  // ── Tab bar ────────────────────────────────────────────────────────────────
  tabBar: {
    display: 'flex',
    gap: 6,
    padding: '2px 16px 12px',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  tabBtn: {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    border: 'none',
    background: 'transparent',
    color: colors.ink3,
    transition: 'all 0.18s ease',
    fontFamily: 'inherit',
  },
  tabBtnActive: {
    background: colors.ink,
    color: '#fff',
  },
  tabBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 16,
    height: 16,
    padding: '0 4px',
    marginLeft: 6,
    borderRadius: 8,
    fontSize: '0.6rem',
    fontWeight: 700,
    lineHeight: 1,
    background: colors.error,
    color: '#fff',
    verticalAlign: 'middle',
  },

  // ── Friends horizontal scroll ──────────────────────────────────────────────
  friendsScroll: {
    display: 'flex',
    gap: 12,
    padding: '0 16px 12px',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  friendItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  friendAvatarWrap: {
    position: 'relative',
  },
  friendAvatar: {
    width: 44,
    height: 44,
    fontSize: '0.85rem',
    fontWeight: 700,
    background: `linear-gradient(135deg, ${colors.moss}, ${colors.mossDeep})`,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: '#4ade80',
    border: '2px solid #fff',
  },
  friendName: {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: colors.ink2,
    textAlign: 'center',
    maxWidth: 44,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // ── Circle sub-tab ─────────────────────────────────────────────────────────
  circleContent: {
    padding: '0 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  circleCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 6px 22px rgba(20,20,15,0.05)',
  },
  circleCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px 10px',
  },
  circleCardTitle: {
    fontWeight: 700,
    fontSize: '0.9rem',
    color: colors.ink,
  },
  // ── List rows (Friends / Members / Requests) ────────────────────────────────
  listRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderBottom: `1px solid ${colors.lineSoft}`,
    '&:last-of-type': { borderBottom: 'none' },
  },
  personAvatar: {
    width: 46,
    height: 46,
    fontSize: '0.95rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  personInfo: {
    flex: 1,
    minWidth: 0,
  },
  personName: {
    fontWeight: 700,
    fontSize: '0.88rem',
    color: colors.ink,
    lineHeight: 1.3,
  },
  personSub: {
    fontSize: '0.74rem',
    color: colors.ink3,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  emptyRow: {
    textAlign: 'center',
    padding: '28px 16px',
    color: colors.ink3,
    fontSize: '0.85rem',
  },

  // ── Pills / row actions ───────────────────────────────────────────────────────
  addFriendPill: {
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.74rem',
    borderRadius: 10,
    backgroundColor: colors.moss,
    color: '#fff',
    '&:hover': { backgroundColor: colors.mossDeep },
    padding: '6px 14px',
    minWidth: 0,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  requestedPill: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.74rem',
    borderRadius: 10,
    color: colors.ink3,
    borderColor: colors.line,
    padding: '6px 12px',
    minWidth: 0,
    flexShrink: 0,
    gap: 4,
    whiteSpace: 'nowrap',
    '&:hover': {
      color: colors.urgent,
      borderColor: colors.urgent,
      backgroundColor: `${colors.urgent}10`,
    },
  },
  friendedPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '6px 12px',
    borderRadius: 10,
    border: `1px solid ${colors.line}`,
    fontSize: '0.74rem',
    fontWeight: 600,
    color: colors.ink3,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  removePill: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.74rem',
    borderRadius: 10,
    backgroundColor: colors.mossSoft,
    color: colors.urgent,
    '&:hover': { backgroundColor: `${colors.urgent}15` },
    padding: '6px 14px',
    minWidth: 0,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },

  // ── Friend request row (two stacked actions) ──────────────────────────────────
  requestRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '14px 16px',
    borderBottom: `1px solid ${colors.lineSoft}`,
    '&:last-of-type': { borderBottom: 'none' },
  },
  requestTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  requestActions: {
    display: 'flex',
    gap: 8,
  },
  confirmBtn: {
    flex: 1,
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.8rem',
    borderRadius: 10,
    backgroundColor: colors.moss,
    color: '#fff',
    '&:hover': { backgroundColor: colors.mossDeep },
    padding: '7px 0',
  },
  deleteBtn: {
    flex: 1,
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.8rem',
    borderRadius: 10,
    backgroundColor: colors.mossSoft,
    color: colors.ink2,
    '&:hover': { backgroundColor: colors.line },
    padding: '7px 0',
  },

  // ── Pagination ─────────────────────────────────────────────────────────────
  paginationRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: '4px 14px 14px',
  },
  pageBtn: {
    minWidth: 0,
    width: 32,
    height: 32,
    padding: 0,
    borderRadius: 8,
    color: colors.ink3,
    borderColor: colors.line,
    '&:hover': { borderColor: colors.ink3 },
    '&.Mui-disabled': { opacity: 0.4 },
  },
  pageLabel: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: colors.ink3,
  },
}))

// ── Community gradient card ────────────────────────────────────────────────────
const CommunityCard: React.FC<{
  communityName?: string | null
  friendCount: number
  memberCount: number
  subCommCount?: number
}> = ({ communityName, friendCount, memberCount, subCommCount = 0 }) => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const { data: friends = [] } = useFriends()
  const first5 = (friends as Friend[]).slice(0, 5)

  // Real mutual-friends count — aggregated via GET /friends/mutual/{userId}
  // across the current user's own friends (see useMutualFriendsAggregate).
  const { people: mutualPeople } = useMutualFriendsAggregate((friends as Friend[]).map(f => f.userId))
  const mutualFriendsCount = mutualPeople.length

  return (
    <Box className={classes.communityCard}>
      {/* Background decoration */}
      <svg className={classes.leafDecor} width={180} height={180} viewBox="0 0 180 180" fill="none">
        <ellipse cx={90} cy={90} rx={80} ry={110} fill="#fff" transform="rotate(-25 90 90)" />
      </svg>

      {/* Community name — large bold */}
      <Typography className={classes.communityName}>
        {communityName ?? 'My Community'}
      </Typography>

      {/* Members pill */}
      <Box className={classes.membersPill}>
        <svg width={13} height={13} viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
        <Typography className={classes.membersPillText}>
          {memberCount.toLocaleString('en-IN')} Members
        </Typography>
      </Box>

      {/* Friends · Mutual Friends line */}
      {friendCount > 0 && (
        <Typography className={classes.friendsLine}>
          {friendCount.toLocaleString('en-IN')} Friends
          {mutualFriendsCount > 0 && ` · ${mutualFriendsCount.toLocaleString('en-IN')} Mutual Friends`}
        </Typography>
      )}

      {/* Avatar stack */}
      {first5.length > 0 && (
        <Box className={classes.avatarStack}>
          {first5.map((f) => (
            <Avatar
              key={(f as Friend).id}
              className={classes.stackAvatar}
              src={(f as Friend).avatarUrl ?? undefined}
            >
              {getInitials((f as Friend).name)}
            </Avatar>
          ))}
        </Box>
      )}

      {/* Sub-communities link */}
      {subCommCount > 0 && (
        <Box className={classes.subCommLink} onClick={() => navigate(PATHS.onboarding, { state: { revisit: true } })}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
          <Typography className={classes.subCommText}>
            Amalgam of {subCommCount}+ sub-communities
          </Typography>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </Box>
      )}
    </Box>
  )
}

// ── Friends horizontal scroll row ─────────────────────────────────────────────
const FriendsScroll: React.FC = () => {
  const { classes } = useStyles()
  const { data: friends = [], isLoading } = useFriends()
  const first6 = (friends as Friend[]).slice(0, 6)

  if (isLoading || first6.length === 0) return null

  return (
    <Box className={classes.friendsScroll}>
      {first6.map((f) => (
        <Box key={(f as Friend).id} className={classes.friendItem}>
          <Box className={classes.friendAvatarWrap}>
            <Avatar className={classes.friendAvatar} src={(f as Friend).avatarUrl ?? undefined}>{getInitials((f as Friend).name)}</Avatar>
          </Box>
          <Typography className={classes.friendName}>
            {(f as Friend).name.split(' ')[0]}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

// ── Friends tab (circle content inline) ───────────────────────────────────────
const FriendsTab: React.FC = () => {
  const { classes } = useStyles()
  const { data: friends = [], isLoading } = useFriends()
  const removeMutation = useRemoveFriend()
  const [viewingUser, setViewingUser] = useState<ProfileSheetUser | null>(null)

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress size={28} sx={{ color: colors.moss }} />
    </Box>
  )

  const list = friends as Friend[]

  return (
    <Box className={classes.circleContent}>
      <Box className={classes.circleCard}>
        <Box className={classes.circleCardHeader}>
          <Typography className={classes.circleCardTitle}>My Friends ({list.length})</Typography>
        </Box>
        {list.length === 0 ? (
          <Typography className={classes.emptyRow}>No friends yet</Typography>
        ) : list.map((f) => {
          const av = avatarColor(f.id)
          return (
            <Box
              key={f.id}
              className={classes.listRow}
              sx={{ cursor: 'pointer' }}
              onClick={() => setViewingUser({ userId: f.userId, name: f.name, designation: f.designation, avatarUrl: f.avatarUrl, communityName: f.communityName })}
            >
              <Avatar
                src={f.avatarUrl ?? undefined}
                className={classes.personAvatar}
                sx={{ bgcolor: av.bg, color: av.fg }}
              >
                {getInitials(f.name)}
              </Avatar>
              <Box className={classes.personInfo}>
                <Typography className={classes.personName}>{f.name}</Typography>
                {f.designation && <Typography className={classes.personSub}>{f.designation}</Typography>}
              </Box>
              <Button
                disableElevation
                className={classes.removePill}
                onClick={(e) => { e.stopPropagation(); removeMutation.mutate(f.userId) }}
                disabled={removeMutation.isPending}
              >
                Remove
              </Button>
            </Box>
          )
        })}
      </Box>

      {/* Standalone "Add friend by user ID" box was retired — the Members tab's
          inline Add Friend buttons already cover this need with clearer,
          name-based context, so a free-text numeric-ID box was redundant
          surface area. */}

      <UserProfileSheet
        open={!!viewingUser}
        onClose={() => setViewingUser(null)}
        user={viewingUser}
        friendStatus="friends"
      />
    </Box>
  )
}

// ── Requests tab ──────────────────────────────────────────────────────────────
const RequestsTab: React.FC = () => {
  const { classes } = useStyles()
  const { data: pending = [], isLoading } = usePendingRequests()
  const acceptMutation = useAcceptRequest()
  const rejectMutation = useRejectRequest()
  const [viewingUser, setViewingUser] = useState<ProfileSheetUser | null>(null)

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress size={28} sx={{ color: colors.moss }} />
    </Box>
  )

  const list = pending as PendingRequest[]

  return (
    <Box className={classes.circleContent}>
      <Box className={classes.circleCard}>
        <Box className={classes.circleCardHeader}>
          <Typography className={classes.circleCardTitle}>Pending Requests ({list.length})</Typography>
        </Box>
        {list.length === 0 ? (
          <Typography className={classes.emptyRow}>No pending requests</Typography>
        ) : list.map((req) => {
          const av = avatarColor(req.id)
          return (
            <Box key={req.id} className={classes.requestRow}>
              <Box
                className={classes.requestTop}
                sx={{ cursor: 'pointer' }}
                onClick={() => setViewingUser({ userId: req.userId, name: req.name, designation: req.designation, avatarUrl: req.avatarUrl, communityName: req.communityName })}
              >
                <Avatar
                  src={req.avatarUrl ?? undefined}
                  className={classes.personAvatar}
                  sx={{ bgcolor: av.bg, color: av.fg }}
                >
                  {getInitials(req.name)}
                </Avatar>
                <Box className={classes.personInfo}>
                  <Typography className={classes.personName}>{req.name}</Typography>
                  {req.designation && <Typography className={classes.personSub}>{req.designation}</Typography>}
                </Box>
              </Box>
              <Box className={classes.requestActions}>
                <Button
                  disableElevation
                  className={classes.confirmBtn}
                  onClick={() => acceptMutation.mutate(req.id)}
                  disabled={acceptMutation.isPending}
                >
                  Confirm
                </Button>
                <Button
                  disableElevation
                  className={classes.deleteBtn}
                  onClick={() => rejectMutation.mutate(req.id)}
                  disabled={rejectMutation.isPending}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          )
        })}
      </Box>

      <UserProfileSheet
        open={!!viewingUser}
        onClose={() => setViewingUser(null)}
        user={viewingUser}
        friendStatus="requested"
      />
    </Box>
  )
}

// ── Small "Add Friend" pill used for mutual connections who aren't friends yet ─
const MutualAddFriendButton: React.FC<{ userId: string }> = ({ userId }) => {
  const { classes } = useStyles()
  const [requested, setRequested] = useState(false)
  const sendRequestMutation = useSendFriendRequest()

  if (requested) {
    return (
      <Box className={classes.friendedPill}>
        <CheckIcon sx={{ fontSize: '0.7rem', color: colors.moss }} />
        Requested
      </Box>
    )
  }

  return (
    <Button
      disableElevation
      className={classes.addFriendPill}
      onClick={() => {
        sendRequestMutation.mutate(userId)
        setRequested(true)
      }}
      disabled={sendRequestMutation.isPending}
    >
      Add Friend
    </Button>
  )
}

// ── Mutual Friends tab ────────────────────────────────────────────────────────
const MutualFriendsTab: React.FC<{ friends: Friend[] }> = ({ friends }) => {
  const { classes } = useStyles()

  // Real mutual friends — union of GET /friends/mutual/{userId} across your
  // own friends, minus anyone who's already a direct friend (useMutualFriendsAggregate
  // excludes them) — so this reads as "people you might know", not a re-listing
  // of your friends list.
  const friendUserIds = friends.map(f => f.userId)
  const { people: mutuals, isLoading } = useMutualFriendsAggregate(friendUserIds)
  const [viewingUser, setViewingUser] = useState<ProfileSheetUser | null>(null)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={28} sx={{ color: colors.moss }} />
      </Box>
    )
  }

  if (friends.length === 0 || mutuals.length === 0) {
    return (
      <Box className={classes.circleContent}>
        <Box className={classes.circleCard}>
          <Typography className={classes.emptyRow}>No mutual friends yet. Add friends to see connections.</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box className={classes.circleContent}>
      <Box sx={{ px: 2, pb: 1 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: colors.ink }}>
          {mutuals.length} Mutual Friends
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: colors.ink3, mt: '2px' }}>
          People you share a connection with through your friends
        </Typography>
      </Box>
      <Box className={classes.circleCard}>
        {mutuals.map((f) => {
          const av = avatarColor(f.id)
          return (
            <Box
              key={f.id}
              className={classes.listRow}
              sx={{ cursor: 'pointer' }}
              onClick={() => setViewingUser({ userId: f.userId, name: f.name, designation: f.designation, avatarUrl: f.avatarUrl })}
            >
              <Avatar src={f.avatarUrl ?? undefined} className={classes.personAvatar} sx={{ bgcolor: av.bg, color: av.fg }}>
                {getInitials(f.name)}
              </Avatar>
              <Box className={classes.personInfo}>
                <Typography className={classes.personName}>{f.name}</Typography>
                {f.designation && <Typography className={classes.personSub}>{f.designation}</Typography>}
              </Box>
              <Box onClick={(e) => e.stopPropagation()}>
                <MutualAddFriendButton userId={f.userId} />
              </Box>
            </Box>
          )
        })}
      </Box>

      <UserProfileSheet
        open={!!viewingUser}
        onClose={() => setViewingUser(null)}
        user={viewingUser}
        friendStatus="none"
      />
    </Box>
  )
}

// ── Friend status helpers ─────────────────────────────────────────────────────
const FRIEND_STATUS_MAP: Record<string, 'friends' | 'requested'> = {
  accepted: 'friends',
  friend: 'friends',
  friends: 'friends',
  pending: 'requested',
  sent: 'requested',
  requested: 'requested',
  request_sent: 'requested',
}

const deriveFriendStatus = (status: string | null): 'friends' | 'requested' | 'none' => {
  if (!status) return 'none'
  return FRIEND_STATUS_MAP[status.toLowerCase()] ?? 'none'
}

// ── Members tab ───────────────────────────────────────────────────────────────
const MembersTab: React.FC<{ communityId?: string | null; friendCount: number; currentUserId?: string }> = ({
  communityId, friendCount, currentUserId,
}) => {
  const { classes } = useStyles()
  const [page, setPage] = useState(1)
  const { data, isLoading } = useCommunityMembers(communityId, page)
  const { data: friends = [] } = useFriends()
  const sendRequestMutation = useSendFriendRequest()
  const cancelRequestMutation = useCancelFriendRequest()

  // Optimistic overrides so the button updates instantly, before the server's
  // friendship_status catches up on the next members refetch.
  const [localStatus, setLocalStatus] = useState<Record<string, 'requested' | 'none'>>({})
  const [viewingMember, setViewingMember] = useState<{ user: ProfileSheetUser; status: 'friends' | 'requested' | 'none' } | null>(null)

  const members = data?.data ?? []
  const meta = data?.meta

  const friendUserIds = new Set((friends as Friend[]).map(f => f.userId))

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress size={28} sx={{ color: colors.moss }} />
    </Box>
  )

  const totalMembers = meta?.total ?? members.length

  return (
    <Box className={classes.circleContent}>
      {/* Heading block outside the white card — per reference design */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: colors.ink, lineHeight: 1.2 }}>
          {totalMembers.toLocaleString('en-IN')} Members
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: colors.ink3, mt: '2px' }}>
          People in this community
        </Typography>
        {friendCount > 0 && (
          <Typography sx={{ fontSize: '0.78rem', color: colors.moss, fontWeight: 600, mt: '4px' }}>
            {friendCount} Friends
          </Typography>
        )}
      </Box>
      <Box className={classes.circleCard}>
        {members.length === 0 ? (
          <Typography className={classes.emptyRow}>No members yet</Typography>
        ) : members.map((m: CommunityMember) => {
          const serverStatus = deriveFriendStatus(m.friendshipStatus)
          const override = localStatus[m.userId]
          const isFriend = friendUserIds.has(m.userId) || (serverStatus === 'friends' && override !== 'none')
          const isRequested = !isFriend && (override === 'requested' || (serverStatus === 'requested' && override !== 'none'))
          // Compare real user ids (not the membership row's `id`) — coerce to
          // string defensively in case either side ever comes back numeric.
          const isSelf = !!currentUserId && String(m.userId) === String(currentUserId)
          const av = avatarColor(m.userId)
          return (
            <Box
              key={m.id}
              className={classes.listRow}
              sx={{ cursor: 'pointer' }}
              onClick={() => setViewingMember({
                user: { userId: m.userId, name: m.name, designation: m.designation, avatarUrl: m.avatarUrl },
                status: isFriend ? 'friends' : isRequested ? 'requested' : 'none',
              })}
            >
              <Avatar
                src={m.avatarUrl ?? undefined}
                className={classes.personAvatar}
                sx={{ bgcolor: av.bg, color: av.fg }}
              >
                {getInitials(m.name)}
              </Avatar>
              <Box className={classes.personInfo}>
                <Typography className={classes.personName}>{m.name}</Typography>
                {m.designation && (
                  <Typography className={classes.personSub}>{m.designation}</Typography>
                )}
              </Box>
              {isSelf ? null : isFriend ? (
                <Box className={classes.friendedPill}>
                  <CheckIcon sx={{ fontSize: '0.7rem', color: colors.moss }} />
                  Friends
                </Box>
              ) : isRequested ? (
                <Button
                  variant="outlined"
                  className={classes.requestedPill}
                  endIcon={<CloseIcon sx={{ fontSize: '0.8rem !important' }} />}
                  onClick={(e) => {
                    e.stopPropagation()
                    cancelRequestMutation.mutate(m.userId)
                    setLocalStatus(s => ({ ...s, [m.userId]: 'none' }))
                  }}
                  disabled={cancelRequestMutation.isPending}
                >
                  Requested
                </Button>
              ) : (
                <Button
                  disableElevation
                  className={classes.addFriendPill}
                  onClick={(e) => {
                    e.stopPropagation()
                    sendRequestMutation.mutate(m.userId)
                    setLocalStatus(s => ({ ...s, [m.userId]: 'requested' }))
                  }}
                  disabled={sendRequestMutation.isPending}
                >
                  Add Friend
                </Button>
              )}
            </Box>
          )
        })}

        {meta && meta.lastPage > 1 && (
          <Box className={classes.paginationRow}>
            <Button
              variant="outlined"
              className={classes.pageBtn}
              onClick={() => setPage(p => p - 1)}
              disabled={page <= 1}
            >
              <ChevronLeftIcon sx={{ fontSize: '1.1rem' }} />
            </Button>
            <Typography className={classes.pageLabel}>
              Page {meta.currentPage} of {meta.lastPage}
            </Typography>
            <Button
              variant="outlined"
              className={classes.pageBtn}
              onClick={() => setPage(p => p + 1)}
              disabled={page >= meta.lastPage}
            >
              <ChevronRightIcon sx={{ fontSize: '1.1rem' }} />
            </Button>
          </Box>
        )}
      </Box>

      <UserProfileSheet
        open={!!viewingMember}
        onClose={() => setViewingMember(null)}
        user={viewingMember?.user ?? null}
        friendStatus={viewingMember?.status ?? 'none'}
        isAdding={sendRequestMutation.isPending}
        onAddFriend={() => {
          if (!viewingMember) return
          sendRequestMutation.mutate(viewingMember.user.userId)
          setLocalStatus(s => ({ ...s, [viewingMember.user.userId]: 'requested' }))
          setViewingMember(null)
        }}
      />
    </Box>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
const CommunityPage: React.FC = () => {
  const { classes, cx } = useStyles()
  const { user } = useAuth()
  const { data, isLoading, isError } = usePosts(user?.communityId)
  const posts = data?.data ?? []

  const { data: friends = [] } = useFriends()
  const { data: pending = [] } = usePendingRequests()
  const { data: communityDetail } = useCommunity(user?.communityId ?? null)
  // GET /communities/{id} doesn't return a member_count field — the real count
  // only comes from the paginated members endpoint (same source MembersTab uses).
  const { data: membersPageForCount } = useCommunityMembers(user?.communityId ?? null, 1)
  const friendCount = (friends as Friend[]).length
  const pendingCount = (pending as PendingRequest[]).length
  const memberCount = membersPageForCount?.meta?.total ?? 0

  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') as Tab | null
  const activeTab: Tab = (tabParam && ['feed', 'members', 'friends', 'mutual'].includes(tabParam))
    ? tabParam
    : 'feed'
  const setActiveTab = (tab: Tab) => setSearchParams(tab === 'feed' ? {} : { tab }, { replace: true })
  const subCommCount = communityDetail?.subCommunities?.length ?? 0

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: 'feed',    label: 'Feed' },
    { key: 'members', label: 'Members' },
    { key: 'friends', label: 'Friends', badge: pendingCount },
    { key: 'mutual',  label: 'Mutual Friends' },
  ]

  return (
    <Box sx={{ backgroundColor: colors.cream, minHeight: '100%', pb: 2 }}>

      {/* Community gradient card */}
      <CommunityCard
        communityName={user?.communityName}
        friendCount={friendCount}
        memberCount={memberCount}
        subCommCount={subCommCount}
      />

      {/* Tab bar */}
      <Box className={classes.tabBar}>
        {tabs.map((tab) => (
          <Box
            key={tab.key}
            component="button"
            className={cx(classes.tabBtn, { [classes.tabBtnActive]: activeTab === tab.key })}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <Box component="span" className={classes.tabBadge}>
                {tab.badge}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Feed tab */}
      {activeTab === 'feed' && (
        <>
          <FriendsScroll />
          <CreatePostInput />
          <Box sx={{ px: 2, pt: 1, pb: 2 }}>
            {isLoading && <ContentSkeleton count={4} variant="post" />}
            {!isLoading && isError && (
              <EmptyState
                title="Couldn't load posts"
                description="Something went wrong. Please try again later."
                icon={<ForumOutlinedIcon />}
              />
            )}
            {!isLoading && !isError && posts.length === 0 && (
              <EmptyState
                title="No queries yet"
                description="Be the first to ask something in your community!"
                icon={<ForumOutlinedIcon />}
              />
            )}
            {!isLoading && !isError && posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Box>
        </>
      )}

      {activeTab === 'members' && <MembersTab communityId={user?.communityId} friendCount={friendCount} currentUserId={user?.id} />}
      {activeTab === 'friends' && (
        <>
          {/* Always shown (not just when there are pending requests) so the
              Requests section is discoverable — it already renders its own
              "No pending requests" empty state. */}
          <RequestsTab />
          <FriendsTab />
        </>
      )}
      {activeTab === 'mutual'  && <MutualFriendsTab friends={friends as Friend[]} />}
    </Box>
  )
}

export default CommunityPage
