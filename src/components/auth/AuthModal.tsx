import React, { useState } from 'react'
import { SignUpForm } from './SignUpForm'
import { LoginForm } from './LoginForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: 'login' | 'signup'
}

export function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(initialView)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {view === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mt-2">
            {view === 'login' 
              ? 'Welcome back! Please sign in to your account.'
              : 'Join us today! Create your account to get started.'
            }
          </p>
        </div>

        {view === 'login' ? <LoginForm /> : <SignUpForm />}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {view === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setView(view === 'login' ? 'signup' : 'login')}
              className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              {view === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
