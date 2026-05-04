import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/services/auth.api'
import { useAuth } from '@/app/AuthProvider'
import { useSnackbar } from '@/app/SnackbarProvider'
import { PATHS } from '@/routes/paths'
import { INDIA_STATES } from '@/constants/states'

// ── Constants ─────────────────────────────────────────────────────────────────
const GENDER_OPTIONS = [
  { value: 'male',   label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other',  label: 'Other' },
]

const DESIGNATION_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'staff',   label: 'Staff' },
  { value: 'alumni',  label: 'Alumni' },
]

// ── Step 1 schema ─────────────────────────────────────────────────────────────
const step1Schema = z
  .object({
    name:                  z.string().min(2, 'Full name must be at least 2 characters'),
    gender:                z.enum(['male', 'female', 'other', '']),
    designation:           z.string().min(1, 'Please select a designation'),
    phone:                 z.string().refine(
      (v) => v === '' || /^[0-9+\-\s]{7,15}$/.test(v),
      { message: 'Enter a valid phone number' },
    ),
    email:                 z.string().email('Enter a valid email address'),
    institute:             z.string(),
    password:              z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

type Step1Values = z.infer<typeof step1Schema>

// ── Step 2 schema ─────────────────────────────────────────────────────────────
const step2Schema = z.object({
  native_state_id:  z.string().min(1, 'Please select your home state'),
  current_state_id: z.string().min(1, 'Please select your current state'),
})

type Step2Values = z.infer<typeof step2Schema>

// ── Step 1 component ──────────────────────────────────────────────────────────
interface Step1Props {
  prefillEmail: string
  onNext: (data: Step1Values) => void
  onBack: () => void
}

function AccountStep({ prefillEmail, onNext, onBack }: Step1Props) {
  const { control, register, handleSubmit, setValue, formState: { errors } } =
    useForm<Step1Values>({
      resolver: zodResolver(step1Schema),
      defaultValues: {
        name: '', gender: '', designation: '', phone: '',
        email: prefillEmail, institute: '',
        password: '', password_confirmation: '',
      },
    })

  useEffect(() => {
    if (prefillEmail) setValue('email', prefillEmail)
  }, [prefillEmail, setValue])

  return (
    <Box>
      {/* Header */}
      <Stack alignItems="center" spacing={2} mb={3}>
        <Box sx={{
          width: 72, height: 72, borderRadius: '50%',
          bgcolor: 'primary.main', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(45,125,50,0.35)',
        }}>
          <PersonAddOutlinedIcon sx={{ color: '#fff', fontSize: 38 }} />
        </Box>
        <Box textAlign="center">
          <Typography variant="h5" fontWeight={700}>Create your account</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Step 1 of 2 — Your details
          </Typography>
        </Box>
      </Stack>

      <Box component="form" noValidate onSubmit={handleSubmit(onNext)}>
        <Grid container spacing={2}>

          {/* Name + Gender */}
          <Grid item xs={12} sm={7}>
            <TextField
              {...register('name')} fullWidth label="Full Name"
              error={!!errors.name} helperText={errors.name?.message}
              autoComplete="name" autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Controller name="gender" control={control} render={({ field }) => (
              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel shrink>Gender</InputLabel>
                <Select {...field} label="Gender" displayEmpty notched>
                  <MenuItem value=""><em>Select</em></MenuItem>
                  {GENDER_OPTIONS.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
                {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
              </FormControl>
            )} />
          </Grid>

          {/* Designation + Phone */}
          <Grid item xs={12} sm={6}>
            <Controller name="designation" control={control} render={({ field }) => (
              <FormControl fullWidth error={!!errors.designation}>
                <InputLabel shrink>Designation</InputLabel>
                <Select {...field} label="Designation" displayEmpty notched>
                  <MenuItem value=""><em>Select</em></MenuItem>
                  {DESIGNATION_OPTIONS.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
                {errors.designation && <FormHelperText>{errors.designation.message}</FormHelperText>}
              </FormControl>
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('phone')} fullWidth label="Phone Number" placeholder="Optional"
              error={!!errors.phone} helperText={errors.phone?.message}
              autoComplete="tel" inputProps={{ inputMode: 'tel' }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              {...register('email')} fullWidth label="Email Address" type="email"
              error={!!errors.email} helperText={errors.email?.message}
              autoComplete="email"
            />
          </Grid>

          {/* Institute */}
          <Grid item xs={12}>
            <TextField
              {...register('institute')} fullWidth label="Institute / College"
              placeholder="Optional"
              error={!!errors.institute} helperText={errors.institute?.message}
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12}>
            <TextField
              {...register('password')} fullWidth label="Password" type="password"
              placeholder="Min. 8 characters" autoComplete="new-password"
              error={!!errors.password} helperText={errors.password?.message}
            />
          </Grid>

          {/* Confirm Password */}
          <Grid item xs={12}>
            <TextField
              {...register('password_confirmation')} fullWidth label="Confirm Password" type="password"
              autoComplete="new-password"
              error={!!errors.password_confirmation} helperText={errors.password_confirmation?.message}
            />
          </Grid>

          {/* Next */}
          <Grid item xs={12} mt={1}>
            <Button type="submit" fullWidth variant="contained" size="large"
              sx={{ py: 1.5, fontWeight: 600 }}>
              Next — Select Your State
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        {'Already have an account? '}
        <Box component="span"
          sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
          onClick={onBack}>
          Sign In
        </Box>
      </Typography>
    </Box>
  )
}

// ── Step 2 component ──────────────────────────────────────────────────────────
interface Step2Props {
  onSubmit: (data: Step2Values) => void
  onBack: () => void
  isPending: boolean
}

function LocationStep({ onSubmit, onBack, isPending }: Step2Props) {
  const { control, handleSubmit, formState: { errors } } =
    useForm<Step2Values>({
      resolver: zodResolver(step2Schema),
      defaultValues: { native_state_id: '', current_state_id: '' },
    })

  return (
    <Box>
      {/* Header */}
      <Stack alignItems="center" spacing={2} mb={3}>
        <Box sx={{
          width: 72, height: 72, borderRadius: '50%',
          bgcolor: 'primary.main', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(45,125,50,0.35)',
        }}>
          <GroupsOutlinedIcon sx={{ color: '#fff', fontSize: 38 }} />
        </Box>
        <Box textAlign="center">
          <Typography variant="h5" fontWeight={700}>Your Location</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Step 2 of 2 — We'll assign your community based on your states
          </Typography>
        </Box>
      </Stack>

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2.5}>

          {/* Home State */}
          <Grid item xs={12}>
            <Controller name="native_state_id" control={control} render={({ field }) => (
              <FormControl fullWidth error={!!errors.native_state_id}>
                <InputLabel shrink>Home State *</InputLabel>
                <Select {...field} label="Home State *" displayEmpty notched>
                  <MenuItem value=""><em>Select your home state</em></MenuItem>
                  {INDIA_STATES.map(s => (
                    <MenuItem key={s.id} value={String(s.id)}>{s.name}</MenuItem>
                  ))}
                </Select>
                {errors.native_state_id
                  ? <FormHelperText>{errors.native_state_id.message}</FormHelperText>
                  : <FormHelperText>The state you originally come from</FormHelperText>
                }
              </FormControl>
            )} />
          </Grid>

          {/* Current State */}
          <Grid item xs={12}>
            <Controller name="current_state_id" control={control} render={({ field }) => (
              <FormControl fullWidth error={!!errors.current_state_id}>
                <InputLabel shrink>Current State *</InputLabel>
                <Select {...field} label="Current State *" displayEmpty notched>
                  <MenuItem value=""><em>Select your current state</em></MenuItem>
                  {INDIA_STATES.map(s => (
                    <MenuItem key={s.id} value={String(s.id)}>{s.name}</MenuItem>
                  ))}
                </Select>
                {errors.current_state_id
                  ? <FormHelperText>{errors.current_state_id.message}</FormHelperText>
                  : <FormHelperText>Where you're currently located</FormHelperText>
                }
              </FormControl>
            )} />
          </Grid>

          {/* Register button */}
          <Grid item xs={12} mt={1}>
            <Button type="submit" fullWidth variant="contained" size="large"
              disabled={isPending}
              sx={{ py: 1.5, fontWeight: 600 }}>
              {isPending
                ? <CircularProgress size={22} sx={{ color: '#fff' }} />
                : 'Register & Join Community'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Back */}
      <Button
        fullWidth startIcon={<ArrowBackIcon />} onClick={onBack}
        sx={{
          mt: 1.5, color: 'text.secondary', fontWeight: 500, textTransform: 'none',
          '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
        }}
      >
        Back to account details
      </Button>
    </Box>
  )
}

// ── Root component ────────────────────────────────────────────────────────────
const RegisterPage: React.FC = () => {
  const navigate     = useNavigate()
  const location     = useLocation()
  const prefillEmail = (location.state as { email?: string })?.email ?? ''

  const [step, setStep] = useState<1 | 2>(1)
  // Keep Step 1 data in a ref — passwords never hit React state
  const step1Ref = useRef<Step1Values | null>(null)

  const { login, syncProfile } = useAuth()
  const { showError } = useSnackbar()

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      login({ ...data.user, profileComplete: true }, data.token)
      // Fetch full profile — backend has assigned community based on native_state_id
      await syncProfile()
      navigate(PATHS.dashboard.community)
    },
    onError: (error: Error & { errors?: Record<string, string[]> }) => {
      showError(error.message ?? 'Registration failed. Please try again.')
    },
  })

  const handleStep1Next = (data: Step1Values) => {
    step1Ref.current = data
    setStep(2)
  }

  const handleStep2Submit = (data: Step2Values) => {
    const s1 = step1Ref.current
    if (!s1) return
    registerMutation.mutate({
      name:                  s1.name,
      email:                 s1.email,
      profile_type:          s1.designation,
      password:              s1.password,
      password_confirmation: s1.password_confirmation,
      native_state_id:       Number(data.native_state_id),
      current_state_id:      Number(data.current_state_id),
      gender:                s1.gender    || undefined,
      phone:                 s1.phone     || undefined,
      institute:             s1.institute || undefined,
    })
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: { xs: 2, sm: 5 },
      px: { xs: 1.5, sm: 2 },
    }}>
      {/* Back button — only on step 1 */}
      {step === 1 && (
        <Box sx={{ width: '100%', maxWidth: 520, mb: 1.5 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(PATHS.auth.login)}
            sx={{ color: 'text.secondary', fontWeight: 500, pl: 0, '&:hover': { bgcolor: 'transparent', color: 'text.primary' } }}
          >
            Back
          </Button>
        </Box>
      )}

      <Paper elevation={0} sx={{
        width: '100%', maxWidth: 520, borderRadius: 4,
        p: { xs: 2.5, sm: 4 },
        bgcolor: 'background.paper',
        border: '1px solid', borderColor: 'divider',
      }}>
        {step === 1 ? (
          <AccountStep
            prefillEmail={prefillEmail}
            onNext={handleStep1Next}
            onBack={() => navigate(PATHS.auth.login)}
          />
        ) : (
          <LocationStep
            onSubmit={handleStep2Submit}
            onBack={() => setStep(1)}
            isPending={registerMutation.isPending}
          />
        )}
      </Paper>

      {step === 1 && (
        <Typography variant="caption" align="center" color="text.disabled" display="block" sx={{ mt: 2 }}>
          By creating an account, you agree to our{' '}
          <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}>
            Terms of Service
          </Box>
        </Typography>
      )}
    </Box>
  )
}

export default RegisterPage
