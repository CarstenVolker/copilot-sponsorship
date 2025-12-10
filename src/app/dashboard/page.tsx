'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Typography } from '@/components/ui/typography'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSponsorships } from '@/hooks/useSponsorships'
import KanbanBoard from '@/components/dashboard/KanbanBoard'
import AddDealModal from '@/components/dashboard/AddDealModal'
import { Search, Settings, LogOut, Filter } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { sponsorships, addSponsorship } = useSponsorships()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDealOpen, setIsAddDealOpen] = useState(false)

  const handleLogout = () => {
    router.push('/')
  }

  const filteredSponsorsips = sponsorships.filter((s) =>
    s.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">SM</span>
              </div>
              <div>
                <Typography variant="h4" className="text-white font-bold truncate">
                  Sponsorship Pipeline
                </Typography>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Profile and Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsAddDealOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add New Deal
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-300">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback className="bg-blue-600 text-white">
                        CD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <div className="px-2 py-1.5">
                    <Typography variant="small" className="text-white font-medium">
                      Creator Dashboard
                    </Typography>
                    <Typography variant="small" className="text-slate-400">
                      creator@example.com
                    </Typography>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem className="text-slate-200 hover:bg-slate-700 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-slate-200 hover:bg-slate-700 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Creator Profile Section */}
          <div className="mt-4 flex items-center gap-4 pb-4 border-b border-slate-700">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-blue-600 text-white text-lg">
                CD
              </AvatarFallback>
            </Avatar>
            <div>
              <Typography variant="h4" className="text-white">
                Creator Name
              </Typography>
              <Typography variant="small" className="text-slate-400">
                📺 1.2M Subscribers
              </Typography>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Deals', value: filteredSponsorsips.length, color: 'bg-blue-600' },
            { label: 'Pending Approval', value: 2, color: 'bg-yellow-600' },
            { label: 'Completed', value: 8, color: 'bg-green-600' },
            { label: 'Pipeline Value', value: '$45.5K', color: 'bg-purple-600' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-colors"
            >
              <Typography variant="small" className="text-slate-400">
                {stat.label}
              </Typography>
              <Typography variant="h3" className="text-white mt-2">
                {stat.value}
              </Typography>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <KanbanBoard sponsorships={filteredSponsorsips} />
        </div>
      </main>

      {/* Add Deal Modal */}
      <AddDealModal
        isOpen={isAddDealOpen}
        onClose={() => setIsAddDealOpen(false)}
        onSubmit={(deal) => {
          addSponsorship(deal)
          setIsAddDealOpen(false)
        }}
      />
    </div>
  )
}
