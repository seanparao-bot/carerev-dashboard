import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CareRev Dashboard',
  description: 'Main Experience Sheet & Regional Team Matrix',
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
