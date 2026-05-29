import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { palette } from './palette'
import { typography } from './typography'

let theme = createTheme({
  palette,
  typography,
  shape: { borderRadius: 18 },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': { boxShadow: 'none', transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.16)' },
        },
        sizeLarge: { padding: '13px 28px', fontSize: '1rem' },
      },
      defaultProps: { disableElevation: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          transition: 'box-shadow 0.2s ease',
          '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(46,125,50,0.12)' },
        },
        notchedOutline: { borderColor: '#E2E8E4' },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined', fullWidth: true } },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 1px 2px rgba(20,20,15,0.04), 0 6px 22px rgba(20,20,15,0.05)',
          border: 'none',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0px 8px 28px rgba(20,20,15,0.10)',
            transform: 'translateY(-2px)',
          },
        },
      },
      defaultProps: { elevation: 0 },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 20 },
        elevation1: { boxShadow: '0px 2px 12px rgba(0,0,0,0.08)' },
        elevation2: { boxShadow: '0px 4px 20px rgba(0,0,0,0.10)' },
        elevation3: { boxShadow: '0px 8px 32px rgba(0,0,0,0.12)' },
      },
      defaultProps: { elevation: 0 },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
        sizeSmall: { height: 22, fontSize: '0.7rem' },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 44 },
        indicator: { height: 3, borderRadius: '3px 3px 0 0', backgroundColor: '#2D7D32' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 44,
          color: '#6B7280',
          transition: 'color 0.15s ease',
          '&.Mui-selected': { color: '#2D7D32', fontWeight: 600 },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: 'none', backgroundColor: '#FFFFFF', color: '#1A1A1A' },
      },
      defaultProps: { elevation: 0, color: 'default' },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          boxShadow: '0px 24px 64px rgba(0,0,0,0.14)',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(0,0,0,0.32)' },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 12, fontWeight: 500 } },
    },
    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 6px',
          transition: 'background-color 0.15s ease',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          backgroundColor: '#f7f3ea',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        a: { color: 'inherit', textDecoration: 'none' },
        '*, *::before, *::after': { boxSizing: 'border-box' },
        '@keyframes fadeSlideUp': {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        '@keyframes pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
      },
    },
  },
})

theme = responsiveFontSizes(theme, { breakpoints: ['sm', 'md', 'lg'], factor: 2 })
export default theme
