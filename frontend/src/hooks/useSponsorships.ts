'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sponsorship } from '@/types/sponsorship'
import { sponsorshipApi, CreateSponsorshipInput } from '@/lib/sponsorship-api'
import { authApi } from '@/lib/auth-api'

export function useSponsorships() {
  const router = useRouter()
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  // Handle 401 errors - redirect to login
  const handleAuthenticationError = useCallback(() => {
    console.log('[useSponsorships] Authentication error detected - clearing token and redirecting to login')
    authApi.logout()
    router.push('/login')
  }, [router])

  // Fetch sponsorships from backend
  const fetchSponsorships = useCallback(async (pageNum: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const response = await sponsorshipApi.listSponsorships(pageNum)
      setSponsorships(response.sponsorships)
      setHasMore(response.hasMore)
      setTotal(response.total)
      setPage(pageNum)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch sponsorships'
      const status = (err as any)?.status
      
      // Check if it's an authentication error (401)
      if (status === 401 || message.includes('401') || message.includes('Unauthorized') || message.includes('token')) {
        handleAuthenticationError()
      } else {
        setError(message)
      }
      
      console.error('Error fetching sponsorships:', err)
    } finally {
      setLoading(false)
    }
  }, [handleAuthenticationError])

  // Load sponsorships on mount
  useEffect(() => {
    fetchSponsorships(1)
  }, [fetchSponsorships])

  const addSponsorship = useCallback(
    async (input: CreateSponsorshipInput) => {
      try {
        setError(null)
        const newSponsorship = await sponsorshipApi.createSponsorship(input)
        setSponsorships((prev) => [newSponsorship, ...prev])
        return newSponsorship
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create sponsorship'
        const status = (err as any)?.status
        
        if (status === 401 || message.includes('401') || message.includes('Unauthorized') || message.includes('token')) {
          handleAuthenticationError()
        } else {
          setError(message)
        }
        
        throw err
      }
    },
    [handleAuthenticationError]
  )

  const updateSponsorship = useCallback(
    async (id: string, updates: Partial<CreateSponsorshipInput>) => {
      try {
        setError(null)
        const updated = await sponsorshipApi.updateSponsorship(id, updates)
        setSponsorships((prev) =>
          prev.map((s) => (s.id === id ? updated : s))
        )
        return updated
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update sponsorship'
        const status = (err as any)?.status
        
        if (status === 401 || message.includes('401') || message.includes('Unauthorized') || message.includes('token')) {
          handleAuthenticationError()
        } else {
          setError(message)
        }
        
        throw err
      }
    },
    [handleAuthenticationError]
  )

  const deleteSponsorship = useCallback(
    async (id: string) => {
      try {
        setError(null)
        await sponsorshipApi.deleteSponsorshipById(id)
        setSponsorships((prev) => prev.filter((s) => s.id !== id))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete sponsorship'
        const status = (err as any)?.status
        
        if (status === 401 || message.includes('401') || message.includes('Unauthorized') || message.includes('token')) {
          handleAuthenticationError()
        } else {
          setError(message)
        }
        
        throw err
      }
    },
    [handleAuthenticationError]
  )

  const getSponsorshipsByStatus = useCallback(
    (status: string) => {
      return sponsorships.filter((s) => s.status === status)
    },
    [sponsorships]
  )

  const nextPage = useCallback(() => {
    if (hasMore) {
      fetchSponsorships(page + 1)
    }
  }, [page, hasMore, fetchSponsorships])

  const prevPage = useCallback(() => {
    if (page > 1) {
      fetchSponsorships(page - 1)
    }
  }, [page, fetchSponsorships])

  return {
    sponsorships,
    loading,
    error,
    addSponsorship,
    updateSponsorship,
    deleteSponsorship,
    getSponsorshipsByStatus,
    fetchSponsorships,
    page,
    hasMore,
    total,
    nextPage,
    prevPage,
  }
}
