import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Typography, CircularProgress, Avatar } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import AuthCard from '../components/AuthCard'
import { AuthField, AuthSelectField, StepPill, authInputSx } from '../components/AuthField'
import { authApi } from '@/services/auth.api'
import { useAuth } from '@/app/AuthProvider'
import { PATHS } from '@/routes/paths'
import { NATIVE_STATE_OPTIONS, CURRENT_STATE_OPTIONS, DISTRICTS_BY_STATE } from '@/constants/states'
import { getInitials, selfAvatarGradient } from '@/utils'
import colors from '@/theme/colors'

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
    phone:                 z.string()
      .min(1, 'Phone number is required')
      .refine(
        (v) => /^[0-9+\-\s]{7,15}$/.test(v),
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
// native_district / current_district are display-only — the backend only
// accepts a state id, so they're never sent with the registration payload.
const step2Schema = z.object({
  native_state_id:   z.string().min(1, 'Please select your home state'),
  native_district:   z.string(),
  current_state_id:  z.string().min(1, 'Please select your current state'),
  current_district:  z.string(),
})

type Step2Values = z.infer<typeof step2Schema>

// ── Shared back button ────────────────────────────────────────────────────────
const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Box
    component="button"
    onClick={onClick}
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
)

// ── Shared submit button ──────────────────────────────────────────────────────
const SubmitButton: React.FC<{ label: string; loading?: boolean; onClick: () => void }> = ({ label, loading, onClick }) => (
  <Box
    component="button"
    onClick={onClick}
    disabled={loading}
    sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
      width: '100%', padding: '17px', border: 'none', borderRadius: '16px',
      background: `linear-gradient(150deg, ${colors.mossMid}, ${colors.mossDeep})`,
      fontFamily: 'inherit', fontSize: '16px', fontWeight: 700, color: '#fff',
      cursor: 'pointer', boxShadow: colors.shadowFab,
      '&:hover': { filter: 'brightness(1.06)' },
      '&:active': { transform: 'scale(0.985)' },
    }}
  >
    {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : (
      <>
        {label}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </>
    )}
  </Box>
)

// ── Step 1 component ──────────────────────────────────────────────────────────
interface Step1Props {
  prefillEmail: string
  initialValues: Step1Values | null
  onNext: (data: Step1Values) => void
  onBack: () => void
}

