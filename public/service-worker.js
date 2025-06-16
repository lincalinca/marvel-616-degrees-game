// 616 Degrees of Separation Service Worker - Enhanced for PWA compliance
// Version 2.1 - Full PWA Support with Maskable Icons

importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js")

const CACHE_NAME = "616degrees-v2.1"
const OFFLINE_PAGE = "/offline.html"
const MARVEL_API_CACHE = "marvel-api-v2"
const IMAGES_CACHE = "images-v2"

// Files to cache for offline functionality
const STATIC_CACHE_URLS = [
  "/",
  "/marvel-game",
  "/offline.html",
  "/images/616degrees-logo.png",
  "/images/comic-pages-texture.png",
  "/manifest.json",
  // Cache all regular icon sizes
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
  // Cache all maskable icon sizes
  "/icons/maskable/icon-72x72-maskable.png",
  "/icons/maskable/icon-96x96-maskable.png",
  "/icons/maskable/icon-128x128-maskable.png",
  "/icons/maskable/icon-144x144-maskable.png",
  "/icons/maskable/icon-152x152-maskable.png",
  "/icons/maskable/icon-192x192-maskable.png",
  "/icons/maskable/icon-384x384-maskable.png",
  "/icons/maskable/icon-512x512-maskable.png",
]

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})

// Install event - cache static assets
self.addEventListener("install", async (event) => {
  console.log("616 Degrees Service Worker v2.1 installing...")
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches
        .open(CACHE_NAME)
        .then((cache) => {
          console.log("Caching static assets including maskable icons")
          return cache.addAll(STATIC_CACHE_URLS)
        }),
      // Skip waiting to activate immediately
      self.skipWaiting(),
    ]).catch((error) => {
      console.error("Failed to cache static assets:", error)
    }),
  )
})

// Activate event - clean up old caches and claim clients
self.addEventListener("activate", (event) => {
  console.log("616 Degrees Service Worker v2.1 activating...")
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (
                cacheName !== CACHE_NAME &&
                cacheName !== MARVEL_API_CACHE &&
                cacheName !== IMAGES_CACHE &&
                cacheName.startsWith("616degrees-")
              ) {
                console.log("Deleting old cache:", cacheName)
                return caches.delete(cacheName)
              }
            }),
          )
        }),
      // Claim all clients
      self.clients.claim(),
    ]),
  )
})

// Enable navigation preload if supported
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable()
}

// Fetch event - handle requests with advanced caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle navigation requests (page loads)
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Try preload response first
          const preloadResp = await event.preloadResponse
          if (preloadResp) {
            return preloadResp
          }

          // Try network with timeout
          const networkResp = await Promise.race([
            fetch(request),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Network timeout")), 5000)),
          ])

          return networkResp
        } catch (error) {
          console.log("Network failed for navigation, serving offline page")
          // Serve offline page
          const cache = await caches.open(CACHE_NAME)
          const cachedResp = await cache.match(OFFLINE_PAGE)
          return (
            cachedResp ||
            new Response("Offline - Please check your connection", {
              status: 503,
              headers: { "Content-Type": "text/html" },
            })
          )
        }
      })(),
    )
  }

  // Handle Marvel API requests with network-first strategy
  else if (url.pathname.includes("/api/marvel/")) {
    event.respondWith(
      (async () => {
        try {
          // Try network first for fresh data
          const networkResp = await fetch(request)

          // Cache successful responses
          if (networkResp.ok) {
            const cache = await caches.open(MARVEL_API_CACHE)
            // Clone response before caching
            cache.put(request, networkResp.clone())
          }

          return networkResp
        } catch (error) {
          // Fallback to cache
          const cache = await caches.open(MARVEL_API_CACHE)
          const cachedResp = await cache.match(request)

          if (cachedResp) {
            console.log("Serving Marvel API from cache:", url.pathname)
            return cachedResp
          }

          // Return error response if no cache available
          return new Response(
            JSON.stringify({
              error: "Offline - No cached data available",
              offline: true,
            }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            },
          )
        }
      })(),
    )
  }

  // Handle images with cache-first strategy (including maskable icons)
  else if (
    request.destination === "image" ||
    url.pathname.includes("/icons/") ||
    url.pathname.includes("/icons/maskable/") ||
    url.pathname.includes("/images/") ||
    url.pathname.includes("/screenshots/")
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(IMAGES_CACHE)
        const cachedResp = await cache.match(request)

        if (cachedResp) {
          return cachedResp
        }

        try {
          const networkResp = await fetch(request)
          if (networkResp.ok) {
            // Cache successful image responses
            cache.put(request, networkResp.clone())
          }
          return networkResp
        } catch (error) {
          console.log("Failed to fetch image:", url.pathname)
          // Return a placeholder or empty response for failed images
          return new Response("", { status: 404 })
        }
      })(),
    )
  }

  // Handle static assets (CSS, JS) with cache-first strategy
  else if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    url.pathname.includes("/_next/static/")
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME)
        const cachedResp = await cache.match(request)

        if (cachedResp) {
          return cachedResp
        }

        try {
          const networkResp = await fetch(request)
          if (networkResp.ok) {
            cache.put(request, networkResp.clone())
          }
          return networkResp
        } catch (error) {
          console.log("Failed to fetch static asset:", url.pathname)
          return new Response("Asset not available offline", { status: 404 })
        }
      })(),
    )
  }

  // Handle manifest.json specifically
  else if (url.pathname === "/manifest.json") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME)
        const cachedResp = await cache.match(request)

        if (cachedResp) {
          return cachedResp
        }

        try {
          const networkResp = await fetch(request)
          if (networkResp.ok) {
            cache.put(request, networkResp.clone())
          }
          return networkResp
        } catch (error) {
          return new Response("Manifest not available", { status: 404 })
        }
      })(),
    )
  }
})

// Background sync for game data (when online again)
self.addEventListener("sync", (event) => {
  if (event.tag === "game-data-sync") {
    event.waitUntil(syncGameData())
  }
})

// Push notification handling (for future features)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/maskable/icon-72x72-maskable.png", // Use maskable for badge
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || "default",
      },
      actions: [
        {
          action: "explore",
          title: "Play Now",
          icon: "/icons/maskable/icon-72x72-maskable.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/icons/maskable/icon-72x72-maskable.png",
        },
      ],
    }

    event.waitUntil(self.registration.showNotification(data.title || "616 Degrees", options))
  }
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/marvel-game"))
  } else if (event.action === "close") {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"))
  }
})

async function syncGameData() {
  // Sync any pending game data when connection is restored
  console.log("Syncing game data...")
  try {
    // Check if there's pending data in IndexedDB or localStorage
    const pendingData = localStorage.getItem("pendingGameData")
    if (pendingData) {
      // Send to server
      const response = await fetch("/api/sync-game-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: pendingData,
      })

      if (response.ok) {
        localStorage.removeItem("pendingGameData")
        console.log("Game data synced successfully")
      }
    }
  } catch (error) {
    console.error("Failed to sync game data:", error)
  }
}

// Cache size management
async function cleanupCaches() {
  const cacheKeys = await caches.keys()
  for (const cacheName of cacheKeys) {
    const cache = await caches.open(cacheName)
    const requests = await cache.keys()

    // Keep only the 50 most recent entries per cache
    if (requests.length > 50) {
      const oldRequests = requests.slice(0, requests.length - 50)
      for (const request of oldRequests) {
        await cache.delete(request)
      }
    }
  }
}

// Run cleanup periodically
setInterval(cleanupCaches, 24 * 60 * 60 * 1000) // Once per day
