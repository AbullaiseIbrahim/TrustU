import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import FilterBar, { type FilterField, type FilterValues } from '@/components/FilterBar'
import ListingCard from '@/components/ListingCard'
import EmptyState from '@/components/EmptyState'
import { Skeleton } from '@mui/material'
import {
  useAccommodations,
  useCreateAccommodation,
} from '../hooks/useAccommodationQueries'
import {
  ACCOMMODATION_TYPES,
  ACCOMMODATION_GENDERS,
  accommodationTypeLabel,
  accommodationGenderLabel,
  type Accommodation,
} from '@/services/accommodation.api'
import { INDIA_STATES } from '@/constants/states'
import { useAuth } from '@/app/AuthProvider'
import { formatINR, formatDate } from '@/utils'
import colors from '@/theme/colors'

// ── Styles ────────────────────────────────────────────────────────────────────
const useStyles = makeStyles()(() => ({
  list: {
    padding: '12px 16px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  infoChips: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '4px',
    marginBottom: '4px',
  },
  chip: {
    height: 22,
    fontSize: '0.72rem',
    fontWeight: 500,
    backgroundColor: `${colors.primary}15`,
    color: colors.primaryDark,
  },
  dialogTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '8px',
  },
}))

// ── Filter config ─────────────────────────────────────────────────────────────
const FILTER_FIELDS: FilterField[] = [
  {
    key: 'type', label: 'Type', type: 'select', options: ACCOMMODATION_TYPES.map(t => ({
      label: t.label, value: String(t.value),
    })),
  },
  {
    key: 'gender', label: 'Available For', type: 'select', options: ACCOMMODATION_GENDERS.map(g => ({
      label: g.label, value: String(g.value),
    })),
  },
]

const INITIAL_FILTERS: FilterValues = { type: '', gender: '' }

// ── Detail dialog ─────────────────────────────────────────────────────────────
interface DetailDialogProps {
  acc: Accommodation | null
  onClose: () => void
}

