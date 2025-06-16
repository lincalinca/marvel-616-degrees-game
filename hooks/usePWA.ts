"use client"

import { useState, useEffect } from "react"

export function usePWA() {
  const [isOnline, setIsOnline] = useState(true)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isIOSStandalone)
    }

    checkInstalled()

    // Online/offline detection
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Install prompt handling
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Check if user has completed enough games to show prompt
      const gamesCompleted = Number.parseInt(localStorage.getItem("gamesCompleted") || "0")
      const promptDismissed = localStorage.getItem("installPromptDismissed")
      const dismissedTime = promptDismissed ? Number.parseInt(promptDismissed) : 0
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)

      if (gamesCompleted >= 3 && daysSinceDismissed > 7) {
        setShowInstallPrompt(true)
      }
    }

    // Service worker update detection
    const handleServiceWorkerUpdate = () => {
      setUpdateAvailable(true)
    }

    // Register event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Check for service worker updates
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", handleServiceWorkerUpdate)
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("controllerchange", handleServiceWorkerUpdate)
      }
    }
  }, [])

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setShowInstallPrompt(false)
        localStorage.setItem("appInstalled", "true")
      }

      setDeferredPrompt(null)
    }
  }

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false)
    localStorage.setItem("installPromptDismissed", Date.now().toString())
  }

  const updateApp = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" })
          window.location.reload()
        }
      })
    }
  }

  // Track game completion for install prompt
  const trackGameCompletion = () => {
    const current = Number.parseInt(localStorage.getItem("gamesCompleted") || "0")
    localStorage.setItem("gamesCompleted", (current + 1).toString())
  }

  return {
    isOnline,
    showInstallPrompt,
    isInstalled,
    updateAvailable,
    handleInstallApp,
    dismissInstallPrompt,
    updateApp,
    trackGameCompletion,
  }
}
