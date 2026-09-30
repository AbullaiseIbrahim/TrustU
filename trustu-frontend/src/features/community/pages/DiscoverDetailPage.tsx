import React, { useState } from 'react'
import { Box, Typography, Avatar, IconButton, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import TuneIcon from '@mui/icons-material/Tune'
import CloseIcon from '@mui/icons-material/Close'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { useAuth } from '@/app/AuthProvider'
import { useFriendsOfFriends } from '@/features/circle/hooks/useFriendshipQueries'
import { useNewCommunityMembers } from '../hooks/useCommunityQueries'
import { getInitials, avatarGradient, formatRelativeTime, formatCommunityName, communityLocation } from '@/utils'
import colors from '@/theme/colors'
import UserProfileSheet, { type ProfileSheetUser } from '../components/UserProfileSheet'
import { useStyles, FofAddFriendButton, NewMemberAddFriendButton } from './CommunityPage'

/**
 * Discover detail page -- reached from any "See all" on the Community
 * page's Discover tab. Reuses that tab's styles/components (useStyles,
 * FofAddFriendButton, NewMemberAddFriendButton) so the two stay visually
 * and behaviorally consistent rather than drifting apart.
 *
 * Each section (Friends of your friends / New members) renders as one white
 * card with its title/subtitle as the card's own header and its rows
 * separated by divider lines -- not one floating card per person -- and
 * each "Friends of your friends" row shows an avatar, name, a locality line,
 * a hometown line, and an outlined Add Friend button on the right.
 *
 * The "Friends of your friends" list itself comes from GET /friends/fof --
 * a single, backend-computed friends-of-friends list (useFriendsOfFriends,
 * see useFriendshipQueries.ts) -- replacing the old per-friend aggregate
 * approach, which was discovered to be unreliable: it built the list by
 * unioning GET /friends/mutual/{userId} across the current user's own
 * friends, but that endpoint returns the true intersection of "friends of me
 * AND friends of userId", not "userId's friends", so it silently missed real
 * second-degree connections. /friends/fof doesn't return per-person friends-of-friends
 * counts or connecting-friend avatars, so the "N friends of friends" caption and
 * connector-avatar stack are gone from this view, and "Popular in your
 * community" below now just shows the same list rather than a count-ranked
 * subset of it.
 *
 * Locality uses real data: the app has one live community right now (Kerala
 * natives in Jamia Nagar, Delhi), and communityLocation/formatCommunityName
 * (src/utils/index.ts) resolve every member's communityName to that same
 * locality -- so it's shown for real, not invented. There is, however, no
 * per-person hometown field anywhere in this app yet (see the Friend /
 * CommunityMember types and friendship.api.ts), so the "From <city>" line
 * renders a clearly-labelled placeholder rather than a fabricated city, per
 * explicit product direction to show a placeholder instead of omitting the
 * field. The dismiss (X) button hides a row for the rest of this visit only
 * -- there's no persisted dismiss/hide-suggestion endpoint on the backend
 * yet.
 */

type FilterKey = 'all' | 'friends-of-friends' | 'new-members'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'friends-of-friends', label: 'Friends of friends' },
  { key: 'new-members', label: 'New members' },
]

const HOMETOWN_PLACEHOLDER = 'From — not shared'

