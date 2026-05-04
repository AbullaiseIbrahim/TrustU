import React from 'react'
import { Box, Paper, type SxProps, type Theme } from '@mui/material'

interface AuthCardProps {
  children: React.ReactNode
  maxWidth?: number
  sx?: SxProps<Theme>
}

/**
 * AuthCard — shared white card wrapper for all auth/onboarding pages.
 * Centres itself on the mint-green page background.
 */
const AuthCard: React.FC<AuthCardProps> = ({ children, maxWidth = 460, sx }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth,
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0px 4px 24px rgba(0,0,0,0.07)',
          p: { xs: 3, sm: 4 },
          ...sx,
        }}
      >
        {children}
      </Paper>
    </Box>
  )
}

export default AuthCard
