import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/theme/index'
import { AuthProvider } from '@/app/AuthProvider'
import QueryProvider from '@/app/QueryProvider'
import { SnackbarProvider } from '@/app/SnackbarProvider'
import AppRouter from '@/routes/index'
import ErrorBoundary from '@/components/ErrorBoundary'

const App: React.FC = () => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <QueryProvider>
          <AuthProvider>
            <SnackbarProvider>
              <AppRouter />
            </SnackbarProvider>
          </AuthProvider>
        </QueryProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </BrowserRouter>
)

export default App
