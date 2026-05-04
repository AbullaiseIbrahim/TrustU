import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { palette } from './palette'
import { typography } from './typography'

let theme = createTheme({
  palette,
  typography,
  shape: { borderRadius: 12 },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: 'none', fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        sizeLarge: { padding: '12px 24px', fontSize: '1rem' },
      },
      defaultProps: { disableElevation: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10, backgroundColor: '#FFFFFF' },
        notchedOutline: { borderColor: '#D1D5DB' },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined', fullWidth: true } },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 12, boxShadow: '0px 1px 4px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' } },
      defaultProps: { elevation: 0 },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' }, rounded: { borderRadius: 12 } },
      defaultProps: { elevation: 0 },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 44 },
        indicator: { height: 3, borderRadius: '3px 3px 0 0', backgroundColor: '#2D7D32' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500, minHeight: 44, color: '#6B7280', '&.Mui-selected': { color: '#2D7D32', fontWeight: 600 } },
      },
    },
    MuiAppBar: {
      styleOverrides: { root: { boxShadow: '0px 1px 0px #E5E7EB', backgroundColor: '#FFFFFF', color: '#1A1A1A' } },
      defaultProps: { elevation: 0, color: 'default' },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 16, boxShadow: '0px 20px 60px rgba(0,0,0,0.12)' } },
    },
    MuiAlert: { styleOverrides: { root: { borderRadius: 10, fontWeight: 500 } } },
    MuiSkeleton: { defaultProps: { animation: 'wave' }, styleOverrides: { root: { borderRadius: 8 } } },
    MuiCssBaseline: {
      styleOverrides: {
        body: { minHeight: '100vh', backgroundColor: '#F0FAF1' },
        a: { color: 'inherit', textDecoration: 'none' },
      },
    },
  },
})

theme = responsiveFontSizes(theme, { breakpoints: ['sm', 'md', 'lg'], factor: 2 })
export default theme
