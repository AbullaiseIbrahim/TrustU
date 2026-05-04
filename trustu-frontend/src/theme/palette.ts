import type { PaletteOptions } from '@mui/material/styles'

export const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    light: '#60AD5E',
    main: '#2D7D32',
    dark: '#1B5E20',
    contrastText: '#FFFFFF',
  },
  secondary: {
    light: '#81C784',
    main: '#4CAF50',
    dark: '#388E3C',
    contrastText: '#FFFFFF',
  },
  error: { main: '#D32F2F' },
  background: {
    default: '#F0FAF1',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  },
  divider: '#E5E7EB',
}
