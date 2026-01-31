import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  apiClient,
  User,
  UserSignupData,
  AdminSignupData,
  LoginCredentials,
  ApiError
} from '../lib/api'

interface AuthContextType {
  user: User | null
  userProfile: User | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  token: string | null
  signUp: (data: UserSignupData) => Promise<{ error: any; user?: User; token?: string }>

  signIn: (credentials: LoginCredentials) => Promise<{ error: any; user?: User; token?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ error: any; user?: User }>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error: any }>
  refreshToken: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  // Initialize authentication state on app load
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem('qthink_solutions_token')

      if (!storedToken) {
        setLoading(false)
        return
      }

      // Verify token with backend
      const response = await apiClient.verifyToken()

      if (response.status === 'success' && response.data?.user) {
        setUser(response.data.user)
        setToken(storedToken)
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('qthink_solutions_token')
      }
    } catch (error) {
      console.error('Error verifying token:', error)
      localStorage.removeItem('qthink_solutions_token')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: UserSignupData) => {
    try {
      setLoading(true)

      const response = await apiClient.signup(data)

      if (response.status === 'success' && response.data) {
        setUser(response.data.user)
        setToken(response.data.token)
        return { error: null, user: response.data.user, token: response.data.token }
      } else {
        return { error: { message: response.message || 'Signup failed' } }
      }
    } catch (error) {
      console.error('Signup error:', error)

      if (error instanceof ApiError) {
        return { error: { message: error.message } }
      }

      return { error: { message: 'An unexpected error occurred during signup' } }
    } finally {
      setLoading(false)
    }
  }



  const signIn = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)

      const response = await apiClient.login(credentials)

      if (response.status === 'success' && response.data) {
        setUser(response.data.user)
        setToken(response.data.token)
        return { error: null, user: response.data.user, token: response.data.token }
      } else {
        return { error: { message: response.message || 'Login failed' } }
      }
    } catch (error) {
      console.error('Login error:', error)

      if (error instanceof ApiError) {
        return { error: { message: error.message } }
      }

      return { error: { message: 'An unexpected error occurred during login' } }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setToken(null)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) {
        return { error: { message: 'No user logged in' } }
      }

      const response = await apiClient.updateUserProfile(updates)

      if (response.status === 'success' && response.data?.profile) {
        setUser(response.data.profile)
        return { error: null, user: response.data.profile }
      } else {
        return { error: { message: response.message || 'Profile update failed' } }
      }
    } catch (error) {
      console.error('Profile update error:', error)

      if (error instanceof ApiError) {
        return { error: { message: error.message } }
      }

      return { error: { message: 'An unexpected error occurred during profile update' } }
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await apiClient.changePassword({
        currentPassword,
        newPassword
      })

      if (response.status === 'success') {
        return { error: null }
      } else {
        return { error: { message: response.message || 'Password change failed' } }
      }
    } catch (error) {
      console.error('Password change error:', error)

      if (error instanceof ApiError) {
        return { error: { message: error.message } }
      }

      return { error: { message: 'An unexpected error occurred during password change' } }
    }
  }

  const refreshToken = async () => {
    try {
      const response = await apiClient.refreshToken()

      if (response.status === 'success' && response.data) {
        setUser(response.data.user)
        setToken(response.data.token)
        return { error: null }
      } else {
        return { error: { message: response.message || 'Token refresh failed' } }
      }
    } catch (error) {
      console.error('Token refresh error:', error)

      if (error instanceof ApiError) {
        return { error: { message: error.message } }
      }

      return { error: { message: 'An unexpected error occurred during token refresh' } }
    }
  }

  // Auto-refresh token when it's close to expiry
  useEffect(() => {
    if (!token || !user) return

    // Refresh token every 23 hours (assuming 24h expiry)
    const refreshInterval = setInterval(() => {
      refreshToken().catch(console.error)
    }, 23 * 60 * 60 * 1000)

    return () => clearInterval(refreshInterval)
  }, [token, user])

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin' && user?.is_admin === true,
    token,
    signUp,

    signIn,
    signOut,
    updateProfile,
    changePassword,
    refreshToken,
    userProfile: user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper hook for admin-only components
export function useRequireAuth() {
  const auth = useAuth()

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      // Redirect to login or show login modal
      console.warn('Authentication required')
    }
  }, [auth.loading, auth.isAuthenticated])

  return auth
}

// Helper hook for admin-only components
export function useRequireAdmin() {
  const auth = useAuth()

  useEffect(() => {
    if (!auth.loading && (!auth.isAuthenticated || !auth.isAdmin)) {
      // Redirect to user dashboard or show error
      console.warn('Admin access required')
    }
  }, [auth.loading, auth.isAuthenticated, auth.isAdmin])

  return auth
}
