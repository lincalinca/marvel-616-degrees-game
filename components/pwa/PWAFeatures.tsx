"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Download, RotateCcw, Share2 } from "lucide-react"

export function PWAFeatures() {
  const [isOnline, setIsOnline] = useState(true)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    // Check if app is installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isIOSStandalone)
    }
    checkInstalled()

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPromptEvent(e)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPromptEvent(null)
    }

    // Service worker update detection
    const handleServiceWorkerUpdate = () => {
      setUpdateAvailable(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Check for service worker updates
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", handleServiceWorkerUpdate)
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("controllerchange", handleServiceWorkerUpdate)
      }
    }
  }, [])

  const handleInstall = async () => {
    if (installPromptEvent) {
      installPromptEvent.prompt()
      const { outcome } = await installPromptEvent.userChoice

      if (outcome === "accepted") {
        setInstallPromptEvent(null)
      }
    }
  }

  const handleUpdate = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" })
          window.location.reload()
        }
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "616 Degrees of Separation",
          text: "Connect Marvel characters through comic book appearances!",
          url: window.location.origin,
        })
      } catch (error) {
        console.log("Share cancelled or failed")
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.origin)
    }
  }

  return (
    <div className="space-y-2">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Badge variant="outline" className="border-green-500 text-green-400">
            <Wifi className="h-3 w-3 mr-1" />
            Online
          </Badge>
        ) : (
          <Badge variant="outline" className="border-red-500 text-red-400">
            <WifiOff className="h-3 w-3 mr-1" />
            Offline
          </Badge>
        )}

        {isInstalled && (
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            <Download className="h-3 w-3 mr-1" />
            Installed
          </Badge>
        )}
      </div>

      {/* Update Available */}
      {updateAvailable && (
        <GlassCard className="p-3 border-blue-500/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-blue-400" />
              <span className="text-white text-sm">Update available</span>
            </div>
            <Button onClick={handleUpdate} size="sm" className="bg-blue-600 hover:bg-blue-700">
              Update
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Install Prompt */}
      {installPromptEvent && !isInstalled && (
        <GlassCard className="p-3 border-purple-500/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-purple-400" />
              <span className="text-white text-sm">Install app</span>
            </div>
            <Button onClick={handleInstall} size="sm" className="bg-purple-600 hover:bg-purple-700">
              Install
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Share Button */}
      <Button
        onClick={handleShare}
        variant="ghost"
        size="sm"
        className="w-full text-white/80 hover:text-white hover:bg-white/10"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share App
      </Button>
    </div>
  )
}
