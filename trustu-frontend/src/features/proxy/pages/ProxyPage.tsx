import React, { useState, useEffect } from 'react'
import { Box, Chip } from '@mui/material'
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined'
import { useSearchParams } from 'react-router-dom'
import FilterBar, { type FilterField, type FilterValues } from '@/components/FilterBar'
import ListingCard from '@/components/ListingCard'
import ContentSkeleton from '@/components/ContentSkeleton'
import EmptyState from '@/components/EmptyState'
import { useProxyListings } from '../hooks/useProxyQueries'
import CreateProxyDialog from '../components/CreateProxyDialog'
import { makeStyles } from 'tss-react/mui'
import { formatINR } from '@/utils'
import colors from '@/theme/colors'

const useStyles = makeStyles()(() => ({
  list: {
    padding: '12px 16px',
  },
  typeChip: {
    height: 22,
    fontSize: '0.72rem',
    fontWeight: 500,
    backgroundColor: `${colors.secondaryLight}30`,
    color: colors.secondaryDark,
    marginTop: '4px',
    marginBottom: '4px',
  },
}))

const FILTER_FIELDS: FilterField[] = [
  { key: 'service_type', label: 'Service Type', type: 'select', options: [
    { label: 'Errand',      value: 'errand' },
    { label: 'Delivery',    value: 'delivery' },
    { label: 'Tutoring',    value: 'tutoring' },
    { label: 'Photography', value: 'photography' },
    { label: 'Other',       value: 'other' },
  ]},
  { key: 'charge_max', label: 'Charge Range', type: 'select', options: [
    { label: '< ₹100',   value: '100' },
    { label: '< ₹300',   value: '300' },
    { label: '< ₹500',   value: '500' },
    { label: '< ₹1,000', value: '1000' },
  ]},
  { key: 'location',        label: 'Location (optional)', type: 'text', placeholder: 'e.g. Jamia Nagar' },
  { key: 'available_until', label: 'Available Until',    type: 'date' },
]

const INITIAL_FILTERS: FilterValues = { service_type: '', charge_max: '', location: '', available_until: '' }

const ProxyPage: React.FC = () => {
  const { classes } = useStyles()
  const [filters, setFilters] = useState<FilterValues>(INITIAL_FILTERS)
  const [createOpen, setCreateOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  // Auto-open create dialog if navigated with ?action=create-proxy
  useEffect(() => {
    if (searchParams.get('action') === 'create-proxy') {
      setCreateOpen(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const apiParams = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
  const { data, isLoading, isError } = useProxyListings(Object.keys(apiParams).length > 0 ? apiParams : undefined)
  const listings = data?.data ?? []

  const handleFilterChange = (key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }))
  const handleClear = () => setFilters(INITIAL_FILTERS)

  return (
    <Box>
      <FilterBar title="Filter Proxy Services" fields={FILTER_FIELDS} values={filters} onChange={handleFilterChange} onClear={handleClear} />

      <Box className={classes.list}>
        {isLoading && <ContentSkeleton count={3} variant="card" />}

        {!isLoading && isError && (
          <EmptyState title="Couldn't load services" description="Something went wrong. Please try refreshing." icon={<DeliveryDiningOutlinedIcon />} />
        )}

        {!isLoading && !isError && listings.length === 0 && (
          <EmptyState title="No proxy services found" description="No listings match your filters. Try adjusting them." icon={<DeliveryDiningOutlinedIcon />} actionLabel="Clear Filters" onAction={handleClear} />
        )}

        {!isLoading && !isError && listings.map((item) => (
          <ListingCard
            key={item.id}
            id={item.id}
            userName={item.userName}
            type={item.serviceType}
            location={item.location}
            createdAt={item.createdAt}
            isConnected={item.isConnected}
            mutualFriends={item.mutualFriends}
            extra={
              item.chargePerTask != null ? (
                <Chip label={`Charge: ${formatINR(item.chargePerTask)}/task`} size="small" className={classes.typeChip} />
              ) : item.chargeRange != null ? (
                <Chip label={`Charge: ${item.chargeRange}`} size="small" className={classes.typeChip} />
              ) : undefined
            }
          />
        ))}
      </Box>

      <CreateProxyDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  )
}

export default ProxyPage
