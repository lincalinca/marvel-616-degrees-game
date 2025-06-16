// Debug utility for conditional logging
class DebugLogger {
  private enabled = true // FORCE ENABLE for debugging

  constructor() {
    // Only enable debug on client side
    if (typeof window !== "undefined") {
      this.enabled = localStorage.getItem("marvel-debug") === "true" || true // Force enable for now
      localStorage.setItem("marvel-debug", "true")

      // Make debug methods available globally for easy console access
      ;(window as any).marvelDebug = {
        enable: () => this.enable(),
        disable: () => this.disable(),
        toggle: () => this.toggle(),
        status: () => this.enabled,
      }

      console.log("🐛 Marvel Debug Mode FORCE ENABLED")
    } else {
      // Server-side: disable debug
      this.enabled = false
    }
  }

  enable() {
    this.enabled = true
    if (typeof window !== "undefined") {
      localStorage.setItem("marvel-debug", "true")
      console.log("🐛 Marvel Debug Mode ENABLED")
      console.log("Available commands:")
      console.log("  marvelDebug.disable() - Turn off debug logging")
      console.log("  marvelDebug.toggle() - Toggle debug logging")
      console.log("  marvelDebug.status() - Check current status")
    }
  }

  disable() {
    this.enabled = false
    if (typeof window !== "undefined") {
      localStorage.setItem("marvel-debug", "false")
      console.log("🔇 Marvel Debug Mode DISABLED")
    }
  }

  toggle() {
    if (this.enabled) {
      this.disable()
    } else {
      this.enable()
    }
    return this.enabled
  }

  log(emoji: string, message: string, ...args: any[]) {
    if (this.enabled) {
      console.log(`${emoji} ${message}`, ...args)
    }
  }

  error(message: string, ...args: any[]) {
    if (this.enabled) {
      console.error(`❌ ${message}`, ...args)
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.enabled) {
      console.warn(`⚠️ ${message}`, ...args)
    }
  }

  group(title: string) {
    if (this.enabled) {
      console.group(`🔍 ${title}`)
    }
  }

  groupEnd() {
    if (this.enabled) {
      console.groupEnd()
    }
  }
}

// Create singleton instance
export const debug = new DebugLogger()

// Helper function for quick debug checks
export const isDebugEnabled = () => debug.status?.() || false
