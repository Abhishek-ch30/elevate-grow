import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { User } from '../lib/supabase'

interface SignUpData {
  email: string
  password: string
  fullName: string
  phone?: number
  profession: 'student' | 'professional'
  college?: string
  company?: string
}

interface AuthContextType {
  user: SupabaseUser | null
  userProfile: User | null
  session: Session | null
  loading: boolean
  signUp: (data: SignUpData, isAdmin?: boolean) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signUp = async (data: SignUpData, isAdmin: boolean = false) => {
    try {
      console.log('Starting signup with data:', { email: data.email, profession: data.profession, isAdmin });
      
      // Validate required fields
      if (!data.email || !data.password || !data.fullName) {
        return { error: { message: 'Email, password, and full name are required' } }
      }

      // Sign up the user with auth and include all metadata for the trigger function
      // Include role information in both user_metadata and raw_user_meta_data
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone?.toString() || '',
            profession: data.profession,
            college: data.college || '',
            company: data.company || '',
            role: isAdmin ? 'admin' : 'user',
            is_admin: isAdmin,
            // Add these for JWT claims
            custom_claims: {
              role: isAdmin ? 'admin' : 'user',
              is_admin: isAdmin
            }
          }
        }
      })

      if (error) {
        console.error('Supabase auth error:', error)
        return { error }
      }

      console.log('Auth signup successful:', authData)

      // The trigger function will handle profile creation automatically
      // No need for manual profile creation anymore

      return { error: null }
    } catch (error) {
      console.error('Unexpected error in signUp:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      return { error: new Error('No user logged in') }
    }

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (!error) {
        setUserProfile(prev => prev ? { ...prev, ...updates } : null)
      }

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
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
