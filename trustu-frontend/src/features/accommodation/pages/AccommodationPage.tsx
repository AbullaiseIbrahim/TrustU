import React, { useState, useMemo } from 'react'
import {
  Box, Typography, Avatar, Divider,
} from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import TuneIcon from '@mui/icons-material/Tune'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ShareIcon from '@mui/icons-material/Share'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import StarIcon from '@mui/icons-material/Star'
import CheckIcon from '@mui/icons-material/Check'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import WifiIcon from '@mui/icons-material/Wifi'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import SingleBedIcon from '@mui/icons-material/SingleBed'
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService'
import KitchenIcon from '@mui/icons-material/Kitchen'
import IronIcon from '@mui/icons-material/Iron'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import { makeStyles } from 'tss-react/mui'
import { useAccommodations } from '../hooks/useAccommodationQueries'
import type { Accommodation } from '@/services/accommodation.api'
import { formatINR, formatDate, getInitials } from '@/utils'
import colors from '@/theme/colors'
import EmptyState from '@/components/EmptyState'
import { useAuth } from '@/app/AuthProvider'
import { useFriends } from '@/features/circle/hooks/useFriendshipQueries'
import type { Friend } from '@/services/friendship.api'
import SharedRoomFilterSheet, {
  type SharedRoomFilters,
  EMPTY_SHARED_FILTERS,
} from '../components/SharedRoomFilterSheet'
import ContentSkeleton from '@/components/ContentSkeleton'

// ── Category definitions ───────────────────────────────────────────────────────

interface Category {
  type: number
  label: string
  desc: string
  iconBg: string[]   // gradient colors
  iconFg: string
}

const CATEGORIES: Category[] = [
  {
    type: 0,
    label: 'Flatmate Needs',
    desc: 'Find someone to share a flat with',
    iconBg: ['#1a7a4a', '#0a4d2d'],
    iconFg: '#fff',
  },
  {
    type: 1,
    label: 'Short Stays',
    desc: 'Stay for a few days or weeks',
    iconBg: ['#4aab72', '#2d8a50'],
    iconFg: '#fff',
  },
  {
    type: 2,
    label: 'Flats for Rent',
    desc: 'Rent a full flat, monthly',
    iconBg: ['#c8705a', '#a0503c'],
    iconFg: '#fff',
  },
  {
    type: 3,
    label: 'Hostels',
    desc: 'Boys & girls hostels by the month',
    iconBg: ['#c8a06a', '#a07848'],
    iconFg: '#fff',
  },
  {
    type: 4,
    label: 'Hotels',
    desc: 'Book hotel rooms by the night',
    iconBg: ['#1a3a2a', '#0a2218'],
    iconFg: '#fff',
  },
]

// Category SVG icons (path-based, 24×24 viewBox)
const CATEGORY_ICON_PATHS: Record<number, React.ReactNode> = {
  0: (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <rect x={3} y={7} width={18} height={14} rx={2} fill="rgba(255,255,255,0.25)" />
      <rect x={3} y={3} width={18} height={5} rx={1.5} fill="rgba(255,255,255,0.50)" />
      <rect x={6} y={10} width={4} height={3} rx={1} fill="#fff" />
      <rect x={14} y={10} width={4} height={3} rx={1} fill="#fff" />
      <rect x={6} y={15} width={4} height={3} rx={1} fill="#fff" />
      <rect x={14} y={15} width={4} height={3} rx={1} fill="#fff" />
    </svg>
  ),
  1: (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <path d="M12 3L3 18h18L12 3z" fill="rgba(255,255,255,0.30)" />
      <path d="M12 6L5 18h14L12 6z" fill="rgba(255,255,255,0.50)" />
      <path d="M12 9l-5 9h10L12 9z" fill="#fff" />
    </svg>
  ),
  2: (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <path d="M3 11.5L12 4l9 7.5V21H3V11.5z" fill="rgba(255,255,255,0.25)" />
      <path d="M5 12.5L12 6.8l7 5.7V19H5V12.5z" fill="rgba(255,255,255,0.50)" />
      <rect x={9} y={13} width={6} height={6} rx={1} fill="#fff" />
      <path d="M12 6.8V4" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  ),
  3: (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <rect x={3} y={5} width={18} height={16} rx={2} fill="rgba(255,255,255,0.25)" />
      <rect x={3} y={2} width={18} height={5} rx={1} fill="rgba(255,255,255,0.45)" />
      <rect x={6} y={8} width={3} height={3} rx={0.8} fill="#fff" />
      <rect x={10.5} y={8} width={3} height={3} rx={0.8} fill="#fff" />
      <rect x={15} y={8} width={3} height={3} rx={0.8} fill="#fff" />
      <rect x={6} y={13} width={3} height={3} rx={0.8} fill="#fff" />
      <rect x={10.5} y={13} width={3} height={3} rx={0.8} fill="#fff" />
      <rect x={15} y={13} width={3} height={3} rx={0.8} fill="#fff" />
    </svg>
  ),
  4: (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <rect x={4} y={2} width={16} height={20} rx={2} fill="rgba(255,255,255,0.20)" />
      <rect x={4} y={2} width={16} height={6} rx={1.5} fill="rgba(255,255,255,0.40)" />
      <rect x={7} y={5} width={2} height={2} rx={0.5} fill="#fff" />
      <rect x={11} y={5} width={2} height={2} rx={0.5} fill="#fff" />
      <rect x={15} y={5} width={2} height={2} rx={0.5} fill="#fff" />
      <rect x={7} y={10} width={2} height={2} rx={0.5} fill="#fff" />
      <rect x={11} y={10} width={2} height={2} rx={0.5} fill="#fff" />
      <rect x={15} y={10} width={2} height={2} rx={0.5} fill="#fff" />
      <rect x={7} y={15} width={2} height={2} rx={0.5} fill="#fff" />
      <rect x={11} y={15} width={2} height={2} rx={0.5} fill="#fff" />
      <rect x={15} y={15} width={2} height={2} rx={0.5} fill="#fff" />
    </svg>
  ),
}

