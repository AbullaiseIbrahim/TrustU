import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, CircularProgress } from '@mui/material'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthCard from '../components/AuthCard'
import { PATHS } from '@/routes/paths'
import { useSnackbar } from '@/app/SnackbarProvider'
import { authApi } from '@/services/auth.api'
import { useAuth } from '@/app/AuthProvider'
import colors from '@/theme/colors'

// ── Validation ────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

// ── Shared field styling — pixel match to the prototype's input treatment ──────

const inputSx = {
  width: '100%',
  padding: '15px 16px',
  border: `1.5px solid ${colors.line}`,
  borderRadius: '14px',
  background: '#fff',
  fontFamily: 'inherit',
  fontSize: '15.5px',
  fontWeight: 500,
  color: colors.ink,
  outline: 'none',
  '&:focus': { borderColor: colors.accentGreen },
}

// ── Component ─────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { showError } = useSnackbar()
  const { login, syncProfile } = useAuth()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit: SubmitHandler<LoginForm> = async ({ email, password }) => {
    setIsSubmitting(true)
    try {
      const data = await authApi.login({ email, password })
      login({ ...data.user, profileComplete: true }, data.token)
      await syncProfile()
      navigate(PATHS.dashboard.community)
    } catch (err) {
      const error = err as Error & { status?: number }
      if (error.status === 401 || error.status === 404 || error.status === 422) {
        navigate(PATHS.auth.register, { state: { email } })
      } else {
        showError(error.message ?? 'Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const rootError = errors.email?.message ?? errors.password?.message

  return (
    <AuthCard maxWidth={480} bgcolor={colors.white}>
      {/* Header */}
      <Box sx={{ padding: '24px 24px 0' }}>
        <Box
          component="button"
          onClick={() => navigate(PATHS.landing)}
          aria-label="Back"
          sx={{
            width: 42, height: 42, borderRadius: '13px', border: `1.5px solid ${colors.line}`,
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', '&:active': { transform: 'scale(0.94)' },
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 5l-7 7 7 7" stroke={colors.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Box>

        <Typography component="h1" sx={{ margin: '22px 0 6px', fontSize: '27px', fontWeight: 800, letterSpacing: '-0.6px', color: colors.ink }}>
          Welcome back
        </Typography>
        <Typography sx={{ margin: 0, fontSize: '14.5px', lineHeight: 1.5, color: colors.ink3, fontWeight: 500 }}>
          Log in with your email to continue.
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Box component="label" sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography component="span" sx={{ fontSize: '13px', fontWeight: 700, color: colors.ink2, letterSpacing: '0.2px' }}>
              Email
            </Typography>
            <Box
              component="input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
              {...register('email')}
              sx={inputSx}
            />
          </Box>

          <Box component="label" sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography component="span" sx={{ fontSize: '13px', fontWeight: 700, color: colors.ink2, letterSpacing: '0.2px' }}>
              Password
            </Typography>
            <Box
              component="input"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
              sx={inputSx}
            />
          </Box>
        </Box>

        {rootError && (
          <Typography sx={{ margin: '14px 2px 0', fontSize: '13px', fontWeight: 600, color: colors.urgent }}>
            {rootError}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
          <Typography
            component="span"
            onClick={() => showError("Password reset isn't available yet — please contact support.")}
            sx={{ fontSize: '13.5px', fontWeight: 700, color: colors.moss, cursor: 'pointer' }}
          >
            Forgot password?
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 16 }} />

      <Box sx={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: '13px' }}>
        <Box
          component="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
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
          {isSubmitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Log in'}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14px' }}>
          <Typography component="span" sx={{ color: colors.ink3, fontWeight: 500, fontSize: 'inherit' }}>
            New to TrustU?
          </Typography>
          <Typography
            component="span"
            onClick={() => navigate(PATHS.auth.register)}
            sx={{ color: colors.moss, fontWeight: 700, cursor: 'pointer', fontSize: 'inherit' }}
          >
            Create account
          </Typography>
        </Box>
      </Box>
    </AuthCard>
  )
}

export default LoginPage
