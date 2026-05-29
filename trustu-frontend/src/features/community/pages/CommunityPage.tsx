import React, { useState } from 'react'
import { Box, Typography, Avatar, Badge } from '@mui/material'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import { makeStyles } from 'tss-react/mui'
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
} from '@/features/circle/hooks/useFriendshipQueries'
import type { Friend, PendingRequest } from '@/services/friendship.api'
import { getInitials } from '@/utils'
import colors from '@/theme/colors'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

type Tab = 'feed' | 'friends' | 'requests'

const useStyles = makeStyles()(() => ({
  // ── Community gradient card ────────────────────────────────────────────────
  communityCard: {
    background: `linear-gradient(140deg, ${colors.moss}, ${colors.mossDeep})`,
    borderRadius: 18,
    margin: '4px 16px 12px',
    padding: '14px 16px',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    animation: 'fadeSlideUp 0.3s ease both',
  },
  leaf: {
    position: 'absolute',
    right: -18,
    top: -22,
    opacity: 0.15,
    pointerEvents: 'none',
  },
  communityLabel: {
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    opacity: 0.75,
    marginBottom: 2,
  },
  communityName: {
    fontWeight: 800,
    fontSize: '1.1rem',
    letterSpacing: '-0.4px',
    lineHeight: 1.2,
    marginBottom: 8,
  },
  statsRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  statVal: {
    fontWeight: 700,
    fontSize: '1rem',
    lineHeight: 1,
  },
  statLbl: {
    fontSize: '0.65rem',
    opacity: 0.7,
    marginTop: 1,
    fontWeight: 500,
  },
  avatarStack: {
    display: 'flex',
  },
  stackAvatar: {
    width: 28,
    height: 28,
    fontSize: '0.62rem',
    fontWeight: 700,
    border: '2px solid rgba(255,255,255,0.8)',
    marginLeft: -6,
    '&:first-of-type': { marginLeft: 0 },
    background: 'rgba(255,255,255,0.25)',
    color: '#fff',
  },

  // ── Tab bar ────────────────────────────────────────────────────────────────
  tabBar: {
    display: 'flex',
    gap: 6,
    padding: '0 16px 12px',
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
  memberGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
    padding: '0 14px 14px',
  },
  memberCard: {
    border: `1px solid ${colors.line}`,
    borderRadius: 14,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    backgroundColor: '#fafafa',
  },
  memberCardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    fontSize: '0.85rem',
    fontWeight: 700,
    background: `linear-gradient(135deg, ${colors.moss}, ${colors.mossDeep})`,
    flexShrink: 0,
  },
  memberName: {
    fontWeight: 600,
    fontSize: '0.82rem',
    color: colors.ink,
    lineHeight: 1.3,
  },
  memberDesig: {
    fontSize: '0.72rem',
    color: colors.ink3,
    marginTop: 1,
  },
  acceptBtn: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.75rem',
    flex: 1,
    borderRadius: 8,
    backgroundColor: colors.moss,
    color: '#fff',
    '&:hover': { backgroundColor: colors.mossDeep },
    minWidth: 0,
    padding: '4px 8px',
  },
  rejectBtn: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.75rem',
    flex: 1,
    borderRadius: 8,
    color: colors.ink3,
    borderColor: colors.line,
    '&:hover': { borderColor: colors.ink3 },
    minWidth: 0,
    padding: '4px 8px',
  },
  removeBtn: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.75rem',
    borderRadius: 8,
    backgroundColor: colors.urgent,
    color: '#fff',
    '&:hover': { backgroundColor: '#a02920' },
    width: '100%',
    padding: '4px 8px',
  },
}))