// Sub-type grouping by accommodation type + gender
interface SubGroup {
  label: string
  filter: (a: Accommodation) => boolean
}

function getSubGroups(type: number): SubGroup[] {
  if (type === 0) return [
    { label: 'Female Flatmate Needed', filter: a => a.gender === 1 },
    { label: 'Male Flatmate Needed',   filter: a => a.gender === 0 },
    { label: 'Mixed / Any',            filter: a => a.gender === 2 },
  ]
  if (type === 1) return [
    { label: 'Short Stay – For Male Students',   filter: a => a.gender === 0 },
    { label: 'Short Stay – For Female Students', filter: a => a.gender === 1 },
    { label: 'Short Stay – Mixed',               filter: a => a.gender === 2 },
  ]
  return [{ label: 'All Listings', filter: () => true }]
}

// Friendship type for listings
type FriendStatus = 'friend' | 'mutual' | 'community' | 'none'

// ── Avatar color palette ───────────────────────────────────────────────────────

const AVATAR_PALETTE = [
  { bg: '#FBE3D0', fg: '#C9762E' },
  { bg: '#DCEAFE', fg: '#3B6FB6' },
  { bg: '#F6DDEB', fg: '#B0568E' },
  { bg: '#E1EFE0', fg: '#5C8A5E' },
  { bg: '#FFF3D6', fg: '#C99A2E' },
  { bg: '#E6E1F7', fg: '#7660B8' },
]
function avatarColor(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length]
}

// ── Styles ────────────────────────────────────────────────────────────────────

