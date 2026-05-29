import React, { useState } from 'react'
import {
  Box, Typography, Skeleton, IconButton, Menu, MenuItem,
  ListItemIcon, Chip, Divider,
} from '@mui/material'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { makeStyles } from 'tss-react/mui'
import { useUserAccommodations, useDeleteAccommodation } from '@/features/accommodation/hooks/useAccommodationQueries'
import { useUserProxyListings, useDeleteProxy } from '@/features/proxy/hooks/useProxyQueries'
import { useUserMarketplaceListings, useDeleteMarketplaceListing } from '@/features/marketplace/hooks/useMarketplaceQueries'
import { accommodationTypeLabel, accommodationGenderLabel } from '@/services/accommodation.api'
import { formatINR, formatDate } from '@/utils'
import colors from '@/theme/colors'
import type { Accommodation } from '@/services/accommodation.api'
import type { ProxyListing } from '@/types/proxy.types'
import type { MarketplaceListing } from '@/types/marketplace.types'

const useStyles = makeStyles()(() => ({
  page: {
    backgroundColor: '#F2F8F3',
    minHeight: '100%',
    paddingBottom: 16,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '20px 16px 10px',
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.primary}0c 100%)`,
    border: `1px solid ${colors.primary}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: colors.textPrimary,
    letterSpacing: '-0.1px',
  },
  sectionCount: {
    fontSize: '0.7rem',
    color: colors.primary,
    fontWeight: 700,
    backgroundColor: `${colors.primary}12`,
    borderRadius: 8,
    padding: '2px 8px',
    border: `1px solid ${colors.primary}20`,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    margin: '0 16px 10px',
    border: '1px solid rgba(0,0,0,0.06)',
    padding: '14px 14px 12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
    animation: 'fadeSlideUp 0.3s ease both',
    '&:hover': {
      boxShadow: '0 6px 20px rgba(0,0,0,0.09)',
      transform: 'translateY(-1px)',
      borderColor: `${colors.primary}25`,
    },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: '0.9rem',
    color: colors.textPrimary,
    lineHeight: 1.35,
    flex: 1,
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: '0.74rem',
    color: colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontWeight: 500,
    '& svg': { fontSize: '0.8rem' },
  },
  chip: {
    height: 22,
    fontSize: '0.68rem',
    fontWeight: 600,
    backgroundColor: `${colors.primary}10`,
    color: colors.primary,
    marginTop: 6,
    marginRight: 4,
    borderRadius: 8,
  },
  priceText: {
    fontWeight: 800,
    fontSize: '1rem',
    color: colors.primary,
    marginTop: 4,
    letterSpacing: '-0.2px',
  },
  emptyBox: {
    margin: '0 16px 12px',
    padding: '24px 16px',
    backgroundColor: colors.white,
    borderRadius: 20,
    border: '1px solid rgba(0,0,0,0.06)',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  emptyText: {
    fontSize: '0.82rem',
    color: colors.textSecondary,
    fontWeight: 500,
  },
  skeletonCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    margin: '0 16px 10px',
    padding: '14px',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
}))

// ── Reusable card menu ────────────────────────────────────────────────────────
interface CardMenuProps {
  onDelete: () => void
  onEdit?: () => void
  isDeleting?: boolean
}

