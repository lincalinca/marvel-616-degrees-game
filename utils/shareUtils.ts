import type { MarvelCharacter, PathSegment } from "@/types/marvel-types"

export function generateShareText(
  startChar: MarvelCharacter,
  endChar: MarvelCharacter,
  path: PathSegment[],
  steps: number,
  difficulty: string,
  day: number,
): string {
  let shareText = `I played Marvel's 616 Degrees of Separation today.\n\n`
  shareText += `Game ${day}:\n`
  shareText += `I connected ${startChar.name} to ${endChar.name} in ${steps} step${steps !== 1 ? "s" : ""}:\n\n`

  const pathEmojis = ["🦸", "📚", "🦹", "📖", "🎭", "📕", "⚡"]

  shareText += `${pathEmojis[0]} ${startChar.name}\n`

  path.slice(1).forEach((segment, index) => {
    const comic = segment.comicConnectingToPrevious!
    let comicTitle = comic.title
    if (comic.issueNumber && !comicTitle.includes(`#${comic.issueNumber}`)) {
      comicTitle += ` #${comic.issueNumber}`
    }
    shareText += `${pathEmojis[(index * 2 + 1) % pathEmojis.length]} ${comicTitle}\n`
    shareText += `${pathEmojis[(index * 2 + 2) % pathEmojis.length]} ${segment.character.name}\n`
  })

  shareText += `\nPlay 616 Degrees today: https://tinyurl.com/616degrees`
  return shareText
}

export function generateJourneyText(path: PathSegment[]): string {
  if (path.length <= 1) return "No journey to share yet!"

  let journeyText = `My Marvel 616 Degrees Journey:\n\n`

  // Start character
  journeyText += `🦸 ${path[0].character.name}\n`

  // Each connection
  path.slice(1).forEach((segment, index) => {
    const comic = segment.comicConnectingToPrevious!
    let comicTitle = comic.title
    if (comic.issueNumber && !comicTitle.includes(`#${comic.issueNumber}`)) {
      comicTitle += ` #${comic.issueNumber}`
    }
    journeyText += `📚 ${comicTitle}\n`
    journeyText += `🦸 ${segment.character.name}\n`
  })

  journeyText += `\nSteps: ${path.length - 1}\n`
  journeyText += `Play at: https://tinyurl.com/616degrees`

  return journeyText
}

export async function handleShare(shareText: string): Promise<boolean> {
  // Try native sharing first
  if (navigator.share) {
    try {
      await navigator.share({
        title: "616 Degrees of Separation",
        text: shareText,
      })
      return true
    } catch (error) {
      console.log("Native sharing failed or cancelled")
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(shareText)
    return true
  } catch (error) {
    console.error("Failed to copy to clipboard:", error)
    alert("Share text:\n\n" + shareText)
    return false
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error("Failed to copy to clipboard:", error)
    return false
  }
}
