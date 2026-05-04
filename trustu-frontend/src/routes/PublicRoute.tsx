import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'
import { PATHS } from './paths'
import FullPageLoader from '@/components/FullPageLoader'

const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <FullPageLoader />

  if (isAuthenticated) {
    return <Navigate to={PATHS.dashboard.community} replace />
  }

  return <Outlet />
}

export default PublicRoute