const useStyles = makeStyles()(() => ({

  // ── Landing ──────────────────────────────────────────────────────────────────
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px 4px',
  },
  breadcrumbBack: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.white,
    border: `1px solid ${colors.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: colors.ink2,
    flexShrink: 0,
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: colors.lineSoft },
  },
  breadcrumbText: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: colors.ink3,
  },
  landingHeading: {
    fontWeight: 800,
    fontSize: '1.6rem',
    color: colors.ink,
    letterSpacing: '-0.6px',
    lineHeight: 1.2,
    padding: '14px 20px 6px',
  },
  landingSub: {
    fontSize: '0.88rem',
    color: colors.ink3,
    padding: '0 20px 18px',
    fontWeight: 500,
  },
  categoryList: {
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  categoryCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 4px 14px rgba(20,20,15,0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    animation: 'fadeSlideUp 0.28s ease both',
    '&:hover': {
      boxShadow: '0 6px 20px rgba(20,20,15,0.09)',
      transform: 'translateY(-1px)',
    },
    '&:active': { transform: 'translateY(0)' },
  },
  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  categoryInfo: {
    flex: 1,
    minWidth: 0,
  },
  categoryLabel: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: colors.ink,
    letterSpacing: '-0.3px',
    lineHeight: 1.3,
  },
  categoryDesc: {
    fontSize: '0.78rem',
    color: colors.ink3,
    marginTop: 2,
    lineHeight: 1.4,
  },
  categoryCount: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: colors.moss,
    marginTop: 4,
  },
  categoryArrow: {
    color: colors.ink4,
    flexShrink: 0,
  },

  // ── Community stats header ────────────────────────────────────────────────────
  communityHeader: {
    padding: '10px 16px 8px',
    borderBottom: `1px solid ${colors.lineSoft}`,
  },
  communityHeaderName: {
    fontWeight: 800,
    fontSize: '1.15rem',
    color: colors.ink,
    letterSpacing: '-0.4px',
    lineHeight: 1.2,
  },
  communityHeaderMembers: {
    fontSize: '0.78rem',
    color: colors.ink3,
    fontWeight: 600,
    marginTop: 2,
  },
  communityHeaderFriends: {
    fontSize: '0.75rem',
    color: colors.ink4,
    fontWeight: 500,
    marginTop: 1,
  },

  // ── Category view sub-header ──────────────────────────────────────────────────
  catHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px 6px',
  },
  catBackBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.white,
    border: `1px solid ${colors.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: colors.ink2,
    flexShrink: 0,
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: colors.lineSoft },
  },
  catTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  catTitle: {
    fontWeight: 800,
    fontSize: '1.3rem',
    color: colors.ink,
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
  },
  catSub: {
    fontSize: '0.78rem',
    color: colors.ink3,
    fontWeight: 500,
    marginTop: 2,
  },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.white,
    border: `1px solid ${colors.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: colors.ink2,
    flexShrink: 0,
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: colors.lineSoft },
  },

  // ── Filter pills ──────────────────────────────────────────────────────────────
  filterPills: {
    display: 'flex',
    gap: 8,
    padding: '8px 16px 10px',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  filterPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    borderRadius: 20,
    border: `1.5px solid ${colors.line}`,
    backgroundColor: colors.white,
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: colors.ink2,
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
    '&:hover': { borderColor: colors.ink3 },
  },
  filterPillActive: {
    border: `1.5px solid ${colors.ink}`,
    backgroundColor: colors.ink,
    color: '#fff',
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0,
  },

  // ── Sub-section group ─────────────────────────────────────────────────────────
  groupSection: {
    padding: '12px 16px 0',
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  groupTitle: {
    fontWeight: 700,
    fontSize: '1rem',
    color: colors.ink,
    letterSpacing: '-0.3px',
  },
  groupSeeAll: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: colors.white,
    border: `1px solid ${colors.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: colors.ink3,
    flexShrink: 0,
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: colors.lineSoft },
  },
  // ── Horizontal scroll row ─────────────────────────────────────────────────────
  hScrollRow: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    padding: '0 0 14px 0',
    '&::-webkit-scrollbar': { display: 'none' },
    scrollbarWidth: 'none' as const,
  },

  // ── Grid card (portrait, 160px wide — in horizontal scroll) ──────────────────
  gridCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 4px 16px rgba(20,20,15,0.06)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    animation: 'fadeSlideUp 0.28s ease both',
    flexShrink: 0,
    width: 160,
    '&:hover': {
      boxShadow: '0 6px 20px rgba(20,20,15,0.10)',
      transform: 'translateY(-2px)',
    },
    '&:active': { transform: 'translateY(0)' },
  },
  gridPhoto: {
    height: 130,
    position: 'relative',
    overflow: 'hidden',
  },

  // ── Sub-group list view ───────────────────────────────────────────────────────
  subgroupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px 10px',
    backgroundColor: colors.cream,
  },
  subgroupBackBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.white,
    border: `1px solid ${colors.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: colors.ink2,
    flexShrink: 0,
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: colors.lineSoft },
  },
  subgroupTitle: {
    fontWeight: 800,
    fontSize: '1.05rem',
    color: colors.ink,
    letterSpacing: '-0.4px',
    lineHeight: 1.25,
    flex: 1,
  },
  subgroupList: {
    padding: '6px 14px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },

  // ── List card (horizontal: left photo + right content) ────────────────────────
  listCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 4px 14px rgba(20,20,15,0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    animation: 'fadeSlideUp 0.28s ease both',
    display: 'flex',
    flexDirection: 'row',
    '&:hover': {
      boxShadow: '0 6px 20px rgba(20,20,15,0.09)',
      transform: 'translateY(-1px)',
    },
    '&:active': { transform: 'translateY(0)' },
  },
  listPhoto: {
    width: 120,
    minWidth: 120,
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  },
  listPhotoImg: {
    position: 'absolute',
    inset: 0,
  },
  listUrgentBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(30,30,20,0.65)',
    backdropFilter: 'blur(4px)',
    color: '#fff',
    fontSize: '0.58rem',
    fontWeight: 700,
    letterSpacing: '0.3px',
    padding: '3px 7px',
    borderRadius: 6,
  },
  listMoreBtn: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255,255,255,0.90)',
    color: colors.ink,
    fontSize: '0.68rem',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 16,
    whiteSpace: 'nowrap',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  listBody: {
    flex: 1,
    padding: '12px 14px',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  listTitle: {
    fontWeight: 700,
    fontSize: '0.88rem',
    color: colors.ink,
    letterSpacing: '-0.2px',
    lineHeight: 1.3,
  },
  listTypeChip: {
    display: 'inline-flex',
    alignItems: 'center',
    border: `1px solid ${colors.moss}`,
    borderRadius: 20,
    padding: '2px 9px',
    fontSize: '0.68rem',
    fontWeight: 600,
    color: colors.mossDeep,
    backgroundColor: colors.mossSoft,
    width: 'fit-content',
  },
  listMeta: {
    fontSize: '0.75rem',
    color: colors.ink3,
    fontWeight: 500,
  },
  listLocation: {
    fontSize: '0.72rem',
    color: colors.ink4,
  },
  listBottomRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  listPrice: {
    fontWeight: 700,
    fontSize: '0.82rem',
    color: colors.moss,
    letterSpacing: '-0.2px',
  },
  urgentBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(30,30,20,0.65)',
    backdropFilter: 'blur(4px)',
    color: '#fff',
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.3px',
    padding: '3px 8px',
    borderRadius: 6,
  },
  moreDetailsBtn: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(4px)',
    color: colors.ink,
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '5px 12px',
    borderRadius: 20,
    whiteSpace: 'nowrap',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
  },
  gridBody: {
    padding: '10px 10px 12px',
  },
  gridTitle: {
    fontWeight: 700,
    fontSize: '0.82rem',
    color: colors.ink,
    letterSpacing: '-0.2px',
    lineHeight: 1.3,
    marginBottom: 3,
  },
  gridMeta: {
    fontSize: '0.72rem',
    color: colors.ink3,
    lineHeight: 1.4,
    marginBottom: 3,
  },
  gridLocation: {
    fontSize: '0.70rem',
    color: colors.ink4,
    marginBottom: 5,
  },
  connectionChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 8px',
    borderRadius: 20,
    fontSize: '0.68rem',
    fontWeight: 700,
    marginBottom: 5,
    border: '1px solid',
  },
  gridPostedBy: {
    fontSize: '0.70rem',
    color: colors.ink3,
    marginBottom: 4,
  },
  gridPrice: {
    fontWeight: 700,
    fontSize: '0.82rem',
    color: colors.moss,
    letterSpacing: '-0.2px',
  },

  // ── Detail full-page view ─────────────────────────────────────────────────────
  detailPage: {
    position: 'fixed',
    inset: 0,
    backgroundColor: colors.cream,
    zIndex: 1300,
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeSlideUp 0.28s ease both',
  },
  detailScroll: {
    flex: 1,
    overflowY: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
    scrollbarWidth: 'none' as const,
  },
  detailHero: {
    height: 260,
    position: 'relative',
    flexShrink: 0,
  },
  detailHeroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 40%)',
    pointerEvents: 'none',
  },
  detailHeroControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 14px',
  },
  detailHeroBtn: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.88)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: colors.ink,
    border: 'none',
    '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
  },
  detailHeroBtnsRight: {
    display: 'flex',
    gap: 8,
  },
  detailContent: {
    backgroundColor: colors.white,
    borderRadius: '20px 20px 0 0',
    marginTop: -20,
    padding: '22px 18px 24px',
    position: 'relative',
  },
  detailTitle: {
    fontWeight: 800,
    fontSize: '1.2rem',
    color: colors.ink,
    letterSpacing: '-0.4px',
    lineHeight: 1.3,
    marginBottom: 4,
  },
  detailSubtitle: {
    fontSize: '0.82rem',
    color: colors.ink3,
    fontWeight: 500,
    lineHeight: 1.5,
    marginBottom: 0,
  },
  // ── Price section ─────────────────────────────────────────────────────────────
  detailPriceSection: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 14,
  },
  detailPriceLeft: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  },
  detailPriceAmt: {
    fontWeight: 800,
    fontSize: '1.65rem',
    color: colors.ink,
    letterSpacing: '-0.7px',
    lineHeight: 1,
  },
  detailPricePer: {
    fontSize: '0.75rem',
    color: colors.ink3,
    fontWeight: 500,
  },
  detailPriceDeposit: {
    fontSize: '0.73rem',
    color: colors.ink4,
    fontWeight: 500,
    marginTop: 2,
  },
  negotiableBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 12px',
    borderRadius: 20,
    backgroundColor: colors.mossSoft,
    border: `1px solid ${colors.moss}50`,
    color: colors.mossDeep,
    fontSize: '0.75rem',
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 4,
  },
  // ── Info chips ────────────────────────────────────────────────────────────────
  detailChipsRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 8,
    marginBottom: 14,
  },
  detailChip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 12px',
    borderRadius: 20,
    backgroundColor: colors.cream,
    border: `1px solid ${colors.line}`,
    color: colors.ink2,
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  // ── Meta rows (location, date) ────────────────────────────────────────────────
  detailMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    marginBottom: 8,
  },
  detailMetaText: {
    fontSize: '0.82rem',
    color: colors.ink2,
    fontWeight: 500,
    lineHeight: 1.4,
  },
  // ── Reviews ───────────────────────────────────────────────────────────────────
  detailReviews: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    marginBottom: 18,
    marginTop: 8,
  },
  // ── Poster card ───────────────────────────────────────────────────────────────
  posterInfoCard: {
    backgroundColor: colors.cream,
    borderRadius: 16,
    padding: '14px 16px',
    marginBottom: 14,
    border: `1px solid ${colors.lineSoft}`,
  },
  posterSectionTitle: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: colors.ink4,
    letterSpacing: '0.6px',
    textTransform: 'uppercase' as const,
    marginBottom: 12,
  },
  yourFriendPill: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.mossSoft,
    border: `1px solid ${colors.moss}40`,
    borderRadius: 20,
    padding: '7px 18px',
    marginBottom: 12,
  },
  yourFriendText: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: colors.mossDeep,
  },
  posterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  posterAvatar: {
    width: 44,
    height: 44,
    fontSize: '0.95rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  postedByLabel: {
    fontSize: '0.72rem',
    color: colors.ink3,
    fontWeight: 500,
    marginBottom: 2,
  },
  posterNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  posterName: {
    fontWeight: 700,
    fontSize: '0.92rem',
    color: colors.ink,
    letterSpacing: '-0.2px',
  },
  posterMutuals: {
    fontSize: '0.7rem',
    color: colors.ink3,
    fontWeight: 500,
    marginTop: 2,
  },
  friendsBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.moss,
    color: '#fff',
    borderRadius: 20,
    padding: '5px 11px',
    fontSize: '0.72rem',
    fontWeight: 700,
    flexShrink: 0,
    marginLeft: 'auto',
  },
  posterDesignation: {
    fontSize: '0.78rem',
    color: colors.ink3,
    marginTop: 4,
    paddingTop: 8,
    borderTop: `1px solid ${colors.line}`,
  },
  mutualConnections: {
    fontSize: '0.78rem',
    color: colors.ink3,
    marginTop: 6,
  },
  mutualConnectionsLabel: {
    fontWeight: 600,
    color: colors.ink2,
  },
  // Amenities
  amenitiesCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: '16px',
    marginBottom: 14,
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 4px 14px rgba(20,20,15,0.05)',
  },
  amenitiesTitle: {
    fontWeight: 700,
    fontSize: '1rem',
    color: colors.ink,
    letterSpacing: '-0.3px',
    marginBottom: 14,
  },
  amenitiesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  amenityTile: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 12,
    backgroundColor: colors.mossSoft,
    '& svg': { fontSize: '1.1rem', color: colors.moss, flexShrink: 0 },
  },
  amenityLabel: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: colors.ink,
  },
  // Sticky footer CTA — sits outside scroll area, always visible
  detailFooter: {
    flexShrink: 0,
    padding: '12px 18px 12px',
    backgroundColor: colors.white,
    borderTop: `1px solid ${colors.lineSoft}`,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
  },
  whatsappBtn: {
    width: '100%',
    padding: '15px',
    borderRadius: 50,
    border: 'none',
    backgroundColor: colors.moss,
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: colors.mossDeep },
  },
}))

// ── Amenity tiles ─────────────────────────────────────────────────────────────

const AMENITY_TILES = [
  { icon: <WifiIcon />,                label: 'Wifi' },
  { icon: <AcUnitIcon />,              label: 'AC' },
  { icon: <SingleBedIcon />,           label: 'Bed & Cot' },
  { icon: <LocalLaundryServiceIcon />, label: 'Washing Machine' },
  { icon: <KitchenIcon />,             label: 'Fridge' },
  { icon: <IronIcon />,                label: 'Iron Box' },
]

// ── Connection chip helper ────────────────────────────────────────────────────

function connectionStatus(acc: Accommodation): FriendStatus {
  if (acc.isConnected) return 'friend'
  if (acc.mutualFriends > 0) return 'mutual'
  return 'community'
}

const ConnectionChip: React.FC<{ status: FriendStatus; classes: ReturnType<typeof useStyles>['classes'] }> = ({ status, classes }) => {
  if (status === 'friend') return (
    <Box className={classes.connectionChip} sx={{ color: colors.mossDeep, borderColor: colors.moss, backgroundColor: colors.mossSoft }}>
      <CheckIcon sx={{ fontSize: '0.7rem' }} /> Friend
    </Box>
  )
  if (status === 'mutual') return (
    <Box className={classes.connectionChip} sx={{ color: '#a07a10', borderColor: '#e8a430', backgroundColor: '#FFF8E7' }}>
      Mutual Friend
    </Box>
  )
  return (
    <Box className={classes.connectionChip} sx={{ color: colors.ink3, borderColor: colors.line, backgroundColor: colors.cream }}>
      Community Member
    </Box>
  )
}

// Flat type label
function flatLabel(type: number | null, peopleAllowed: number): string {
  const bhk = type === 4 ? '4BHK' : type === 3 ? '3BHK' : type === 2 ? '2BHK' : '1BHK'
  const people = peopleAllowed > 0 ? ` · Total ${peopleAllowed} Persons` : ''
  return `${bhk}${people}`
}

// WhatsApp deep-link helper
// Strips non-digits, prepends India country code (91) if only 10 digits given.
function whatsappUrl(raw: string, message?: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  // If 10-digit Indian mobile, prepend 91
  const e164 = digits.length === 10 ? `91${digits}` : digits
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${e164}${text}`
}