function AccommodationDetailDialog({ acc, onClose }: DetailDialogProps) {
  const { classes } = useStyles()
  if (!acc) return null

  return (
    <Dialog open={!!acc} onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle className={classes.dialogTitle}>
        <Typography variant="h6" fontWeight={700} sx={{ pr: 2, lineHeight: 1.3 }}>
          {acc.title || 'Accommodation Details'}
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="close" sx={{ flexShrink: 0 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {/* Type + Gender + Negotiable chips */}
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          <Chip label={accommodationTypeLabel(acc.type)} size="small" className={classes.chip} />
          <Chip label={accommodationGenderLabel(acc.gender)} size="small" className={classes.chip} />
          {acc.isNegotiable && <Chip label="Negotiable" size="small" className={classes.chip} />}
        </Stack>

        {/* Amount */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <CurrencyRupeeIcon sx={{ fontSize: '1.5rem', color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={700} color="primary.main">
            {new Intl.NumberFormat('en-IN').format(acc.amount)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5, mt: 0.5 }}>
            / month
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Key details — 2×2 grid */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {acc.address && (
            <Box sx={{ display: 'flex', gap: 1, width: 'calc(50% - 8px)' }}>
              <LocationOnOutlinedIcon sx={{ fontSize: '1.1rem', color: 'text.secondary', mt: 0.1, flexShrink: 0 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Location</Typography>
                <Typography variant="body2" fontWeight={500}>{acc.address}</Typography>
              </Box>
            </Box>
          )}
          {acc.availableFrom && (
            <Box sx={{ display: 'flex', gap: 1, width: 'calc(50% - 8px)' }}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: '1.1rem', color: 'text.secondary', mt: 0.1, flexShrink: 0 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Available From</Typography>
                <Typography variant="body2" fontWeight={500}>{formatDate(acc.availableFrom)}</Typography>
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 1, width: 'calc(50% - 8px)' }}>
            <PeopleAltOutlinedIcon sx={{ fontSize: '1.1rem', color: 'text.secondary', mt: 0.1, flexShrink: 0 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">Available For</Typography>
              <Typography variant="body2" fontWeight={500}>{accommodationGenderLabel(acc.gender)}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, width: 'calc(50% - 8px)' }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: '1.1rem', color: 'text.secondary', mt: 0.1, flexShrink: 0 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">Posted On</Typography>
              <Typography variant="body2" fontWeight={500}>{formatDate(acc.createdAt)}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Description */}
        {acc.description && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" fontWeight={600} mb={0.75}>About this place</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {acc.description}
            </Typography>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Create form schema ────────────────────────────────────────────────────────
const createSchema = z.object({
  title:          z.string().min(3, 'Title is required'),
  address:        z.string().min(3, 'Address is required'),
  description:    z.string().optional(),
  amount:         z.string().refine(v => Number(v) > 0, { message: 'Amount must be greater than 0' }),
  city_id:        z.string().min(1, 'Please select a city / state'),
  type:           z.string().min(1, 'Please select a type'),
  gender:         z.string().min(1, 'Please select who it is available for'),
  available_from: z.string().min(1, 'Please select a date'),
  is_negotiable:  z.boolean(),
})

type CreateFormValues = z.infer<typeof createSchema>

// ── Create dialog ─────────────────────────────────────────────────────────────
interface CreateDialogProps {
  open: boolean
  onClose: () => void
}

function CreateAccommodationDialog({ open, onClose }: CreateDialogProps) {
  const { classes } = useStyles()
  const { user } = useAuth()
  const createMutation = useCreateAccommodation()

  const { control, register, handleSubmit, reset, formState: { errors } } =
    useForm<CreateFormValues>({
      resolver: zodResolver(createSchema),
      defaultValues: {
        title: '', address: '', description: '', amount: '',
        city_id: '', type: '', gender: '0',
        available_from: '', is_negotiable: false,
      },
    })

  const handleClose = () => { reset(); onClose() }

  const onSubmit = (values: CreateFormValues) => {
    createMutation.mutate(
      {
        title:          values.title,
        address:        values.address,
        description:    values.description ?? '',
        amount:         Number(values.amount),
        city_id:        Number(values.city_id),
        community_id:   user?.communityId != null ? Number(user.communityId) : null,
        sub_community_id: null,
        type:           Number(values.type),
        is_negotiable:  values.is_negotiable,
        available_from: values.available_from,
        gender:         Number(values.gender),
      },
      { onSuccess: handleClose },
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle className={classes.dialogTitle}>
        <Typography variant="h6" fontWeight={700}>List Accommodation</Typography>
        <IconButton size="small" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>

            {/* Title */}
            <Grid item xs={12}>
              <TextField
                {...register('title')}
                fullWidth label="Title"
                placeholder="e.g. Spacious room near metro"
                error={!!errors.title} helperText={errors.title?.message}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                {...register('address')}
                fullWidth label="Address / Area"
                placeholder="e.g. Lajpat Nagar, New Delhi"
                error={!!errors.address} helperText={errors.address?.message}
              />
            </Grid>

            {/* Type + Gender */}
            <Grid item xs={12} sm={6}>
              <Controller name="type" control={control} render={({ field }) => (
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>Accommodation Type</InputLabel>
                  <Select {...field} label="Accommodation Type">
                    {ACCOMMODATION_TYPES.map(t => (
                      <MenuItem key={t.value} value={String(t.value)}>{t.label}</MenuItem>
                    ))}
                  </Select>
                  {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
                </FormControl>
              )} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller name="gender" control={control} render={({ field }) => (
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>Available For</InputLabel>
                  <Select {...field} label="Available For">
                    {ACCOMMODATION_GENDERS.map(g => (
                      <MenuItem key={g.value} value={String(g.value)}>{g.label}</MenuItem>
                    ))}
                  </Select>
                  {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
                </FormControl>
              )} />
            </Grid>

            {/* City (using states list as city proxy) */}
            <Grid item xs={12} sm={6}>
              <Controller name="city_id" control={control} render={({ field }) => (
                <FormControl fullWidth error={!!errors.city_id}>
                  <InputLabel>City / State</InputLabel>
                  <Select {...field} label="City / State">
                    {INDIA_STATES.map(s => (
                      <MenuItem key={s.id} value={String(s.id)}>{s.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.city_id && <FormHelperText>{errors.city_id.message}</FormHelperText>}
                </FormControl>
              )} />
            </Grid>

            {/* Amount */}
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('amount')}
                fullWidth label="Rent / Month"
                type="number" inputProps={{ min: 0 }}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                error={!!errors.amount} helperText={errors.amount?.message}
              />
            </Grid>

            {/* Available From */}
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('available_from')}
                fullWidth label="Available From"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.available_from} helperText={errors.available_from?.message}
              />
            </Grid>

            {/* Negotiable */}
            <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <Controller name="is_negotiable" control={control} render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={field.onChange} color="primary" />}
                  label="Rent is negotiable"
                />
              )} />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                {...register('description')}
                fullWidth label="Description (Optional)"
                placeholder="Describe the place, rules, nearby landmarks…"
                multiline minRows={3}
                error={!!errors.description} helperText={errors.description?.message}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" size="large"
                disabled={createMutation.isPending}
                sx={{ py: 1.4, fontWeight: 600, borderRadius: 2 }}>
                {createMutation.isPending
                  ? <CircularProgress size={22} sx={{ color: '#fff' }} />
                  : 'Post Listing'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
const AccommodationPage: React.FC = () => {
  const { classes } = useStyles()
  const [filters, setFilters] = useState<FilterValues>(INITIAL_FILTERS)
  const [createOpen, setCreateOpen] = useState(false)
  const [detailAcc, setDetailAcc] = useState<Accommodation | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  // Auto-open create dialog if navigated with ?action=create-accommodation
  useEffect(() => {
    if (searchParams.get('action') === 'create-accommodation') {
      setCreateOpen(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const apiParams = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
  const { data, isLoading, isError } = useAccommodations(
    Object.keys(apiParams).length > 0 ? apiParams : undefined,
  )
  const accommodations = data?.data ?? []

  const handleFilterChange = (key: string, value: string) =>
    setFilters(prev => ({ ...prev, [key]: value }))
  const handleClear = () => setFilters(INITIAL_FILTERS)

  return (
    <Box>
      <FilterBar
        title="Filter Accommodations"
        fields={FILTER_FIELDS}
        values={filters}
        onChange={handleFilterChange}
        onClear={handleClear}
      />

      <Box className={classes.list}>
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <Box key={i} sx={{
            width: { xs: '100%', sm: 'calc(50% - 6px)' },
            backgroundColor: 'background.paper',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {/* Title */}
            <Skeleton variant="text" width="75%" height={22} />
            {/* Avatar + type + location row */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Skeleton variant="circular" width={38} height={38} sx={{ flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height={16} />
                <Skeleton variant="text" width="60%" height={14} sx={{ mt: 0.5 }} />
              </Box>
            </Box>
            {/* Chips row */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="rounded" width={80} height={22} />
              <Skeleton variant="rounded" width={70} height={22} />
              <Skeleton variant="rounded" width={110} height={22} />
            </Box>
            {/* Description lines */}
            <Skeleton variant="text" width="100%" height={14} />
            <Skeleton variant="text" width="85%" height={14} />
            <Skeleton variant="text" width="60%" height={14} />
            {/* Connection + view more */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Skeleton variant="rounded" width={90} height={20} />
              <Skeleton variant="text" width={100} height={16} />
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
            title="No accommodations found"
            description="No listings match your filters, or none have been posted yet."
            icon={<HomeWorkOutlinedIcon />}
            actionLabel="Clear Filters"
            onAction={handleClear}
          />
        )}

        {!isLoading && !isError && accommodations.map((acc) => (
          <Box key={acc.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 6px)' } }}>
            <ListingCard
              id={acc.id}
              title={acc.title}
              type={accommodationTypeLabel(acc.type)}
              location={acc.address}
              description={acc.description}
              createdAt={acc.createdAt}
              isConnected={acc.isConnected}
              mutualFriends={acc.mutualFriends}
              onViewDetails={() => setDetailAcc(acc)}
              sx={{ marginBottom: 0 }}
              extra={
                <Box className={classes.infoChips}>
                  <Chip label={formatINR(acc.amount) + '/mo'} size="small" className={classes.chip} />
                  <Chip label={accommodationGenderLabel(acc.gender)} size="small" className={classes.chip} />
                  {acc.isNegotiable && (
                    <Chip label="Negotiable" size="small" className={classes.chip} />
                  )}
                  {acc.availableFrom && (
                    <Chip label={`Available from ${formatDate(acc.availableFrom)}`} size="small" className={classes.chip} />
                  )}
                </Box>
              }
            />
          </Box>
        ))}
      </Box>

      <AccommodationDetailDialog
        acc={detailAcc}
        onClose={() => setDetailAcc(null)}
      />

      <CreateAccommodationDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </Box>
  )
}

export default AccommodationPage
