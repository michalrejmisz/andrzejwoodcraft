import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Warsztat Andrzeja - Kalkulator Drewna',
  description:
    'Kalkulator objętości i kosztu elementów drewnianych dla stolarzy. Szybko oblicz ile drewna potrzebujesz i ile to będzie kosztować.',
  keywords: ['kalkulator drewna', 'objętość drewna', 'koszt drewna', 'stolarz', 'kalkulacja'],
  authors: [{ name: 'Warsztat Andrzeja' }],
  creator: 'Warsztat Andrzeja',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Warsztat Andrzeja',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Warsztat Andrzeja',
    title: 'Warsztat Andrzeja - Kalkulator Drewna',
    description: 'Kalkulator objętości i kosztu elementów drewnianych dla stolarzy',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#16a34a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Warsztat Andrzeja" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
      </body>
    </html>
  )
}
