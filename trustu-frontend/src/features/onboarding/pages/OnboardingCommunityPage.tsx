import React, { useState } from 'react'
import { Box, Typography, Button, IconButton, CircularProgress, Avatar } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import { makeStyles } from 'tss-react/mui'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'
import { useSnackbar } from '@/app/SnackbarProvider'
import {
  useCommunities,
  useCommunity,
  useCommunityMembers,
  useJoinCommunity,
} from '@/features/community/hooks/useCommunityQueries'
import { PATHS } from '@/routes/paths'
import colors from '@/theme/colors'
import type { Community } from '@/types/community.types'

const useStyles = makeStyles()(() => ({
  page: {
    minHeight: '100vh',
    backgroundColor: colors.cream,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 12px',
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: '1.05rem',
    color: colors.ink,
  },
  content: {
    flex: 1,
    padding: '8px 20px 28px',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 480,
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 22,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: colors.moss,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 4px 14px ${colors.moss}55`,
  },
  step: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: colors.moss,
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  title: {
    fontWeight: 800,
    fontSize: '1.35rem',
    color: colors.ink,
  },
  subtitle: {
    fontSize: '0.85rem',
    color: colors.ink3,
    maxWidth: 340,
  },
  communityCard: {
    background: `linear-gradient(155deg, #1a7a4a 0%, ${colors.mossDeep} 100%)`,
    borderRadius: 20,
    padding: '22px 20px',
    color: '#fff',
    boxShadow: '0 8px 28px rgba(14,107,63,0.30)',
    marginBottom: 18,
  },
  communityName: {
    fontWeight: 800,
    fontSize: '1.3rem',
    color: '#fff',
    marginBottom: 10,
  },
  statsRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 14,
  },
  statBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontWeight: 800,
    fontSize: '1.05rem',
    color: '#fff',
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: '0.68rem',
    color: 'rgba(255,255,255,0.75)',
    fontWeight: 600,
  },
  joinedPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    padding: '6px 12px',
    width: 'fit-content',
  },
  joinedText: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#fff',
  },
  exploreLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 16px',
    borderRadius: 16,
    backgroundColor: colors.white,
    border: `1px solid ${colors.line}`,
    cursor: 'pointer',
    marginBottom: 20,
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    '&:hover': { borderColor: colors.moss, boxShadow: '0 4px 14px rgba(0,0,0,0.06)' },
  },
  exploreIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    background: colors.mossSoft,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  exploreTextWrap: {
    flex: 1,
  },
  exploreTitle: {
    fontWeight: 700,
    fontSize: '0.88rem',
    color: colors.ink,
  },
  exploreSubtitle: {
    fontSize: '0.74rem',
    color: colors.ink3,
    marginTop: 1,
  },
  continueBtn: {
    marginTop: 'auto',
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    borderRadius: 12,
    padding: '13px 0',
    backgroundColor: colors.moss,
    '&:hover': { backgroundColor: colors.mossDeep },
  },
  // ── Explore Communities list view ──────────────────────────────────────────
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    borderRadius: 16,
    backgroundColor: colors.white,
    border: `1px solid ${colors.line}`,
  },
  rowAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: `linear-gradient(135deg, ${colors.moss}, ${colors.mossDeep})`,
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
  },
  rowInfo: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    fontWeight: 700,
    fontSize: '0.88rem',
    color: colors.ink,
  },
  rowMeta: {
    fontSize: '0.74rem',
    color: colors.ink3,
    marginTop: 1,
  },
  joinBtn: {
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.76rem',
    borderRadius: 10,
    backgroundColor: colors.moss,
    color: '#fff',
    padding: '6px 14px',
    minWidth: 0,
    flexShrink: 0,
    '&:hover': { backgroundColor: colors.mossDeep },
  },
  emptyBox: {
    textAlign: 'center',
    padding: '32px 16px',
    color: colors.ink3,
    fontSize: '0.85rem',
  },
}))

