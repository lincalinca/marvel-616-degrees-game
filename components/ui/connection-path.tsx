"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ComicFrame } from "@/components/ui/comic-frame"
import { GlassCard } from "@/components/ui/glass-card"
import { ExternalLink, Share2, Copy } from "lucide-react"
import type { PathSegment, MarvelComic } from "@/types/marvel-types"

interface ConnectionPathProps {
  currentPath: PathSegment[]
  onShare?: () => void
  onCopyToClipboard?: () => void
}

function getMarvelComicUrl(comic: MarvelComic): string {
  const baseTitle = comic.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  const issueNumber = comic.issueNumber || 1
  return `https://www.marvel.com/comics/issue/${comic.id}/${baseTitle}_${issueNumber}`
}

export function ConnectionPath({ currentPath, onShare, onCopyToClipboard }: ConnectionPathProps) {
  if (currentPath.length <= 1) return null

  return (
    <GlassCard className="p-4 mb-6 relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Comic Connection Journey</h3>

        {/* Share buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopyToClipboard}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2"
            title="Copy journey to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2"
            title="Share your journey"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex items-center pb-4 min-w-max h-48">
            {/* Start with the first character */}
            <div className="relative z-20 mr-4">
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 border-2 border-white shadow-lg">
                    <Image
                      src={currentPath[0].character.imageUrl || "/placeholder.svg"}
                      alt={currentPath[0].character.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p
                  className="text-xs text-white/80 mt-1 w-20 truncate text-center"
                  title={currentPath[0].character.name}
                  style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Bradley Hand', cursive" }}
                >
                  {currentPath[0].character.name}
                </p>
              </div>
            </div>

            {/* Then show each comic and the character it connects to */}
            {currentPath.slice(1).map((segment, index) => (
              <div key={`connection-${index}`} className="flex items-center relative">
                {/* Comic Cover */}
                <div className="relative group z-10 mr-4">
                  <ComicFrame variant="comic">
                    <div
                      className="relative cursor-pointer transition-transform hover:scale-105"
                      onClick={() => window.open(getMarvelComicUrl(segment.comicConnectingToPrevious!), "_blank")}
                      style={{ width: "120px", height: "180px" }}
                    >
                      <Image
                        src={segment.comicConnectingToPrevious?.coverImageUrl || "/placeholder.svg"}
                        alt={segment.comicConnectingToPrevious?.title || "Comic"}
                        width={120}
                        height={180}
                        className="rounded object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                        <ExternalLink className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </ComicFrame>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                    {segment.comicConnectingToPrevious?.title}
                    {segment.comicConnectingToPrevious?.issueNumber &&
                      ` #${segment.comicConnectingToPrevious.issueNumber}`}
                    <br />
                    <span className="text-blue-300">Click to view on Marvel.com</span>
                  </div>
                </div>

                {/* Connected Character */}
                <div className="relative z-20 mr-4">
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 border-2 border-white shadow-lg">
                        <Image
                          src={segment.character.imageUrl || "/placeholder.svg"}
                          alt={segment.character.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <p
                      className="text-xs text-white/80 mt-1 w-20 truncate text-center"
                      title={segment.character.name}
                      style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Bradley Hand', cursive" }}
                    >
                      {segment.character.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>

        {/* Scroll indicators */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900/50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900/50 to-transparent pointer-events-none" />
      </div>
    </GlassCard>
  )
}
