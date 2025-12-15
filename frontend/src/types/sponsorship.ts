export interface Sponsorship {
  id: string
  brandName: string
  productService: string
  dealAmount: number
  priority: 'high' | 'medium' | 'low'
  contactName: string
  contactEmail: string
  contactPhone?: string
  description: string
  deliverables: string[]
  targetAudience?: string
  startDate: Date
  endDate: Date
  status: SponsorshipStatus
  attachments?: string[]
  notes?: string
}

export type SponsorshipStatus =
  | 'pitch-received'
  | 'under-review'
  | 'negotiating'
  | 'approved'
  | 'contracted'
  | 'content-creation'
  | 'awaiting-review'
  | 'published'
  | 'completed'
