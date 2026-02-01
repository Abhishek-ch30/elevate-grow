import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from '@/hooks/use-toast'

export function UserMenu() {
  const { user, userProfile, signOut, isAdmin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  // Show user menu for all authenticated users
  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
    setIsOpen(false)
  }

  const handleDashboard = () => {
    if (isAdmin) {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
    setIsOpen(false)
  }

  const handleSettings = () => {
    if (isAdmin) {
      navigate('/admin')
    } else {
      navigate('/settings')
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-cyan-400 focus:outline-none transition-colors"
      >
        <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {userProfile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden md:block text-sm font-medium text-white">
          {userProfile?.full_name || user.email}
        </span>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-cyan-500/30">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm font-medium text-white">
              {userProfile?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
            {isAdmin && (
              <p className="text-xs text-cyan-400 mt-1">Administrator</p>
            )}
          </div>
          
          <button
            onClick={handleDashboard}
            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-cyan-400 transition-colors"
          >
            {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
          </button>
          
          <button
            onClick={handleSettings}
            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-cyan-400 transition-colors"
          >
            {isAdmin ? 'Admin Settings' : 'Settings'}
          </button>
          
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