// ── Community gradient card ────────────────────────────────────────────────────
const CommunityCard: React.FC<{ communityName?: string | null; friendCount: number }> = ({
  communityName, friendCount,
}) => {
  const { classes } = useStyles()
  const { data: friends = [] } = useFriends()
  const first5 = (friends as Friend[]).slice(0, 5)

  return (
    <Box className={classes.communityCard}>
      {/* Leaf decoration */}
      <svg className={classes.leaf} width={120} height={120} viewBox="0 0 120 120" fill="none">
        <ellipse cx={60} cy={60} rx={55} ry={75} fill="#fff" transform="rotate(-30 60 60)" />
      </svg>

      <Typography className={classes.communityLabel}>Semi-private community</Typography>
      <Typography className={classes.communityName}>{communityName ?? 'My Community'}</Typography>

      <Box className={classes.statsRow}>
        <Box className={classes.statItem}>
          <Typography className={classes.statVal}>{friendCount}</Typography>
          <Typography className={classes.statLbl}>Friends</Typography>
        </Box>
      </Box>

      {first5.length > 0 && (
        <Box className={classes.avatarStack}>
          {first5.map((f) => (
            <Avatar key={(f as Friend).id} className={classes.stackAvatar}>
              {getInitials((f as Friend).name)}
            </Avatar>
          ))}
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
            <Avatar className={classes.friendAvatar}>{getInitials((f as Friend).name)}</Avatar>
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

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress size={28} sx={{ color: colors.moss }} />
    </Box>
  )

  return (
    <Box className={classes.circleContent}>
      <Box className={classes.circleCard}>
        <Box className={classes.circleCardHeader}>
          <Typography className={classes.circleCardTitle}>My Friends ({(friends as Friend[]).length})</Typography>
        </Box>
        <Box className={classes.memberGrid}>
          {(friends as Friend[]).length === 0 ? (
            <Typography sx={{ gridColumn: '1/-1', textAlign: 'center', py: 3, color: colors.ink3, fontSize: '0.85rem' }}>
              No friends yet
            </Typography>
          ) : (friends as Friend[]).map((f) => (
            <Box key={f.id} className={classes.memberCard}>
              <Box className={classes.memberCardTop}>
                <Avatar className={classes.memberAvatar}>{getInitials(f.name)}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography className={classes.memberName}>{f.name}</Typography>
                  {f.designation && <Typography className={classes.memberDesig}>{f.designation}</Typography>}
                </Box>
              </Box>
              <Button
                disableElevation
                className={classes.removeBtn}
                onClick={() => removeMutation.mutate(f.userId)}
                disabled={removeMutation.isPending}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// ── Requests tab ──────────────────────────────────────────────────────────────
const RequestsTab: React.FC = () => {
  const { classes } = useStyles()
  const { data: pending = [], isLoading } = usePendingRequests()
  const acceptMutation = useAcceptRequest()
  const rejectMutation = useRejectRequest()

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress size={28} sx={{ color: colors.moss }} />
    </Box>
  )

  return (
    <Box className={classes.circleContent}>
      <Box className={classes.circleCard}>
        <Box className={classes.circleCardHeader}>
          <Typography className={classes.circleCardTitle}>Pending Requests ({(pending as PendingRequest[]).length})</Typography>
        </Box>
        <Box className={classes.memberGrid}>
          {(pending as PendingRequest[]).length === 0 ? (
            <Typography sx={{ gridColumn: '1/-1', textAlign: 'center', py: 3, color: colors.ink3, fontSize: '0.85rem' }}>
              No pending requests
            </Typography>
          ) : (pending as PendingRequest[]).map((req) => (
            <Box key={req.id} className={classes.memberCard}>
              <Box className={classes.memberCardTop}>
                <Avatar className={classes.memberAvatar}>{getInitials(req.name)}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography className={classes.memberName}>{req.name}</Typography>
                  {req.designation && <Typography className={classes.memberDesig}>{req.designation}</Typography>}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  disableElevation
                  className={classes.acceptBtn}
                  startIcon={<CheckIcon sx={{ fontSize: '0.85rem !important' }} />}
                  onClick={() => acceptMutation.mutate(req.id)}
                  disabled={acceptMutation.isPending}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  className={classes.rejectBtn}
                  startIcon={<CloseIcon sx={{ fontSize: '0.85rem !important' }} />}
                  onClick={() => rejectMutation.mutate(req.id)}
                  disabled={rejectMutation.isPending}
                >
                  Ignore
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
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
  const friendCount = (friends as Friend[]).length
  const pendingCount = (pending as PendingRequest[]).length

  const [activeTab, setActiveTab] = useState<Tab>('feed')

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: 'feed', label: 'Feed' },
    { key: 'friends', label: 'Friends' },
    { key: 'requests', label: 'Requests', badge: pendingCount },
  ]

  return (
    <Box sx={{ backgroundColor: colors.cream, minHeight: '100%', pb: 2 }}>

      {/* Community gradient card */}
      <CommunityCard communityName={user?.communityName} friendCount={friendCount} />

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
              <Badge
                badgeContent={tab.badge}
                color="error"
                sx={{ ml: 0.5, '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
              />
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

      {activeTab === 'friends' && <FriendsTab />}
      {activeTab === 'requests' && <RequestsTab />}
    </Box>
  )
}

export default CommunityPage
