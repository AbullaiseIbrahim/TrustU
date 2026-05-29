import React, { Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Outlet } from 'react-router-dom'

/**
 * DashboardLayout — thin shell that only provides lazy-load fallback.
 * Navigation is handled by BottomNav (AppShell).
 * Each page owns its own header content (community card, mode tabs, etc.).
 */
const DashboardLayout: React.FC = () => (
  <Suspense
    fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
        <CircularProgress size={28} sx={{ color: 'primary.main' }} />
      </Box>
    }
  >
    <Outlet />
  </Suspense>
)

export default DashboardLayout
