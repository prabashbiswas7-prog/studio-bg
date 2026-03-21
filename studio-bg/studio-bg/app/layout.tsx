import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Studio BG — Free Background Generator',
  description: 'Generate beautiful backgrounds free. Mesh gradients, noise, patterns, SVG. Download PNG, JPEG, WebP instantly.',
  keywords: 'background generator, gradient generator, mesh gradient, perlin noise, free download',
  openGraph: {
    title: 'Studio BG — Free Background Generator',
    description: 'Generate beautiful backgrounds free. Download PNG, JPEG, WebP instantly.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-bg text-t1 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
