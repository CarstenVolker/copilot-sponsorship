'use client'

import { useState, useEffect } from 'react'
import { Sponsorship } from '@/types/sponsorship'
import { sponsorshipApi, CreateSponsorshipInput } from '@/lib/sponsorship-api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Typography } from '@/components/ui/typography'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface FormData {
  brandName: string
  productService: string
  dealAmount: string
  priority: string
  contactName: string
  contactEmail: string
  contactPhone: string
  description: string
  deliverables: string
  targetAudience: string
  startDate: string
  endDate: string
  status: string
}

interface AddDealModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (deal: Sponsorship) => void
  initialDeal?: Sponsorship | null
}

const INITIAL_FORM_STATE: FormData = {
  brandName: '',
  productService: '',
  dealAmount: '',
  priority: 'medium',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  description: '',
  deliverables: '',
  targetAudience: '',
  startDate: '',
  endDate: '',
  status: 'pitch-received',
}

export default function AddDealModal({
  isOpen,
  onClose,
  onSubmit,
  initialDeal,
}: AddDealModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE)

  // Sync form data when modal opens with a deal to edit
  useEffect(() => {
    if (isOpen && initialDeal) {
      setFormData({
        brandName: initialDeal.brandName,
        productService: initialDeal.productService,
        dealAmount: initialDeal.dealAmount.toString(),
        priority: initialDeal.priority,
        contactName: initialDeal.contactName,
        contactEmail: initialDeal.contactEmail,
        contactPhone: initialDeal.contactPhone || '',
        description: initialDeal.description,
        deliverables: initialDeal.deliverables.join(', '),
        targetAudience: initialDeal.targetAudience || '',
        startDate: initialDeal.startDate.toISOString().split('T')[0],
        endDate: initialDeal.endDate.toISOString().split('T')[0],
        status: initialDeal.status,
      })
    } else if (isOpen) {
      setFormData(INITIAL_FORM_STATE)
    }
    setError(null)
  }, [isOpen, initialDeal])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Prepare the API input
      const apiInput: CreateSponsorshipInput = {
        brandName: formData.brandName,
        productService: formData.productService,
        dealAmount: parseFloat(formData.dealAmount),
        priority: formData.priority,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || undefined,
        description: formData.description,
        deliverables: formData.deliverables
          .split(',')
          .map((d) => d.trim())
          .filter((d) => d),
        targetAudience: formData.targetAudience || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      }

      let result: Sponsorship
      
      if (initialDeal) {
        // Update existing sponsorship
        result = await sponsorshipApi.updateSponsorship(initialDeal.id, apiInput)
      } else {
        // Create new sponsorship
        result = await sponsorshipApi.createSponsorship(apiInput)
      }

      // Call the onSubmit callback with the server response
      onSubmit(result)
      setFormData(INITIAL_FORM_STATE)
      setLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save sponsorship'
      setError(errorMessage)
      console.error('Error submitting sponsorship:', err)
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            {initialDeal ? 'Edit Sponsorship Deal' : 'Create New Sponsorship Deal'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded p-3 text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Brand & Deal Information */}
          <div className="space-y-4">
            <Typography variant="h4" className="text-white">
              Brand & Deal Information
            </Typography>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brandName" className="text-slate-200">
                  Brand/Company Name*
                </Label>
                <Input
                  id="brandName"
                  name="brandName"
                  placeholder="Enter brand name"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productService" className="text-slate-200">
                  Product/Service*
                </Label>
                <Input
                  id="productService"
                  name="productService"
                  placeholder="What is being sponsored?"
                  value={formData.productService}
                  onChange={handleInputChange}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dealAmount" className="text-slate-200">
                  Deal Value ($)*
                </Label>
                <Input
                  id="dealAmount"
                  name="dealAmount"
                  type="number"
                  placeholder="0.00"
                  value={formData.dealAmount}
                  onChange={handleInputChange}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-slate-200">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="high" className="text-white">
                      High
                    </SelectItem>
                    <SelectItem value="medium" className="text-white">
                      Medium
                    </SelectItem>
                    <SelectItem value="low" className="text-white">
                      Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="space-y-4">
            <Typography variant="h4" className="text-white">
              Contact Information
            </Typography>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-slate-200">
                  Contact Person Name*
                </Label>
                <Input
                  id="contactName"
                  name="contactName"
                  placeholder="Full name"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-slate-200">
                  Contact Email*
                </Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  placeholder="contact@brand.com"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="contactPhone" className="text-slate-200">
                  Contact Phone
                </Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  placeholder="(000) 000-0000"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Deal Terms & Deliverables */}
          <div className="space-y-4">
            <Typography variant="h4" className="text-white">
              Deal Terms & Deliverables
            </Typography>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-200">
                Deal Description*
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the sponsorship opportunity..."
                value={formData.description}
                onChange={handleInputChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 min-h-24"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliverables" className="text-slate-200">
                Deliverables (comma-separated)*
              </Label>
              <Textarea
                id="deliverables"
                name="deliverables"
                placeholder="E.g., 1x YouTube video, Instagram posts, TikTok series"
                value={formData.deliverables}
                onChange={handleInputChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 min-h-20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="text-slate-200">
                Target Audience
              </Label>
              <Input
                id="targetAudience"
                name="targetAudience"
                placeholder="Who is this sponsorship targeting?"
                value={formData.targetAudience}
                onChange={handleInputChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Section 4: Timeline & Dates */}
          <div className="space-y-4">
            <Typography variant="h4" className="text-white">
              Timeline & Dates
            </Typography>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-200">
                  Start Date*
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-slate-200">
                  End Date / Due Date*
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-slate-200">
                Starting Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="pitch-received" className="text-white">
                    Pitch Received
                  </SelectItem>
                  <SelectItem value="under-review" className="text-white">
                    Under Review
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading 
              ? (initialDeal ? 'Saving...' : 'Creating Deal...') 
              : (initialDeal ? 'Save Changes' : 'Create Deal')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
