import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthTokens, User } from '@/types/auth.types'
import { profileApi } from '@/services/profile.api'
import { queryClient } from './QueryProvider'

const TOKEN_KEY = 'trustu_token'
const USER_KEY = 'trustu_user'

interface AuthContextValue {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (partial: Partial<User>) => void
  /** Fetch full profile from GET /user/profile and merge into user state.
   *  Call this after login or register to get community info, etc. */
  syncProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUserRaw = localStorage.getItem(USER_KEY)

    // Purge any stale/corrupted token values from previous sessions
    const isValidToken = storedToken && storedToken !== 'undefined' && storedToken !== 'null'

    if (isValidToken && storedUserRaw) {
      try {
        setUser(JSON.parse(storedUserRaw) as User)
        setTokens({ accessToken: storedToken, tokenType: 'Bearer' })
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    } else if (!isValidToken && storedToken) {
      // Had a bad token — clear it so the user is prompted to log in again
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }

    setIsLoading(false)
  }, [])

  const login = useCallback((newUser: User, token: string) => {
    setUser(newUser)
    setTokens({ accessToken: token, tokenType: 'Bearer' })
    // Only persist a real token — never write "undefined" or empty string
    if (token && token !== 'undefined' && token !== 'null') {
      localStorage.setItem(TOKEN_KEY, token)
    }
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setTokens(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    // Clear all React Query cache so the next user starts with fresh data
    queryClient.clear()
  }, [])

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...partial }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const syncProfile = useCallback(async () => {
    try {
      const profile = await profileApi.get()
      setUser(prev => {
        if (!prev) return prev
        const updated = { ...prev, ...profile, profileComplete: true }
        localStorage.setItem(USER_KEY, JSON.stringify(updated))
        return updated
      })
    } catch {
      // Non-fatal — user already has basic data from login/register response
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, tokens, isAuthenticated: !!user && !!tokens, isLoading, login, logout, updateUser, syncProfile }),
    [user, tokens, isLoading, login, logout, updateUser, syncProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
