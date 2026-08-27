import React, { useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import { useAuth } from '@/app/AuthProvider'
import { useSnackbar } from '@/app/SnackbarProvider'
import {
  useCommunities,
  useCommunity,
  useCommunityMembers,
  useJoinCommunity,
} from '@/features/community/hooks/useCommunityQueries'
import { useFriends } from '@/features/circle/hooks/useFriendshipQueries'
import { PATHS } from '@/routes/paths'
import colors from '@/theme/colors'
import { StepPill } from '@/features/auth/components/AuthField'
import type { Community } from '@/types/community.types'
import { formatCommunityName } from '@/utils'

// ── Styles — exact pixel match to the prototype's onboarding screens ───────────

const useStyles = makeStyles()(() => ({
  page: {
    minHeight: '100vh',
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
  },
  headerBlock: {
    padding: '20px 24px 8px',
    flexShrink: 0,
  },
  closeBtn: {
    width: 42, height: 42, borderRadius: 13,
    border: `1.5px solid ${colors.line}`, background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', marginBottom: 12,
    '&:active': { transform: 'scale(0.94)' },
  },
  title: {
    margin: '16px 0 6px',
    fontSize: '26px',
    fontWeight: 800,
    letterSpacing: '-0.6px',
    color: colors.ink,
  },
  subtitle: {
    margin: 0,
    fontSize: '14.5px',
    lineHeight: 1.5,
    color: colors.ink3,
    fontWeight: 500,
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '18px 24px 24px',
  },
  // ── Community card ────────────────────────────────────────────────────────
  card: {
    background: '#fff',
    borderRadius: 22,
    padding: 20,
    boxShadow: '0 6px 18px rgba(26,29,26,0.06)',
    border: `1px solid ${colors.lineSoft}`,
    cursor: 'pointer',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
  },
  cardIdentity: {
    display: 'flex',
    alignItems: 'center',
    gap: 13,
    minWidth: 0,
  },
  cardIcon: {
    width: 52, height: 52, borderRadius: 16,
    background: `linear-gradient(150deg, #2A8A52, ${colors.mossDeep})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardName: {
    fontSize: '17px', fontWeight: 800, color: colors.ink, letterSpacing: '-0.3px',
  },
  cardLoc: {
    fontSize: '12.5px', fontWeight: 600, color: colors.ink4, marginTop: 3,
  },
  toggleWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0,
  },
  toggleTrack: {
    width: 52, height: 30, borderRadius: 999, padding: 3,
    display: 'flex', alignItems: 'center', cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    '&:active': { transform: 'scale(0.96)' },
  },
  toggleThumb: {
    width: 24, height: 24, borderRadius: '50%', background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.22)',
    transition: 'transform 0.15s ease',
  },
  toggleLabel: {
    fontSize: '11px', fontWeight: 800, color: colors.moss, letterSpacing: '0.6px',
  },
  toggleLabelOff: {
    color: colors.ink4,
  },
  statsRow: {
    display: 'flex', gap: 8, marginTop: 20,
  },
  statBlock: {
    flex: 1, background: '#F4F0E6', borderRadius: 14, padding: '12px 10px', textAlign: 'center',
  },
  statValue: {
    fontSize: '18px', fontWeight: 800, color: colors.ink, letterSpacing: '-0.3px',
  },
  statLabel: {
    fontSize: '11px', fontWeight: 700, color: '#8A8D85', marginTop: 2,
  },
  hint: {
    display: 'flex', alignItems: 'center', gap: 7, marginTop: 16, paddingTop: 16,
    borderTop: `1px solid ${colors.lineSoft}`,
  },
  hintText: {
    fontSize: '12.5px', fontWeight: 600, color: colors.ink3,
  },
  // ── Coming soon dashed box ────────────────────────────────────────────────
  comingSoon: {
    marginTop: 14,
    border: `1.5px dashed ${colors.line}`,
    borderRadius: 18,
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
  },
  comingSoonIcon: {
    width: 44, height: 44, borderRadius: 13, background: '#ECE8DE',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  comingSoonTitle: {
    fontSize: '14px', fontWeight: 800, color: colors.ink3,
  },
  comingSoonBody: {
    fontSize: '12px', fontWeight: 500, color: colors.ink4, marginTop: 2,
  },
  // ── Explore Communities grid screen ──────────────────────────────────────
  exploreHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    padding: '16px 20px 8px', flexShrink: 0,
  },
  exploreHeaderLeft: {
    display: 'flex', alignItems: 'center', gap: 12, minWidth: 0,
  },
  exploreTitle: {
    margin: 0, fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px', color: colors.ink,
  },
  exploreSub: {
    margin: 0, padding: '0 20px 2px', fontSize: '13.5px', fontWeight: 500, color: colors.ink3, flexShrink: 0,
  },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
  },
  gridTile: {
    position: 'relative',
    background: '#fff',
    border: `1.5px solid ${colors.line}`,
    borderRadius: 16,
    padding: '20px 12px',
    minHeight: 92,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: '0 3px 10px rgba(26,29,26,0.04)',
    '&:active': { transform: 'scale(0.97)' },
  },
  gridTileName: {
    fontSize: '14.5px', fontWeight: 800, letterSpacing: '-0.3px', color: colors.ink, lineHeight: 1.22,
  },
  gridTileMeta: {
    fontSize: '12.5px', fontWeight: 600, color: '#8A8D85', marginTop: 5,
  },
  gridBadge: {
    position: 'absolute', top: 8, right: 8, padding: '3px 8px',
    background: colors.accentGreen, borderRadius: 999,
  },
  gridBadgeText: {
    fontSize: '9px', fontWeight: 800, color: '#fff', letterSpacing: '0.5px',
  },
  moreComingSoon: {
    textAlign: 'center', marginTop: 20, fontSize: '12.5px', fontWeight: 700, color: colors.ink4,
  },
  // ── Coming soon modal ─────────────────────────────────────────────────────
  modalBackdrop: {
    position: 'fixed', inset: 0, background: 'rgba(22,32,26,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, zIndex: 60,
  },
  modalCard: {
    width: '100%', maxWidth: 320, background: '#fff', borderRadius: 24,
    padding: '28px 24px', textAlign: 'center', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.5)',
  },
  modalIcon: {
    width: 64, height: 64, borderRadius: 20, background: '#F4F0E6',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
  },
  modalTitle: {
    margin: 0, fontSize: '20px', fontWeight: 800, letterSpacing: '-0.4px', color: colors.ink,
  },
  modalBody: {
    margin: '10px 0 0', fontSize: '14px', lineHeight: 1.5, fontWeight: 500, color: colors.ink3,
  },
  modalBtn: {
    width: '100%', marginTop: 22, padding: 15, border: 'none', borderRadius: 14,
    background: `linear-gradient(150deg, ${colors.mossMid}, ${colors.mossDeep})`,
    fontFamily: 'inherit', fontSize: '15px', fontWeight: 700, color: '#fff', cursor: 'pointer',
    '&:active': { transform: 'scale(0.98)' },
    '&:disabled': { opacity: 0.65, cursor: 'not-allowed' },
  },
  modalBtnRow: {
    display: 'flex', gap: 10, marginTop: 22,
  },
  modalBtnSecondary: {
    flex: 1, padding: 15, border: `1.5px solid ${colors.line}`, borderRadius: 14,
    background: 'transparent', fontFamily: 'inherit', fontSize: '15px', fontWeight: 700,
    color: colors.ink2, cursor: 'pointer',
    '&:active': { transform: 'scale(0.98)' },
  },
}))

// ── Explore Communities sub-screen ─────────────────────────────────────────────
const ExploreCommunities: React.FC<{ myCommunityId?: string | null; myCommunityName?: string | null; onBack: () => void }> = ({
  myCommunityId,
  myCommunityName,
  onBack,
}) => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const { syncProfile } = useAuth()
  const { showSuccess } = useSnackbar()
  const { data: communities = [], isLoading } = useCommunities()
  const [comingSoon, setComingSoon] = useState<string | null>(null)
  const [switchTarget, setSwitchTarget] = useState<Community | null>(null)
  const joinMutation = useJoinCommunity()

  const others = communities.filter((c) => c.id !== myCommunityId)

  const handleTileClick = (c: Community) => {
    if (c.memberCount > 0) setSwitchTarget(c)
    else setComingSoon(formatCommunityName(c.name))
  }

  // No onError here — a failure still reaches the user via the global
  // QueryCache/MutationCache handler in QueryProvider.tsx.
  const handleConfirmSwitch = () => {
    if (!switchTarget) return
    joinMutation.mutate(switchTarget.id, {
      onSuccess: async () => {
        await syncProfile()
        showSuccess(`Switched to ${formatCommunityName(switchTarget.name)}`)
        navigate(PATHS.dashboard.community, { replace: true })
      },
    })
  }

  return (
    <Box className={classes.page}>
      <Box className={classes.exploreHeader}>
        <Box className={classes.exploreHeaderLeft}>
          <Box component="button" className={classes.closeBtn} onClick={onBack} sx={{ marginBottom: 0 }} aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke={colors.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Box>
          <Typography component="h1" className={classes.exploreTitle}>Explore Communities</Typography>
        </Box>
      </Box>
      <Typography className={classes.exploreSub}>Kerala communities across Delhi</Typography>

      <Box className={classes.scrollArea} sx={{ padding: '16px 20px 24px' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress size={26} sx={{ color: colors.moss }} />
          </Box>
        ) : (
          <Box className={classes.grid}>
            {/* My community — already joined */}
            <Box className={classes.gridTile} sx={{ background: colors.mossSoft, borderColor: colors.moss }}>
              <Typography className={classes.gridTileName} sx={{ color: colors.mossDeep }}>
                {myCommunityName ? formatCommunityName(myCommunityName) : 'Your community'}
              </Typography>
              <Typography className={classes.gridTileMeta}>Your community</Typography>
              <Box className={classes.gridBadge}>
                <Typography className={classes.gridBadgeText}>JOINED</Typography>
              </Box>
            </Box>
            {others.map((c) => (
              <Box key={c.id} className={classes.gridTile} onClick={() => handleTileClick(c)}>
                <Typography className={classes.gridTileName}>{formatCommunityName(c.name)}</Typography>
                <Typography className={classes.gridTileMeta}>
                  {c.memberCount > 0 ? `${c.memberCount.toLocaleString('en-IN')} members` : 'Coming soon'}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        <Typography className={classes.moreComingSoon}>More communities coming soon</Typography>
      </Box>

      {/* Switch-community confirmation */}
      {switchTarget && (
        <Box className={classes.modalBackdrop} onClick={() => !joinMutation.isPending && setSwitchTarget(null)}>
          <Box className={classes.modalCard} onClick={(e) => e.stopPropagation()}>
            <Box className={classes.modalIcon}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M17 20a5 5 0 0 0-10 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke={colors.accentGreen} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Box>
            <Typography component="h3" className={classes.modalTitle}>Switch community?</Typography>
            <Typography className={classes.modalBody}>
              You&apos;ll move from{' '}
              <Box component="span" sx={{ fontWeight: 700, color: colors.ink }}>{myCommunityName ? formatCommunityName(myCommunityName) : 'your current community'}</Box>
              {' '}to{' '}
              <Box component="span" sx={{ fontWeight: 700, color: colors.ink }}>{formatCommunityName(switchTarget.name)}</Box>. You can switch back anytime.
            </Typography>
            <Box className={classes.modalBtnRow}>
              <Box
                component="button"
                className={classes.modalBtnSecondary}
                onClick={() => setSwitchTarget(null)}
                disabled={joinMutation.isPending}
              >
                Cancel
              </Box>
              <Box
                component="button"
                className={classes.modalBtn}
                sx={{ marginTop: 0 }}
                onClick={handleConfirmSwitch}
                disabled={joinMutation.isPending}
              >
                {joinMutation.isPending ? 'Switching…' : 'Switch'}
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {comingSoon && (
        <Box className={classes.modalBackdrop} onClick={() => setComingSoon(null)}>
          <Box className={classes.modalCard} onClick={(e) => e.stopPropagation()}>
            <Box className={classes.modalIcon}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke={colors.accentGreen} strokeWidth="1.8" />
                <path d="M12 7v5l3 2" stroke={colors.accentGreen} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Box>
            <Typography component="h3" className={classes.modalTitle}>Coming soon</Typography>
            <Typography className={classes.modalBody}>
              <Box component="span" sx={{ fontWeight: 700, color: colors.ink }}>{comingSoon}</Box>
              {' '}isn&apos;t live yet. We&apos;re forming this community as more Malayalis join — we&apos;ll notify you when it opens.
            </Typography>
            <Box component="button" className={classes.modalBtn} onClick={() => setComingSoon(null)}>
              Got it
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

// ── Main onboarding screen ──────────────────────────────────────────────────────
const OnboardingCommunityPage: React.FC = () => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { showSuccess } = useSnackbar()
  const navState = location.state as { revisit?: boolean; initialView?: 'main' | 'explore' } | null
  // Reached mid-app (e.g. tapping the Amalgam link on the Network banner)
  // rather than fresh off registration — show a way back out in that case.
  const isRevisit = Boolean(navState?.revisit)
  // The Network page's "Amalgam of N Kerala communities" link jumps straight
  // into the switcher grid, skipping this page's single-community view.
  const initialView = navState?.initialView ?? 'main'
  const [view, setView] = useState<'main' | 'explore'>(initialView)
  // Visually mirrors the design's default-off Join toggle — the account was
  // already added to its community server-side at registration, so this is a
  // confirmation tap rather than a second API call, then carries the user
  // forward into the app.
  const [joined, setJoined] = useState(false)

  const { data: myCommunity, isLoading: isCommunityLoading } = useCommunity(user?.communityId)
  // GET /communities/{id} doesn't return a member_count field — the real count
  // only comes from the paginated members endpoint (same source MembersTab/
  // CommunityCard use). Wait on both queries before rendering the count so we
  // never show a stale "0 → —" flash while membersPage is still in flight.
  const { data: membersPage, isLoading: isMembersLoading } = useCommunityMembers(user?.communityId, 1)
  const { data: friends = [] } = useFriends()
  const isLoading = isCommunityLoading || isMembersLoading

  const handleContinue = () => {
    if (!isRevisit) showSuccess("You're in! Welcome to the community.")
    isRevisit ? navigate(-1) : navigate(PATHS.dashboard.community, { replace: true })
  }

  // The toggle is the "enter" gesture for a fresh signup: first tap flips it
  // on and, a beat later, carries the user into the app. Already-joined
  // revisits (and a second tap) just continue right away.
  const handleToggle = () => {
    if (isRevisit || joined) { handleContinue(); return }
    setJoined(true)
    window.setTimeout(handleContinue, 350)
  }

  if (view === 'explore') {
    return (
      <ExploreCommunities
        myCommunityId={user?.communityId}
        myCommunityName={user?.communityName}
        // Entered directly from the Network banner (skipped the main view) —
        // going back should exit the page, not fall into a view we never showed.
        onBack={() => (initialView === 'explore' ? navigate(-1) : setView('main'))}
      />
    )
  }

  const communityName = formatCommunityName(myCommunity?.name ?? user?.communityName) || 'Your Community'
  const locationText = myCommunity?.description || null
  const memberCount = membersPage?.meta?.total ?? 0
  const friendCount = friends.length
  // Same approximation used by the main Community banner (CommunityPage.tsx)
  // for consistency — no dedicated "total mutuals" endpoint exists yet.
  const mutualCount = Math.floor(friendCount * 0.35)
  const isOn = isRevisit || joined

  return (
    <Box className={classes.page}>
      <Box className={classes.headerBlock}>
        {isRevisit && (
          <Box component="button" className={classes.closeBtn} onClick={() => navigate(-1)} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke={colors.ink3} strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </Box>
        )}
        <StepPill step="STEP 2 OF 2" />
        <Typography component="h1" className={classes.title}>Communities you belong to</Typography>
        <Typography className={classes.subtitle}>
          {locationText
            ? `Based on your location in ${locationText}. Join to start connecting with people from back home.`
            : 'Join to start connecting with people from back home.'}
        </Typography>
      </Box>

      <Box className={classes.scrollArea}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={26} sx={{ color: colors.moss }} />
          </Box>
        ) : (
          <Box className={classes.card} onClick={handleToggle}>
            <Box className={classes.cardTop}>
              <Box className={classes.cardIdentity}>
                <Box className={classes.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 20a5 5 0 0 0-10 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography className={classes.cardName}>{communityName}</Typography>
                  {locationText && <Typography className={classes.cardLoc}>{locationText}</Typography>}
                </Box>
              </Box>
              <Box className={classes.toggleWrap}>
                <Box
                  className={classes.toggleTrack}
                  sx={{
                    background: isOn ? colors.moss : colors.line,
                    justifyContent: isOn ? 'flex-end' : 'flex-start',
                  }}
                  onClick={(e) => { e.stopPropagation(); handleToggle() }}
                >
                  <Box className={classes.toggleThumb} />
                </Box>
                <Typography className={cx(classes.toggleLabel, !isOn && classes.toggleLabelOff)}>
                  {isRevisit ? 'BACK' : (joined ? 'JOINED' : 'JOIN')}
                </Typography>
              </Box>
            </Box>

            <Box className={classes.statsRow}>
              <Box className={classes.statBlock}>
                <Typography className={classes.statValue}>{memberCount.toLocaleString('en-IN')}</Typography>
                <Typography className={classes.statLabel}>Members</Typography>
              </Box>
              <Box className={classes.statBlock}>
                <Typography className={classes.statValue}>{friendCount.toLocaleString('en-IN')}</Typography>
                <Typography className={classes.statLabel}>Friends</Typography>
              </Box>
              <Box className={classes.statBlock}>
                <Typography className={classes.statValue}>{mutualCount.toLocaleString('en-IN')}</Typography>
                <Typography className={classes.statLabel}>Mutual Friends</Typography>
              </Box>
            </Box>

            <Box className={classes.hint}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11Z" stroke={colors.accentGreen} strokeWidth="1.7" strokeLinejoin="round" />
                <path d="M9 11.5l2 2 4-4" stroke={colors.accentGreen} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Typography className={classes.hintText}>
                {isRevisit ? 'Tap to go back to your community' : (
                  <>Toggle <Box component="span" sx={{ fontWeight: 800, color: colors.moss }}>Join</Box> to enter the community</>
                )}
              </Typography>
            </Box>
          </Box>
        )}

        <Box className={classes.comingSoon} onClick={() => setView('explore')}>
          <Box className={classes.comingSoonIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 6v6l4 2" stroke={colors.ink4} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke={colors.ink4} strokeWidth="1.8" />
            </svg>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography className={classes.comingSoonTitle}>More communities coming soon</Typography>
            <Typography className={classes.comingSoonBody}>
              As more Malayalis join across Delhi, new communities will unlock — together forming the Delhi Malayali Network.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default OnboardingCommunityPage
