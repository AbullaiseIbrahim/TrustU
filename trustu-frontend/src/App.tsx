import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/theme/index'
import { AuthProvider } from '@/app/AuthProvider'
import QueryProvider from '@/app/QueryProvider'
import { SnackbarProvider } from '@/app/SnackbarProvider'
import AppRouter from '@/routes/index'

const App: React.FC = () => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryProvider>
        <AuthProvider>
          <SnackbarProvider>
            <AppRouter />
          </SnackbarProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  </BrowserRouter>
)

export default App
