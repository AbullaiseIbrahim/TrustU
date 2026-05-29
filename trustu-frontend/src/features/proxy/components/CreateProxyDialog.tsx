import React from 'react'
import {
  Dialog, DialogTitle, DialogContent, IconButton, Typography,
  Box, Grid, TextField, MenuItem, Button, CircularProgress, InputAdornment,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateProxy } from '../hooks/useProxyQueries'

interface CreateProxyDialogProps {
  open: boolean
  onClose: () => void
}

const SERVICE_TYPES = ['Errand', 'Delivery', 'Tutoring', 'Photography', 'Translation', 'Other']

const schema = z.object({
  serviceType:   z.string().min(1, 'Please select a service type'),
  location:      z.string().min(2, 'Location is required'),
  description:   z.string().min(10, 'Please describe your service (min 10 characters)'),
  chargePerTask: z.string().optional(),
  chargeRange:   z.string().optional(),
  availableUntil: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const CreateProxyDialog: React.FC<CreateProxyDialogProps> = ({ open, onClose }) => {
  const createMutation = useCreateProxy()

  const { control, register, handleSubmit, reset, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        serviceType: '', location: '', description: '',
        chargePerTask: '', chargeRange: '', availableUntil: '',
      },
    })

  const handleClose = () => { reset(); onClose() }

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(
      {
        serviceType:   values.serviceType,
        location:      values.location,
        description:   values.description,
        chargePerTask: values.chargePerTask ? Number(values.chargePerTask) : null,
        chargeRange:   values.chargeRange || undefined,
        availableUntil: values.availableUntil || undefined,
      },
      { onSuccess: handleClose },
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>Offer a Service</Typography>
        <IconButton size="small" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0.5 }}>

          <Grid container spacing={2}>

            {/* Service Type */}
            <Grid item xs={12} sm={6}>
              <Controller name="serviceType" control={control} render={({ field }) => (
                <TextField
                  {...field} select fullWidth label="Service Type"
                  error={!!errors.serviceType} helperText={errors.serviceType?.message}
                >
                  {SERVICE_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
              )} />
            </Grid>

            {/* Location */}
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('location')} fullWidth label="Location / Area"
                placeholder="e.g. Lajpat Nagar, Delhi"
                error={!!errors.location} helperText={errors.location?.message}
              />
            </Grid>

            {/* Charge per task */}
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('chargePerTask')} fullWidth label="Charge per Task (optional)"
                type="number" inputProps={{ min: 0 }}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                helperText="Leave blank if you prefer a range"
              />
            </Grid>

            {/* Charge range */}
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('chargeRange')} fullWidth label="Charge Range (optional)"
                placeholder="e.g. ₹200–₹500"
                helperText="Use if charge varies by task"
              />
            </Grid>

            {/* Available Until */}
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('availableUntil')} fullWidth label="Available Until (optional)"
                type="date" InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                {...register('description')} fullWidth label="Description"
                placeholder="Describe what you can do, your experience, turnaround time…"
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
                  : 'Post Service'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CreateProxyDialog
