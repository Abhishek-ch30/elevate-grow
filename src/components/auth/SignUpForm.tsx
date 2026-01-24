import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [profession, setProfession] = useState<'student' | 'professional'>('student')
  const [college, setCollege] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate profession-specific fields
    if (profession === 'student' && !college.trim()) {
      setError('College name is required for students')
      setLoading(false)
      return
    }
    
    if (profession === 'professional' && !company.trim()) {
      setError('Company name is required for professionals')
      setLoading(false)
      return
    }

    const signUpData = {
      email,
      password,
      fullName,
      phone: phone ? parseInt(phone) : undefined,
      profession,
      college: profession === 'student' ? college : undefined,
      company: profession === 'professional' ? company : undefined
    }

    const { error } = await signUp(signUpData)

    if (error) {
      setError(error.message || 'An error occurred during sign up')
    } else {
      setSuccess(true)
      setEmail('')
      setPassword('')
      setFullName('')
      setPhone('')
      setProfession('student')
      setCollege('')
      setCompany('')
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="p-6 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Check your email</h3>
        <p className="text-green-700">
          We've sent you a confirmation link. Please check your email to complete the registration.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number (Optional)
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your phone number"
        />
      </div>

      <div>
        <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
          Profession
        </label>
        <select
          id="profession"
          value={profession}
          onChange={(e) => {
            setProfession(e.target.value as 'student' | 'professional')
            setCollege('')
            setCompany('')
          }}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="student">Student</option>
          <option value="professional">Professional</option>
        </select>
      </div>

      {profession === 'student' && (
        <div>
          <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
            College Name
          </label>
          <input
            id="college"
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your college name"
          />
        </div>
      )}

      {profession === 'professional' && (
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your company name"
          />
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Create a password (min. 6 characters)"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  )
}