// Photo gradient by type/gender
function heroGradient(type: number, gender: number): string {
  const hue = type === 2 ? 30 : type === 3 ? 40 : type === 4 ? 200 : gender === 1 ? 340 : gender === 0 ? 210 : 110
  return `linear-gradient(155deg, oklch(82% 0.06 ${hue}), oklch(66% 0.09 ${hue + 30}))`
}

// ── Grid card (2-column in category view) ─────────────────────────────────────

const GridCard: React.FC<{
  acc: Accommodation
  saved: boolean
  onSave: (id: string) => void
  onClick: () => void
  classes: ReturnType<typeof useStyles>['classes']
}> = ({ acc, saved: _saved, onClick, classes }) => {
  const status = connectionStatus(acc)
  const grad = heroGradient(acc.type, acc.gender)

  return (
    <Box className={classes.gridCard} onClick={onClick}>
      <Box className={classes.gridPhoto} sx={{ background: grad }}>
        {acc.isNegotiable && <Box className={classes.urgentBadge}>Urgent</Box>}
        <Box
          component="button"
          className={classes.moreDetailsBtn}
          onClick={e => { e.stopPropagation(); onClick() }}
        >
          More Details
        </Box>
      </Box>
      <Box className={classes.gridBody}>
        <Typography className={classes.gridTitle}>
          {acc.title || 'Listing'}
        </Typography>
        <Typography className={classes.gridMeta}>
          {flatLabel(acc.flatType, acc.peopleAllowed)}
        </Typography>
        {acc.address && (
          <Typography className={classes.gridLocation}>{acc.address}</Typography>
        )}
        <ConnectionChip status={status} classes={classes} />
        {acc.userName && (
          <Typography className={classes.gridPostedBy}>Posted by {acc.userName}</Typography>
        )}
        <Typography className={classes.gridPrice}>
          {formatINR(acc.amount)}{acc.type === 1 ? ' Per Day' : ''} / head
        </Typography>
      </Box>
    </Box>
  )
}

