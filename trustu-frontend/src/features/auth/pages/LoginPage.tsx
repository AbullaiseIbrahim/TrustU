import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthCard from '../components/AuthCard'
import TrustULogo from '../components/TrustULogo'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { PATHS } from '@/routes/paths'
import { useSnackbar } from '@/app/SnackbarProvider'
import { authApi } from '@/services/auth.api'
import { useAuth } from '@/app/AuthProvider'

// ── Validation ────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

// ── Component ─────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { showError } = useSnackbar()
  const { login, syncProfile } = useAuth()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // ── Handlers ──────────────────────────────────────────────────────────────

  const onSubmit: SubmitHandler<LoginForm> = async ({ email, password }) => {
    setIsSubmitting(true)
    try {
      const data = await authApi.login({ email, password })
      login({ ...data.user, profileComplete: true }, data.token)
      // Fetch full profile to get community name, id, communityJoined, etc.
      await syncProfile()
      navigate(PATHS.dashboard.community)
    } catch (err) {
      const error = err as Error & { status?: number }
      // Account not found or wrong password → send to register with email pre-filled
      if (error.status === 401 || error.status === 404 || error.status === 422) {
        navigate(PATHS.auth.register, { state: { email } })
      } else {
        showError(error.message ?? 'Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      showError('Google Sign-In integration coming soon. Please use Email & Password.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AuthCard maxWidth={460}>
      {/* Logo */}
      <TrustULogo size={64} />

      {/* Title */}
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
      >
        Sign In to TrustU
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Welcome back! Please sign in to continue.
      </Typography>

      {/* Google sign in banner */}
      <Box
        sx={{
          backgroundColor: '#E8F5E9',
          border: '1px solid #C8E6C9',
          borderRadius: '10px',
          px: 2,
          py: 1.5,
          mb: 2.5,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: 'primary.dark' }}>
          Sign in with your Google account to get started
        </Typography>
      </Box>

      {/* Google button */}
      <GoogleSignInButton
        onClick={handleGoogleSignIn}
        loading={isGoogleLoading}
        sx={{ mb: 2.5 }}
      />

      {/* Divider */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.disabled" sx={{ fontWeight: 500 }}>
          or continue with email
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      {/* Email + Password form */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* Email */}
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.75, color: 'text.primary' }}>
          Email Address
        </Typography>
        <TextField
          {...register('email')}
          placeholder="Enter your email address"
          type="email"
          autoComplete="email"
          autoFocus
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ mb: 2 }}
        />

        {/* Password */}
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.75, color: 'text.primary' }}>
          Password
        </Typography>
        <TextField
          {...register('password')}
          placeholder="Enter your password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  size="small"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <VisibilityOffOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                    : <VisibilityOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                  }
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2.5 }}
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isSubmitting}
          sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600 }}
        >
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
        </Button>
      </Box>

      {/* Register link */}
      <Typography variant="body2" align="center" sx={{ mt: 2.5 }}>
        {"Don't have an account? "}
        <Box
          component="span"
          sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
          onClick={() => navigate(PATHS.auth.register)}
        >
          Sign Up
        </Box>
      </Typography>

      {/* Terms */}
      <Typography
        variant="caption"
        align="center"
        color="text.disabled"
        display="block"
        sx={{ mt: 1.5 }}
      >
        By signing in, you agree to our{' '}
        <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}>
          Terms of Service
        </Box>
        {' '}and{' '}
        <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}>
          Privacy Policy
        </Box>
      </Typography>
    </AuthCard>
  )
}

export default LoginPage
