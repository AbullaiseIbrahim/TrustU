import React from 'react'
import {
  Dialog, DialogTitle, DialogContent, IconButton, Typography,
  Box, Grid, TextField, MenuItem, Button, CircularProgress,
  FormControlLabel, Checkbox, InputAdornment,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateMarketplaceListing } from '../hooks/useMarketplaceQueries'

interface CreateMarketplaceDialogProps {
  open: boolean
  onClose: () => void
}

const ITEM_TYPES = ['Books', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Appliances', 'Other']

const schema = z.object({
  itemType:        z.string().min(1, 'Please select an item type'),
  itemName:        z.string().min(2, 'Item name is required'),
  price:           z.string().min(1, 'Price is required'),
  priceNegotiable: z.boolean().default(false),
  location:        z.string().min(2, 'Location is required'),
  description:     z.string().min(10, 'Please describe the item (min 10 characters)'),
})

type FormValues = z.infer<typeof schema>

const CreateMarketplaceDialog: React.FC<CreateMarketplaceDialogProps> = ({ open, onClose }) => {
  const createMutation = useCreateMarketplaceListing()

  const { control, register, handleSubmit, reset, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        itemType: '', itemName: '', price: '',
        priceNegotiable: false, location: '', description: '',
      },
    })

  const handleClose = () => { reset(); onClose() }

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(
      {
        itemType:        values.itemType,
        itemName:        values.itemName,
        price:           Number(values.price),
        priceNegotiable: values.priceNegotiable,
        location:        values.location,
        description:     values.description,
      },
      { onSuccess: handleClose },
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>Sell an Item</Typography>
        <IconButton size="small" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0.5 }}>

          <Grid container spacing={2}>

            {/* Item Type */}
            <Grid item xs={12} sm={6}>
              <Controller name="itemType" control={control} render={({ field }) => (
                <TextField
                  {...field} select fullWidth label="Item Type"
                  error={!!errors.itemType} helperText={errors.itemType?.message}
                >
                  {ITEM_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
              )} />
            </Grid>

            {/* Item Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('itemName')} fullWidth label="Item Name"
                placeholder="e.g. Engineering Maths Textbook"
                error={!!errors.itemName} helperText={errors.itemName?.message}
              />
            </Grid>

            {/* Price */}
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('price')} fullWidth label="Asking Price"
                type="number" inputProps={{ min: 0 }}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                error={!!errors.price} helperText={errors.price?.message}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('location')} fullWidth label="Pickup Location"
                placeholder="e.g. Lajpat Nagar, Delhi"
                error={!!errors.location} helperText={errors.location?.message}
              />
            </Grid>

            {/* Price Negotiable */}
            <Grid item xs={12}>
              <Controller name="priceNegotiable" control={control} render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={field.onChange} size="small" color="primary" />}
                  label={<Typography variant="body2">Price is negotiable</Typography>}
                />
              )} />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                {...register('description')} fullWidth label="Description"
                placeholder="Describe the item — condition, age, reason for selling…"
                multiline minRows={3}
                error={!!errors.description} helperText={errors.description?.message}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" size="large"
                disabled={createMutation.isPending}
                sx={{ py: 1.4, fontWeight: 600, borderRadius: 2, textTransform: 'none' }}>
                {createMutation.isPending
                  ? <CircularProgress size={22} sx={{ color: '#fff' }} />
                  : 'List for Sale'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CreateMarketplaceDialog
