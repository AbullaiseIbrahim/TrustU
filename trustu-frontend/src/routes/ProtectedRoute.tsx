import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'
import { PATHS } from './paths'

interface Props {
  children: ReactNode
  /** Kept for API compatibility — community is auto-assigned at registration */
  requireCommunity?: boolean
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={PATHS.auth.login} state={{ from: location }} replace />
  }

  return <>{children}</>
}
