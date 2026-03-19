import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Curaduría · Guía cultural de Bogotá',
  description: 'Una guía cultural abierta que articula un mapa, un catálogo y un marketplace para conectar públicos, creadores y gestores culturales.',
  openGraph: {
    title: 'La Curaduría',
    description: 'Guía cultural abierta de música, arte y cultura · Bogotá',
    url: 'https://lacuraduria.net',
    siteName: 'La Curaduría',
    locale: 'es_CO',
    type: 'website',
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
