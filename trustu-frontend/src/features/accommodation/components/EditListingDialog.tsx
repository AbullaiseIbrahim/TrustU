import React, { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, TextField,
  Button, FormControlLabel, Switch, MenuItem, InputAdornment, IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useUpdateAccommodation } from '../hooks/useAccommodationQueries'
import { useAmenities } from '../hooks/useAmenityQueries'
import { FURNISHING_OPTIONS } from '@/services/accommodation.api'
import type { Accommodation } from '@/services/accommodation.api'
import colors from '@/theme/colors'

// Matches ROOMMATE_PREF_MAP / FLAT_TYPE_MAP in PostListingFlow.tsx (create flow)
const ROOMMATE_PREF_OPTIONS = [
  { value: 1, label: 'Students' },
  { value: 2, label: 'Working pros' },
  { value: 3, label: 'Family' },
]

const FLAT_TYPE_OPTIONS = [
  { value: 1, label: '1BHK' },
  { value: 2, label: '2BHK' },
  { value: 3, label: '3BHK' },
  { value: 4, label: '4BHK' },
]

interface Props {
  open: boolean
  onClose: () => void
  accommodation: Accommodation | null
}

/**
 * The backend's PUT /accommodations only persists a subset of fields (see
 * UpdateAccommodationPayload) — description, location, gender, dates, phone
 * and photos aren't editable after creation, so this form only exposes what
 * actually saves rather than implying a full re-edit of the listing.
 */
const EditListingDialog: React.FC<Props> = ({ open, onClose, accommodation }) => {
  const updateMutation = useUpdateAccommodation()
  const { data: apiAmenities = [] } = useAmenities()

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [availableSpots, setAvailableSpots] = useState(1)
  const [isNegotiable, setIsNegotiable] = useState(false)
  const [roommatePref, setRoommatePref] = useState<number | ''>('')
  const [flatType, setFlatType] = useState<number | ''>('')
  const [floor, setFloor] = useState('')
  const [furnishing, setFurnishing] = useState(0)
  const [securityDeposit, setSecurityDeposit] = useState(false)
  const [amenityIds, setAmenityIds] = useState<number[]>([])

  useEffect(() => {
    if (!accommodation) return
    setTitle(accommodation.title)
    setAmount(String(accommodation.amount ?? ''))
    setAvailableSpots(accommodation.availableSpots || 1)
    setIsNegotiable(accommodation.isNegotiable)
    setRoommatePref(accommodation.roommatePreference ?? '')
    setFlatType(accommodation.flatType ?? '')
    setFloor(accommodation.floor != null ? String(accommodation.floor) : '')
    setFurnishing(accommodation.furnishing ?? 0)
    setSecurityDeposit(accommodation.securityDeposit)
    setAmenityIds(accommodation.amenities.map(a => a.id))
  }, [accommodation])

  const toggleAmenity = (id: number) => {
    setAmenityIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  const handleSave = () => {
    if (!accommodation) return
    updateMutation.mutate(
      {
        id: Number(accommodation.id),
        title: title.trim() || undefined,
        amount: Number(amount) || undefined,
        available_spots: availableSpots,
        is_negotiable: isNegotiable,
        roommate_preference: roommatePref === '' ? undefined : roommatePref,
        flat_type: flatType === '' ? undefined : flatType,
        floor: floor.trim() ? Number(floor) : undefined,
        furnishing,
        security_deposit: securityDeposit,
        amenity_ids: amenityIds,
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem' }}>
        Edit Listing
        <IconButton size="small" onClick={onClose} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2.5 }}>
        <TextField
          label="Title" fullWidth size="small"
          value={title} onChange={e => setTitle(e.target.value)}
        />
        <TextField
          label="Rent / amount" fullWidth size="small"
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
          inputProps={{ inputMode: 'numeric' }}
        />
        <TextField
          label="Available spots" fullWidth size="small" type="number"
          value={availableSpots}
          onChange={e => setAvailableSpots(Math.max(1, Number(e.target.value) || 1))}
          inputProps={{ min: 1 }}
        />
        <FormControlLabel
          control={<Switch checked={isNegotiable} onChange={e => setIsNegotiable(e.target.checked)} />}
          label="Negotiable"
        />
        <TextField
          select label="Roommate preference" fullWidth size="small"
          value={roommatePref}
          onChange={e => setRoommatePref(e.target.value === '' ? '' : Number(e.target.value))}
        >
          <MenuItem value="">—</MenuItem>
          {ROOMMATE_PREF_OPTIONS.map(o => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          select label="Flat type" fullWidth size="small"
          value={flatType}
          onChange={e => setFlatType(e.target.value === '' ? '' : Number(e.target.value))}
        >
          <MenuItem value="">—</MenuItem>
          {FLAT_TYPE_OPTIONS.map(o => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Floor" fullWidth size="small"
          placeholder="e.g. 2 (0 for ground floor)"
          value={floor}
          onChange={e => setFloor(e.target.value.replace(/\D/g, ''))}
          inputProps={{ inputMode: 'numeric' }}
        />
        <TextField
          select label="Furnishing" fullWidth size="small"
          value={furnishing}
          onChange={e => setFurnishing(Number(e.target.value))}
        >
          {FURNISHING_OPTIONS.map(o => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={<Switch checked={securityDeposit} onChange={e => setSecurityDeposit(e.target.checked)} />}
          label="Security deposit collected"
        />

        {apiAmenities.length > 0 && (
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: colors.ink, mb: 1 }}>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {apiAmenities.map(a => {
                const active = amenityIds.includes(a.id)
                return (
                  <Box
                    key={a.id}
                    component="button"
                    onClick={() => toggleAmenity(a.id)}
                    sx={{
                      px: 1.5, py: 0.75, borderRadius: 999, cursor: 'pointer',
                      fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
                      border: `1.5px solid ${active ? colors.moss : colors.line}`,
                      backgroundColor: active ? colors.mossSoft : colors.white,
                      color: active ? colors.mossDeep : colors.ink2,
                    }}
                  >
                    {a.name}
                  </Box>
                )
              })}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={updateMutation.isPending}
          sx={{ backgroundColor: colors.moss, '&:hover': { backgroundColor: colors.mossDeep } }}
        >
          {updateMutation.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditListingDialog
