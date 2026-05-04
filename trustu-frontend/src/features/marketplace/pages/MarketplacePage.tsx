import React, { useState } from 'react'
import { Box, Chip } from '@mui/material'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import FilterBar, { type FilterField, type FilterValues } from '@/components/FilterBar'
import ListingCard from '@/components/ListingCard'
import ContentSkeleton from '@/components/ContentSkeleton'
import EmptyState from '@/components/EmptyState'
import { useMarketplaceListings } from '../hooks/useMarketplaceQueries'
import { makeStyles } from 'tss-react/mui'
import { formatINR } from '@/utils'
import colors from '@/theme/colors'

const useStyles = makeStyles()(() => ({
  list: {
    padding: '12px 16px',
  },
  priceChip: {
    height: 22,
    fontSize: '0.72rem',
    fontWeight: 600,
    backgroundColor: `${colors.warningLight}40`,
    color: colors.warningDark,
    marginTop: '4px',
    marginBottom: '4px',
  },
  negotiableChip: {
    height: 22,
    fontSize: '0.7rem',
    fontWeight: 400,
    backgroundColor: colors.grey100,
    color: colors.textSecondary,
    marginLeft: '4px',
  },
  extraRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
}))

const FILTER_FIELDS: FilterField[] = [
  { key: 'item_type', label: 'Item Type', type: 'select', options: [
    { label: 'Books',       value: 'books' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Furniture',   value: 'furniture' },
    { label: 'Clothing',    value: 'clothing' },
    { label: 'Other',       value: 'other' },
  ]},
  { key: 'price_max', label: 'Price Range', type: 'select', options: [
    { label: '< ₹500',    value: '500' },
    { label: '< ₹1,000',  value: '1000' },
    { label: '< ₹5,000',  value: '5000' },
    { label: '< ₹10,000', value: '10000' },
  ]},
  { key: 'location', label: 'Location',    type: 'text', placeholder: 'e.g. Jamia Nagar' },
  { key: 'search',   label: 'Item Details', type: 'text', placeholder: 'Search by item name...' },
]

const INITIAL_FILTERS: FilterValues = { item_type: '', price_max: '', location: '', search: '' }

const MarketplacePage: React.FC = () => {
  const { classes } = useStyles()
  const [filters, setFilters] = useState<FilterValues>(INITIAL_FILTERS)

  const apiParams = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
  const { data, isLoading, isError } = useMarketplaceListings(Object.keys(apiParams).length > 0 ? apiParams : undefined)
  const listings = data?.data ?? []

  const handleFilterChange = (key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }))
  const handleClear = () => setFilters(INITIAL_FILTERS)

  return (
    <Box>
      <FilterBar title="Filter Products" fields={FILTER_FIELDS} values={filters} onChange={handleFilterChange} onClear={handleClear} />

      <Box className={classes.list}>
        {isLoading && <ContentSkeleton count={3} variant="card" />}

        {!isLoading && isError && (
          <EmptyState title="Couldn't load products" description="Something went wrong. Please try refreshing." icon={<StorefrontOutlinedIcon />} />
        )}

        {!isLoading && !isError && listings.length === 0 && (
          <EmptyState title="No products listed yet" description="No listings match your filters. Try adjusting them." icon={<StorefrontOutlinedIcon />} actionLabel="Clear Filters" onAction={handleClear} />
        )}

        {!isLoading && !isError && listings.map((item) => (
          <ListingCard
            key={item.id}
            id={item.id}
            userName={item.userName}
            type={`${item.itemType} · ${item.itemName}`}
            location={item.location}
            createdAt={item.createdAt}
            isConnected={item.isConnected}
            mutualFriends={item.mutualFriends}
            extra={
              <Box className={classes.extraRow}>
                <Chip label={formatINR(item.price)} size="small" className={classes.priceChip} />
                {item.priceNegotiable && <Chip label="Negotiable" size="small" className={classes.negotiableChip} />}
              </Box>
            }
          />
        ))}
      </Box>
    </Box>
  )
}

export default MarketplacePage
