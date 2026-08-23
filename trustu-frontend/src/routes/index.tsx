import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { PATHS } from './paths'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

// ── Lazy-loaded pages (auth + rarely visited) ──────────────────────────────────
const LandingPage    = lazy(() => import('../features/auth/pages/LandingPage'))
const LoginPage      = lazy(() => import('../features/auth/pages/LoginPage'))
const RegisterPage   = lazy(() => import('../features/auth/pages/RegisterPage'))
const AppShell       = lazy(() => import('../features/dashboard/layouts/AppShell'))
const DashboardLayout = lazy(() => import('../features/dashboard/layouts/DashboardLayout'))
const MyListingsPage = lazy(() => import('../features/profile/pages/MyListingsPage'))
const OnboardingCommunityPage = lazy(() => import('../features/onboarding/pages/OnboardingCommunityPage'))
const NotFoundPage   = lazy(() => import('../components/NotFoundPage'))

// ── Eager imports (tab pages + profile — prevents full-page Suspense flash) ────
import CommunityPage     from '../features/community/pages/CommunityPage'
import AccommodationPage from '../features/accommodation/pages/AccommodationPage'
import ProfilePage       from '../features/profile/pages/ProfilePage'

const PageLoader = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <CircularProgress />
  </Box>
)

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ── Public routes ────────────────────────────────────────────────── */}
        <Route element={<PublicRoute />}>
          <Route path={PATHS.landing}       element={<LandingPage />} />
          <Route path={PATHS.auth.login}    element={<LoginPage />} />
          <Route path={PATHS.auth.register} element={<RegisterPage />} />
        </Route>

        {/* ── Onboarding — full-screen, no top bar / bottom nav ─────────────── */}
        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route path={PATHS.onboarding} element={<OnboardingCommunityPage />} />
        </Route>

        {/* ── All authenticated routes share AppShell (top bar + bottom nav) ─ */}
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>

          {/* Dashboard with nested tab pages */}
          <Route path={PATHS.dashboard.root} element={<DashboardLayout />}>
            <Route index element={<Navigate to={PATHS.dashboard.community} replace />} />
            <Route path="community"     element={<CommunityPage />} />
            <Route path="accommodation" element={<AccommodationPage />} />
          </Route>

          {/* Standalone authenticated pages */}
          <Route path={PATHS.profile}     element={<ProfilePage />} />
          <Route path={PATHS.myListings}  element={<MyListingsPage />} />

        </Route>

        {/* ── 404 ──────────────────────────────────────────────────────────── */}
        <Route path={PATHS.notFound} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={PATHS.notFound} replace />} />

      </Routes>
    </Suspense>
  )
}
