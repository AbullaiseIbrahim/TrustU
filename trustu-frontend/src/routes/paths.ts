export const PATHS = {
  landing: '/',
  auth: {
    root: '/auth',
    login: '/auth/login',
    register: '/auth/register',
    otp: '/auth/otp',
  },
  dashboard: {
    root: '/dashboard',
    community: '/dashboard/community',
    accommodation: '/dashboard/accommodation',
    proxy: '/dashboard/proxy',
    marketplace: '/dashboard/marketplace',
  },
  profile: '/profile',
  circle: '/circle',
  notFound: '/404',
} as const
