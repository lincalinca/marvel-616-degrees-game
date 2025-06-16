"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Download, X, Smartphone } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [gamesCompleted, setGamesCompleted] = useState(0)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches
    setIsStandalone(standalone)

    // Get games completed from localStorage
    const completed = Number.parseInt(localStorage.getItem("gamesCompleted") || "0")
    setGamesCompleted(completed)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after 3 completed games
      if (completed >= 3 && !standalone) {
        setShowPrompt(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // For iOS, show manual install instructions after 3 games
    if (iOS && !standalone && completed >= 3) {
      setShowPrompt(true)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
      localStorage.setItem("installPromptShown", "true")
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("installPromptDismissed", Date.now().toString())
  }

  // Don't show if already installed or dismissed recently
  if (isStandalone || !showPrompt) return null

  const dismissedTime = localStorage.getItem("installPromptDismissed")
  if (dismissedTime && Date.now() - Number.parseInt(dismissedTime) < 7 * 24 * 60 * 60 * 1000) {
    return null // Don't show for 7 days after dismissal
  }

  return (
    <GlassCard className="fixed bottom-4 left-4 right-4 z-50 p-4 border-purple-500/50 bg-purple-900/90">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {isIOS ? (
            <Smartphone className="h-6 w-6 text-purple-400" />
          ) : (
            <Download className="h-6 w-6 text-purple-400" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">Install 616 Degrees</h3>

          {isIOS ? (
            <div className="text-white/80 text-sm space-y-2">
              <p>Add to your home screen for the best experience:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>
                  Tap the Share button{" "}
                  <span className="inline-block w-4 h-4 bg-blue-500 rounded text-center text-white text-xs">↗</span>
                </li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </div>
          ) : (
            <p className="text-white/80 text-sm mb-3">Get faster access and offline play by installing the app!</p>
          )}

          <div className="flex gap-2 mt-3">
            {!isIOS && deferredPrompt && (
              <Button onClick={handleInstall} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Download className="h-4 w-4 mr-1" />
                Install App
              </Button>
            )}

            <Button
              onClick={handleDismiss}
              size="sm"
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              Maybe Later
            </Button>
          </div>
        </div>

        <Button
          onClick={handleDismiss}
          size="sm"
          variant="ghost"
          className="flex-shrink-0 text-white/60 hover:text-white hover:bg-white/10 p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </GlassCard>
  )
}
