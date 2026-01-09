import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Filipa & Duarte — Comporta 2026',
  description: 'A relaxed weekend by the beach — with plenty of music. September 12, 2026.',
  openGraph: {
    title: 'Filipa & Duarte — Comporta 2026',
    description: 'A relaxed weekend by the beach — with plenty of music.',
    type: 'website',
  },
  robots: {
    index: false, // noindex per privacy guidelines
    follow: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-linen text-ink font-sans antialiased">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
