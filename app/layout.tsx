import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "616 Degrees of Separation",
  description: "Connect Marvel characters through comic book appearances in Earth-616",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "616 Degrees of Separation",
    startupImage: [
      {
        url: "/icons/icon-512x512.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/icons/icon-512x512.png",
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/icons/icon-512x512.png",
        media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "616 Degrees of Separation",
    title: "616 Degrees of Separation",
    description: "Connect Marvel characters through comic book appearances in Earth-616",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "616 Degrees of Separation",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "616 Degrees of Separation",
    description: "Connect Marvel characters through comic book appearances in Earth-616",
    images: ["/icons/icon-512x512.png"],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "616 Degrees",
    "application-name": "616 Degrees",
    "msapplication-TileColor": "#5B21B6",
    "msapplication-TileImage": "/icons/icon-144x144.png",
    "msapplication-config": "/browserconfig.xml",
    "msapplication-navbutton-color": "#5B21B6",
    "msapplication-starturl": "/",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#5B21B6" },
    { media: "(prefers-color-scheme: dark)", color: "#1E1B4B" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />

        {/* Apple Touch Icons - Regular */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />

        {/* Apple Splash Screens */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-square70x70logo" content="/icons/icon-72x72.png" />
        <meta name="msapplication-square150x150logo" content="/icons/icon-152x152.png" />
        <meta name="msapplication-square310x310logo" content="/icons/icon-384x384.png" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/service-worker.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                      
                      // Check for updates
                      registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available
                            if (confirm('New version available! Reload to update?')) {
                              window.location.reload();
                            }
                          }
                        });
                      });
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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
