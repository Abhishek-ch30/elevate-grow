import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Client-side Supabase client for authentication with flexible CORS settings
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Admin client for server-side operations (if needed)
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY
export const supabaseAdmin = SUPABASE_SERVICE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Types for our database tables
export interface User {
  id: string
  full_name: string
  email: string
  phone?: number
  profession?: 'student' | 'professional'
  college?: string
  company?: string
  role?: 'user' | 'admin'
  is_admin?: boolean
  created_at: string
}

export interface TrainingProgram {
  id: string
  title: string
  description?: string
  duration?: string
  price?: number
  is_active: boolean
  created_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  training_id: string
  status: 'pending_payment' | 'enrolled' | 'completed'
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  training_id: string
  amount: number
  payment_method: string
  transaction_reference?: string
  status: 'pending_verification' | 'verified' | 'failed' | 'refunded'
  created_at: string
}

export interface Certificate {
  id: string
  user_id: string
  training_id: string
  certificate_id: string
  issue_date: string
  file_url?: string
  created_at: string
}

export interface CertificateTemplate {
  id: string
  name: string
  template_type: 'html' | 'image' | 'pdf'
  template_url: string
  is_active: boolean
  created_at: string
}

export interface AdminActivityLog {
  id: string
  action: string
  reference_id?: string
  created_at: string
}
