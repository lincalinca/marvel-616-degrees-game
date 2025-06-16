import Image from "next/image"

interface PullToRefreshIndicatorProps {
  isPulling: boolean
  pullDistance: number
  isMobile: boolean
}

export function PullToRefreshIndicator({ isPulling, pullDistance, isMobile }: PullToRefreshIndicatorProps) {
  if (!isPulling || !isMobile) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center text-white transition-all duration-200 relative overflow-hidden"
      style={{
        height: `${Math.min(pullDistance, 80)}px`,
        transform: `translateY(${pullDistance > 80 ? 0 : pullDistance - 80}px)`,
      }}
    >
      <div className="absolute inset-0">
        <Image
          src="/images/comic-pages-texture.png"
          alt="Comic pages"
          fill
          className="object-cover opacity-90"
          style={{ objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 to-purple-800/80" />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <div
          className={`animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full ${pullDistance > 80 ? "opacity-100" : "opacity-60"}`}
        />
        <span
          className="text-sm font-bold text-white drop-shadow-lg"
          style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Bradley Hand', cursive" }}
        >
          {pullDistance > 80 ? "Release for Next Quest!" : "Pull for Next Quest!"}
        </span>
      </div>
    </div>
  )
}
