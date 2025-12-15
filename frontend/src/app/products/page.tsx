'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Check, ArrowRight, Loader2 } from 'lucide-react'

interface ProductFeature {
  name: string
  included: boolean
}

interface Product {
  name: string
  price: string
  description: string
  features: ProductFeature[]
  highlighted?: boolean
}

const PRODUCTS: Product[] = [
  {
    name: 'Base Product',
    price: '$29',
    description: 'Perfect for getting started with sponsorship management',
    features: [
      { name: 'Up to 10 active deals', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Email support', included: true },
      { name: 'Status tracking', included: true },
      { name: 'Contact management', included: true },
      { name: 'Advanced reporting', included: false },
      { name: 'Priority support', included: false },
      { name: 'Unlimited deals', included: false },
    ],
  },
  {
    name: 'Pro Product',
    price: '$99',
    description: 'Advanced features for growing creators',
    features: [
      { name: 'Unlimited active deals', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority email & phone support', included: true },
      { name: 'Status tracking', included: true },
      { name: 'Contact management', included: true },
      { name: 'Advanced reporting', included: true },
      { name: 'Priority support', included: true },
      { name: 'API access', included: true },
    ],
    highlighted: true,
  },
]

export default function ProductsPage() {
  const router = useRouter()
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async (productName: string, price: string) => {
    try {
      setLoadingProduct(productName)
      setError(null)

      // Check if user is authenticated
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      if (!token) {
        // Redirect to login if not authenticated
        router.push('/login?redirect=/products')
        return
      }

      // Call frontend API route which proxies to backend
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productName,
          price,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error?.message || 'Failed to create checkout session')
      }

      const data = await response.json()
      console.log('[Products Page] API Response:', data)
      const checkoutUrl = data?.checkoutUrl
      console.log('[Products Page] Checkout URL:', checkoutUrl)

      // Redirect to the Stripe checkout URL
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        throw new Error(`No checkout URL returned from server. Response: ${JSON.stringify(data)}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Checkout failed'
      setError(message)
      console.error('Checkout error:', err)
    } finally {
      setLoadingProduct(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">SM</span>
              </div>
              <Typography variant="h4" className="text-white font-bold">
                Sponsorship Manager
              </Typography>
            </div>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Typography variant="h2" className="text-white text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="p" className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Choose the perfect plan for your sponsorship management needs. All plans include access to our dashboard and core features.
          </Typography>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded p-4 text-red-200 text-sm mb-8 max-w-5xl mx-auto">
              {error}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {PRODUCTS.map((product) => (
              <div
                key={product.name}
                className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                  product.highlighted
                    ? 'ring-2 ring-blue-500 transform md:scale-105 shadow-2xl shadow-blue-500/20'
                    : 'border border-slate-700'
                }`}
              >
                {/* Card Background */}
                <div
                  className={`p-8 ${
                    product.highlighted
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900'
                      : 'bg-slate-800/50'
                  }`}
                >
                  {/* Featured Badge */}
                  {product.highlighted && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                      Most Popular
                    </div>
                  )}

                  {/* Product Header */}
                  <div className="mb-6">
                    <Typography variant="h3" className="text-white text-2xl font-bold mb-2">
                      {product.name}
                    </Typography>
                    <Typography variant="p" className="text-slate-400 mb-4">
                      {product.description}
                    </Typography>
                    <div className="flex items-baseline gap-1 mb-4">
                      <Typography variant="h2" className="text-white font-bold">
                        {product.price}
                      </Typography>
                      <Typography variant="small" className="text-slate-400">
                        /month
                      </Typography>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleCheckout(product.name, product.price)}
                    disabled={loadingProduct === product.name}
                    className={`w-full mb-8 font-semibold ${
                      product.highlighted
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {loadingProduct === product.name ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {/* Features List */}
                  <div className="space-y-3">
                    <Typography variant="small" className="text-slate-400 font-semibold uppercase tracking-wide">
                      What's included
                    </Typography>
                    <div className="space-y-3">
                      {product.features.map((feature) => (
                        <div key={feature.name} className="flex items-center gap-3">
                          <div
                            className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                              feature.included ? 'bg-blue-600' : 'bg-slate-700'
                            }`}
                          >
                            {feature.included && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <Typography
                            variant="small"
                            className={feature.included ? 'text-slate-300' : 'text-slate-500 line-through'}
                          >
                            {feature.name}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-700">
        <div className="max-w-3xl mx-auto">
          <Typography variant="h3" className="text-white text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </Typography>

          <div className="space-y-6">
            {[
              {
                question: 'Can I upgrade or downgrade anytime?',
                answer:
                  'Yes! You can change your plan anytime. Changes take effect at the next billing cycle.',
              },
              {
                question: 'Is there a free trial?',
                answer:
                  'We offer a 14-day free trial on both plans so you can explore all features before committing.',
              },
              {
                question: 'What payment methods do you accept?',
                answer:
                  'We accept all major credit cards, PayPal, and bank transfers for annual plans.',
              },
              {
                question: 'Do you offer refunds?',
                answer:
                  "We offer a 30-day money-back guarantee if you're not satisfied with the service.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <Typography variant="h4" className="text-white font-semibold mb-2">
                  {item.question}
                </Typography>
                <Typography variant="p" className="text-slate-400">
                  {item.answer}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-t border-slate-700">
        <div className="max-w-3xl mx-auto text-center">
          <Typography variant="h3" className="text-white text-2xl font-bold mb-4">
            Ready to manage your sponsorships?
          </Typography>
          <Typography variant="p" className="text-slate-400 mb-8">
            Choose a plan and start managing your deals today.
          </Typography>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-2"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
