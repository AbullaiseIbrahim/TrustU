import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { PATHS } from './paths'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

// ── Lazy-loaded pages ──────────────────────────────────────────────────────────
const LandingPage    = lazy(() => import('../features/auth/pages/LandingPage'))
const LoginPage      = lazy(() => import('../features/auth/pages/LoginPage'))
const RegisterPage   = lazy(() => import('../features/auth/pages/RegisterPage'))
const AppShell       = lazy(() => import('../features/dashboard/layouts/AppShell'))
const DashboardLayout = lazy(() => import('../features/dashboard/layouts/DashboardLayout'))
const ProfilePage    = lazy(() => import('../features/profile/pages/ProfilePage'))
const MyListingsPage = lazy(() => import('../features/profile/pages/MyListingsPage'))
const NotFoundPage   = lazy(() => import('../components/NotFoundPage'))

// ── Eager imports for tab pages ────────────────────────────────────────────────
import CommunityPage     from '../features/community/pages/CommunityPage'
import AccommodationPage from '../features/accommodation/pages/AccommodationPage'
import ProxyPage         from '../features/proxy/pages/ProxyPage'
import MarketplacePage   from '../features/marketplace/pages/MarketplacePage'
import CirclePage        from '../features/circle/pages/CirclePage'

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

        {/* ── All authenticated routes share AppShell (top bar + bottom nav) ─ */}
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>

          {/* Dashboard with nested tab pages */}
          <Route path={PATHS.dashboard.root} element={<DashboardLayout />}>
            <Route index element={<Navigate to={PATHS.dashboard.community} replace />} />
            <Route path="community"     element={<CommunityPage />} />
            <Route path="accommodation" element={<AccommodationPage />} />
            <Route path="proxy"         element={<ProxyPage />} />
            <Route path="marketplace"   element={<MarketplacePage />} />
          </Route>

          {/* Standalone authenticated pages */}
          <Route path={PATHS.circle}      element={<CirclePage />} />
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
