import { apiClient } from './api-client'
import { Sponsorship, SponsorshipStatus } from '@/types/sponsorship'

export interface CreateSponsorshipInput {
  brandName: string
  productService?: string
  dealAmount: number
  priority?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  description?: string
  deliverables?: string[]
  targetAudience?: string
  startDate?: Date | string
  endDate?: Date | string
  status?: SponsorshipStatus
}

export interface SponsorshipsResponse {
  sponsorships: Sponsorship[]
  total: number
  page: number
  hasMore: boolean
}

export interface DashboardStats {
  activeDeals: number
  pendingApproval: number
  completedDeals: number
  pipelineValue: number
  averageDealAmount: number
}

// Helper function to convert date strings to Date objects
function convertSponsorshipDates(sponsorship: any): Sponsorship {
  return {
    ...sponsorship,
    startDate: sponsorship.startDate ? new Date(sponsorship.startDate) : sponsorship.startDate,
    endDate: sponsorship.endDate ? new Date(sponsorship.endDate) : sponsorship.endDate,
  }
}

export const sponsorshipApi = {
  async listSponsorships(page: number = 1): Promise<SponsorshipsResponse> {
    const response = await apiClient.getPaginated<Sponsorship>(
      '/sponsorships',
      page
    )
    
    return {
      sponsorships: (response.data || []).map(convertSponsorshipDates),
      total: response.pagination.total,
      page: response.pagination.page,
      hasMore: response.pagination.hasMore,
    }
  },

  async getSponsorshipById(id: string): Promise<Sponsorship> {
    const response = await apiClient.get<Sponsorship>(`/sponsorships/${id}`)
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to fetch sponsorship')
    }
    
    return convertSponsorshipDates(response.data)
  },

  async createSponsorship(input: CreateSponsorshipInput): Promise<Sponsorship> {
    console.log('[sponsorship-api] Creating sponsorship:', {
      brandName: input.brandName,
      dealAmount: input.dealAmount,
    })
    
    const response = await apiClient.post<Sponsorship>('/sponsorships', {
      brandName: input.brandName,
      productService: input.productService || '',
      dealAmount: input.dealAmount,
      priority: input.priority || 'medium',
      contactName: input.contactName || '',
      contactEmail: input.contactEmail || '',
      contactPhone: input.contactPhone || '',
      description: input.description || '',
      deliverables: input.deliverables || [],
      targetAudience: input.targetAudience || '',
      startDate: input.startDate ? new Date(input.startDate).toISOString() : null,
      endDate: input.endDate ? new Date(input.endDate).toISOString() : null,
      status: input.status || 'pitch-received',
    })
    
    if (!response.success || !response.data) {
      console.error('[sponsorship-api] Failed to create sponsorship:', response.error?.message)
      throw new Error(response.error?.message || 'Failed to create sponsorship')
    }
    
    console.log('[sponsorship-api] Sponsorship created successfully:', response.data.id)
    return convertSponsorshipDates(response.data)
  },

  async updateSponsorship(
    id: string,
    input: Partial<CreateSponsorshipInput>
  ): Promise<Sponsorship> {
    const data: Record<string, unknown> = {}
    
    if (input.brandName !== undefined) data.brandName = input.brandName
    if (input.productService !== undefined) data.productService = input.productService
    if (input.dealAmount !== undefined) data.dealAmount = input.dealAmount
    if (input.priority !== undefined) data.priority = input.priority
    if (input.contactName !== undefined) data.contactName = input.contactName
    if (input.contactEmail !== undefined) data.contactEmail = input.contactEmail
    if (input.contactPhone !== undefined) data.contactPhone = input.contactPhone
    if (input.description !== undefined) data.description = input.description
    if (input.deliverables !== undefined) data.deliverables = input.deliverables
    if (input.targetAudience !== undefined) data.targetAudience = input.targetAudience
    if (input.startDate !== undefined) data.startDate = input.startDate ? new Date(input.startDate).toISOString() : null
    if (input.endDate !== undefined) data.endDate = input.endDate ? new Date(input.endDate).toISOString() : null
    if (input.status !== undefined) data.status = input.status
    
    const response = await apiClient.put<Sponsorship>(
      `/sponsorships/${id}`,
      data
    )
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to update sponsorship')
    }
    
    return convertSponsorshipDates(response.data)
  },

  async deleteSponsorshipById(id: string): Promise<void> {
    const response = await apiClient.delete(`/sponsorships/${id}`)
    
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to delete sponsorship')
    }
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats')
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to fetch dashboard stats')
    }
    
    return response.data
  },
}