// ── Explore Communities sub-screen ─────────────────────────────────────────────
const ExploreCommunities: React.FC<{ myCommunityId?: string | null; onBack: () => void }> = ({
  myCommunityId,
  onBack,
}) => {
  const { classes } = useStyles()
  const { data: communities = [], isLoading } = useCommunities()
  const joinMutation = useJoinCommunity()
  const { showSuccess, showError } = useSnackbar()
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set())

  const others = communities.filter((c) => c.id !== myCommunityId)

  const handleJoin = (community: Community) => {
    joinMutation.mutate(community.id, {
      onSuccess: () => {
        setJoinedIds((prev) => new Set(prev).add(community.id))
        showSuccess(`Joined ${community.name}`)
      },
      onError: () => showError('Could not join this community. Please try again.'),
    })
  }

  return (
    <Box className={classes.page}>
      <Box className={classes.header}>
        <IconButton onClick={onBack} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography className={classes.headerTitle}>Explore Communities</Typography>
      </Box>

      <Box className={classes.content}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress size={26} sx={{ color: colors.moss }} />
          </Box>
        )}

        {!isLoading && others.length === 0 && (
          <Box className={classes.emptyBox}>No other communities to show yet.</Box>
        )}

        {!isLoading && others.length > 0 && (
          <Box className={classes.list}>
            {others.map((c) => {
              const joined = joinedIds.has(c.id)
              return (
                <Box key={c.id} className={classes.row}>
                  <Avatar className={classes.rowAvatar}>
                    {c.name.slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Box className={classes.rowInfo}>
                    <Typography className={classes.rowName}>{c.name}</Typography>
                    <Typography className={classes.rowMeta}>
                      {c.memberCount > 0 ? `${c.memberCount.toLocaleString('en-IN')} members` : 'New community'}
                    </Typography>
                  </Box>
                  {joined ? (
                    <Box className={classes.joinedPill} sx={{ backgroundColor: colors.mossSoft }}>
                      <CheckCircleIcon sx={{ fontSize: '0.9rem', color: colors.moss }} />
                      <Typography className={classes.joinedText} sx={{ color: colors.moss }}>Joined</Typography>
                    </Box>
                  ) : (
                    <Button
                      disableElevation
                      className={classes.joinBtn}
                      onClick={() => handleJoin(c)}
                      disabled={joinMutation.isPending}
                    >
                      Join
                    </Button>
                  )}
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
    </Box>
  )
}

// ── Main onboarding screen ──────────────────────────────────────────────────────
const OnboardingCommunityPage: React.FC = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [view, setView] = useState<'main' | 'explore'>('main')

  // Reached mid-app (e.g. tapping the sub-communities chip on the Community tab)
  // rather than fresh off registration — show a way back out in that case.
  const isRevisit = Boolean((location.state as { revisit?: boolean } | null)?.revisit)

  const { data: myCommunity, isLoading } = useCommunity(user?.communityId)
  // GET /communities/{id} doesn't return a member_count field — the real count
  // only comes from the paginated members endpoint (same source MembersTab uses).
  const { data: membersPage } = useCommunityMembers(user?.communityId, 1)

  const handleContinue = () =>
    isRevisit ? navigate(-1) : navigate(PATHS.dashboard.community, { replace: true })

  if (view === 'explore') {
    return <ExploreCommunities myCommunityId={user?.communityId} onBack={() => setView('main')} />
  }

  const communityName = myCommunity?.name ?? user?.communityName ?? 'Your Community'
  const memberCount = membersPage?.meta?.total ?? 0
  const subCommCount = myCommunity?.subCommunities?.length ?? 0

  return (
    <Box className={classes.page}>
      {isRevisit && (
        <Box className={classes.header} sx={{ justifyContent: 'flex-end' }}>
          <IconButton size="small" onClick={() => navigate(-1)} aria-label="Close">
            <CloseIcon sx={{ fontSize: '1.1rem' }} />
          </IconButton>
        </Box>
      )}
      <Box className={classes.content}>
        <Box className={classes.hero}>
          <Box className={classes.heroIcon}>
            <GroupsOutlinedIcon sx={{ color: '#fff', fontSize: 32 }} />
          </Box>
          <Typography className={classes.step}>Step 2 of 2</Typography>
          <Typography className={classes.title}>Communities you belong to</Typography>
          <Typography className={classes.subtitle}>
            Based on your details, we've matched you with a local community.
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={26} sx={{ color: colors.moss }} />
          </Box>
        ) : (
          <Box className={classes.communityCard}>
            <Typography className={classes.communityName}>{communityName}</Typography>
            <Box className={classes.statsRow}>
              <Box className={classes.statBlock}>
                <Typography className={classes.statValue}>
                  {memberCount > 0 ? memberCount.toLocaleString('en-IN') : '—'}
                </Typography>
                <Typography className={classes.statLabel}>MEMBERS</Typography>
              </Box>
              {subCommCount > 0 && (
                <Box className={classes.statBlock}>
                  <Typography className={classes.statValue}>{subCommCount}</Typography>
                  <Typography className={classes.statLabel}>SUB-COMMUNITIES</Typography>
                </Box>
              )}
            </Box>
            <Box className={classes.joinedPill}>
              <CheckCircleIcon sx={{ fontSize: '0.9rem', color: '#fff' }} />
              <Typography className={classes.joinedText}>You're in!</Typography>
            </Box>
          </Box>
        )}

        <Box className={classes.exploreLink} onClick={() => setView('explore')}>
          <Box className={classes.exploreIcon}>
            <ExploreOutlinedIcon sx={{ color: colors.moss, fontSize: '1.15rem' }} />
          </Box>
          <Box className={classes.exploreTextWrap}>
            <Typography className={classes.exploreTitle}>Explore Communities</Typography>
            <Typography className={classes.exploreSubtitle}>See other Kerala communities across Delhi</Typography>
          </Box>
          <ChevronRightIcon sx={{ color: colors.ink3 }} />
        </Box>

        <Button
          fullWidth
          variant="contained"
          disableElevation
          className={classes.continueBtn}
          onClick={handleContinue}
        >
          {isRevisit ? 'Back to Community' : 'Continue'}
        </Button>
      </Box>
    </Box>
  )
}

export default OnboardingCommunityPage
