import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/paths'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 2, p: 3, textAlign: 'center', backgroundColor: 'background.default' }}>
      <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 700, color: 'primary.main' }}>404</Typography>
      <Typography variant="h5" color="text.secondary">Page not found</Typography>
      <Button variant="contained" size="large" onClick={() => navigate(PATHS.landing)} sx={{ mt: 2 }}>Go back home</Button>
    </Box>
  )
}

export default NotFoundPage
