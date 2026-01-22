import type { Metadata, Viewport } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'AI News Aggregator',
  description: 'Discover trending AI/ML repositories from GitHub with AI-powered summaries',
  keywords: ['AI', 'Machine Learning', 'GitHub', 'Repositories', 'News'],
  authors: [{ name: 'AI News Aggregator' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}