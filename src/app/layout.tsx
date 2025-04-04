import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import Providers from '@/components/Providers'
import Script from 'next/script'

// Import styles
import 'mapbox-gl/dist/mapbox-gl.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Red Points',
  description: 'Hệ thống báo cáo điểm đen giao thông',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="vi">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet" />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      </head>
      <body className={inter.className}>
        <Providers session={session}>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  )
} 