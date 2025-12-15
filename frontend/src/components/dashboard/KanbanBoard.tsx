'use client'

import { useState } from 'react'
import { Sponsorship, SponsorshipStatus } from '@/types/sponsorship'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Eye, GripVertical } from 'lucide-react'
import DealDetailsModal from './DealDetailsModal'

const COLUMNS: { id: SponsorshipStatus; title: string }[] = [
  { id: 'pitch-received', title: 'Pitch Received' },
  { id: 'under-review', title: 'Under Review' },
  { id: 'negotiating', title: 'Negotiating' },
  { id: 'approved', title: 'Approved' },
  { id: 'contracted', title: 'Contracted' },
  { id: 'content-creation', title: 'Content Creation' },
  { id: 'awaiting-review', title: 'Awaiting Review' },
  { id: 'published', title: 'Published' },
  { id: 'completed', title: 'Completed/Archived' },
]

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-600',
  medium: 'bg-yellow-600',
  low: 'bg-green-600',
}

interface KanbanBoardProps {
  sponsorships: Sponsorship[]
  onEditDeal?: (deal: Sponsorship) => void
  onUpdateDealStatus?: (dealId: string, newStatus: SponsorshipStatus) => void
}

export default function KanbanBoard({ sponsorships, onEditDeal, onUpdateDealStatus }: KanbanBoardProps) {
  const [selectedDeal, setSelectedDeal] = useState<Sponsorship | null>(null)
  const [draggedDeal, setDraggedDeal] = useState<Sponsorship | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<SponsorshipStatus | null>(null)

  const getSponsorshipsByStatus = (status: SponsorshipStatus) => {
    return sponsorships.filter((s) => s.status === status)
  }

  const handleDragStart = (e: React.DragEvent, deal: Sponsorship) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (columnId: SponsorshipStatus) => {
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, columnId: SponsorshipStatus) => {
    e.preventDefault()
    if (draggedDeal && draggedDeal.status !== columnId) {
      onUpdateDealStatus?.(draggedDeal.id, columnId)
    }
    setDraggedDeal(null)
    setDragOverColumn(null)
  }

  return (
    <>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">
          {COLUMNS.map((column) => {
            const columnSponsors = getSponsorshipsByStatus(column.id)
            const isOver = dragOverColumn === column.id
            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                {/* Column Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Typography variant="h4" className="text-white">
                      {column.title}
                    </Typography>
                    <Badge
                      variant="secondary"
                      className="bg-slate-700 text-slate-200"
                    >
                      {columnSponsors.length}
                    </Badge>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </div>

                {/* Cards Container - Drop Zone */}
                <div
                  className={`space-y-3 min-h-96 p-2 rounded-lg transition-colors ${
                    isOver ? 'bg-slate-600/50 border-2 border-dashed border-blue-400' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={() => handleDragEnter(column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  {columnSponsors.length === 0 ? (
                    <div className="text-center py-8">
                      <Typography variant="muted" className="text-slate-400">
                        No deals
                      </Typography>
                    </div>
                  ) : (
                    columnSponsors.map((sponsor) => (
                      <div
                        key={sponsor.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, sponsor)}
                        className="group cursor-move"
                      >
                        <Card className={`bg-slate-700 border-slate-600 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 ${
                          draggedDeal?.id === sponsor.id ? 'opacity-50' : ''
                        }`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base text-white truncate">
                                  {sponsor.brandName}
                                </CardTitle>
                                <Typography
                                  variant="small"
                                  className="text-slate-300 truncate"
                                >
                                  {sponsor.productService}
                                </Typography>
                              </div>
                              <GripVertical className="h-4 w-4 text-slate-500 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                            </div>
                          </CardHeader>

                          <CardContent className="pb-3">
                            <div className="space-y-3">
                              {/* Priority Badge */}
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`${
                                    PRIORITY_COLORS[sponsor.priority]
                                  } text-white border-0`}
                                >
                                  {sponsor.priority.charAt(0).toUpperCase() +
                                    sponsor.priority.slice(1)}{' '}
                                  Priority
                                </Badge>
                              </div>

                              {/* Deal Amount */}
                              <div className="flex justify-between items-center">
                                <Typography
                                  variant="small"
                                  className="text-slate-400"
                                >
                                  Deal Value
                                </Typography>
                                <Typography
                                  variant="small"
                                  className="text-green-400 font-semibold"
                                >
                                  ${sponsor.dealAmount.toLocaleString()}
                                </Typography>
                              </div>

                              {/* Contact */}
                              <div className="flex justify-between items-center">
                                <Typography
                                  variant="small"
                                  className="text-slate-400"
                                >
                                  Contact
                                </Typography>
                                <Typography
                                  variant="small"
                                  className="text-slate-200"
                                >
                                  {sponsor.contactName}
                                </Typography>
                              </div>

                              {/* Due Date */}
                              <div className="flex justify-between items-center">
                                <Typography
                                  variant="small"
                                  className="text-slate-400"
                                >
                                  Due Date
                                </Typography>
                                <Typography
                                  variant="small"
                                  className="text-slate-200"
                                >
                                  {sponsor.endDate.toLocaleDateString()}
                                </Typography>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600"
                              onClick={() => setSelectedDeal(sponsor)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-slate-400 hover:text-white"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-slate-700 border-slate-600"
                              >
                                <DropdownMenuItem className="text-slate-200 hover:bg-slate-600 cursor-pointer">
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-slate-200 hover:bg-slate-600 cursor-pointer">
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 hover:bg-slate-600 cursor-pointer">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </CardFooter>
                        </Card>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Deal Details Modal */}
      <DealDetailsModal
        deal={selectedDeal}
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        onEdit={onEditDeal}
        onStatusChange={(updatedDeal) => {
          setSelectedDeal(updatedDeal)
          onUpdateDealStatus?.(updatedDeal.id, updatedDeal.status as SponsorshipStatus)
        }}
      />
    </>
  )
}
