import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import AuthCard from '../components/AuthCard'
import TrustULogo from '../components/TrustULogo'
import { PATHS } from '@/routes/paths'
import { useSnackbar } from '@/app/SnackbarProvider'
import colors from '@/theme/colors'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { showError } = useSnackbar()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      showError('Google Sign-In integration coming soon. Please use email instead.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <AuthCard maxWidth={480} bgcolor={colors.white}>
      {/* Brand row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '11px', padding: '22px 24px 8px' }}>
        <TrustULogo size={44} />
        <Typography sx={{ fontSize: '25px', fontWeight: 800, letterSpacing: '-0.5px', color: colors.ink }}>
          Trust<Box component="span" sx={{ color: colors.accentGreen }}>U</Box>
        </Typography>
      </Box>

      {/* Hero card */}
      <Box sx={{ padding: '16px 24px 0' }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '28px',
            background: `linear-gradient(150deg, #1F7C49 0%, ${colors.mossDeep} 72%)`,
            padding: '28px 26px 30px',
            boxShadow: '0 18px 40px -18px rgba(15,86,48,0.55)',
          }}
        >
          <Box sx={{ position: 'absolute', top: '-60px', right: '-50px', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
          <Box sx={{ position: 'absolute', bottom: '-90px', right: '40px', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <Box sx={{ position: 'relative' }}>
            <Typography
              component="span"
              sx={{ display: 'inline-block', fontSize: '11.5px', fontWeight: 700, letterSpacing: '1.6px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}
            >
              Trusted relocation
            </Typography>
            <Typography
              component="h1"
              sx={{ margin: '12px 0 0', fontSize: '27px', lineHeight: 1.18, fontWeight: 800, color: '#fff', letterSpacing: '-0.6px' }}
            >
              Settle into your new city, together.
            </Typography>
            <Typography
              sx={{ margin: '12px 0 0', fontSize: '14.5px', lineHeight: 1.5, color: 'rgba(255,255,255,0.82)', fontWeight: 500, maxWidth: 280 }}
            >
              Find verified homes and people from back home — all in one trusted community.
            </Typography>
            <Box
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '18px',
                padding: '8px 14px', background: 'rgba(255,255,255,0.14)', borderRadius: '999px',
                backdropFilter: 'blur(2px)',
              }}
            >
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#7FE3A6' }} />
              <Typography sx={{ fontSize: '12.5px', fontWeight: 600, color: '#fff' }}>
                Kerala · Jamia Nagar community
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 24 }} />

      {/* Auth actions */}
      <Box sx={{ padding: '0 24px 8px', display: 'flex', flexDirection: 'column', gap: '13px' }}>
        <Box
          component="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            width: '100%', padding: '16px', border: `1.5px solid ${colors.line}`, borderRadius: '16px',
            background: '#fff', fontFamily: 'inherit', fontSize: '15.5px', fontWeight: 700, color: colors.ink,
            cursor: 'pointer', boxShadow: colors.shadowSm,
            '&:hover': { background: '#FCFBF7', borderColor: '#D8D3C4' },
            '&:active': { transform: 'scale(0.985)' },
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.5 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.2 13.3 17.6 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.7 7l7.2 5.6c4.2-3.9 6.9-9.6 6.9-17.1Z" />
            <path fill="#FBBC05" d="M10.4 28.3a14.8 14.8 0 0 1 0-8.6l-7.8-6.1a24 24 0 0 0 0 20.8l7.8-6.1Z" />
            <path fill="#34A853" d="M24 48c6.1 0 11.3-2 15-5.5l-7.2-5.6c-2 1.4-4.6 2.2-7.8 2.2-6.4 0-11.8-3.8-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48Z" />
          </svg>
          Continue with Google
        </Box>

        <Box
          component="button"
          onClick={() => navigate(PATHS.auth.login)}
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            width: '100%', padding: '16px', border: 'none', borderRadius: '16px',
            background: `linear-gradient(150deg, ${colors.mossMid}, ${colors.mossDeep})`,
            fontFamily: 'inherit', fontSize: '15.5px', fontWeight: 700, color: '#fff',
            cursor: 'pointer', boxShadow: colors.shadowFab,
            '&:hover': { filter: 'brightness(1.06)' },
            '&:active': { transform: 'scale(0.985)' },
          }}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="3" stroke="#fff" strokeWidth="1.8" />
            <path d="m4 7 8 6 8-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Continue with email
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px', fontSize: '14px' }}>
          <Typography component="span" sx={{ color: colors.ink3, fontWeight: 500, fontSize: 'inherit' }}>
            Already have an account?
          </Typography>
          <Typography
            component="span"
            onClick={() => navigate(PATHS.auth.login)}
            sx={{ color: colors.moss, fontWeight: 700, cursor: 'pointer', fontSize: 'inherit' }}
          >
            Log in
          </Typography>
        </Box>
      </Box>

      {/* Terms */}
      <Box sx={{ padding: '14px 38px 20px', textAlign: 'center' }}>
        <Typography sx={{ margin: 0, fontSize: '11.5px', lineHeight: 1.55, color: colors.ink4, fontWeight: 500 }}>
          By continuing you agree to TrustU&apos;s{' '}
          <Box component="span" sx={{ color: colors.ink3, fontWeight: 600 }}>Terms of Service</Box>
          {' '}and{' '}
          <Box component="span" sx={{ color: colors.ink3, fontWeight: 600 }}>Privacy Policy</Box>.
        </Typography>
      </Box>
    </AuthCard>
  )
}

export default LandingPage
