import React from 'react'
import { Box, type SxProps, type Theme } from '@mui/material'

interface AuthCardProps {
  children: React.ReactNode
  maxWidth?: number
  sx?: SxProps<Theme>
  /** Overrides the full-bleed page background (defaults to the theme's cream). */
  bgcolor?: string
}

/**
 * Full-bleed mobile screen shell shared by all auth/onboarding pages —
 * matches the prototype's phone-frame layout (cream background, no card
 * border, content fills the column edge-to-edge) rather than a boxed
 * desktop-style card.
 */
const AuthCard: React.FC<AuthCardProps> = ({ children, maxWidth = 480, sx, bgcolor }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: bgcolor ?? 'background.default',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          ...sx,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default AuthCard
