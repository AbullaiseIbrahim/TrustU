import React from 'react'
import { Box } from '@mui/material'

interface TrustULogoProps {
  size?: number
}

/**
 * TrustU brand logo — green circle with community SVG icon.
 * Matches the mockup exactly.
 */
const TrustULogo: React.FC<TrustULogoProps> = ({ size = 64 }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 2,
        flexShrink: 0,
      }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 36 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Left person */}
        <circle cx="9" cy="8" r="5" fill="white" />
        <path
          d="M0 26C0 21.029 4.029 17 9 17C11.09 17 13.02 17.716 14.55 18.92"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Right person */}
        <circle cx="27" cy="8" r="5" fill="white" />
        <path
          d="M36 26C36 21.029 31.971 17 27 17C24.91 17 22.98 17.716 21.45 18.92"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Centre person */}
        <circle cx="18" cy="7" r="5.5" fill="white" />
        <path
          d="M8 27C8 21.477 12.477 17 18 17C23.523 17 28 21.477 28 27"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </Box>
  )
}

export default TrustULogo
