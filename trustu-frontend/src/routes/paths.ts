export const PATHS = {
  landing: '/',
  auth: {
    root: '/auth',
    login: '/auth/login',
    register: '/auth/register',
    otp: '/auth/otp',
  },
  onboarding: '/onboarding',
  dashboard: {
    root: '/dashboard',
    community: '/dashboard/community',
    accommodation: '/dashboard/accommodation',
  },
  profile: '/profile',
  myListings: '/my-listings',
  notFound: '/404',
} as const
