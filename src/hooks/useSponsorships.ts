'use client'

import { useState } from 'react'
import { Sponsorship } from '@/types/sponsorship'

export function useSponsorships() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([
    {
      id: '1',
      brandName: 'TechBrand Co',
      productService: 'Premium Software',
      dealAmount: 5000,
      priority: 'high',
      contactName: 'John Doe',
      contactEmail: 'john@techbrand.com',
      description: 'Create product review video',
      deliverables: ['YouTube Video', 'Instagram Posts'],
      targetAudience: 'Tech enthusiasts',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15'),
      status: 'pitch-received',
    },
    {
      id: '2',
      brandName: 'FashionHub',
      productService: 'Fashion Collection',
      dealAmount: 3500,
      priority: 'medium',
      contactName: 'Sarah Smith',
      contactEmail: 'sarah@fashionhub.com',
      description: 'Feature our new collection',
      deliverables: ['Fashion Video', 'TikTok Series'],
      targetAudience: 'Fashion audience',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-15'),
      status: 'under-review',
    },
  ])

  const addSponsorship = (sponsorship: Sponsorship) => {
    setSponsorships([...sponsorships, sponsorship])
  }

  const updateSponsorship = (id: string, updates: Partial<Sponsorship>) => {
    setSponsorships(
      sponsorships.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
  }

  const deleteSponsorship = (id: string) => {
    setSponsorships(sponsorships.filter((s) => s.id !== id))
  }

  const getSponsorshipsByStatus = (status: string) => {
    return sponsorships.filter((s) => s.status === status)
  }

  return {
    sponsorships,
    addSponsorship,
    updateSponsorship,
    deleteSponsorship,
    getSponsorshipsByStatus,
  }
}
