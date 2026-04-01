import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'La Curaduría · Investor Hub',
  description: 'Guía cultural abierta de música, arte y cultura. Ronda pre-semilla 2026.',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
