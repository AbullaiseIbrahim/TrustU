import React, { useState, useRef, useEffect } from 'react'
import { Box, Typography, Avatar, Tooltip } from '@mui/material'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { makeStyles } from 'tss-react/mui'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import CreatePostInput from '../components/CreatePostInput'
import PostCard from '../components/PostCard'
import { usePosts } from '../hooks/usePostQueries'
import ContentSkeleton from '@/components/ContentSkeleton'
import EmptyState from '@/components/EmptyState'
import PersonCard from '@/components/PersonCard'
import { useAuth } from '@/app/AuthProvider'
import {
  useFriends,
  usePendingRequests,
  useAcceptRequest,
  useRejectRequest,
  useRemoveFriend,
  useSendFriendRequest,
  useCancelFriendRequest,
  useFriendsOfFriends,
} from '@/features/circle/hooks/useFriendshipQueries'
import type { Friend, PendingRequest } from '@/services/friendship.api'
import UserProfileSheet, { type ProfileSheetUser } from '../components/UserProfileSheet'
import { useCommunityMembers, useCommunity, useNewCommunityMembers } from '../hooks/useCommunityQueries'
import type { CommunityMember } from '@/types/community.types'
import { getInitials, formatCommunityName, communityLocation, formatRelativeTime } from '@/utils'
import colors from '@/theme/colors'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import { useAccommodations } from '@/features/accommodation/hooks/useAccommodationQueries'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

type Tab = 'feed' | 'members' | 'friends' | 'mutual'

