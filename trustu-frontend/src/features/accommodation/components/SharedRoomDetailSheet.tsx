import React from 'react'
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShareIcon from '@mui/icons-material/Share'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import WifiIcon from '@mui/icons-material/Wifi'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import KitchenIcon from '@mui/icons-material/Kitchen'
import IronIcon from '@mui/icons-material/Iron'
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService'
import SingleBedIcon from '@mui/icons-material/SingleBed'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import { makeStyles } from 'tss-react/mui'
import { type Accommodation, accommodationTypeLabel, accommodationGenderLabel } from '@/services/accommodation.api'
import { useMutualFriends } from '@/features/circle/hooks/useFriendshipQueries'
import { formatINR, formatDate, getInitials } from '@/utils'
import colors from '@/theme/colors'

// ── Styles ────────────────────────────────────────────────────────────────────

const useStyles = makeStyles()(() => ({
  paper: {
    borderRadius: '20px 20px 0 0',
    maxHeight: '95vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  hero: {
    height: 240,
    position: 'relative',
    flexShrink: 0,
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 50%)',
  },
  heroControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
  },
  heroBtn: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.88)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: colors.ink,
    backdropFilter: 'blur(4px)',
    border: 'none',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.96)' },
  },
  heroBtnsRight: {
    display: 'flex',
    gap: 8,
  },
  urgentBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    padding: '4px 10px',
    borderRadius: 999,
    backgroundColor: colors.urgent,
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
  },
  body: {
    overflowY: 'auto',
    flex: 1,
    '&::-webkit-scrollbar': { display: 'none' },
    scrollbarWidth: 'none',
  },
  content: {
    padding: '18px 18px 100px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  eyebrow: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: colors.ink3,
    marginBottom: 4,
  },
  title: {
    fontWeight: 700,
    fontSize: '1.3rem',
    color: colors.ink,
    letterSpacing: '-0.4px',
    lineHeight: 1.25,
  },
  priceCard: {
    backgroundColor: colors.cream,
    borderRadius: 14,
    padding: '14px 16px',
    border: `1px solid ${colors.lineSoft}`,
  },
  priceMain: {
    fontWeight: 700,
    fontSize: '1.55rem',
    color: colors.ink,
    letterSpacing: '-0.6px',
    lineHeight: 1.1,
  },
  priceLabel: {
    fontWeight: 500,
    fontSize: '0.8rem',
    color: colors.ink3,
    marginLeft: 4,
  },
  priceSplit: {
    fontWeight: 500,
    fontSize: '0.78rem',
    color: colors.ink3,
    marginTop: 5,
  },
  statsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.78rem',
    color: colors.ink3,
    fontWeight: 500,
    '& svg': { fontSize: '0.95rem', color: colors.ink4 },
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: '50%',
    backgroundColor: colors.ink4,
  },
  posterCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: '14px 16px',
    border: `1px solid ${colors.line}`,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  posterAvatar: {
    width: 46,
    height: 46,
    fontSize: '1rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  posterName: {
    fontWeight: 700,
    fontSize: '0.9rem',
    color: colors.ink,
    letterSpacing: '-0.2px',
  },
  posterMeta: {
    fontSize: '0.75rem',
    color: colors.ink3,
    marginTop: 2,
  },
  mutualChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.mossSoft,
    color: colors.mossDeep,
    borderRadius: 999,
    padding: '3px 10px',
    fontSize: '0.72rem',
    fontWeight: 600,
    marginTop: 5,
  },
  addFriendBtn: {
    marginLeft: 'auto',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '7px 14px',
    borderRadius: 10,
    border: `1.5px solid ${colors.moss}`,
    backgroundColor: 'transparent',
    color: colors.moss,
    fontSize: '0.78rem',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: colors.mossSoft },
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: colors.ink,
    letterSpacing: '-0.2px',
    marginBottom: 12,
  },
  amenitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },
  amenityTile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '12px 8px',
    borderRadius: 12,
    backgroundColor: colors.cream,
    border: `1px solid ${colors.lineSoft}`,
    '& svg': { fontSize: '1.3rem', color: colors.moss },
  },
  amenityLabel: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: colors.ink2,
    textAlign: 'center',
  },
  reviewsCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: '14px 16px',
    border: `1px solid ${colors.line}`,
  },
  reviewsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  ratingBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.amber + '20',
    color: '#b87a20',
    borderRadius: 8,
    padding: '3px 8px',
    fontWeight: 700,
    fontSize: '0.82rem',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '12px 18px 20px',
    backgroundColor: colors.white,
    borderTop: `1px solid ${colors.lineSoft}`,
    display: 'flex',
    gap: 10,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.07)',
  },
  msgBtn: {
    flex: 1,
    padding: '13px',
    borderRadius: 12,
    border: `1.5px solid ${colors.line}`,
    backgroundColor: colors.white,
    color: colors.ink,
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: colors.cream },
  },
  whatsappBtn: {
    flex: 2,
    padding: '13px',
    borderRadius: 12,
    border: 'none',
    backgroundColor: '#25D366',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'background-color 0.15s ease',
    '&:hover': { backgroundColor: '#1da754' },
  },
}))