function AccountStep({ prefillEmail, initialValues, onNext, onBack }: Step1Props) {
  const { control, register, handleSubmit, setValue, formState: { errors } } =
    useForm<Step1Values>({
      resolver: zodResolver(step1Schema),
      defaultValues: initialValues ?? {
        name: '', gender: '', designation: '', phone: '',
        email: prefillEmail, institute: '',
        password: '', password_confirmation: '',
      },
    })

  useEffect(() => {
    // Only apply the prefilled email from navigation state on first mount —
    // don't clobber a value the user already typed when re-visiting this step.
    if (prefillEmail && !initialValues) setValue('email', prefillEmail)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Box sx={{ padding: '24px 24px 0' }}>
        <BackButton onClick={onBack} />
        <Typography component="h1" sx={{ margin: '20px 0 6px', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.6px', color: colors.ink }}>
          Create your account
        </Typography>
        <Typography sx={{ margin: 0, fontSize: '14.5px', lineHeight: 1.5, color: colors.ink3, fontWeight: 500 }}>
          Tell us a bit about yourself to get started.
        </Typography>
      </Box>

      <Box component="form" noValidate onSubmit={handleSubmit(onNext)} sx={{ padding: '18px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AuthField label="Full Name" error={errors.name?.message}>
          <Box component="input" autoComplete="name" autoFocus placeholder="Your full name" {...register('name')} sx={authInputSx} />
        </AuthField>

        <Box sx={{ display: 'flex', gap: '12px' }}>
          <Box sx={{ flex: 1 }}>
            <AuthField label="Gender" error={errors.gender?.message}>
              <Controller name="gender" control={control} render={({ field }) => (
                <AuthSelectField value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="Select" options={GENDER_OPTIONS} />
              )} />
            </AuthField>
          </Box>
          <Box sx={{ flex: 1 }}>
            <AuthField label="Designation" error={errors.designation?.message}>
              <Controller name="designation" control={control} render={({ field }) => (
                <AuthSelectField value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="Select" options={DESIGNATION_OPTIONS} />
              )} />
            </AuthField>
          </Box>
        </Box>

        <AuthField label="Phone Number" error={errors.phone?.message}>
          <Box component="input" autoComplete="tel" placeholder="e.g. 9876543210" {...register('phone')} sx={authInputSx} />
        </AuthField>

        <AuthField label="Email" error={errors.email?.message}>
          <Box component="input" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} sx={authInputSx} />
        </AuthField>

        <AuthField label="Institute / College" error={errors.institute?.message}>
          <Box component="input" placeholder="Optional" {...register('institute')} sx={authInputSx} />
        </AuthField>

        <AuthField label="Password" error={errors.password?.message}>
          <Box component="input" type="password" autoComplete="new-password" placeholder="Min. 8 characters" {...register('password')} sx={authInputSx} />
        </AuthField>

        <AuthField label="Confirm Password" error={errors.password_confirmation?.message}>
          <Box component="input" type="password" autoComplete="new-password" placeholder="••••••••" {...register('password_confirmation')} sx={authInputSx} />
        </AuthField>

        <Box sx={{ marginTop: '4px' }}>
          <SubmitButton label="Next — Save Your Profile" onClick={handleSubmit(onNext)} />
        </Box>
      </Box>

      <Box sx={{ padding: '0 24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14px' }}>
        <Typography component="span" sx={{ color: colors.ink3, fontWeight: 500, fontSize: 'inherit' }}>
          Already have an account?
        </Typography>
        <Typography component="span" onClick={onBack} sx={{ color: colors.moss, fontWeight: 700, cursor: 'pointer', fontSize: 'inherit' }}>
          Log in
        </Typography>
      </Box>
    </>
  )
}

// ── Step 2 component: "Save your profile" (location) ───────────────────────────
interface Step2Props {
  name: string
  designationLabel: string
  initialValues: Step2Values | null
  onSubmit: (data: Step2Values) => void
  onBack: (data: Step2Values) => void
  isPending: boolean
}

function ProfileLocationStep({ name, designationLabel, initialValues, onSubmit, onBack, isPending }: Step2Props) {
  const nativeStateOptions = NATIVE_STATE_OPTIONS.map(s => ({ value: String(s.id), label: s.name }))
  const currentStateOptions = CURRENT_STATE_OPTIONS.map(s => ({ value: String(s.id), label: s.name }))

  const { control, handleSubmit, watch, getValues, formState: { errors } } =
    useForm<Step2Values>({
      resolver: zodResolver(step2Schema),
      // Only one state — and, for Delhi, only one district (Jamia Nagar) —
      // is offered right now, so pre-select both rather than making the user
      // pick from a list of one.
      defaultValues: initialValues ?? {
        native_state_id: nativeStateOptions[0]?.value ?? '',
        native_district: '',
        current_state_id: currentStateOptions[0]?.value ?? '',
        current_district: (DISTRICTS_BY_STATE[Number(currentStateOptions[0]?.value)] ?? [])[0] ?? '',
      },
    })

  const nativeStateId = watch('native_state_id')
  const currentStateId = watch('current_state_id')
  const nativeDistrictOptions = (DISTRICTS_BY_STATE[Number(nativeStateId)] ?? []).map(d => ({ value: d, label: d }))
  const currentDistrictOptions = (DISTRICTS_BY_STATE[Number(currentStateId)] ?? []).map(d => ({ value: d, label: d }))

  return (
    <>
      <Box sx={{ padding: '24px 24px 0' }}>
        <BackButton onClick={() => onBack(getValues())} />
        <Box sx={{ marginTop: '18px' }}>
          <StepPill step="STEP 1 OF 2" />
        </Box>
        <Typography component="h1" sx={{ margin: '16px 0 6px', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.6px', color: colors.ink }}>
          Save your profile
        </Typography>
        <Typography sx={{ margin: 0, fontSize: '14.5px', lineHeight: 1.5, color: colors.ink3, fontWeight: 500 }}>
          Tell us where you&apos;re from and where you live now — we&apos;ll connect you to the right community.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '18px' }}>
          <Avatar sx={{ width: 44, height: 44, background: selfAvatarGradient(), color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
            {getInitials(name || 'U')}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '15px', fontWeight: 800, color: colors.ink, letterSpacing: '-0.2px' }}>
              {name || 'Your name'}
            </Typography>
            {designationLabel && (
              <Typography sx={{ fontSize: '12.5px', fontWeight: 500, color: colors.ink3 }}>
                {designationLabel}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography component="span" sx={{ fontSize: '12.5px', fontWeight: 700, color: colors.ink2 }}>Permanent State</Typography>
          <Box sx={{ display: 'flex', gap: '12px' }}>
            <Box sx={{ flex: 1 }}>
              <Controller name="native_state_id" control={control} render={({ field }) => (
                <AuthSelectField value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="State" options={nativeStateOptions} />
              )} />
              {errors.native_state_id && (
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: colors.urgent, marginTop: '6px' }}>
                  {errors.native_state_id.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Controller name="native_district" control={control} render={({ field }) => (
                <AuthSelectField value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="District" options={nativeDistrictOptions} />
              )} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography component="span" sx={{ fontSize: '12.5px', fontWeight: 700, color: colors.ink2 }}>Current State</Typography>
          <Box sx={{ display: 'flex', gap: '12px' }}>
            <Box sx={{ flex: 1 }}>
              <Controller name="current_state_id" control={control} render={({ field }) => (
                <AuthSelectField value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="State" options={currentStateOptions} />
              )} />
              {errors.current_state_id && (
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: colors.urgent, marginTop: '6px' }}>
                  {errors.current_state_id.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Controller name="current_district" control={control} render={({ field }) => (
                <AuthSelectField value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="District" options={currentDistrictOptions} />
              )} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ marginTop: '4px' }}>
          <SubmitButton label="Save & Continue" loading={isPending} onClick={handleSubmit(onSubmit)} />
        </Box>
      </Box>
    </>
  )
}

// ── Root component ────────────────────────────────────────────────────────────
const RegisterPage: React.FC = () => {
  const navigate     = useNavigate()
  const location     = useLocation()
  const prefillEmail = (location.state as { email?: string })?.email ?? ''

  const [step, setStep] = useState<1 | 2>(1)
  const step1Ref = useRef<Step1Values | null>(null)
  const step2Ref = useRef<Step2Values | null>(null)

  const { login, syncProfile } = useAuth()

  // No onError here — a failure (including 422 validation messages, which the
  // backend sends as .message) still reaches the user via the global
  // QueryCache/MutationCache handler in QueryProvider.tsx.
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      login({ ...data.user, profileComplete: true }, data.token)
      await syncProfile()
      navigate(PATHS.onboarding)
    },
  })

  const handleStep1Next = (data: Step1Values) => {
    step1Ref.current = data
    setStep(2)
  }

  const handleStep2Submit = (data: Step2Values) => {
    step2Ref.current = data
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

  const designationLabel = DESIGNATION_OPTIONS.find(d => d.value === step1Ref.current?.designation)?.label ?? ''

  return (
    <AuthCard maxWidth={480} bgcolor={colors.white}>
      {step === 1 ? (
        <AccountStep
          prefillEmail={prefillEmail}
          initialValues={step1Ref.current}
          onNext={handleStep1Next}
          onBack={() => navigate(PATHS.auth.login)}
        />
      ) : (
        <ProfileLocationStep
          name={step1Ref.current?.name ?? ''}
          designationLabel={designationLabel}
          initialValues={step2Ref.current}
          onSubmit={handleStep2Submit}
          onBack={(data) => { step2Ref.current = data; setStep(1) }}
          isPending={registerMutation.isPending}
        />
      )}
    </AuthCard>
  )
}

export default RegisterPage