export const useStyles = makeStyles()(() => ({
  // ── Community gradient card ────────────────────────────────────────────────
  communityCard: {
    background: `linear-gradient(150deg, #2A8A52 0%, ${colors.mossDeep} 80%)`,
    borderRadius: 22,
    margin: '4px 16px 14px',
    padding: '24px 22px 22px',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    animation: 'fadeSlideUp 0.3s ease both',
    boxShadow: '0 14px 30px -16px rgba(15,86,48,0.55)',
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
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.28)' },
    '&:active': { transform: 'scale(0.97)' },
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
    lineHeight: 1.4,
  },
  subCommLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
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

  // ── New default-view community card elements (mockup: badge, location,
  // stats row, larger avatar row, tagline). Kept separate from the classes
  // above so the Network view (isNetworkView) keeps its original, untouched
  // layout until it gets its own design pass. ────────────────────────────────
  communityContent: {
    position: 'relative',
  },
  communityBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    padding: '5px 12px 5px 10px',
    marginBottom: 14,
  },
  communityBadgeText: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '#fff',
  },
  communityNameLg: {
    fontWeight: 800,
    fontSize: '1.65rem',
    letterSpacing: '-0.6px',
    lineHeight: 1.15,
    margin: '0 0 8px',
    color: '#fff',
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: '0.95rem !important',
    color: '#fff',
  },
  locationText: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.85)',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 5,
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'inherit',
  },
  statNumber: {
    fontSize: '0.98rem',
    fontWeight: 800,
    color: '#fff',
  },
  statAmber: {
    color: colors.amber,
  },
  statLabel: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.75)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    width: 1,
    height: 14,
    background: 'rgba(255,255,255,0.3)',
  },
  infoIcon: {
    fontSize: '0.78rem !important',
    color: 'rgba(255,255,255,0.55)',
  },
  avatarStackLg: {
    display: 'flex',
    marginBottom: 14,
  },
  stackAvatarLg: {
    width: 38,
    height: 38,
    fontSize: '0.72rem',
    fontWeight: 700,
    border: '2px solid rgba(255,255,255,0.55)',
    marginLeft: -10,
    '&:first-of-type': { marginLeft: 0 },
    background: 'rgba(255,255,255,0.22)',
    color: '#fff',
  },
  avatarOverflow: {
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  tagline: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 4px',
  },
  taglineSub: {
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 500,
    lineHeight: 1.4,
    margin: 0,
  },
  mosqueDecor: {
    position: 'absolute',
    right: -10,
    top: 0,
    bottom: 0,
    height: '100%',
    width: 200,
    opacity: 0.2,
    pointerEvents: 'none',
    WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 96%)',
    maskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 96%)',
  },
  communityPhoto: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundImage: 'url(/images/jamia-nagar.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'right center',
    pointerEvents: 'none',
  },
  communityPhotoScrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: `linear-gradient(100deg, ${colors.mossDeep} 0%, ${colors.mossDeep} 30%, rgba(15,86,48,0.72) 52%, rgba(15,86,48,0.25) 78%, rgba(15,86,48,0) 100%)`,
    pointerEvents: 'none',
  },

  // ── Tab bar ────────────────────────────────────────────────────────────────
  tabBar: {
    margin: '4px 16px 14px',
  },
  tabRow: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: 'inherit',
    outline: 'none',
    boxShadow: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    WebkitTapHighlightColor: 'transparent',
    '&:focus': { outline: 'none', boxShadow: 'none' },
    '&:focus-visible': { outline: 'none', boxShadow: 'none' },
  },
  tabPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '7px 15px',
    borderRadius: 8,
    fontSize: '0.76rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    color: colors.ink3,
    background: 'transparent',
    boxShadow: 'none',
    transition: 'all 0.18s ease',
  },
  tabPillActive: {
    color: colors.moss,
    background: colors.mossSoft,
  },
  tabIcon: {
    fontSize: '1.05rem !important',
  },
  tabBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 15,
    height: 15,
    padding: '0 4px',
    borderRadius: 8,
    fontSize: '0.58rem',
    fontWeight: 700,
    lineHeight: 1,
    background: colors.error,
    color: '#fff',
    verticalAlign: 'middle',
  },

  // ── Friends horizontal scroll ──────────────────────────────────────────────
  // Accommodation summary card (Feed tab)
  accomCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    margin: '4px 16px 14px',
    padding: '16px',
    boxShadow: '0 0 2px rgba(20,20,15,0.04), 0 0 22px rgba(20,20,15,0.05)',
  },
  accomTitle: {
    fontWeight: 800,
    fontSize: '1rem',
    color: colors.ink,
    margin: 0,
  },
  accomSubtitle: {
    fontSize: '0.78rem',
    color: colors.ink3,
    fontWeight: 500,
    margin: '2px 0 14px',
  },
  accomStatsRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 14,
  },
  accomStat: {
    flex: 1,
    minWidth: 0,
    borderRadius: 14,
    padding: '14px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
  },
  accomStatGreen: { backgroundColor: '#F3FAF4' },
  accomStatAmber: { backgroundColor: '#FCFAF0' },
  accomStatGrey: { backgroundColor: '#FAFAF9' },
  accomStatTopRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  accomStatIcon: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  accomStatIconGreen: { backgroundColor: '#CDE7D1', color: colors.mossDeep },
  accomStatIconAmber: { backgroundColor: '#F6E192', color: '#A6861F' },
  accomStatIconGrey: { backgroundColor: '#E6E6E4', color: colors.ink },
  accomStatNumber: {
    fontWeight: 800,
    fontSize: '1.2rem',
    lineHeight: 1,
  },
  accomStatNumberGreen: { color: colors.mossDeep },
  accomStatNumberAmber: { color: '#A6861F' },
  accomStatNumberGrey: { color: colors.ink },
  accomStatLabel: {
    fontSize: '0.72rem',
    fontWeight: 500,
    color: colors.ink,
    lineHeight: 1.35,
  },
  accomStatLabelGreen: { color: colors.mossDeep, fontWeight: 700 },
  accomStatLabelAmber: { color: '#A6861F', fontWeight: 700 },
  accomStatLabelGrey: { color: colors.ink, fontWeight: 700 },
  accomExploreBtn: {
    width: '100%',
    borderRadius: 14,
    padding: '12px 16px',
    background: `linear-gradient(135deg, ${colors.moss} 0%, ${colors.mossDeep} 100%)`,
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.88rem',
    textTransform: 'none',
    boxShadow: '0 6px 18px rgba(14,107,63,0.30)',
    '&:hover': {
      background: `linear-gradient(135deg, ${colors.moss} 0%, ${colors.mossDeep} 100%)`,
      boxShadow: '0 8px 22px rgba(14,107,63,0.36)',
    },
  },

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

  // ── Discover tab ────────────────────────────────────────
  discoverIntro: {
    padding: '4px 16px 2px',
  },
  discoverIntroTitle: {
    fontWeight: 800,
    fontSize: '1.05rem',
    color: colors.ink,
    lineHeight: 1.25,
  },
  discoverIntroSub: {
    fontSize: '0.8rem',
    color: colors.ink3,
    marginTop: 2,
  },
  discoverSection: {
    marginTop: 18,
  },
  discoverSectionCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    margin: '0 16px',
    padding: '14px 14px 12px',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 6px 22px rgba(20,20,15,0.05)',
  },
  discoverSectionHead: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '0 0 10px',
    gap: 8,
  },
  discoverSectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  discoverSectionTitle: {
    fontWeight: 700,
    fontSize: '0.92rem',
    color: colors.ink,
  },
  discoverNewBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '1px 7px',
    borderRadius: 8,
    fontSize: '0.6rem',
    fontWeight: 800,
    letterSpacing: '0.3px',
    color: '#fff',
    backgroundColor: colors.moss,
  },
  discoverSectionSub: {
    fontSize: '0.76rem',
    color: colors.ink3,
    marginTop: 2,
  },
  seeAllLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontSize: '0.78rem',
    fontWeight: 700,
    color: colors.moss,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    background: 'none',
    border: 'none',
    fontFamily: 'inherit',
    padding: '2px 0',
    WebkitTapHighlightColor: 'transparent',
  },
  discoverAvatarLg: {
    width: 54,
    height: 54,
    fontSize: '1rem',
    fontWeight: 700,
  },
  discoverAvatarName: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: colors.ink,
    textAlign: 'center',
    maxWidth: 66,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  discoverCardScroll: {
    display: 'flex',
    gap: 12,
    padding: '0 0 2px',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  discoverEmpty: {
    margin: '0 16px',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: '24px 16px',
    textAlign: 'center',
    color: colors.ink3,
    fontSize: '0.85rem',
  },
  discoverNoData: {
    padding: '4px 0 2px',
    color: colors.ink3,
    fontSize: '0.8rem',
    lineHeight: 1.4,
  },
  discoverSectionIcon: {
    fontSize: '1.05rem !important',
    color: colors.moss,
    flexShrink: 0,
  },

  // ── Discover detail page ────────────────────────────────────
  discoverPageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px 14px',
  },
  discoverPageTitle: {
    fontWeight: 800,
    fontSize: '1.1rem',
    color: colors.ink,
  },
  discoverPillRow: {
    display: 'flex',
    gap: 8,
    padding: '0 16px 16px',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  discoverPill: {
    flexShrink: 0,
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: '0.8rem',
    fontWeight: 700,
    color: colors.ink3,
    backgroundColor: colors.white,
    border: `1px solid ${colors.line}`,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
    WebkitTapHighlightColor: 'transparent',
  },
  discoverPillActive: {
    color: '#fff',
    backgroundColor: colors.mossDeep,
    borderColor: colors.mossDeep,
  },
  ctaBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '4px 16px 22px',
    padding: '14px 16px',
    borderRadius: 16,
    backgroundColor: colors.mossSoft,
    cursor: 'pointer',
    border: 'none',
    width: 'calc(100% - 32px)',
    textAlign: 'left',
    fontFamily: 'inherit',
    WebkitTapHighlightColor: 'transparent',
  },
  ctaBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ctaBannerTitle: {
    fontWeight: 700,
    fontSize: '0.85rem',
    color: colors.ink,
  },
  ctaBannerSub: {
    fontSize: '0.74rem',
    color: colors.ink3,
    marginTop: 2,
  },
  popularGrid: {
    display: 'flex',
    gap: 16,
    padding: '0 16px 4px',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  popularItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
    width: 68,
  },

  // -- Discover person list (detail page) -- one white card per section,
  // rows separated by divider lines, Add Friend button on the right. -----
  discoverListCardHeader: {
    padding: '14px 14px 10px',
  },
  discoverListCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    margin: '0 16px',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 6px 22px rgba(20,20,15,0.05)',
  },
  discoverListRow: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 44px 12px 14px',
    cursor: 'pointer',
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${colors.line}`,
    },
  },
  discoverPersonAvatar: {
    width: 52,
    height: 52,
    fontSize: '0.92rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  discoverPersonBody: {
    flex: 1,
    minWidth: 0,
  },
  discoverPersonName: {
    fontWeight: 700,
    fontSize: '0.88rem',
    color: colors.ink,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  discoverPersonSub: {
    fontSize: '0.74rem',
    color: colors.ink3,
    marginTop: 2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  discoverPersonLocationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  discoverPersonLocationIcon: {
    fontSize: '0.8rem !important',
    color: colors.ink3,
    flexShrink: 0,
  },
  discoverPersonLocationText: {
    fontSize: '0.74rem',
    color: colors.ink3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  discoverPersonFromText: {
    fontSize: '0.72rem',
    color: colors.ink4,
    marginTop: 2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  discoverPersonDismiss: {
    position: 'absolute',
    top: 6,
    right: 6,
    color: colors.ink3,
    padding: 4,
  },
  discoverMutualRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  discoverMutualStack: {
    display: 'flex',
    flexShrink: 0,
  },
  discoverMutualStackAvatar: {
    width: 16,
    height: 16,
    fontSize: '0.45rem',
    fontWeight: 700,
    border: '2px solid #fff',
    marginLeft: -5,
    '&:first-of-type': { marginLeft: 0 },
  },
  discoverMutualText: {
    fontSize: '0.72rem',
    color: colors.ink3,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  discoverListAction: {
    flexShrink: 0,
  },

  // ── Circle sub-tab ─────────────────────────────────────────────────────────
  circleContent: {
    padding: '0 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  // Boxed member-card grid -- each member gets their own rounded card,
  // instead of one continuous list of rows, per direct request. The card
  // itself is the shared PersonCard component (src/components/PersonCard.tsx)
  // -- this is only the grid CONTAINER (2-up layout), used by Members, My
  // Friends and Pending Requests alike.
  memberCardGrid: {
    display: 'grid',
    // Fixed at 2 equal columns on every screen size -- 3-across (via
    // auto-fill) read as too cramped, so this is a flat 2-up grid rather
    // than one that reflows to 3 columns on wider viewports.
    gridTemplateColumns: 'repeat(2, 1fr)',
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
  addFriendPillOutlined: {
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.74rem',
    borderRadius: 10,
    backgroundColor: 'transparent',
    color: colors.moss,
    border: `1.5px solid ${colors.moss}`,
    '&:hover': { backgroundColor: colors.mossSoft, borderColor: colors.mossDeep },
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
  /** The user's actual joined community — shown on the Amalgam link in Network view, as opposed to the "Delhi Malayali Network" label used for the card title there. */
  joinedCommunityName?: string | null
  /** Backend community description — used as the card's subtitle tagline when present. */
  description?: string | null
  friendCount: number
  memberCount: number
  subCommCount?: number
  isNetworkView?: boolean
  onExplore?: () => void
  onSelectMembers?: () => void
  onSelectFriends?: () => void
  onSelectDiscover?: () => void
}> = ({
  communityName, joinedCommunityName, description, friendCount, memberCount, subCommCount = 0,
  isNetworkView = false, onExplore, onSelectMembers, onSelectFriends, onSelectDiscover,
}) => {
  const { classes, cx } = useStyles()
  const { data: friends = [] } = useFriends()

  // Real "friends of friends" count via GET /friends/fof -- a single,
  // backend-computed request instead of the N+1 useMutualFriendsAggregate
  // (that hook is no longer used anywhere in the app -- see its docstring in
  // useFriendshipQueries.ts for why).
  const { data: fofPeople = [] } = useFriendsOfFriends()
  const mutualFriendsCount = fofPeople.length

  // ── Network view keeps its original, simpler layout for now — it has its
  // own semantics (aggregate name, sub-community switcher link) that the new
  // per-community design below hasn't been adapted for yet. ──────────────
  if (isNetworkView) {
    const first5 = (friends as Friend[]).slice(0, 5)
    return (
      <Box className={classes.communityCard}>
        <svg className={classes.leafDecor} width={180} height={180} viewBox="0 0 180 180" fill="none">
          <ellipse cx={90} cy={90} rx={80} ry={110} fill="#fff" transform="rotate(-25 90 90)" />
        </svg>

        <Typography className={classes.communityName}>
          {communityName ?? 'My Community'}
        </Typography>

        <Box
          component="button"
          className={classes.membersPill}
          onClick={onSelectMembers}
          sx={{ border: 'none', fontFamily: 'inherit', cursor: onSelectMembers ? 'pointer' : 'default' }}
        >
          <svg width={13} height={13} viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          <Typography className={classes.membersPillText}>
            {memberCount.toLocaleString('en-IN')} Members
          </Typography>
        </Box>

        <Typography className={classes.friendsLine}>
          {friendCount.toLocaleString('en-IN')} Friends · {mutualFriendsCount.toLocaleString('en-IN')} Mutual Friends
        </Typography>

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

        {subCommCount > 0 && (
          <Box className={classes.subCommLink} onClick={onExplore}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
            <Typography className={classes.subCommText}>
              {joinedCommunityName ?? 'My Community'}
            </Typography>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </Box>
        )}
      </Box>
    )
  }

  // ── Default per-community view — matches the approved mockup: a "Your
  // Community" badge, name, locality line, a Members / Friends / Friends of
  // Friends stat row, a real avatar row, and a tagline + description. ────
  const location = communityLocation(communityName)
  const subtitle = description?.trim() ||
    (location ? 'Malayalis living, studying and working around Jamia Nagar.' : null)
  const AVATAR_CAP = 4
  const shownFriends = (friends as Friend[]).slice(0, AVATAR_CAP)
  const overflowCount = Math.max((friends as Friend[]).length - AVATAR_CAP, 0)

  return (
    <Box className={classes.communityCard}>
      {/* Background photo — a real Jamia Nagar mosque photo (watermark
          removed), layered under a left-to-right scrim so the badge/name/
          stats/tagline stay legible while the photo shows through on the
          right, matching the approved mockup. There is no backend field for
          community imagery/locality yet, so this (like
          communityLocation/formatCommunityName in src/utils/index.ts) is
          special-cased for the one live pilot community. Swap the image URL
          for a real per-community asset once the product has more than one
          community. */}
      {location && (
        <>
          <Box className={classes.communityPhoto} aria-hidden="true" />
          <Box className={classes.communityPhotoScrim} aria-hidden="true" />
        </>
      )}

      <Box className={classes.communityContent}>
      {/* "Your Community" badge */}
      <Box className={classes.communityBadge}>
        <PeopleAltOutlinedIcon sx={{ fontSize: '0.85rem', color: '#fff' }} />
        <Typography className={classes.communityBadgeText}>Your Community</Typography>
      </Box>

      {/* Community name — large bold */}
      <Typography className={classes.communityNameLg}>
        {communityName ?? 'My Community'}
      </Typography>

      {/* Locality — only shown while we have one to show (see communityLocation) */}
      {location && (
        <Box className={classes.locationRow}>
          <PlaceOutlinedIcon className={classes.locationIcon} />
          <Typography className={classes.locationText}>{location}</Typography>
        </Box>
      )}

      {/* Members / Friends / Friends of Friends */}
      <Box className={classes.statsRow}>
        <Box
          component="button"
          className={classes.statItem}
          onClick={onSelectMembers}
          sx={{ cursor: onSelectMembers ? 'pointer' : 'default' }}
        >
          <Typography className={classes.statNumber}>{memberCount.toLocaleString('en-IN')}</Typography>
          <Typography className={classes.statLabel}>Members</Typography>
        </Box>
        <Box className={classes.statDivider} />
        <Box
          component="button"
          className={classes.statItem}
          onClick={onSelectFriends}
          sx={{ cursor: onSelectFriends ? 'pointer' : 'default' }}
        >
          <Typography className={classes.statNumber}>{friendCount.toLocaleString('en-IN')}</Typography>
          <Typography className={classes.statLabel}>Friends</Typography>
        </Box>
        <Box className={classes.statDivider} />
        <Tooltip
          title="Friends of your friends — people you're not connected to yet, but share a mutual connection with."
          arrow
        >
          <Box
            component="button"
            className={classes.statItem}
            onClick={onSelectDiscover}
            sx={{ cursor: onSelectDiscover ? 'pointer' : 'default' }}
          >
            <Typography className={cx(classes.statNumber, classes.statAmber)}>
              {mutualFriendsCount.toLocaleString('en-IN')}
            </Typography>
            <Typography className={classes.statLabel}>
              Friends of Friends
              <InfoOutlinedIcon className={classes.infoIcon} />
            </Typography>
          </Box>
        </Tooltip>
      </Box>

      {/* Avatar row — real friends, photo where available, initials otherwise,
          capped with a "+N" overflow badge so this never grows unbounded. */}
      {shownFriends.length > 0 && (
        <Box className={classes.avatarStackLg}>
          {shownFriends.map((f) => (
            <Avatar
              key={f.id}
              className={classes.stackAvatarLg}
              src={f.avatarUrl ?? undefined}
            >
              {getInitials(f.name)}
            </Avatar>
          ))}
          {overflowCount > 0 && (
            <Avatar className={cx(classes.stackAvatarLg, classes.avatarOverflow)}>
              +{overflowCount}
            </Avatar>
          )}
        </Box>
      )}

      {/* Tagline + description */}
      <Typography className={classes.tagline}>Your people are here.</Typography>
      {subtitle && (
        <Typography className={classes.taglineSub}>{subtitle}</Typography>
      )}
      </Box>
    </Box>
  )
}

// ── Friends horizontal scroll row ─────────────────────────────────────────────
const AccommodationSummaryCard: React.FC = () => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()
  const { data } = useAccommodations()
  const listings = data?.data ?? []
  const friendsCount = listings.filter((a) => a.isConnected).length
  const mutualCount = listings.filter((a) => a.mutualFriends > 0).length
  // meta.total is the backend's real total (the list itself may only be one
  // page), so it's the more accurate "everyone in the community" count --
  // but this endpoint currently doesn't send total/meta at all, and the API
  // layer defaults a missing total to 0 (not undefined), so `?? listings.length`
  // never kicked in. `||` falls back whenever total is falsy (missing OR a
  // genuine 0), which is what we want either way.
  const communityCount = data?.meta?.total || listings.length

  return (
    <Box className={classes.accomCard}>
      <Typography className={classes.accomTitle}>Accommodation in your community</Typography>
      <Typography className={classes.accomSubtitle}>Find a place through people you know and trust.</Typography>

      <Box className={classes.accomStatsRow}>
        <Box className={cx(classes.accomStat, classes.accomStatGreen)}>
          <Box className={classes.accomStatTopRow}>
            <Box className={cx(classes.accomStatIcon, classes.accomStatIconGreen)}>
              <PeopleAltIcon sx={{ fontSize: '1rem' }} />
            </Box>
            <Typography className={cx(classes.accomStatNumber, classes.accomStatNumberGreen)}>{friendsCount}</Typography>
          </Box>
          <Typography className={classes.accomStatLabel}>
            Listings from <Box component="span" className={classes.accomStatLabelGreen}>your friends</Box>
          </Typography>
        </Box>

        <Box className={cx(classes.accomStat, classes.accomStatAmber)}>
          <Box className={classes.accomStatTopRow}>
            <Box className={cx(classes.accomStatIcon, classes.accomStatIconAmber)}>
              <PeopleAltIcon sx={{ fontSize: '1rem' }} />
            </Box>
            <Typography className={cx(classes.accomStatNumber, classes.accomStatNumberAmber)}>{mutualCount}</Typography>
          </Box>
          <Typography className={classes.accomStatLabel}>
            Listings from <Box component="span" className={classes.accomStatLabelAmber}>mutual connections</Box>
          </Typography>
        </Box>

        <Box className={cx(classes.accomStat, classes.accomStatGrey)}>
          <Box className={classes.accomStatTopRow}>
            <Box className={cx(classes.accomStatIcon, classes.accomStatIconGrey)}>
              <PeopleAltIcon sx={{ fontSize: '1rem' }} />
            </Box>
            <Typography className={cx(classes.accomStatNumber, classes.accomStatNumberGrey)}>{communityCount}</Typography>
          </Box>
          <Typography className={classes.accomStatLabel}>
            Listings from <Box component="span" className={classes.accomStatLabelGrey}>community members</Box>
          </Typography>
        </Box>
      </Box>

      <Button
        className={classes.accomExploreBtn}
        endIcon={<ArrowForwardIcon />}
        onClick={() => navigate(PATHS.dashboard.accommodation)}
      >
        Explore Accommodation
      </Button>
    </Box>
  )
}

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
      <Box className={classes.circleCardHeader}>
        <Typography className={classes.circleCardTitle}>My Friends ({list.length})</Typography>
      </Box>
      {list.length === 0 ? (
        <Typography className={classes.emptyRow}>No friends yet</Typography>
      ) : (
        <Box className={classes.memberCardGrid}>
          {list.map((f) => (
            <PersonCard
              key={f.id}
              name={f.name}
              avatarUrl={f.avatarUrl}
              colorSeed={f.id}
              subtitle={f.designation}
              capitalizeSubtitle
              onClick={() => setViewingUser({ userId: f.userId, name: f.name, designation: f.designation, avatarUrl: f.avatarUrl, communityName: f.communityName })}
              action={(
                <Button
                  disableElevation
                  className={classes.removePill}
                  onClick={() => removeMutation.mutate(f.userId)}
                  disabled={removeMutation.isPending}
                >
                  Remove
                </Button>
              )}
            />
          ))}
        </Box>
      )}

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
      <Box className={classes.circleCardHeader}>
        <Typography className={classes.circleCardTitle}>Pending Requests ({list.length})</Typography>
      </Box>
      {list.length === 0 ? (
        <Typography className={classes.emptyRow}>No pending requests</Typography>
      ) : (
        <Box className={classes.memberCardGrid}>
          {list.map((req) => (
            <PersonCard
              key={req.id}
              name={req.name}
              avatarUrl={req.avatarUrl}
              colorSeed={req.id}
              subtitle={req.designation}
              capitalizeSubtitle
              onClick={() => setViewingUser({ userId: req.userId, name: req.name, designation: req.designation, avatarUrl: req.avatarUrl, communityName: req.communityName })}
              action={(
                <Box className={classes.requestActions} sx={{ width: '100%' }}>
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
              )}
            />
          ))}
        </Box>
      )}

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
export const MutualAddFriendButton: React.FC<{ userId: string; outlined?: boolean }> = ({ userId, outlined }) => {
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
      className={outlined ? classes.addFriendPillOutlined : classes.addFriendPill}
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

// Status-aware "Add Friend" pill for New Members cards (reflects
// pending/requested state from the community-members API's
// friendshipStatus) -- unlike MutualAddFriendButton above, which is safe to
// assume "not connected yet" always because useFriendsOfFriends'
// GET /friends/fof already excludes direct friends from its result.
export const NewMemberAddFriendButton: React.FC<{ member: CommunityMember; outlined?: boolean }> = ({ member, outlined }) => {
  const { classes } = useStyles()
  const [localStatus, setLocalStatus] = useState<'requested' | 'none' | null>(null)
  const sendRequestMutation = useSendFriendRequest()
  const cancelRequestMutation = useCancelFriendRequest()

  const serverStatus = deriveFriendStatus(member.friendshipStatus)
  const isRequested = localStatus === 'requested' || (serverStatus === 'requested' && localStatus !== 'none')

  if (isRequested) {
    return (
      <Button
        variant="outlined"
        className={classes.requestedPill}
        endIcon={<CloseIcon sx={{ fontSize: '0.8rem !important' }} />}
        onClick={(e) => {
          e.stopPropagation()
          cancelRequestMutation.mutate(member.userId)
          setLocalStatus('none')
        }}
        disabled={cancelRequestMutation.isPending}
      >
        Requested
      </Button>
    )
  }

  return (
    <Button
      disableElevation
      className={outlined ? classes.addFriendPillOutlined : classes.addFriendPill}
      onClick={(e) => {
        e.stopPropagation()
        sendRequestMutation.mutate(member.userId)
        setLocalStatus('requested')
      }}
      disabled={sendRequestMutation.isPending}
    >
      Add Friend
    </Button>
  )
}

// -- Discover tab -- real, derivable suggestions only. Two sections:
//  - "Friends of your friends" -- useFriendsOfFriends (GET /friends/fof), a
//    flat, backend-computed list. (The old useMutualFriendsAggregate N+1
//    approach turned out to compute something different and often-empty --
//    GET /friends/mutual/{userId} is a true set intersection of "friends of
//    mine AND of userId", not "userId's friends", so it rarely surfaced real
//    second-degree connections. /friends/fof replaces it here; per-person
//    mutual counts aren't available from it, so that caption is gone too.)
//  - "New members" -- useNewCommunityMembers (the community members list,
//    sorted by join date; see that hook for the fallback used if join dates
//    aren't populated).
// A third mockup section, "People you may know" (dismiss button, "from
// <city>" suggestions), has no backend data source anywhere in this app yet
// and is intentionally left out rather than filled with placeholder people.
// `friends` is no longer read directly (useFriendsOfFriends below fetches
// its own data) but stays in the prop type so the call site doesn't need to
// change what it passes in.
const DiscoverTab: React.FC<{ friends: Friend[]; communityId?: string | null; currentUserId?: string }> = ({
  communityId, currentUserId,
}) => {
  const { classes } = useStyles()
  const navigate = useNavigate()

  const { data: mutuals = [], isLoading: mutualsLoading } = useFriendsOfFriends()
  const { members: newMembers, isLoading: membersLoading } = useNewCommunityMembers(communityId, currentUserId)

  const [viewingUser, setViewingUser] = useState<ProfileSheetUser | null>(null)

  return (
    <Box>
      <Box className={classes.discoverIntro}>
        <Typography className={classes.discoverIntroTitle}>Discover people in your community</Typography>
        <Typography className={classes.discoverIntroSub}>Connect with more people you know or may know.</Typography>
      </Box>

      {/* Friends of your friends -- header + row live together inside one
          white card, matching the reference design. Always shows; "No data
          yet" when useFriendsOfFriends comes back empty, which happens when
          you have no friends yet, or your friends have no connections beyond
          people you already know. */}
      <Box className={classes.discoverSection}>
        <Box className={classes.discoverSectionCard}>
          <Box className={classes.discoverSectionHead}>
            <Box>
              <Box className={classes.discoverSectionTitleRow}>
                <PeopleAltOutlinedIcon className={classes.discoverSectionIcon} />
                <Typography className={classes.discoverSectionTitle}>Friends of your friends</Typography>
              </Box>
              <Typography className={classes.discoverSectionSub}>People mostly connected in your network</Typography>
            </Box>
            {mutuals.length > 0 && (
              <Box
                component="button"
                className={classes.seeAllLink}
                onClick={() => navigate(`${PATHS.dashboard.discover}?filter=friends-of-friends`)}
              >
                See all <ChevronRightIcon sx={{ fontSize: '1rem' }} />
              </Box>
            )}
          </Box>
          {mutualsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={22} sx={{ color: colors.moss }} />
            </Box>
          ) : mutuals.length === 0 ? (
            <Typography className={classes.discoverNoData}>
              No data yet. Once your friends add their own friends, people you&apos;re not connected to yet will show up here.
            </Typography>
          ) : (
            // Shared PersonCard (src/components/PersonCard.tsx) -- same box
            // look as the "New members" section below (per direct request that
            // these two sections match, and a later request to stop duplicating
            // that box design per-section and reuse one component instead), each
            // with its own Add Friend action via MutualAddFriendButton rather
            // than New Members' status-aware one.
            <Box className={classes.discoverCardScroll}>
              {mutuals.slice(0, 12).map((f) => (
                <PersonCard
                  key={f.id}
                  variant="scroll"
                  name={f.name}
                  avatarUrl={f.avatarUrl}
                  colorSeed={f.id}
                  onClick={() => setViewingUser({ userId: f.userId, name: f.name, designation: f.designation, avatarUrl: f.avatarUrl })}
                  action={<MutualAddFriendButton userId={f.userId} />}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* New members -- same white-card + "always show, or say no data"
          treatment. */}
      <Box className={classes.discoverSection}>
        <Box className={classes.discoverSectionCard}>
          <Box className={classes.discoverSectionHead}>
            <Box>
              <Box className={classes.discoverSectionTitleRow}>
                <PeopleAltOutlinedIcon className={classes.discoverSectionIcon} />
                <Typography className={classes.discoverSectionTitle}>New members</Typography>
                <Box component="span" className={classes.discoverNewBadge}>NEW</Box>
              </Box>
              <Typography className={classes.discoverSectionSub}>Recently joined your community</Typography>
            </Box>
            {newMembers.length > 0 && (
              <Box
                component="button"
                className={classes.seeAllLink}
                onClick={() => navigate(`${PATHS.dashboard.discover}?filter=new-members`)}
              >
                See all <ChevronRightIcon sx={{ fontSize: '1rem' }} />
              </Box>
            )}
          </Box>
          {membersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={22} sx={{ color: colors.moss }} />
            </Box>
          ) : newMembers.length === 0 ? (
            <Typography className={classes.discoverNoData}>
              No data yet. New members will show up here as they join your community.
            </Typography>
          ) : (
            <Box className={classes.discoverCardScroll}>
              {newMembers.slice(0, 12).map((m) => (
                <PersonCard
                  key={m.id}
                  variant="scroll"
                  name={m.name}
                  avatarUrl={m.avatarUrl}
                  colorSeed={m.userId}
                  subtitle={m.joinedAt ? `Joined ${formatRelativeTime(m.joinedAt)}` : 'New to the community'}
                  onClick={() => setViewingUser({ userId: m.userId, name: m.name, designation: m.designation, avatarUrl: m.avatarUrl })}
                  action={<NewMemberAddFriendButton member={m} />}
                />
              ))}
            </Box>
          )}
        </Box>
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

// -- Friend status helpers --------------------------------------------------
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
  const sendRequestMutation = useSendFriendRequest()
  const cancelRequestMutation = useCancelFriendRequest()

  // Optimistic overrides so the button updates instantly, before the server's
  // friendship_status catches up on the next members refetch.
  const [localStatus, setLocalStatus] = useState<Record<string, 'requested' | 'none'>>({})
  const [viewingMember, setViewingMember] = useState<{ user: ProfileSheetUser; status: 'friends' | 'requested' | 'none' } | null>(null)

  const members = data?.data ?? []
  const meta = data?.meta

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
      {members.length === 0 ? (
        <Typography className={classes.emptyRow}>No members yet</Typography>
      ) : (
        <Box className={classes.memberCardGrid}>
          {members.map((m: CommunityMember) => {
            // The community-members API already returns friendship_status per
            // member (verified reliable, and kept fresh: every friend mutation
            // below invalidates the members query), so this no longer also
            // fetches /friends separately just to cross-check it -- that was a
            // second API call on every Members-tab visit for a status this
            // endpoint already tells us directly.
            const serverStatus = deriveFriendStatus(m.friendshipStatus)
            const override = localStatus[m.userId]
            const isFriend = serverStatus === 'friends' && override !== 'none'
            const isRequested = !isFriend && (override === 'requested' || (serverStatus === 'requested' && override !== 'none'))
            // Compare real user ids (not the membership row's `id`) — coerce to
            // string defensively in case either side ever comes back numeric.
            const isSelf = !!currentUserId && String(m.userId) === String(currentUserId)
            const action = isSelf ? undefined : isFriend ? (
              <Box className={classes.friendedPill}>
                <CheckIcon sx={{ fontSize: '0.7rem', color: colors.moss }} />
                Friends
              </Box>
            ) : isRequested ? (
              <Button
                variant="outlined"
                className={classes.requestedPill}
                endIcon={<CloseIcon sx={{ fontSize: '0.8rem !important' }} />}
                onClick={() => {
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
                onClick={() => {
                  sendRequestMutation.mutate(m.userId)
                  setLocalStatus(s => ({ ...s, [m.userId]: 'requested' }))
                }}
                disabled={sendRequestMutation.isPending}
              >
                Add Friend
              </Button>
            )
            return (
              <PersonCard
                key={m.id}
                name={m.name}
                avatarUrl={m.avatarUrl}
                colorSeed={m.userId}
                subtitle={m.designation}
                capitalizeSubtitle
                onClick={() => setViewingMember({
                  user: { userId: m.userId, name: m.name, designation: m.designation, avatarUrl: m.avatarUrl },
                  status: isFriend ? 'friends' : isRequested ? 'requested' : 'none',
                })}
                action={action}
              />
            )
          })}
        </Box>
      )}

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

// ── Feed tab -- mounts/unmounts with the tab itself (like Members/Friends/
//    Discover below) so switching back to Feed always issues a fresh
//    GET /posts call rather than showing whatever was last cached. ───────────
const FeedTab: React.FC = () => {
  const { user } = useAuth()
  const { data, isLoading, isError } = usePosts(user?.communityId)
  const posts = data?.data ?? []

  return (
    <>
      <FriendsScroll />
      <AccommodationSummaryCard />
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
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
const CommunityPage: React.FC = () => {
  const { classes, cx } = useStyles()
  const { user } = useAuth()

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
  const navigate = useNavigate()
  const tabParam = searchParams.get('tab') as Tab | null
  const activeTab: Tab = (tabParam && ['feed', 'members', 'friends', 'mutual'].includes(tabParam))
    ? tabParam
    : 'feed'
  const setActiveTab = (tab: Tab) => {
    const next = new URLSearchParams(searchParams)
    tab === 'feed' ? next.delete('tab') : next.set('tab', tab)
    setSearchParams(next, { replace: true })
  }
  const activeTabRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
  }, [activeTab])

  const isNetworkView = searchParams.get('view') === 'network'
  const otherCommunities = communityDetail?.subCommunities ?? []
  const subCommCount = otherCommunities.length
  // No dedicated "network" entity in the API — the network view is the sum of
  // this community plus its sibling communities (communityDetail.subCommunities).
  const networkMemberCount = memberCount + otherCommunities.reduce((sum, c) => sum + c.memberCount, 0)
  // The network is Delhi's Malayali diaspora, not the members' native state —
  // fixed for now since the pilot only covers Delhi (see CURRENT_STATE_OPTIONS).
  const networkLabel = 'Delhi Malayali Network'

  const tabs: { key: Tab; label: string; icon: React.ReactElement; badge?: number }[] = [
    { key: 'feed',    label: 'Feed',     icon: <HomeOutlinedIcon className={classes.tabIcon} /> },
    { key: 'members', label: 'Members',  icon: <GroupsOutlinedIcon className={classes.tabIcon} /> },
    { key: 'friends', label: 'Friends',  icon: <PeopleAltOutlinedIcon className={classes.tabIcon} />, badge: pendingCount },
    { key: 'mutual',  label: 'Discover', icon: <ExploreOutlinedIcon className={classes.tabIcon} /> },
  ]

  return (
    <Box sx={{ backgroundColor: colors.cream, minHeight: '100%', pb: 2 }}>

      {/* Community gradient card */}
      <CommunityCard
        communityName={isNetworkView ? networkLabel : (user?.communityName ? formatCommunityName(user.communityName) : user?.communityName)}
        joinedCommunityName={user?.communityName ? formatCommunityName(user.communityName) : user?.communityName}
        description={communityDetail?.description}
        isNetworkView={isNetworkView}
        onExplore={() => navigate(PATHS.onboarding, { state: { revisit: true, initialView: 'explore' } })}
        onSelectMembers={() => setActiveTab('members')}
        onSelectFriends={() => setActiveTab('friends')}
        onSelectDiscover={() => setActiveTab('mutual')}
        memberCount={isNetworkView ? networkMemberCount : memberCount}
        friendCount={friendCount}
        subCommCount={subCommCount}
      />

      {/* Tab bar */}
      <Box className={classes.tabBar}>
        <Box className={classes.tabRow}>
          {tabs.map((tab) => (
            <Box
              key={tab.key}
              ref={activeTab === tab.key ? activeTabRef : undefined}
              component="button"
              className={classes.tabBtn}
              onClick={() => setActiveTab(tab.key)}
            >
              <Box className={cx(classes.tabPill, { [classes.tabPillActive]: activeTab === tab.key })}>
                {tab.icon}
                {tab.label}
                {tab.badge != null && tab.badge > 0 && (
                  <Box component="span" className={classes.tabBadge}>
                    {tab.badge}
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Feed tab */}
      {activeTab === 'feed' && <FeedTab />}

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
      {activeTab === 'mutual'  && <DiscoverTab friends={friends as Friend[]} communityId={user?.communityId} currentUserId={user?.id} />}
    </Box>
  )
}

export default CommunityPage