// ── Amenity tiles ─────────────────────────────────────────────────────────────

const AMENITY_TILES = [
  { icon: <WifiIcon />,                label: 'Wifi' },
  { icon: <SingleBedIcon />,           label: 'Bed & Cot' },
  { icon: <AcUnitIcon />,              label: 'AC' },
  { icon: <LocalLaundryServiceIcon />, label: 'Washing' },
  { icon: <KitchenIcon />,             label: 'Fridge' },
  { icon: <IronIcon />,                label: 'Iron Box' },
]

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  acc: Accommodation | null
  onClose: () => void
  saved?: boolean
  onToggleSave?: (id: string) => void
}

const SharedRoomDetailSheet: React.FC<Props> = ({ acc, onClose, saved = false, onToggleSave }) => {
  const { classes } = useStyles()

  const { data: mutualFriends = [], isLoading: loadingMutual } = useMutualFriends(
    acc?.userId ?? '',
  )

  if (!acc) return null

  const hue = 110
  const heroGradient = `linear-gradient(160deg, oklch(84% 0.05 ${hue}), oklch(68% 0.08 ${hue + 30}))`
  const posterHue = 200
  const posterGradient = `linear-gradient(140deg, oklch(82% 0.07 ${posterHue}), oklch(72% 0.09 ${posterHue + 40}))`

  const eyebrow = [
    accommodationTypeLabel(acc.type),
    accommodationGenderLabel(acc.gender) !== 'Any' ? accommodationGenderLabel(acc.gender) : null,
  ].filter(Boolean).join(' · ')

  const mutualCount = loadingMutual ? acc.mutualFriends : mutualFriends.length

  return (
    <Dialog
      open={!!acc}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ className: classes.paper, sx: { m: { xs: 0, sm: 2 }, mt: 'auto', position: 'relative' } }}
    >
      {/* Hero */}
      <Box className={classes.hero} sx={{ background: heroGradient }}>
        <Box className={classes.heroOverlay} />

        {/* Floating controls */}
        <Box className={classes.heroControls}>
          <Box component="button" className={classes.heroBtn} onClick={onClose} aria-label="back">
            <ArrowBackIcon sx={{ fontSize: '1.1rem' }} />
          </Box>
          <Box className={classes.heroBtnsRight}>
            <Box component="button" className={classes.heroBtn} aria-label="share">
              <ShareIcon sx={{ fontSize: '1rem' }} />
            </Box>
            <Box
              component="button"
              className={classes.heroBtn}
              aria-label="save"
              onClick={(e) => { e.stopPropagation(); onToggleSave?.(acc.id) }}
            >
              {saved
                ? <FavoriteIcon sx={{ fontSize: '1rem', color: colors.urgent }} />
                : <FavoriteBorderIcon sx={{ fontSize: '1rem' }} />}
            </Box>
          </Box>
        </Box>

        {/* Photo label */}
        <Box sx={{
          position: 'absolute', bottom: '50%', left: '50%',
          transform: 'translate(-50%, 50%)',
          color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>
          room photo
        </Box>
      </Box>

      {/* Scrollable body */}
      <DialogContent className={classes.body} sx={{ p: 0 }}>
        <Box className={classes.content}>

          {/* Eyebrow + Title */}
          <Box>
            {eyebrow && <Typography className={classes.eyebrow}>{eyebrow}</Typography>}
            <Typography className={classes.title}>
              {acc.title || 'Accommodation Listing'}
            </Typography>
          </Box>

          {/* Price band */}
          <Box className={classes.priceCard}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
              <Typography className={classes.priceMain}>{formatINR(acc.amount)}</Typography>
              <Typography className={classes.priceLabel}>/month · per head</Typography>
            </Box>
            <Typography className={classes.priceSplit}>
              {acc.isNegotiable ? 'Rent is negotiable' : `Total rent ${formatINR(acc.amount)} · fixed`}
            </Typography>
          </Box>

          {/* Stats row */}
          <Box className={classes.statsRow}>
            <Box className={classes.statItem}>
              <LocationOnOutlinedIcon />
              {acc.address}
            </Box>
            <Box className={classes.statDot} />
            {acc.availableFrom && (
              <>
                <Box className={classes.statItem}>
                  <CalendarTodayOutlinedIcon />
                  {formatDate(acc.availableFrom)}
                </Box>
                <Box className={classes.statDot} />
              </>
            )}
            <Box className={classes.statItem}>
              <StarRoundedIcon sx={{ color: `${colors.amber} !important` }} />
              4.2 · 6 reviews
            </Box>
          </Box>

          <Divider sx={{ borderColor: colors.lineSoft }} />

          {/* Poster card */}
          <Box className={classes.posterCard}>
            <Avatar
              className={classes.posterAvatar}
              sx={{ background: posterGradient, color: `oklch(28% 0.07 ${posterHue})` }}
            >
              {getInitials(acc.userName)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography className={classes.posterName}>{acc.userName}</Typography>
              <Typography className={classes.posterMeta}>Posted by · {acc.address}</Typography>
              {mutualCount > 0 && (
                <Box className={classes.mutualChip}>
                  <PeopleAltOutlinedIcon sx={{ fontSize: '0.75rem' }} />
                  {mutualCount} mutual friend{mutualCount !== 1 ? 's' : ''}
                </Box>
              )}
            </Box>
            <Box
              component="button"
              className={classes.addFriendBtn}
              onClick={(e) => e.stopPropagation()}
            >
              <PersonAddOutlinedIcon sx={{ fontSize: '0.9rem' }} />
              Add
            </Box>
          </Box>

          {/* Amenities */}
          <Box>
            <Typography className={classes.sectionTitle}>Amenities</Typography>
            <Box className={classes.amenitiesGrid}>
              {AMENITY_TILES.map(a => (
                <Box key={a.label} className={classes.amenityTile}>
                  {a.icon}
                  <Typography className={classes.amenityLabel}>{a.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Description */}
          {acc.description && (
            <Box>
              <Typography className={classes.sectionTitle}>About this place</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: colors.ink3, lineHeight: 1.7 }}>
                {acc.description}
              </Typography>
            </Box>
          )}

          {/* Reviews placeholder */}
          <Box className={classes.reviewsCard}>
            <Box className={classes.reviewsHeader}>
              <Typography className={classes.sectionTitle} sx={{ mb: 0 }}>Reviews</Typography>
              <Box className={classes.ratingBadge}>
                <StarRoundedIcon sx={{ fontSize: '0.85rem', color: colors.amber }} />
                4.2
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: colors.ink4, ml: 0.5 }}>6 reviews</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.8rem', color: colors.ink3, lineHeight: 1.6 }}>
              "Great location, very close to the main gate. The landlord is helpful and the flat is well maintained."
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 6, mt: 1 }}>
              <Avatar sx={{ width: 22, height: 22, fontSize: '0.6rem', bgcolor: colors.mossSoft, color: colors.mossDeep, fontWeight: 700 }}>
                RK
              </Avatar>
              <Typography sx={{ fontSize: '0.72rem', color: colors.ink4, fontWeight: 500 }}>
                Rahul K. · 2 weeks ago
              </Typography>
            </Box>
          </Box>

          {/* Mutual friends */}
          {mutualFriends.length > 0 && (
            <Box>
              <Typography className={classes.sectionTitle}>
                {mutualFriends.length} mutual friend{mutualFriends.length !== 1 ? 's' : ''} here
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {mutualFriends.map(f => (
                  <Chip
                    key={f.id}
                    avatar={
                      <Avatar sx={{ bgcolor: colors.mossSoft, color: colors.mossDeep, fontSize: '0.6rem', fontWeight: 700 }}>
                        {getInitials(f.name)}
                      </Avatar>
                    }
                    label={f.name}
                    size="small"
                    sx={{ backgroundColor: colors.mossSoft, color: colors.mossDeep, fontWeight: 600, fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </Box>
          )}

        </Box>
      </DialogContent>

      {/* Sticky footer CTA */}
      <Box className={classes.footer}>
        <Box component="button" className={classes.msgBtn}>
          <ChatBubbleOutlineIcon sx={{ fontSize: '1rem' }} />
          Message
        </Box>
        <Box component="button" className={classes.whatsappBtn}>
          <WhatsAppIcon sx={{ fontSize: '1.1rem' }} />
          Contact via WhatsApp
        </Box>
      </Box>
    </Dialog>
  )
}

export default SharedRoomDetailSheet