const CardMenu: React.FC<CardMenuProps> = ({ onDelete, onEdit, isDeleting }) => {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  return (
    <>
      <IconButton size="small" sx={{ mt: -0.5, mr: -0.5, color: colors.textSecondary }}
        onClick={e => setAnchor(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 140, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}>
        {onEdit && (
          <MenuItem onClick={() => { setAnchor(null); onEdit() }}
            sx={{ fontSize: '0.85rem', gap: 1 }}>
            <ListItemIcon sx={{ minWidth: 'auto', color: colors.textPrimary }}>
              <EditOutlinedIcon sx={{ fontSize: '1.1rem' }} />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}
        <MenuItem
          onClick={() => { setAnchor(null); onDelete() }}
          disabled={isDeleting}
          sx={{ fontSize: '0.85rem', color: colors.error, gap: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 'auto', color: 'inherit' }}>
            <DeleteOutlineIcon sx={{ fontSize: '1.1rem' }} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
const SkeletonCard: React.FC = () => {
  const { classes } = useStyles()
  return (
    <Box className={classes.skeletonCard}>
      <Skeleton variant="text" width="70%" height={20} />
      <Skeleton variant="text" width="50%" height={16} sx={{ mt: 0.5 }} />
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Skeleton variant="rounded" width={60} height={18} />
        <Skeleton variant="rounded" width={80} height={18} />
      </Box>
    </Box>
  )
}

// ── Accommodation section ─────────────────────────────────────────────────────
const AccommodationSection: React.FC = () => {
  const { classes } = useStyles()
  const { data, isLoading } = useUserAccommodations()
  const deleteMutation = useDeleteAccommodation()
  const listings: Accommodation[] = data?.data ?? []

  return (
    <Box>
      <Box className={classes.sectionHeader}>
        <Box className={classes.sectionIcon}>
          <HomeWorkOutlinedIcon sx={{ fontSize: '1.1rem', color: colors.primary }} />
        </Box>
        <Typography className={classes.sectionTitle}>Accommodation</Typography>
        {!isLoading && <span className={classes.sectionCount}>{listings.length}</span>}
      </Box>

      {isLoading && [1, 2].map(i => <SkeletonCard key={i} />)}

      {!isLoading && listings.length === 0 && (
        <Box className={classes.emptyBox}>
          <Typography className={classes.emptyText}>No accommodation listings yet.</Typography>
        </Box>
      )}

      {!isLoading && listings.map(acc => (
        <Box key={acc.id} className={classes.card}>
          <Box className={classes.cardHeader}>
            <Box sx={{ flex: 1 }}>
              <Typography className={classes.cardTitle}>{acc.title || 'Untitled listing'}</Typography>
              <Box className={classes.cardMeta}>
                {acc.address && (
                  <Typography className={classes.metaText}>
                    <LocationOnOutlinedIcon />{acc.address}
                  </Typography>
                )}
              </Box>
              <Box>
                <Chip label={accommodationTypeLabel(acc.type)} size="small" className={classes.chip} />
                <Chip label={accommodationGenderLabel(acc.gender)} size="small" className={classes.chip} />
                {acc.isNegotiable && <Chip label="Negotiable" size="small" className={classes.chip} />}
              </Box>
              <Typography className={classes.priceText}>{formatINR(acc.amount)}/mo</Typography>
              {acc.availableFrom && (
                <Typography sx={{ fontSize: '0.75rem', color: colors.textSecondary, mt: 0.5 }}>
                  Available from {formatDate(acc.availableFrom)}
                </Typography>
              )}
            </Box>
            <CardMenu
              onDelete={() => deleteMutation.mutate(acc.id)}
              isDeleting={deleteMutation.isPending}
            />
          </Box>
        </Box>
      ))}

      <Divider sx={{ mx: 2, mt: 4, mb: 0, borderColor: '#EBEBEB' }} />
    </Box>
  )
}

// ── Proxy section ─────────────────────────────────────────────────────────────
const ProxySection: React.FC = () => {
  const { classes } = useStyles()
  const { data, isLoading } = useUserProxyListings()
  const deleteMutation = useDeleteProxy()
  const listings: ProxyListing[] = data?.data ?? []

  return (
    <Box>
      <Box className={classes.sectionHeader}>
        <Box className={classes.sectionIcon}>
          <DeliveryDiningOutlinedIcon sx={{ fontSize: '1.1rem', color: colors.primary }} />
        </Box>
        <Typography className={classes.sectionTitle}>Proxy Services</Typography>
        {!isLoading && <span className={classes.sectionCount}>{listings.length}</span>}
      </Box>

      {isLoading && [1].map(i => <SkeletonCard key={i} />)}

      {!isLoading && listings.length === 0 && (
        <Box className={classes.emptyBox}>
          <Typography className={classes.emptyText}>No proxy services listed yet.</Typography>
        </Box>
      )}

      {!isLoading && listings.map(item => (
        <Box key={item.id} className={classes.card}>
          <Box className={classes.cardHeader}>
            <Box sx={{ flex: 1 }}>
              <Typography className={classes.cardTitle}>{item.serviceType}</Typography>
              <Box className={classes.cardMeta}>
                {item.location && (
                  <Typography className={classes.metaText}>
                    <LocationOnOutlinedIcon />{item.location}
                  </Typography>
                )}
              </Box>
              {item.chargePerTask != null && (
                <Typography className={classes.priceText}>{formatINR(item.chargePerTask)}/task</Typography>
              )}
              {item.chargeRange && (
                <Typography className={classes.priceText}>{item.chargeRange}</Typography>
              )}
              {item.availableUntil && (
                <Typography sx={{ fontSize: '0.75rem', color: colors.textSecondary, mt: 0.5 }}>
                  Available until {formatDate(item.availableUntil)}
                </Typography>
              )}
            </Box>
            <CardMenu
              onDelete={() => deleteMutation.mutate(item.id)}
              isDeleting={deleteMutation.isPending}
            />
          </Box>
        </Box>
      ))}

      <Divider sx={{ mx: 2, mt: 4, mb: 0, borderColor: '#EBEBEB' }} />
    </Box>
  )
}

// ── Marketplace section ───────────────────────────────────────────────────────
const MarketplaceSection: React.FC = () => {
  const { classes } = useStyles()
  const { data, isLoading } = useUserMarketplaceListings()
  const deleteMutation = useDeleteMarketplaceListing()
  const listings: MarketplaceListing[] = data?.data ?? []

  return (
    <Box>
      <Box className={classes.sectionHeader}>
        <Box className={classes.sectionIcon}>
          <StorefrontOutlinedIcon sx={{ fontSize: '1.1rem', color: colors.primary }} />
        </Box>
        <Typography className={classes.sectionTitle}>Buy &amp; Sell</Typography>
        {!isLoading && <span className={classes.sectionCount}>{listings.length}</span>}
      </Box>

      {isLoading && [1].map(i => <SkeletonCard key={i} />)}

      {!isLoading && listings.length === 0 && (
        <Box className={classes.emptyBox}>
          <Typography className={classes.emptyText}>No items listed for sale yet.</Typography>
        </Box>
      )}

      {!isLoading && listings.map(item => (
        <Box key={item.id} className={classes.card}>
          <Box className={classes.cardHeader}>
            <Box sx={{ flex: 1 }}>
              <Typography className={classes.cardTitle}>{item.itemName}</Typography>
              <Box className={classes.cardMeta}>
                <Chip label={item.itemType} size="small" className={classes.chip} />
                {item.priceNegotiable && <Chip label="Negotiable" size="small" className={classes.chip} />}
              </Box>
              {item.location && (
                <Typography className={classes.metaText} sx={{ mt: 0.5 }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: '0.82rem' }} />{item.location}
                </Typography>
              )}
              <Typography className={classes.priceText}>{formatINR(item.price)}</Typography>
            </Box>
            <CardMenu
              onDelete={() => deleteMutation.mutate(item.id)}
              isDeleting={deleteMutation.isPending}
            />
          </Box>
        </Box>
      ))}
    </Box>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const MyListingsPage: React.FC = () => {
  const { classes } = useStyles()
  return (
    <Box className={classes.page}>
      <AccommodationSection />
      <ProxySection />
      <MarketplaceSection />
    </Box>
  )
}

export default MyListingsPage
