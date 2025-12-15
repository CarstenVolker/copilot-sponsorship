'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, User, LoginInput, RegisterInput } from '@/lib/auth-api'
import { apiClient } from '@/lib/api-client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is already logged in by verifying the token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)
        const token = authApi.getStoredToken()
        
        if (token) {
          // Token exists, set it in the API client
          apiClient.setToken(token)
          
          // In a real app, you might want to verify the token by calling a /me endpoint
          // For now, we trust the token if it exists
          // This is a simple JWT that will be validated by the backend on API calls
          setUser({ id: '', email: '', username: '' }) // Placeholder
        }
        
        setError(null)
      } catch (err) {
        console.error('[useAuth] Failed to initialize authentication:', err)
        setError('Failed to verify authentication')
        authApi.logout()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = useCallback(
    async (input: LoginInput) => {
      try {
        setLoading(true)
        setError(null)
        const response = await authApi.login(input)
        setUser(response.user)
        apiClient.setToken(response.token)
        router.push('/dashboard')
        return response.user
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const register = useCallback(
    async (input: RegisterInput) => {
      try {
        setLoading(true)
        setError(null)
        const response = await authApi.register(input)
        setUser(response.user)
        apiClient.setToken(response.token)
        router.push('/dashboard')
        return response.user
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const logout = useCallback(() => {
    authApi.logout()
    apiClient.clearToken()
    setUser(null)
    router.push('/')
  }, [router])

  // Check if user is authenticated (has a valid token)
  const isAuthenticated = !!user || (!!authApi.getStoredToken() && !error)

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  }
}
