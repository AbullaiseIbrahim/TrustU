import React from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import AppTopBar from '../components/AppTopBar'
import BottomNav from '../components/BottomNav'

/**
 * AppShell — wraps all authenticated pages.
 * Provides the slim top bar, scrollable content area, and fixed bottom nav.
 */
const AppShell: React.FC = () => (
  <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
    <AppTopBar />
    {/* paddingTop matches AppTopBar height (52px), paddingBottom matches BottomNav (64px) */}
    <Box sx={{ pt: '56px', pb: '64px', minHeight: '100vh' }}>
      <Outlet />
    </Box>
    <BottomNav />
  </Box>
)

export default AppShell
