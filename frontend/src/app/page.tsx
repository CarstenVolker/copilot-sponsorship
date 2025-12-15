'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <Typography variant="h4" className="text-white font-bold">
              Sponsorship Manager
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="ghost" className="text-slate-200 hover:text-white">
                Plans
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-slate-200 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Typography
            variant="h1"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Manage Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Sponsorship Deals
            </span>{' '}
            Effortlessly
          </Typography>
          <Typography
            variant="large"
            className="text-slate-300 text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
          >
            A modern Kanban board designed for content creators to organize,
            track, and manage their sponsorship pipeline from pitch to publication.
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg h-12 px-8"
              >
                Start Managing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-slate-600 hover:bg-slate-800 text-lg h-12 px-8"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <Typography variant="h2" className="text-3xl font-bold text-white mb-12 text-center">
            Key Features
          </Typography>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Kanban Board',
                description: '9-stage pipeline to track deals from pitch to completion',
              },
              {
                title: 'Deal Management',
                description: 'Comprehensive deal details, deliverables, and timeline tracking',
              },
              {
                title: 'Creator Dashboard',
                description: 'View your profile, subscriber count, and deal pipeline at a glance',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-slate-700/50 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors"
              >
                <Typography variant="h4" className="text-white mb-2">
                  {feature.title}
                </Typography>
                <Typography variant="muted" className="text-slate-300">
                  {feature.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Typography variant="h2" className="text-3xl font-bold text-white mb-6">
            Ready to streamline your sponsorships?
          </Typography>
          <Typography variant="large" className="text-slate-300 mb-8">
            Join creators who are managing their sponsorship deals more efficiently
          </Typography>
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg">
              Sign In to Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <Typography variant="small">
            © 2024 Sponsorship Manager. All rights reserved.
          </Typography>
        </div>
      </footer>
    </div>
  )
}
