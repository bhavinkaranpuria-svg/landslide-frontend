import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { TopBar } from '@/components/top-bar'
import { BottomNav } from '@/components/bottom-nav'
import { OfflineBanner } from '@/components/offline-banner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BhuChetna — Landslide Early Warning (North East)',
  description:
    'AI-based landslide early warning and disaster management platform for the North Eastern Region: real-time GIS risk heatmaps, predictive analytics, multilingual alerts, and offline field reporting.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#0e5a52',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
        style={{
          ['--font-sans' as string]: 'var(--font-inter)',
          ['--font-display' as string]: 'var(--font-space-grotesk)',
        }}
      >
        <Providers>
          <div className="flex min-h-dvh flex-col">
            <TopBar />
            <OfflineBanner />
            <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-6 pt-4">{children}</main>
            <BottomNav />
          </div>
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
