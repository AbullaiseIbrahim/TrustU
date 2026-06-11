import React, { useState } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Skeleton,
} from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import SearchIcon from '@mui/icons-material/Search'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import { makeStyles } from 'tss-react/mui'
import {
  useAccommodations,
} from '../hooks/useAccommodationQueries'
import {
  accommodationTypeLabel,
  accommodationGenderLabel,
  type Accommodation,
} from '@/services/accommodation.api'
import { formatINR, getInitials } from '@/utils'
import colors from '@/theme/colors'
import EmptyState from '@/components/EmptyState'
import SharedRoomFilterSheet, {
  type SharedRoomFilters,
  EMPTY_SHARED_FILTERS,
  getActiveChips,
} from '../components/SharedRoomFilterSheet'
import SharedRoomDetailSheet from '../components/SharedRoomDetailSheet'
import ShortStayFilterSheet, {
  type ShortStayFilters,
  EMPTY_SHORT_STAY_FILTERS,
  getShortStayActiveChips,
} from '../components/ShortStayFilterSheet'

// ── Styles ────────────────────────────────────────────────────────────────────

const useStyles = makeStyles()(() => ({
  // Page sub-header
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 18px 8px',
  },
  pageHeaderLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  pageTitle: {
    fontWeight: 700,
    fontSize: '1.15rem',
    color: colors.ink,
    letterSpacing: '-0.4px',
  },
  pageSub: {
    fontSize: '0.75rem',
    color: colors.ink3,
    fontWeight: 500,
    marginTop: 1,
  },
  filterIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.cream,
    border: `1px solid ${colors.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: colors.ink2,
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: colors.line },
  },
  // Mode tabs
  modeTabs: {
    display: 'flex',
    gap: 6,
    padding: '4px 18px 8px',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  modeTab: {
    padding: '6px 16px',
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
  modeTabActive: {
    background: colors.ink,
    color: '#fff',
  },
  // Search pill
  searchPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    margin: '4px 18px 0',
    padding: '10px 8px 10px 14px',
    borderRadius: 999,
    backgroundColor: colors.white,
    border: `1.5px solid ${colors.line}`,
    cursor: 'pointer',
    transition: 'border-color 0.15s ease',
    '&:hover': { borderColor: colors.ink3 },
  },
  searchText: {
    flex: 1,
    fontSize: '0.85rem',
    color: colors.ink4,
    fontWeight: 500,
  },
  searchArrow: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: colors.moss,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  // Filter chips row
  chipsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '10px 18px 4px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  activeChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 999,
    backgroundColor: colors.moss,
    color: '#fff',
    fontSize: '0.76rem',
    fontWeight: 600,
    flexShrink: 0,
    cursor: 'default',
    userSelect: 'none',
  },
  clearChip: {
    display: 'inline-flex',
    alignItems: 'center',
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 999,
    border: `1px solid ${colors.line}`,
    backgroundColor: colors.white,
    color: colors.ink3,
    fontSize: '0.76rem',
    fontWeight: 600,
    flexShrink: 0,
    cursor: 'pointer',
    fontFamily: 'inherit',
    '&:hover': { backgroundColor: colors.cream },
  },
  // List area
  listArea: {
    padding: '10px 18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  // Listing card
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 6px 22px rgba(20,20,15,0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    animation: 'fadeSlideUp 0.28s ease both',
    '&:hover': {
      boxShadow: '0 8px 28px rgba(20,20,15,0.10)',
      transform: 'translateY(-2px)',
    },
    '&:active': { transform: 'translateY(0)' },
  },
  // Card photo area
  photoBlock: {
    height: 160,
    position: 'relative',
  },
  urgentBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.urgent,
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    padding: '4px 9px',
    borderRadius: 6,
  },
  typeBadge: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.88)',
    color: colors.ink2,
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 6,
    backdropFilter: 'blur(4px)',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.88)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.96)' },
  },
  // Card body
  cardBody: {
    padding: '13px 16px 14px',
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: colors.ink,
    letterSpacing: '-0.25px',
    lineHeight: 1.3,
    marginBottom: 4,
  },
  cardLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: '0.76rem',
    color: colors.ink3,
    marginBottom: 8,
    '& svg': { fontSize: '0.82rem', color: colors.ink4 },
  },
  cardPrice: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 3,
    marginBottom: 10,
  },
  cardPriceAmt: {
    fontWeight: 700,
    fontSize: '1.15rem',
    color: colors.ink,
    letterSpacing: '-0.4px',
  },
  cardPricePer: {
    fontSize: '0.78rem',
    color: colors.ink3,
    fontWeight: 500,
  },
  // Poster row
  posterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  posterAvatar: {
    width: 34,
    height: 34,
    fontSize: '0.72rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  posterName: {
    fontWeight: 700,
    fontSize: '0.82rem',
    color: colors.ink,
  },
  posterMutual: {
    fontSize: '0.72rem',
    color: colors.ink3,
    fontWeight: 500,
    marginTop: 1,
  },
  addFriendBtn: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '6px 12px',
    borderRadius: 8,
    border: `1.5px solid ${colors.moss}`,
    backgroundColor: 'transparent',
    color: colors.moss,
    fontSize: '0.76rem',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    flexShrink: 0,
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: colors.mossSoft },
  },
  // Card footer
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTop: `1px solid ${colors.lineSoft}`,
  },
  cardFrom: {
    fontSize: '0.72rem',
    color: colors.ink4,
    fontWeight: 500,
  },
  moreLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: '0.78rem',
    fontWeight: 700,
    color: colors.moss,
    cursor: 'pointer',
    '& svg': { fontSize: '0.8rem' },
  },
}))

// ── Listing Card ──────────────────────────────────────────────────────────────

interface CardProps {
  acc: Accommodation
  saved: boolean
  onSave: (id: string) => void
  onClick: () => void
}

const hueForGender = (g: number) => g === 2 ? 340 : g === 1 ? 200 : 110

const AccommodationCard: React.FC<CardProps> = ({ acc, saved, onSave, onClick }) => {
  const { classes } = useStyles()
  const hue = hueForGender(acc.gender)
  const heroGrad = `linear-gradient(160deg, oklch(84% 0.05 ${hue}), oklch(70% 0.08 ${hue + 30}))`
  const avatarHue = 200
  const avatarGrad = `linear-gradient(140deg, oklch(82% 0.07 ${avatarHue}), oklch(72% 0.09 ${avatarHue + 40}))`

  const isUrgent = acc.isNegotiable
  const flatLabel = acc.type === 1 ? '2BHK' : acc.type === 2 ? '3BHK' : '1BHK'
  const priceUnit = '/night · per head'

  return (
    <Box className={classes.card} onClick={onClick}>
      {/* Photo */}
      <Box className={classes.photoBlock} sx={{ background: heroGrad }}>
        {isUrgent && <Box className={classes.urgentBadge}>URGENT</Box>}
        <Box className={classes.typeBadge}>{flatLabel}</Box>
        <Box
          component="button"
          className={classes.heartBtn}
          onClick={e => { e.stopPropagation(); onSave(acc.id) }}
        >
          {saved
            ? <FavoriteIcon sx={{ fontSize: '0.9rem', color: colors.urgent }} />
            : <FavoriteBorderIcon sx={{ fontSize: '0.9rem', color: colors.ink2 }} />}
        </Box>
      </Box>

      {/* Body */}
      <Box className={classes.cardBody}>
        <Typography className={classes.cardTitle}>
          {acc.title || 'Stay Listing'}
        </Typography>

        <Box className={classes.cardLocation}>
          <LocationOnOutlinedIcon />
          {accommodationTypeLabel(acc.type)} · {acc.address}
        </Box>

        <Box className={classes.cardPrice}>
          <Typography className={classes.cardPriceAmt}>{formatINR(acc.amount)}</Typography>
          <Typography className={classes.cardPricePer}>{priceUnit}</Typography>
        </Box>

        {/* Poster row */}
        <Box className={classes.posterRow}>
          <Avatar
            className={classes.posterAvatar}
            sx={{ background: avatarGrad, color: `oklch(28% 0.07 ${avatarHue})` }}
          >
            {getInitials(acc.userName)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography className={classes.posterName}>{acc.userName}</Typography>
            {acc.mutualFriends > 0 && (
              <Typography className={classes.posterMutual}>{acc.mutualFriends} mutual friends</Typography>
            )}
          </Box>
          <Box
            component="button"
            className={classes.addFriendBtn}
            onClick={e => e.stopPropagation()}
          >
            <PersonAddOutlinedIcon sx={{ fontSize: '0.85rem' }} />
            Add Friend
          </Box>
        </Box>

        {/* Footer */}
        <Box className={classes.cardFooter}>
          <Typography className={classes.cardFrom}>
            From {accommodationGenderLabel(acc.gender) !== 'Any' ? accommodationGenderLabel(acc.gender) : 'Thrissur'}
          </Typography>
          <Box className={classes.moreLink}>
            More details <ArrowForwardIcon />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

type ModeTab = 'stay' | 'community' | 'marketplace' | 'service'

const AccommodationPage: React.FC = () => {
  const { classes, cx } = useStyles()

  const [modeTab, setModeTab] = useState<ModeTab>('stay')
  const [filterOpen, setFilterOpen] = useState(false)
  const [sharedFilters, setSharedFilters] = useState<SharedRoomFilters>(EMPTY_SHARED_FILTERS)
  const [shortStayFilters, setShortStayFilters] = useState<ShortStayFilters>(EMPTY_SHORT_STAY_FILTERS)
  const [detailAcc, setDetailAcc] = useState<Accommodation | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const isShortStay = modeTab === 'marketplace' // reuse for demo; in real app, 'short-stay' tab
  const activeChips = isShortStay
    ? getShortStayActiveChips(shortStayFilters)
    : getActiveChips(sharedFilters)

  // Only pass gender/budget that the current API supports
  const apiParams: Record<string, string> = {}
  if (sharedFilters.gender === 'male')   apiParams.gender = '1'
  if (sharedFilters.gender === 'female') apiParams.gender = '2'
  if (sharedFilters.budgetMin)           apiParams.amount_min = sharedFilters.budgetMin
  if (sharedFilters.budgetMax)           apiParams.amount_max = sharedFilters.budgetMax

  const { data, isLoading, isError } = useAccommodations(
    Object.keys(apiParams).length > 0 ? apiParams : undefined,
  )
  const accommodations = data?.data ?? []

  const handleSave = (id: string) =>
    setSavedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const clearFilters = () => {
    setSharedFilters(EMPTY_SHARED_FILTERS)
    setShortStayFilters(EMPTY_SHORT_STAY_FILTERS)
  }

  const listingLabel = accommodations.length
    ? `${accommodations.length} listing${accommodations.length !== 1 ? 's' : ''}`
    : 'No listings'

  return (
    <Box sx={{ backgroundColor: colors.cream, minHeight: '100%' }}>

      {/* Page sub-header */}
      <Box className={classes.pageHeader}>
        <Box className={classes.pageHeaderLeft}>
          <Typography className={classes.pageTitle}>Short Stay</Typography>
          <Typography className={classes.pageSub}>{listingLabel} · Jamia Nagar</Typography>
        </Box>
        <Box
          component="button"
          className={classes.filterIconBtn}
          onClick={() => setFilterOpen(true)}
          aria-label="Open filters"
        >
          <TuneIcon sx={{ fontSize: '1.1rem' }} />
        </Box>
      </Box>

      {/* Mode tabs */}
      <Box className={classes.modeTabs}>
        {(['stay', 'community', 'marketplace', 'service'] as ModeTab[]).map(t => (
          <Box
            key={t}
            component="button"
            className={cx(classes.modeTab, { [classes.modeTabActive]: modeTab === t })}
            onClick={() => setModeTab(t)}
          >
            {t === 'stay' ? 'Stay' : t === 'community' ? 'Community' : t === 'marketplace' ? 'Marketplace' : 'Service'}
          </Box>
        ))}
      </Box>

      {/* Search pill */}
      <Box className={classes.searchPill} onClick={() => setFilterOpen(true)}>
        <SearchIcon sx={{ fontSize: '1rem', color: colors.ink4 }} />
        <Typography className={classes.searchText}>Start your search</Typography>
        <Box className={classes.searchArrow}>
          <ArrowForwardIcon sx={{ fontSize: '0.9rem', color: '#fff' }} />
        </Box>
      </Box>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <Box className={classes.chipsBar}>
          {activeChips.map(chip => (
            <Box key={chip} className={classes.activeChip}>{chip}</Box>
          ))}
          <Box
            component="button"
            className={classes.clearChip}
            onClick={clearFilters}
          >
            ✕ Clear
          </Box>
        </Box>
      )}

      {/* Listings */}
      <Box className={classes.listArea}>

        {isLoading && [1, 2, 3].map(i => (
          <Box key={i} sx={{
            backgroundColor: colors.white,
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(20,20,15,0.04)',
          }}>
            {/* Photo block — rectangular with no radius (clipped by parent overflow:hidden) */}
            <Skeleton
              variant="rectangular"
              height={160}
              sx={{ borderRadius: 0, transform: 'none' }}
            />
            <Box sx={{ p: '13px 16px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Title */}
              <Skeleton variant="rounded" width="68%" height={16} sx={{ borderRadius: '6px' }} />
              {/* Location */}
              <Skeleton variant="rounded" width="50%" height={13} sx={{ borderRadius: '6px' }} />
              {/* Price */}
              <Skeleton variant="rounded" width="38%" height={20} sx={{ borderRadius: '6px' }} />
              {/* Poster row */}
              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Skeleton variant="circular" width={34} height={34} sx={{ flexShrink: 0 }} />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <Skeleton variant="rounded" width="42%" height={13} sx={{ borderRadius: '6px' }} />
                  <Skeleton variant="rounded" width="32%" height={11} sx={{ borderRadius: '6px' }} />
                </Box>
                <Skeleton variant="rounded" width={90} height={30} sx={{ borderRadius: '8px', flexShrink: 0 }} />
              </Box>
              {/* Footer divider + from / more details */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: '8px', borderTop: `1px solid ${colors.lineSoft}` }}>
                <Skeleton variant="rounded" width="28%" height={12} sx={{ borderRadius: '6px' }} />
                <Skeleton variant="rounded" width="22%" height={12} sx={{ borderRadius: '6px' }} />
              </Box>
            </Box>
          </Box>
        ))}

        {!isLoading && isError && (
          <EmptyState
            title="Couldn't load listings"
            description="Something went wrong. Please try refreshing."
            icon={<HomeWorkOutlinedIcon />}
          />
        )}

        {!isLoading && !isError && accommodations.length === 0 && (
          <EmptyState
            title="No listings found"
            description="No stays match your filters, or none have been posted yet."
            icon={<HomeWorkOutlinedIcon />}
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        )}

        {!isLoading && !isError && accommodations.map(acc => (
          <AccommodationCard
            key={acc.id}
            acc={acc}
            saved={savedIds.has(acc.id)}
            onSave={handleSave}
            onClick={() => setDetailAcc(acc)}
          />
        ))}

      </Box>

      {/* Filter sheets */}
      {isShortStay ? (
        <ShortStayFilterSheet
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={shortStayFilters}
          onChange={setShortStayFilters}
        />
      ) : (
        <SharedRoomFilterSheet
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={sharedFilters}
          onChange={setSharedFilters}
          listingCount={accommodations.length}
        />
      )}

      {/* Detail sheet */}
      <SharedRoomDetailSheet
        acc={detailAcc}
        onClose={() => setDetailAcc(null)}
        saved={detailAcc ? savedIds.has(detailAcc.id) : false}
        onToggleSave={handleSave}
      />
    </Box>
  )
}

export default AccommodationPage
