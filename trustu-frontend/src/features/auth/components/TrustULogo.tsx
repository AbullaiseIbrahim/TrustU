import React from 'react'
import { Box } from '@mui/material'
import colors from '@/theme/colors'

interface TrustULogoProps {
  size?: number
}

/**
 * TrustU brand mark — rounded-square gradient tile with a shield-check icon.
 * Pixel match to the approved prototype (44px base size, 14px radius).
 */
const TrustULogo: React.FC<TrustULogoProps> = ({ size = 44 }) => {
  const radius = Math.round(size * (14 / 44))
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: `${radius}px`,
        background: `linear-gradient(150deg, ${colors.mossMid}, ${colors.mossDeep})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 16px rgba(15,86,48,0.28)',
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 7.5 12 4l7 3.5v4.2c0 4.4-3 7.5-7 8.8-4-1.3-7-4.4-7-8.8V7.5Z"
          fill="#fff"
          fillOpacity="0.16"
        />
        <path
          d="M9 12.2l2.1 2.1L15.4 10"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  )
}

export default TrustULogo
