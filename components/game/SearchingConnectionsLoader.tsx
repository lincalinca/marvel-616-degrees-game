import { GlassCard } from "@/components/ui/glass-card"

export function SearchingConnectionsLoader() {
  return (
    <GlassCard className="p-6 mb-6">
      <div className="text-center">
        <div className="relative mb-4">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-purple-500 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-white font-semibold text-lg mb-2">Searching the Multiverse...</p>
        <p className="text-white/60 text-sm">Finding comic connections across Earth-616... and beyond</p>
      </div>
    </GlassCard>
  )
}
