import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import colors from '@/theme/colors'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message?: React.ReactNode
  confirmLabel?: string
  loadingLabel?: string
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

// Shared "are you sure?" popup for destructive actions (delete post, listing, comment).
// The caller runs the mutation in onConfirm and closes the dialog when it succeeds.
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  loadingLabel = 'Deleting…',
  loading = false,
  onConfirm,
  onClose,
}) => (
  <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontWeight: 700, fontSize: '1.05rem' }}>{title}</DialogTitle>
    {message && (
      <DialogContent>
        <Typography sx={{ fontSize: '0.85rem', color: colors.textSecondary }}>{message}</Typography>
      </DialogContent>
    )}
    <DialogActions sx={{ p: 2 }}>
      <Button onClick={onClose} disabled={loading}>Cancel</Button>
      <Button variant="contained" color="error" disabled={loading} onClick={onConfirm}>
        {loading ? loadingLabel : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
)

export default ConfirmDialog
