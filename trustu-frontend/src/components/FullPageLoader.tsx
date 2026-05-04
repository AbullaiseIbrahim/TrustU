import React from 'react'
import { Box, CircularProgress } from '@mui/material'

const FullPageLoader: React.FC = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'background.default' }}>
    <CircularProgress color="primary" size={48} thickness={4} />
  </Box>
)

export default FullPageLoader
