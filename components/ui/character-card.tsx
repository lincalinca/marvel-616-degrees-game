"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { RotateCcw, ExternalLink, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MarvelCharacter } from "@/types/marvel-types"

interface CharacterCardProps {
  character: MarvelCharacter | null
  label: string
  labelColor: string
  isFlipped: boolean
  onFlip: () => void
  isActive?: boolean
}

// Helper function to extract real name from character description or name
function extractRealName(character: MarvelCharacter): string {
  const name = character.name
  const description = character.description || ""

  // Common patterns for real names in Marvel descriptions
  const realNamePatterns = [
    /(?:real name|born|birth name|civilian identity|alter ego|secret identity)(?:\s+is)?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /^([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s+is|\s+was|\s+became)/,
    /$$([A-Z][a-z]+\s+[A-Z][a-z]+)$$/,
  ]

  // Try to extract from description first
  for (const pattern of realNamePatterns) {
    const match = description.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  // Known character mappings for common heroes/villains
  const knownNames: Record<string, string> = {
    "Spider-Man": "Peter Parker",
    "Iron Man": "Tony Stark",
    "Captain America": "Steve Rogers",
    Hulk: "Bruce Banner",
    Thor: "Thor Odinson",
    "Black Widow": "Natasha Romanoff",
    Hawkeye: "Clint Barton",
    Falcon: "Sam Wilson",
    "Winter Soldier": "Bucky Barnes",
    "Ant-Man": "Scott Lang",
    Wasp: "Janet van Dyne",
    "Captain Marvel": "Carol Danvers",
    "Ms. Marvel": "Kamala Khan",
    Daredevil: "Matt Murdock",
    Punisher: "Frank Castle",
    "Luke Cage": "Luke Cage",
    "Iron Fist": "Danny Rand",
    "Jessica Jones": "Jessica Jones",
    Deadpool: "Wade Wilson",
    Wolverine: "Logan",
    Cyclops: "Scott Summers",
    "Jean Grey": "Jean Grey",
    Storm: "Ororo Munroe",
    Rogue: "Marie D'Ancanto",
    Gambit: "Remy LeBeau",
    Nightcrawler: "Kurt Wagner",
    Colossus: "Piotr Rasputin",
    Iceman: "Bobby Drake",
    Beast: "Hank McCoy",
    Angel: "Warren Worthington III",
    "Professor X": "Charles Xavier",
    Magneto: "Erik Lehnsherr",
    Mystique: "Raven Darkholme",
    Sabretooth: "Victor Creed",
    "Emma Frost": "Emma Frost",
    "White Queen": "Emma Frost",
    Venom: "Eddie Brock",
    "Green Goblin": "Norman Osborn",
    "Doctor Octopus": "Otto Octavius",
    Sandman: "Flint Marko",
    Electro: "Max Dillon",
    Lizard: "Curt Connors",
    Rhino: "Aleksei Sytsevich",
    Vulture: "Adrian Toomes",
    Mysterio: "Quentin Beck",
    Kraven: "Sergei Kravinoff",
    Kingpin: "Wilson Fisk",
    Bullseye: "Lester",
    Loki: "Loki Laufeyson",
    "Red Skull": "Johann Schmidt",
    "Baron Zemo": "Helmut Zemo",
    Ultron: "Ultron",
    Thanos: "Thanos",
    "Doctor Doom": "Victor Von Doom",
    Galactus: "Galan",
    "Silver Surfer": "Norrin Radd",
    "Fantastic Four": "Reed Richards",
    "Mr. Fantastic": "Reed Richards",
    "Invisible Woman": "Sue Storm",
    "Human Torch": "Johnny Storm",
    Thing: "Ben Grimm",
  }

  // Check known names
  if (knownNames[name]) {
    return knownNames[name]
  }

  // If name appears to be a real name already (two words, both capitalized)
  if (/^[A-Z][a-z]+\s+[A-Z][a-z]+$/.test(name)) {
    return name
  }

  // Default fallback
  return "Unknown"
}

// Helper function to truncate text to fit in card
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

export function CharacterCard({
  character,
  label,
  labelColor,
  isFlipped,
  onFlip,
  isActive = false,
}: CharacterCardProps) {
  if (!character) {
    return (
      <GlassCard className="p-2 w-full aspect-[2/3] flex items-center justify-center min-h-[200px] max-h-[320px]">
        <div className="text-white/60 text-sm text-center">Loading...</div>
      </GlassCard>
    )
  }

  const getMarvelUrl = (character: MarvelCharacter) => {
    // Generate Marvel.com character URL based on character name
    const slug = character.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
    return `https://www.marvel.com/characters/${slug}`
  }

  const realName = extractRealName(character)

  return (
    <div className="relative w-full aspect-[2/3] perspective-1000 min-h-[200px] max-h-[320px]">
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-preserve-3d",
          isFlipped && "rotate-y-180",
        )}
      >
        {/* Front Side - Baseball Card Style */}
        <GlassCard
          className={cn(
            "absolute inset-0 p-2 backface-hidden overflow-hidden",
            isActive && "border-2 border-green-400/50 bg-green-400/10",
          )}
        >
          <div className="flex flex-col h-full relative">
            {/* Header with label and flip button */}
            <div className="flex items-center justify-between mb-1 relative z-10">
              <span className={cn("text-xs font-bold px-2 py-1 rounded bg-black/50", labelColor)}>{label}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onFlip}
                className="h-6 w-6 p-0 text-white/80 hover:text-white hover:bg-black/50 rounded-full"
              >
                <Info className="h-3 w-3" />
              </Button>
            </div>

            {/* Large Character Image - Baseball Card Style */}
            <div className="flex-1 relative rounded-lg overflow-hidden mb-2">
              <Image
                src={character.imageUrl || "/placeholder.svg"}
                alt={character.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Character Names - Overlaid on bottom of image */}
            <div className="absolute bottom-2 left-2 right-2 text-center z-10">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2">
                <h3 className="text-white font-bold text-xs sm:text-sm leading-tight line-clamp-1 mb-1">
                  {character.name}
                </h3>
                <p className="text-white/80 text-xs line-clamp-1">{realName !== "Unknown" ? realName : ""}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Back Side */}
        <GlassCard className="absolute inset-0 p-2 sm:p-3 backface-hidden rotate-y-180">
          <div className="flex flex-col h-full">
            {/* Header with back button */}
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className={cn("text-xs font-bold", labelColor)}>Details</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onFlip}
                className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>

            {/* Character Info */}
            <div className="flex-1 space-y-2 sm:space-y-3">
              <div className="text-center">
                <h3 className="text-white font-bold text-xs sm:text-sm leading-tight mb-1 line-clamp-2">
                  {character.name}
                </h3>
                {realName !== "Unknown" && <p className="text-white/60 text-xs">{realName}</p>}
              </div>

              {/* Truncated Description */}
              <div className="text-xs text-white/80 leading-relaxed">
                {character.description && character.description !== "No description available" ? (
                  <p>{truncateText(character.description, 140)}</p>
                ) : (
                  <p className="text-white/60 italic">No description available for this character.</p>
                )}
              </div>
            </div>

            {/* Marvel Link - Fixed at bottom */}
            <div className="pt-2 sm:pt-3 border-t border-white/20 mt-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(getMarvelUrl(character), "_blank")}
                className="w-full h-7 sm:h-8 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">View on Marvel.com</span>
                <span className="sm:hidden">Marvel.com</span>
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
