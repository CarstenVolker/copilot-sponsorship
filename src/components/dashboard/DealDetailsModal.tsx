'use client'

import { Sponsorship } from '@/types/sponsorship'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Edit, Trash2, Download } from 'lucide-react'

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-600',
  medium: 'bg-yellow-600',
  low: 'bg-green-600',
}

const STATUS_LABELS: Record<string, string> = {
  'pitch-received': 'Pitch Received',
  'under-review': 'Under Review',
  'negotiating': 'Negotiating',
  'approved': 'Approved',
  'contracted': 'Contracted',
  'content-creation': 'Content Creation',
  'awaiting-review': 'Awaiting Review',
  'published': 'Published',
  'completed': 'Completed/Archived',
}

interface DealDetailsModalProps {
  deal: Sponsorship | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (deal: Sponsorship) => void
}

export default function DealDetailsModal({
  deal,
  isOpen,
  onClose,
  onEdit,
}: DealDetailsModalProps) {
  if (!deal) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{deal.brandName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Deal Overview */}
          <div className="space-y-4">
            <Typography variant="h4" className="text-white">
              Deal Overview
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="small" className="text-slate-400">
                  Brand Name
                </Typography>
                <Typography variant="p" className="text-white mt-1">
                  {deal.brandName}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-slate-400">
                  Product/Service
                </Typography>
                <Typography variant="p" className="text-white mt-1">
                  {deal.productService}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-slate-400">
                  Deal Value
                </Typography>
                <Typography variant="p" className="text-green-400 font-semibold mt-1">
                  ${deal.dealAmount.toLocaleString()}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-slate-400">
                  Priority
                </Typography>
                <div className="mt-1">
                  <Badge
                    className={`${
                      PRIORITY_COLORS[deal.priority]
                    } text-white border-0`}
                  >
                    {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <Typography variant="h4" className="text-white">
              Contact Information
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="small" className="text-slate-400">
                  Contact Name
                </Typography>
                <Typography variant="p" className="text-white mt-1">
                  {deal.contactName}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-slate-400">
                  Email
                </Typography>
                <Typography variant="p" className="text-white mt-1">
                  {deal.contactEmail}
                </Typography>
              </div>
              {deal.contactPhone && (
                <div>
                  <Typography variant="small" className="text-slate-400">
                    Phone
                  </Typography>
                  <Typography variant="p" className="text-white mt-1">
                    {deal.contactPhone}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {/* Deal Details */}
          <div className="space-y-4">
            <Typography variant="h4" className="text-white">
              Deal Details
            </Typography>
            <div>
              <Typography variant="small" className="text-slate-400">
                Description
              </Typography>
              <Typography variant="p" className="text-white mt-2">
                {deal.description}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="text-slate-400">
                Deliverables
              </Typography>
              <div className="flex flex-wrap gap-2 mt-2">
                {deal.deliverables.map((d, i) => (
                  <Badge key={i} variant="secondary" className="bg-slate-700 text-slate-200">
                    {d}
                  </Badge>
                ))}
              </div>
            </div>
            {deal.targetAudience && (
              <div>
                <Typography variant="small" className="text-slate-400">
                  Target Audience
                </Typography>
                <Typography variant="p" className="text-white mt-1">
                  {deal.targetAudience}
                </Typography>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <Typography variant="h4" className="text-white">
              Timeline
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="small" className="text-slate-400">
                  Start Date
                </Typography>
                <Typography variant="p" className="text-white mt-1">
                  {deal.startDate.toLocaleDateString()}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-slate-400">
                  End Date
                </Typography>
                <Typography variant="p" className="text-white mt-1">
                  {deal.endDate.toLocaleDateString()}
                </Typography>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <Typography variant="h4" className="text-white">
              Status
            </Typography>
            <div>
              <Typography variant="small" className="text-slate-400 mb-2 block">
                Current Status
              </Typography>
              <Badge className="bg-blue-600 text-white">
                {STATUS_LABELS[deal.status]}
              </Badge>
            </div>
            <div>
              <Typography variant="small" className="text-slate-400 mb-2 block">
                Move to Status
              </Typography>
              <Select defaultValue={deal.status}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="text-white">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              onEdit?.(deal)
              onClose()
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Deal
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
