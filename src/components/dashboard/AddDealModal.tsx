'use client'

import { useState } from 'react'
import { Sponsorship } from '@/types/sponsorship'
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

interface AddDealModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (deal: Sponsorship) => void
}

export default function AddDealModal({
  isOpen,
  onClose,
  onSubmit,
}: AddDealModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
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
  })

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

    // Simulate submission
    setTimeout(() => {
      const newDeal: Sponsorship = {
        id: Date.now().toString(),
        brandName: formData.brandName,
        productService: formData.productService,
        dealAmount: parseFloat(formData.dealAmount),
        priority: formData.priority as 'high' | 'medium' | 'low',
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || undefined,
        description: formData.description,
        deliverables: formData.deliverables
          .split(',')
          .map((d) => d.trim())
          .filter((d) => d),
        targetAudience: formData.targetAudience || undefined,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        status: formData.status as any,
      }

      onSubmit(newDeal)
      setFormData({
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
      })
      setLoading(false)
    }, 500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            Create New Sponsorship Deal
          </DialogTitle>
        </DialogHeader>

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
            {loading ? 'Creating Deal...' : 'Create Deal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
