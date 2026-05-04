import React from 'react'
import {
  Dialog, DialogTitle, DialogContent,
  List, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import { makeStyles } from 'tss-react/mui'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import colors from '@/theme/colors'

interface AddServiceModalProps {
  open: boolean
  onClose: () => void
}

const useStyles = makeStyles()(() => ({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 16,
      width: '100%',
      maxWidth: 360,
    },
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '8px',
  },
  listItem: {
    borderRadius: 10,
    marginBottom: '4px',
    '&:hover': { backgroundColor: `${colors.primary}12` },
  },
  icon: {
    color: colors.primary,
    minWidth: 40,
  },
}))

const SERVICE_OPTIONS = [
  {
    label: 'List Accommodation',
    description: 'Add your room or flat listing',
    icon: <HomeWorkOutlinedIcon />,
    path: PATHS.dashboard.accommodation,
    action: 'create-accommodation',
  },
  // Proxy service will be enabled in a future release
]

const AddServiceModal: React.FC<AddServiceModalProps> = ({ open, onClose }) => {
  const { classes } = useStyles()
  const navigate = useNavigate()

  const handleSelect = (path: string, action: string) => {
    navigate(`${path}?action=${action}`)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} className={classes.dialog}>
      <DialogTitle className={classes.title}>
        <Typography variant="h6" fontWeight={700}>Add a Service</Typography>
        <IconButton size="small" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List disablePadding>
          {SERVICE_OPTIONS.map((opt) => (
            <ListItemButton
              key={opt.action}
              className={classes.listItem}
              onClick={() => handleSelect(opt.path, opt.action)}
            >
              <ListItemIcon className={classes.icon}>{opt.icon}</ListItemIcon>
              <ListItemText
                primary={opt.label}
                secondary={opt.description}
                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                secondaryTypographyProps={{ fontSize: '0.78rem' }}
              />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}

export default AddServiceModal