const DiscoverDetailPage: React.FC = () => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const filterParam = searchParams.get('filter') as FilterKey | null
  const activeFilter: FilterKey = (filterParam && FILTERS.some(f => f.key === filterParam))
    ? filterParam
    : 'all'
  const setActiveFilter = (key: FilterKey) => {
    const next = new URLSearchParams(searchParams)
    key === 'all' ? next.delete('filter') : next.set('filter', key)
    setSearchParams(next, { replace: true })
  }

  // Real "friends of friends" list via GET /friends/fof -- a single,
  // backend-computed request (see the file-level comment above for why this
  // replaced the old per-friend aggregate approach).
  const { data: fofPeople = [], isLoading: fofLoading } = useFriendsOfFriends()
  const { members: newMembers, isLoading: membersLoading } = useNewCommunityMembers(user?.communityId, user?.id)

  const [viewingUser, setViewingUser] = useState<ProfileSheetUser | null>(null)

  // A card can be dismissed from this list -- hides it for the rest of this
  // visit. There's no dismiss/hide-suggestion endpoint on the backend yet,
  // so this is a local "not now", not a saved preference.
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const dismiss = (userId: string) => setDismissedIds((prev) => new Set(prev).add(userId))

  const visibleFof = fofPeople.filter((f) => !dismissedIds.has(f.userId))
  const visibleNewMembers = newMembers.filter((m) => !dismissedIds.has(m.userId))

  const isLoading = fofLoading || membersLoading
  const showFriendsOfFriends = activeFilter === 'all' || activeFilter === 'friends-of-friends'
  const showNewMembers = activeFilter === 'all' || activeFilter === 'new-members'

  // "Popular in your community" -- the same friends-of-friends pool.
  // /friends/fof doesn't return a per-person friends-of-friends count, so this is no
  // longer ranked by friends-of-friends count (see the file-level comment above) -- it's
  // just the first 8 from the list. Shown only on "All", as in the reference
  // design.
  const popular = visibleFof.slice(0, 8)

  const nothingToShow = !isLoading && visibleFof.length === 0 && visibleNewMembers.length === 0

  return (
    <Box sx={{ backgroundColor: colors.cream, minHeight: '100%', pb: 3 }}>
      {/* Header: back arrow + title + (decorative) filter icon */}
      <Box className={classes.discoverPageHeader}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: colors.ink }} aria-label="Back">
          <ArrowBackIcon />
        </IconButton>
        <Typography className={classes.discoverPageTitle}>Discover</Typography>
        <IconButton sx={{ color: colors.ink3 }} aria-label="Filter">
          <TuneIcon />
        </IconButton>
      </Box>

      {/* Segmented filter pills */}
      <Box className={classes.discoverPillRow}>
        {FILTERS.map((f) => (
          <Box
            key={f.key}
            component="button"
            className={cx(classes.discoverPill, { [classes.discoverPillActive]: activeFilter === f.key })}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </Box>
        ))}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} sx={{ color: colors.moss }} />
        </Box>
      ) : nothingToShow ? (
        <Box className={classes.discoverEmpty} sx={{ mt: 1 }}>
          No suggestions yet. As your community grows and your friends add their own friends, people you&apos;re not connected to yet will show up here.
        </Box>
      ) : (
        <>
          {showFriendsOfFriends && (
            <Box sx={{ mb: 2 }}>
              {visibleFof.length === 0 ? (
                <>
                  <Box sx={{ px: 2, pb: 1 }}>
                    <Typography className={classes.discoverSectionTitle}>Friends of your friends</Typography>
                    <Typography className={classes.discoverSectionSub}>People mostly connected in your network</Typography>
                  </Box>
                  <Box className={classes.discoverEmpty}>No suggestions here yet.</Box>
                </>
              ) : (
                <Box className={classes.discoverListCard}>
                  <Box className={classes.discoverListCardHeader}>
                    <Typography className={classes.discoverSectionTitle}>Friends of your friends</Typography>
                    <Typography className={classes.discoverSectionSub}>People mostly connected in your network</Typography>
                  </Box>
                  {visibleFof.map((f) => {
                    const avatarBg = avatarGradient(f.id)
                    const location = communityLocation(formatCommunityName(f.communityName))
                    return (
                      <Box
                        key={f.id}
                        className={classes.discoverListRow}
                        onClick={() => setViewingUser({ userId: f.userId, name: f.name, designation: f.designation, avatarUrl: f.avatarUrl })}
                      >
                        <IconButton
                          size="small"
                          className={classes.discoverPersonDismiss}
                          onClick={(e) => { e.stopPropagation(); dismiss(f.userId) }}
                          aria-label="Dismiss suggestion"
                        >
                          <CloseIcon sx={{ fontSize: '0.95rem' }} />
                        </IconButton>
                        <Avatar src={f.avatarUrl ?? undefined} className={classes.discoverPersonAvatar} sx={{ background: avatarBg, color: '#fff' }}>
                          {getInitials(f.name)}
                        </Avatar>
                        <Box className={classes.discoverPersonBody}>
                          <Typography className={classes.discoverPersonName}>{f.name}</Typography>
                          <Box className={classes.discoverPersonLocationRow}>
                            <PlaceOutlinedIcon className={classes.discoverPersonLocationIcon} />
                            <Typography className={location ? classes.discoverPersonLocationText : classes.discoverPersonFromText}>
                              {location ?? 'Location not shared'}
                            </Typography>
                          </Box>
                          <Typography className={classes.discoverPersonFromText}>
                            {HOMETOWN_PLACEHOLDER}
                          </Typography>
                        </Box>
                        <Box className={classes.discoverListAction} onClick={(e) => e.stopPropagation()}>
                          <FofAddFriendButton userId={f.userId} outlined />
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              )}
            </Box>
          )}

          {activeFilter === 'all' && (
            <Box
              component="button"
              className={classes.ctaBanner}
              onClick={() => navigate(`${PATHS.dashboard.community}?tab=members`)}
            >
              <Box className={classes.ctaBannerIcon}>
                <GroupsOutlinedIcon sx={{ color: colors.moss, fontSize: '1.2rem' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography className={classes.ctaBannerTitle}>Build your network</Typography>
                <Typography className={classes.ctaBannerSub}>Add more people you know. It makes finding trusted places easier.</Typography>
              </Box>
              <ChevronRightIcon sx={{ color: colors.ink3, flexShrink: 0 }} />
            </Box>
          )}

          {showNewMembers && (
            <Box sx={{ mb: 2 }}>
              {visibleNewMembers.length === 0 ? (
                <>
                  <Box sx={{ px: 2, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Typography className={classes.discoverSectionTitle}>New members</Typography>
                      <Box component="span" className={classes.discoverNewBadge}>NEW</Box>
                    </Box>
                    <Typography className={classes.discoverSectionSub}>Recently joined your community</Typography>
                </Box>
                  <Box className={classes.discoverEmpty}>No new members yet.</Box>
                </>
              ) : (
                <Box className={classes.discoverListCard}>
                  <Box className={classes.discoverListCardHeader}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Typography className={classes.discoverSectionTitle}>New members</Typography>
                      <Box component="span" className={classes.discoverNewBadge}>NEW</Box>
                    </Box>
                    <Typography className={classes.discoverSectionSub}>Recently joined your community</Typography>
                  </Box>
                  {visibleNewMembers.map((m) => {
                    const avatarBg = avatarGradient(m.userId)
                    return (
                      <Box
                        key={m.id}
                        className={classes.discoverListRow}
                        onClick={() => setViewingUser({ userId: m.userId, name: m.name, designation: m.designation, avatarUrl: m.avatarUrl })}
                      >
                        <IconButton
                          size="small"
                          className={classes.discoverPersonDismiss}
                          onClick={(e) => { e.stopPropagation(); dismiss(m.userId) }}
                          aria-label="Dismiss suggestion"
                        >
                          <CloseIcon sx={{ fontSize: '0.95rem' }} />
                        </IconButton>
                        <Avatar src={m.avatarUrl ?? undefined} className={classes.discoverPersonAvatar} sx={{ background: avatarBg, color: '#fff' }}>
                          {getInitials(m.name)}
                        </Avatar>
                        <Box className={classes.discoverPersonBody}>
                          <Typography className={classes.discoverPersonName}>{m.name}</Typography>
                          <Typography className={classes.discoverPersonSub}>
                            {m.joinedAt ? `Joined ${formatRelativeTime(m.joinedAt)}` : 'New to the community'}
                          </Typography>
                        </Box>
                        <Box className={classes.discoverListAction} onClick={(e) => e.stopPropagation()}>
                          <NewMemberAddFriendButton member={m} outlined />
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              )}
            </Box>
          )}

          {activeFilter === 'all' && popular.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ px: 2, pb: 1 }}>
                <Typography className={classes.discoverSectionTitle}>Popular in your community</Typography>
                <Typography className={classes.discoverSectionSub}>Most connected members in your network</Typography>
              </Box>
              <Box className={classes.popularGrid}>
                {popular.map((f) => {
                  const avatarBg = avatarGradient(f.id)
                  return (
                    <Box
                      key={f.id}
                      className={classes.popularItem}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setViewingUser({ userId: f.userId, name: f.name, designation: f.designation, avatarUrl: f.avatarUrl })}
                    >
                      <Avatar src={f.avatarUrl ?? undefined} className={classes.discoverAvatarLg} sx={{ background: avatarBg, color: '#fff' }}>
                        {getInitials(f.name)}
                      </Avatar>
                      <Typography className={classes.discoverAvatarName}>{f.name.split(' ')[0]}</Typography>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )}
        </>
      )}

      <UserProfileSheet
        open={!!viewingUser}
        onClose={() => setViewingUser(null)}
        user={viewingUser}
        friendStatus="none"
      />
    </Box>
  )
}

export default DiscoverDetailPage
