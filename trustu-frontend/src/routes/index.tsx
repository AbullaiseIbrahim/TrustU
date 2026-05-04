import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { PATHS } from './paths'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

// ── Lazy-loaded pages (auth / onboarding — rarely revisited after first use) ──
const LandingPage       = lazy(() => import('../features/auth/pages/LandingPage'))
const LoginPage         = lazy(() => import('../features/auth/pages/LoginPage'))
const RegisterPage      = lazy(() => import('../features/auth/pages/RegisterPage'))
const ProfilePage       = lazy(() => import('../features/profile/pages/ProfilePage'))
const DashboardLayout   = lazy(() => import('../features/dashboard/layouts/DashboardLayout'))
const NotFoundPage      = lazy(() => import('../components/NotFoundPage'))

// ── Eager imports for dashboard tab pages (always needed once logged in) ──────
import CommunityPage     from '../features/community/pages/CommunityPage'
import AccommodationPage from '../features/accommodation/pages/AccommodationPage'
import ProxyPage         from '../features/proxy/pages/ProxyPage'
import MarketplacePage   from '../features/marketplace/pages/MarketplacePage'
import CirclePage        from '../features/circle/pages/CirclePage'

// ── Fallback spinner ──────────────────────────────────────────────────────────
const PageLoader = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <CircularProgress />
  </Box>
)

// ── Route tree ────────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ── Public routes (redirect to dashboard if already logged in) ────── */}
        <Route element={<PublicRoute />}>
          <Route path={PATHS.landing}        element={<LandingPage />} />
          <Route path={PATHS.auth.login}     element={<LoginPage />} />
          <Route path={PATHS.auth.register}  element={<RegisterPage />} />
        </Route>

        {/* ── Profile view (accessible from navbar) ────────────────────────── */}
        <Route
          path={PATHS.profile}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ── Dashboard (requires community) with nested feature tabs ──────── */}
        <Route
          path={PATHS.dashboard.root}
          element={
            <ProtectedRoute requireCommunity>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={PATHS.dashboard.community} replace />} />
          <Route path="community"     element={<CommunityPage />} />
          <Route path="accommodation" element={<AccommodationPage />} />
          <Route path="proxy"         element={<ProxyPage />} />
          <Route path="marketplace"   element={<MarketplacePage />} />
        </Route>

        {/* ── My Circle ────────────────────────────────────────────────────── */}
        <Route
          path={PATHS.circle}
          element={
            <ProtectedRoute requireCommunity>
              <CirclePage />
            </ProtectedRoute>
          }
        />

        {/* ── 404 ──────────────────────────────────────────────────────────── */}
        <Route path={PATHS.notFound} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={PATHS.notFound} replace />} />

      </Routes>
    </Suspense>
  )
}
