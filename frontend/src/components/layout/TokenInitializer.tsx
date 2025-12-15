'use client'

import { useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface TokenInitializerProps {
  children: React.ReactNode
}

export function TokenInitializer({ children }: TokenInitializerProps) {
  useEffect(() => {
    // Initialize token from localStorage on client mount
    // Force a fresh load from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        apiClient.setToken(token)
      }
    }
  }, [])

  return <>{children}</>
}

