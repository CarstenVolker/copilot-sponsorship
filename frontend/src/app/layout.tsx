import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { TokenInitializer } from '@/components/layout/TokenInitializer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sponsorship Manager',
  description: 'Manage your YouTube sponsorship deals with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TokenInitializer>{children}</TokenInitializer>
      </body>
    </html>
  )
}