// ── Category view ─────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'friends' | 'mutual' | 'community'

// ── Detail view ───────────────────────────────────────────────────────────────

const DetailView: React.FC<{
  acc: Accommodation
  onClose: () => void
  saved: boolean
  onToggleSave: (id: string) => void
  classes: ReturnType<typeof useStyles>['classes']
}> = ({ acc, onClose, saved, onToggleSave, classes }) => {
  const av = avatarColor(acc.userId || acc.id)
  const grad = heroGradient(acc.type, acc.gender)
  const status = connectionStatus(acc)

  return (
    <Box className={classes.detailPage}>
      {/* Scrollable area: hero + content */}
      <Box className={classes.detailScroll}>
      {/* Hero photo */}
      <Box className={classes.detailHero} sx={{ background: grad }}>
        <Box className={classes.detailHeroOverlay} />
        <Box className={classes.detailHeroControls}>
          <Box component="button" className={classes.detailHeroBtn} onClick={onClose}>
            <ArrowBackIosNewIcon sx={{ fontSize: '0.9rem' }} />
          </Box>
          <Box className={classes.detailHeroBtnsRight}>
            <Box component="button" className={classes.detailHeroBtn}>
              <ShareIcon sx={{ fontSize: '1rem' }} />
            </Box>
            <Box
              component="button"
              className={classes.detailHeroBtn}
              onClick={() => onToggleSave(acc.id)}
            >
              {saved
                ? <FavoriteIcon sx={{ fontSize: '1rem', color: '#e74c3c' }} />
                : <FavoriteBorderIcon sx={{ fontSize: '1rem' }} />}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* White content card */}
      <Box className={classes.detailContent}>

        {/* Title + description */}
        <Typography className={classes.detailTitle}>{acc.title || 'Accommodation'}</Typography>
        {acc.description && (
          <Typography className={classes.detailSubtitle}>{acc.description}</Typography>
        )}

        {/* Price section */}
        <Box className={classes.detailPriceSection}>
          <Box className={classes.detailPriceLeft}>
            <Typography className={classes.detailPriceAmt}>{formatINR(acc.amount)}</Typography>
            <Typography className={classes.detailPricePer}>
              {acc.type === 1 ? 'per day · per head' : 'per head / month'}
            </Typography>
            {acc.depositAmount > 0 && (
              <Typography className={classes.detailPriceDeposit}>
                Deposit: {formatINR(acc.depositAmount)}
              </Typography>
            )}
          </Box>
          {acc.isNegotiable && (
            <Box className={classes.negotiableBadge}>Negotiable</Box>
          )}
        </Box>

        {/* Info chips */}
        <Box className={classes.detailChipsRow}>
          {acc.flatType != null && (
            <Box className={classes.detailChip}>
              {acc.flatType === 4 ? '4 BHK' : acc.flatType === 3 ? '3 BHK' : acc.flatType === 2 ? '2 BHK' : '1 BHK'}
            </Box>
          )}
          {acc.peopleAllowed > 0 && (
            <Box className={classes.detailChip}>
              <PeopleOutlineIcon sx={{ fontSize: '0.85rem', mr: 0.5 }} />
              {acc.peopleAllowed} persons
            </Box>
          )}
          <Box className={classes.detailChip}>
            {acc.gender === 0 ? 'Male' : acc.gender === 1 ? 'Female' : 'Mixed / Any'}
          </Box>
          <Box className={classes.detailChip}>
            {acc.furnishing === 2 ? 'Fully Furnished' : acc.furnishing === 1 ? 'Semi-Furnished' : 'Unfurnished'}
          </Box>
        </Box>

        {/* Location */}
        {acc.address && (
          <Box className={classes.detailMetaRow}>
            <LocationOnOutlinedIcon sx={{ fontSize: '1rem', color: colors.ink4, flexShrink: 0 }} />
            <Typography className={classes.detailMetaText}>{acc.address}</Typography>
          </Box>
        )}

        {/* Available from */}
        {acc.availableFrom && (
          <Box className={classes.detailMetaRow}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: '0.9rem', color: colors.ink4, flexShrink: 0 }} />
            <Typography className={classes.detailMetaText}>
              Available from <Box component="span" sx={{ fontWeight: 700, color: colors.ink }}>{formatDate(acc.availableFrom)}</Box>
            </Typography>
          </Box>
        )}

        {/* Reviews */}
        <Box className={classes.detailReviews}>
          <StarIcon sx={{ fontSize: '0.95rem', color: '#e8a430' }} />
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: colors.ink2 }}>
            2 Reviews
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Poster card */}
        <Box className={classes.posterInfoCard}>
          <Typography className={classes.posterSectionTitle}>Posted by</Typography>

          {status === 'friend' && (
            <Box className={classes.yourFriendPill}>
              <CheckIcon sx={{ fontSize: '0.95rem', color: colors.moss }} />
              <Typography className={classes.yourFriendText}>Your Friend</Typography>
            </Box>
          )}

          <Box className={classes.posterRow}>
            <Avatar className={classes.posterAvatar} sx={{ bgcolor: av.bg, color: av.fg }}>
              {getInitials(acc.userName)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box className={classes.posterNameRow}>
                <Typography className={classes.posterName}>{acc.userName || 'Community Member'}</Typography>
                <ChevronRightIcon sx={{ fontSize: '0.9rem', color: colors.ink3 }} />
              </Box>
              {acc.mutualFriends > 0 ? (
                <Typography className={classes.posterMutuals}>{acc.mutualFriends} mutual connections</Typography>
              ) : (
                <Typography className={classes.posterMutuals}>Community member</Typography>
              )}
            </Box>
            {status === 'friend' && (
              <Box className={classes.friendsBadge}>
                <CheckIcon sx={{ fontSize: '0.75rem' }} /> Friends
              </Box>
            )}
            {status === 'mutual' && (
              <Box className={classes.friendsBadge} sx={{ backgroundColor: '#c89a28' }}>
                Mutual
              </Box>
            )}
          </Box>
        </Box>

        {/* Amenities */}
        <Box className={classes.amenitiesCard}>
          <Typography className={classes.amenitiesTitle}>Amenities Available</Typography>
          <Box className={classes.amenitiesGrid}>
            {AMENITY_TILES.map(a => (
              <Box key={a.label} className={classes.amenityTile}>
                {a.icon}
                <Typography className={classes.amenityLabel}>{a.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      {/* End scrollable area */}
      </Box>

      {/* Footer — outside scroll, always pinned to bottom */}
      <Box className={classes.detailFooter}>
        {(() => {
          const waUrl = whatsappUrl(acc.phone, `Hi, I saw your listing "${acc.title}" on TrustU and I'm interested.`)
          return waUrl ? (
            <Box
              component="a"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.whatsappBtn}
              sx={{ textDecoration: 'none' }}
            >
              <WhatsAppIcon sx={{ fontSize: '1.2rem' }} />
              Contact Via WhatsApp
            </Box>
          ) : (
            <Box
              component="button"
              className={classes.whatsappBtn}
              disabled
              sx={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              <WhatsAppIcon sx={{ fontSize: '1.2rem' }} />
              No Contact Info Available
            </Box>
          )
        })()}
      </Box>
    </Box>
  )
}

// ── List card (horizontal card for subgroup list view) ───────────────────────

const ListCard: React.FC<{
  acc: Accommodation
  onClick: () => void
  classes: ReturnType<typeof useStyles>['classes']
}> = ({ acc, onClick, classes }) => {
  const status = connectionStatus(acc)
  const grad = heroGradient(acc.type, acc.gender)
  const bhk = acc.flatType === 4 ? '4BHK' : acc.flatType === 3 ? '3BHK' : acc.flatType === 2 ? '2BHK' : '1BHK'
  const typeLabel = acc.type === 0 ? (acc.gender === 1 ? 'Female Student' : 'Male Student') :
                    acc.type === 1 ? (acc.gender === 1 ? 'Female Student' : 'Male Student') :
                    acc.type === 2 ? 'Flat' : acc.type === 3 ? 'Hostel' : 'Hotel'

  return (
    <Box className={classes.listCard} onClick={onClick}>
      {/* Left photo */}
      <Box className={classes.listPhoto} sx={{ background: grad }}>
        <Box className={classes.listPhotoImg} sx={{ background: grad }} />
        {acc.isNegotiable && <Box className={classes.listUrgentBadge}>Urgent</Box>}
        <Box
          component="button"
          className={classes.listMoreBtn}
          onClick={e => { e.stopPropagation(); onClick() }}
        >
          More Details
        </Box>
      </Box>

      {/* Right content */}
      <Box className={classes.listBody}>
        <Typography className={classes.listTitle}>{acc.title || 'Listing'}</Typography>
        <Box className={classes.listTypeChip}>{typeLabel}</Box>
        <Typography className={classes.listMeta}>{bhk}</Typography>
        {acc.address && <Typography className={classes.listLocation}>{acc.address}</Typography>}
        <Box className={classes.listBottomRow}>
          <ConnectionChip status={status} classes={classes} />
          <Typography className={classes.listPrice}>
            {formatINR(acc.amount)}{acc.type === 1 ? ' Per Day–Per Head' : ' / head'}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

type View = 'landing' | 'category' | 'subgroup' | 'detail'

const AccommodationPage: React.FC = () => {
  const { classes } = useStyles()
  const { user } = useAuth()
  const { data: friends = [] } = useFriends()
  const friendCount = (friends as Friend[]).length

  const [view, setView] = useState<View>('landing')
  const [selectedType, setSelectedType] = useState<number>(0)
  const [selectedSubGroup, setSelectedSubGroup] = useState<SubGroup | null>(null)
  const [filterTab, setFilterTab] = useState<FilterTab>('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<SharedRoomFilters>(EMPTY_SHARED_FILTERS)
  const [selectedAcc, setSelectedAcc] = useState<Accommodation | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  // Fetch all accommodations
  const { data, isLoading } = useAccommodations()
  const allAccommodations = data?.data ?? []

  // Count by type for landing cards
  const countByType = useMemo(() => {
    const counts: Record<number, number> = {}
    for (const a of allAccommodations) {
      counts[a.type] = (counts[a.type] ?? 0) + 1
    }
    return counts
  }, [allAccommodations])

  // Filter accommodations for current category + filter tab
  const categoryAccommodations = useMemo(() => {
    let list = allAccommodations.filter(a => a.type === selectedType)

    // Apply filter tab
    if (filterTab === 'friends')   list = list.filter(a => a.isConnected)
    if (filterTab === 'mutual')    list = list.filter(a => a.mutualFriends > 0)
    if (filterTab === 'community') list = list.filter(a => !a.isConnected && a.mutualFriends === 0)

    // Apply budget filters
    if (filters.budgetMin) list = list.filter(a => a.amount >= Number(filters.budgetMin))
    if (filters.budgetMax) list = list.filter(a => a.amount <= Number(filters.budgetMax))

    // Apply gender filter
    if (filters.gender === 'male')   list = list.filter(a => a.gender === 0)
    if (filters.gender === 'female') list = list.filter(a => a.gender === 1)

    return list
  }, [allAccommodations, selectedType, filterTab, filters])

  const subGroups = getSubGroups(selectedType)
  const currentCategory = CATEGORIES.find(c => c.type === selectedType)

  const handleToggleSave = (id: string) =>
    setSavedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const handleSelectCategory = (type: number) => {
    setSelectedType(type)
    setFilterTab('all')
    setView('category')
  }

  const handleSelectAcc = (acc: Accommodation) => {
    setSelectedAcc(acc)
    setView('detail')
  }

  // ── Detail view ─────────────────────────────────────────────────────────────
  if (view === 'detail' && selectedAcc) {
    return (
      <DetailView
        acc={selectedAcc}
        onClose={() => setView(selectedSubGroup ? 'subgroup' : 'category')}
        saved={savedIds.has(selectedAcc.id)}
        onToggleSave={handleToggleSave}
        classes={classes}
      />
    )
  }

  // ── Sub-group list view ───────────────────────────────────────────────────────
  if (view === 'subgroup' && selectedSubGroup) {
    const groupItems = categoryAccommodations.filter(selectedSubGroup.filter)
    return (
      <Box sx={{ backgroundColor: colors.cream, minHeight: '100%', pb: 4 }}>
        <Box className={classes.subgroupHeader}>
          <Box className={classes.subgroupBackBtn} onClick={() => setView('category')}>
            <ArrowBackIosNewIcon sx={{ fontSize: '0.8rem' }} />
          </Box>
          <Typography className={classes.subgroupTitle}>{selectedSubGroup.label}</Typography>
        </Box>

        <Box className={classes.subgroupList}>
          {groupItems.length === 0 ? (
            <EmptyState
              title="No listings found"
              description="No accommodations match your filters yet."
              icon={<HomeWorkOutlinedIcon />}
            />
          ) : (
            groupItems.map((acc, idx) => (
              <Box key={acc.id} sx={{ animationDelay: `${idx * 0.04}s` }}>
                <ListCard
                  acc={acc}
                  onClick={() => handleSelectAcc(acc)}
                  classes={classes}
                />
              </Box>
            ))
          )}
        </Box>
      </Box>
    )
  }

  // ── Landing view ─────────────────────────────────────────────────────────────
  if (view === 'landing') {
    return (
      <Box sx={{ backgroundColor: colors.cream, minHeight: '100%', pb: 4 }}>
        {/* Breadcrumb */}
        <Box className={classes.breadcrumb}>
          <Box className={classes.breadcrumbText}>{user?.communityName ?? 'Explore'}</Box>
        </Box>

        <Typography className={classes.landingHeading}>What are you looking for?</Typography>
        <Typography className={classes.landingSub}>Pick a type of accommodation to explore.</Typography>

        <Box className={classes.categoryList}>
          {isLoading
            ? [0, 1, 2, 3, 4].map(i => (
                <Box key={i} className={classes.categoryCard} sx={{ opacity: 0.5 }}>
                  <Box className={classes.categoryIcon} sx={{ background: colors.lineSoft, width: 52, height: 52, borderRadius: 14 }} />
                  <Box className={classes.categoryInfo}>
                    <Box sx={{ height: 16, width: '60%', borderRadius: 6, bgcolor: colors.line, mb: 1 }} />
                    <Box sx={{ height: 12, width: '80%', borderRadius: 6, bgcolor: colors.lineSoft }} />
                  </Box>
                </Box>
              ))
            : CATEGORIES.map((cat, idx) => (
                <Box
                  key={cat.type}
                  className={classes.categoryCard}
                  onClick={() => handleSelectCategory(cat.type)}
                  sx={{ animationDelay: `${idx * 0.06}s` }}
                >
                  <Box
                    className={classes.categoryIcon}
                    sx={{ background: `linear-gradient(140deg, ${cat.iconBg[0]}, ${cat.iconBg[1]})` }}
                  >
                    {CATEGORY_ICON_PATHS[cat.type]}
                  </Box>
                  <Box className={classes.categoryInfo}>
                    <Typography className={classes.categoryLabel}>{cat.label}</Typography>
                    <Typography className={classes.categoryDesc}>{cat.desc}</Typography>
                    <Typography className={classes.categoryCount}>
                      {countByType[cat.type] ?? 0} listings
                    </Typography>
                  </Box>
                  <ChevronRightIcon className={classes.categoryArrow} sx={{ fontSize: '1.1rem' }} />
                </Box>
              ))
          }
        </Box>
      </Box>
    )
  }

  // ── Category view ─────────────────────────────────────────────────────────────

  const FILTER_PILLS = [
    { key: 'all' as FilterTab,       label: 'All',            dotColor: colors.ink4 },
    { key: 'friends' as FilterTab,   label: 'Friends',        dotColor: colors.moss },
    { key: 'mutual' as FilterTab,    label: 'Mutual Friends', dotColor: '#e8a430' },
    { key: 'community' as FilterTab, label: 'Community',      dotColor: colors.ink3 },
  ]

  return (
    <Box sx={{ backgroundColor: colors.cream, minHeight: '100%', pb: 4 }}>

      {/* Community stats header */}
      <Box className={classes.communityHeader}>
        <Typography className={classes.communityHeaderName}>
          {user?.communityName ?? 'Community'}
        </Typography>
        <Typography className={classes.communityHeaderMembers}>
          {/* memberCount comes from community API — show friendCount as proxy */}
          {friendCount > 0 ? `${friendCount * 10} Members` : 'Members'}
        </Typography>
        <Typography className={classes.communityHeaderFriends}>
          {friendCount} Friends · {Math.floor(friendCount * 0.35)} Mutual
        </Typography>
      </Box>

      {/* Category sub-header */}
      <Box className={classes.catHeader}>
        <Box className={classes.catBackBtn} onClick={() => setView('landing')}>
          <ArrowBackIosNewIcon sx={{ fontSize: '0.8rem' }} />
        </Box>
        <Box className={classes.catTitleBlock}>
          <Typography className={classes.catTitle}>{currentCategory?.label}</Typography>
          <Typography className={classes.catSub}>{categoryAccommodations.length} listings</Typography>
        </Box>
        <Box className={classes.filterBtn} onClick={() => setFilterOpen(true)}>
          <TuneIcon sx={{ fontSize: '1.1rem' }} />
        </Box>
      </Box>

      {/* Filter pills */}
      <Box className={classes.filterPills}>
        {FILTER_PILLS.map(pill => (
          <Box
            key={pill.key}
            component="button"
            className={`${classes.filterPill} ${filterTab === pill.key ? classes.filterPillActive : ''}`}
            onClick={() => setFilterTab(pill.key)}
          >
            <Box
              className={classes.pillDot}
              sx={{ backgroundColor: filterTab === pill.key ? '#fff' : pill.dotColor }}
            />
            {pill.label}
          </Box>
        ))}
      </Box>

      {/* Sub-type groups */}
      {isLoading ? (
        <Box sx={{ px: 2 }}><ContentSkeleton count={2} variant="post" /></Box>
      ) : categoryAccommodations.length === 0 ? (
        <Box sx={{ px: 2 }}>
          <EmptyState
            title="No listings found"
            description="No accommodations match your filters yet."
            icon={<HomeWorkOutlinedIcon />}
          />
        </Box>
      ) : (
        subGroups.map(group => {
          const groupItems = categoryAccommodations.filter(group.filter)
          if (groupItems.length === 0) return null
          return (
            <Box key={group.label} className={classes.groupSection}>
              <Box className={classes.groupHeader}>
                <Typography className={classes.groupTitle}>{group.label}</Typography>
                <Box
                  className={classes.groupSeeAll}
                  onClick={() => { setSelectedSubGroup(group); setView('subgroup') }}
                >
                  <ArrowForwardIosIcon sx={{ fontSize: '0.75rem' }} />
                </Box>
              </Box>
              <Box className={classes.hScrollRow}>
                {groupItems.slice(0, 10).map(acc => (
                  <GridCard
                    key={acc.id}
                    acc={acc}
                    saved={savedIds.has(acc.id)}
                    onSave={handleToggleSave}
                    onClick={() => handleSelectAcc(acc)}
                    classes={classes}
                  />
                ))}
              </Box>
            </Box>
          )
        })
      )}

      {/* Filter sheet */}
      <SharedRoomFilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        listingCount={categoryAccommodations.length}
      />
    </Box>
  )
}

export default AccommodationPage
