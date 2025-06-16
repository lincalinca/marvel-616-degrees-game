import type { MarvelCharacter, MarvelComic, MarvelApiResponse } from "@/types/marvel-types"
import { debug } from "@/lib/debug"

// Known character IDs for reliable lookups - FIXED VENOM APPROACH
const KNOWN_CHARACTER_IDS: Record<string, number> = {
  "Spider-Man": 1009610,
  "Iron Man": 1009368,
  // Remove unreliable Venom ID - we'll search dynamically
  Deadpool: 1009268,
  "Captain America": 1009220,
  Thor: 1009664,
  Hulk: 1009351,
  "Black Widow": 1009189,
  Hawkeye: 1009338,
  Wolverine: 1009718,
  Cyclops: 1009257,
  Storm: 1009629,
  "Jean Grey": 1009327,
  "Professor X": 1009504,
  Magneto: 1009417,
  "Doctor Doom": 1009281,
  "Green Goblin": 1014985,
  "Doctor Octopus": 1009276,
  Thanos: 1009652,
  Loki: 1009407,
  "Fantastic Four": 1009299,
  "Mr. Fantastic": 1009459,
  "Invisible Woman": 1009366,
  "Human Torch": 1009356,
  Thing: 1009662,
  Daredevil: 1009262,
  Punisher: 1009515,
  "Ghost Rider": 1009318,
  "Luke Cage": 1009371,
  "Iron Fist": 1009367,
  "Silver Surfer": 1009592,
  Galactus: 1009312,
  "Ant-Man": 1009146,
  Wasp: 1009707,
  Vision: 1009697,
  "Scarlet Witch": 1009562,
  Quicksilver: 1009524,
  "Winter Soldier": 1009211,
  Falcon: 1009297,
  "War Machine": 1009702,
  "Black Panther": 1009187,
  "Captain Marvel": 1010338,
  "Ms. Marvel": 1017577,
  "Spider-Woman": 1009608,
  "She-Hulk": 1009583,
  Elektra: 1009288,
  Blade: 1009191,
  "Moon Knight": 1009452,
  Nova: 1009477,
  Quasar: 1009522,
  "Beta Ray Bill": 1009180,
  Sentry: 1009581,
  Hercules: 1009342,
  "Wonder Man": 1009719,
  Tigra: 1009670,
  Mockingbird: 1009447,
  Namor: 1009466,
  "Doctor Strange": 1009282,
  Wong: 1009720,
  Clea: 1009239,
  Dormammu: 1009284,
  "Baron Mordo": 1009167,
  Nightcrawler: 1009472,
  Colossus: 1009243,
  "Kitty Pryde": 1009508,
  Rogue: 1009546,
  Gambit: 1009313,
  Beast: 1009175,
  Angel: 1009153,
  Iceman: 1009362,
  Mystique: 1009464,
  Sabretooth: 1009554,
  Juggernaut: 1009382,
  Apocalypse: 1009156,
  "Mr. Sinister": 1009458,
  Cable: 1009214,
  Domino: 1009285,
  "X-23": 1009718,
  "Emma Frost": 1009290,
  Psylocke: 1009512,
  Bishop: 1009186,
  Forge: 1009305,
  Banshee: 1009168,
  Polaris: 1009497,
  Havok: 1009335,
  Carnage: 1009214,
}

// Alternative names for characters
const CHARACTER_NAME_VARIANTS: Record<string, string[]> = {
  "Spider-Man": ["Spider-Man", "Spider-Man (Peter Parker)", "Peter Parker", "Spiderman"],
  "Iron Man": ["Iron Man", "Iron Man (Tony Stark)", "Tony Stark"],
  Venom: ["Venom", "Venom (Eddie Brock)", "Eddie Brock"],
  Deadpool: ["Deadpool", "Deadpool (Wade Wilson)", "Wade Wilson"],
  "Captain America": ["Captain America", "Captain America (Steve Rogers)", "Steve Rogers"],
  Thor: ["Thor", "Thor (Thor Odinson)", "Thor Odinson"],
  Hulk: ["Hulk", "Hulk (Bruce Banner)", "Bruce Banner"],
  "Black Widow": ["Black Widow", "Black Widow (Natasha Romanoff)", "Natasha Romanoff"],
  Wolverine: ["Wolverine", "Wolverine (Logan)", "Logan"],
  "Doctor Doom": ["Doctor Doom", "Dr. Doom", "Victor Von Doom"],
  "Green Goblin": ["Green Goblin", "Norman Osborn"],
  "Doctor Octopus": ["Doctor Octopus", "Dr. Octopus", "Otto Octavius"],
  "Mr. Fantastic": ["Mr. Fantastic", "Reed Richards"],
  "Invisible Woman": ["Invisible Woman", "Sue Storm"],
  "Human Torch": ["Human Torch", "Johnny Storm"],
  Thing: ["Thing", "Ben Grimm"],
  Daredevil: ["Daredevil", "Matt Murdock"],
  Punisher: ["Punisher", "Frank Castle"],
  "Luke Cage": ["Luke Cage", "Power Man"],
  "Iron Fist": ["Iron Fist", "Danny Rand"],
  "Captain Marvel": ["Captain Marvel", "Carol Danvers"],
  "Ms. Marvel": ["Ms. Marvel", "Kamala Khan"],
  "Spider-Woman": ["Spider-Woman", "Jessica Drew"],
  "She-Hulk": ["She-Hulk", "Jennifer Walters"],
  "Moon Knight": ["Moon Knight", "Marc Spector"],
  "Doctor Strange": ["Doctor Strange", "Dr. Strange", "Stephen Strange"],
  Nightcrawler: ["Nightcrawler", "Kurt Wagner"],
  Colossus: ["Colossus", "Piotr Rasputin"],
  "Kitty Pryde": ["Kitty Pryde", "Shadowcat"],
  Rogue: ["Rogue", "Marie D'Ancanto"],
  Gambit: ["Gambit", "Remy LeBeau"],
  Beast: ["Beast", "Hank McCoy"],
  Angel: ["Angel", "Warren Worthington III"],
  Iceman: ["Iceman", "Bobby Drake"],
  Mystique: ["Mystique", "Raven Darkholme"],
  Sabretooth: ["Sabretooth", "Victor Creed"],
  "Emma Frost": ["Emma Frost", "White Queen"],
  Psylocke: ["Psylocke", "Betsy Braddock"],
  Bishop: ["Bishop", "Lucas Bishop"],
  Polaris: ["Polaris", "Lorna Dane"],
  Havok: ["Havok", "Alex Summers"],
  Carnage: ["Carnage", "Carnage (Cletus Kasady)", "Cletus Kasady"],
}

// Helper function to convert Marvel API thumbnail to full image URL
function getImageUrl(thumbnail?: { path: string; extension: string }, size = "standard_medium"): string {
  if (!thumbnail) return "/placeholder.svg?width=100&height=100&text=No+Image"
  return `${thumbnail.path}/${size}.${thumbnail.extension}`
}

// Helper function to extract character ID from Marvel API resource URI
function extractCharacterIdFromUri(uri: string): number {
  const matches = uri.match(/\/characters\/(\d+)$/)
  return matches ? Number.parseInt(matches[1]) : 0
}

// Helper function to make Marvel API calls through our proxy
async function callMarvelAPI(endpoint: string, params: Record<string, string> = {}) {
  debug.log("🌐", "Marvel API call:", endpoint, "with params:", params)

  const response = await fetch("/api/marvel/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ endpoint, params }),
  })

  if (!response.ok) {
    debug.error("Marvel API call failed:", response.status, response.statusText)
    throw new Error(`API call failed: ${response.statusText}`)
  }

  const data = await response.json()
  debug.log("✅", "Marvel API response received:", data.data?.results?.length || 0, "results")
  return data
}

// Function to evaluate Venom character quality for the game
function evaluateVenomCharacter(char: any): number {
  let score = 0
  const name = char.name.toLowerCase()
  const description = (char.description || "").toLowerCase()

  // Heavily penalize non-Venom characters
  if (name.includes("scorpion") || description.includes("scorpion")) {
    return -100 // Mac Gargan as Scorpion
  }

  if (name.includes("flash") || name.includes("agent")) {
    return -50 // Agent Venom (Flash Thompson)
  }

  // Prefer Eddie Brock references
  if (description.includes("eddie brock")) {
    score += 50
  }

  // Prefer classic Venom characteristics
  if (description.includes("symbiote")) {
    score += 30
  }

  if (description.includes("spider-man") || description.includes("spiderman")) {
    score += 20
  }

  // Prefer simpler names
  if (name === "venom") {
    score += 40
  } else if (name.includes("venom") && !name.includes("(")) {
    score += 20
  }

  // Penalize specific bad variants
  if (name.includes("2099") || name.includes("noir") || name.includes("ultimate")) {
    score -= 10
  }

  return score
}

// Enhanced character search function
async function findCharacterByName(characterName: string): Promise<MarvelCharacter | null> {
  debug.log("🔍", `Searching for character: ${characterName}`)

  // Special handling for Venom - search for Eddie Brock directly
  if (characterName.toLowerCase() === "venom") {
    debug.log("🕷️", "Venom requested - searching for Eddie Brock instead")

    try {
      // Search for Eddie Brock directly
      const data: MarvelApiResponse<any> = await callMarvelAPI("/characters", {
        nameStartsWith: "Eddie Brock",
        limit: "10",
        orderBy: "name",
      })

      if (data.data.results.length > 0) {
        debug.log(
          "Found Eddie Brock variants:",
          data.data.results.map((char: any) => `${char.name} (ID: ${char.id})`),
        )

        // Look for the best Eddie Brock match
        const eddieBrock =
          data.data.results.find(
            (char: any) => char.name.toLowerCase().includes("eddie brock") || char.name.toLowerCase() === "eddie brock",
          ) || data.data.results[0] // Use first result as fallback

        debug.log("✅", `Selected Eddie Brock: ${eddieBrock.name} (ID: ${eddieBrock.id})`)
        return {
          id: eddieBrock.id,
          name: eddieBrock.name,
          description: eddieBrock.description || "No description available",
          imageUrl: getImageUrl(eddieBrock.thumbnail),
          thumbnail: eddieBrock.thumbnail,
        }
      }

      // If no Eddie Brock found, try "Venom" with Eddie Brock in description
      debug.log("No Eddie Brock found, trying Venom search with description filter")
      const venomData: MarvelApiResponse<any> = await callMarvelAPI("/characters", {
        nameStartsWith: "Venom",
        limit: "50",
        orderBy: "name",
      })

      if (venomData.data.results.length > 0) {
        // Look for Venom with Eddie Brock in description
        const eddieBrockVenom = venomData.data.results.find((char: any) =>
          char.description?.toLowerCase().includes("eddie brock"),
        )

        if (eddieBrockVenom) {
          debug.log(
            "✅",
            `Found Venom with Eddie Brock description: ${eddieBrockVenom.name} (ID: ${eddieBrockVenom.id})`,
          )
          return {
            id: eddieBrockVenom.id,
            name: eddieBrockVenom.name,
            description: eddieBrockVenom.description || "No description available",
            imageUrl: getImageUrl(eddieBrockVenom.thumbnail),
            thumbnail: eddieBrockVenom.thumbnail,
          }
        }

        // Use plain "Venom" as fallback (excluding obvious non-Eddie variants)
        const plainVenom = venomData.data.results.find(
          (char: any) =>
            char.name.toLowerCase() === "venom" &&
            !char.name.toLowerCase().includes("flash") &&
            !char.name.toLowerCase().includes("agent") &&
            !char.name.toLowerCase().includes("mac") &&
            !char.name.toLowerCase().includes("gargan"),
        )

        if (plainVenom) {
          debug.log("✅", `Using plain Venom as fallback: ${plainVenom.name} (ID: ${plainVenom.id})`)
          return {
            id: plainVenom.id,
            name: plainVenom.name,
            description: plainVenom.description || "No description available",
            imageUrl: getImageUrl(plainVenom.thumbnail),
            thumbnail: plainVenom.thumbnail,
          }
        }
      }
    } catch (error) {
      debug.log("❌", `Eddie Brock/Venom search failed:`, error)
    }

    // Ultimate fallback - create a synthetic Eddie Brock/Venom character
    debug.log("⚠️", "Creating synthetic Eddie Brock/Venom character")
    return {
      id: 999999, // Synthetic ID
      name: "Venom (Eddie Brock)",
      description: "Eddie Brock bonded with the alien symbiote to become Venom, one of Spider-Man's greatest enemies.",
      imageUrl: "/placeholder.svg?width=100&height=100&text=Venom",
    }
  }

  // Standard search for non-Venom characters (keep existing logic)
  const knownId = KNOWN_CHARACTER_IDS[characterName]
  if (knownId) {
    debug.log("📋", `Using known ID ${knownId} for ${characterName}`)
    try {
      const data: MarvelApiResponse<any> = await callMarvelAPI(`/characters/${knownId}`)
      if (data.data.results.length > 0) {
        const char = data.data.results[0]
        debug.log("✅", `Found character by ID: ${char.name}`)
        return {
          id: char.id,
          name: char.name,
          description: char.description || "No description available",
          imageUrl: getImageUrl(char.thumbnail),
          thumbnail: char.thumbnail,
        }
      }
    } catch (error) {
      debug.log("❌", `Failed to fetch by known ID, trying name search...`)
    }
  }

  // Try exact name match
  try {
    const data: MarvelApiResponse<any> = await callMarvelAPI("/characters", {
      name: characterName,
      limit: "1",
    })

    if (data.data.results.length > 0) {
      const char = data.data.results[0]
      debug.log("✅", `Found character by exact name: ${char.name}`)
      return {
        id: char.id,
        name: char.name,
        description: char.description || "No description available",
        imageUrl: getImageUrl(char.thumbnail),
        thumbnail: char.thumbnail,
      }
    }
  } catch (error) {
    debug.log("❌", `Exact name search failed for ${characterName}`)
  }

  // Try name variants
  const variants = CHARACTER_NAME_VARIANTS[characterName] || [characterName]
  for (const variant of variants) {
    try {
      debug.log("🔄", `Trying variant: ${variant}`)
      const data: MarvelApiResponse<any> = await callMarvelAPI("/characters", {
        name: variant,
        limit: "1",
      })

      if (data.data.results.length > 0) {
        const char = data.data.results[0]
        debug.log("✅", `Found character by variant "${variant}": ${char.name}`)
        return {
          id: char.id,
          name: char.name,
          description: char.description || "No description available",
          imageUrl: getImageUrl(char.thumbnail),
          thumbnail: char.thumbnail,
        }
      }
    } catch (error) {
      debug.log("❌", `Variant search failed for ${variant}`)
    }
  }

  // Try nameStartsWith search
  try {
    debug.log("🔄", `Trying nameStartsWith search for: ${characterName}`)
    const data: MarvelApiResponse<any> = await callMarvelAPI("/characters", {
      nameStartsWith: characterName,
      limit: "20",
      orderBy: "name",
    })

    if (data.data.results.length > 0) {
      const char = data.data.results[0]
      debug.log("✅", `Using first nameStartsWith result: ${char.name}`)
      return {
        id: char.id,
        name: char.name,
        description: char.description || "No description available",
        imageUrl: getImageUrl(char.thumbnail),
        thumbnail: char.thumbnail,
      }
    }
  } catch (error) {
    debug.log("❌", `nameStartsWith search failed for ${characterName}`)
  }

  debug.log("❌", `Could not find character: ${characterName}`)
  return null
}

export const getInitialCharacters = async (
  startCharacterName: string,
  endCharacterName: string,
): Promise<{ startChar: MarvelCharacter; endChar: MarvelCharacter }> => {
  try {
    debug.log("🎯", "Searching for initial characters:", startCharacterName, "and", endCharacterName)

    const [startChar, endChar] = await Promise.all([
      findCharacterByName(startCharacterName),
      findCharacterByName(endCharacterName),
    ])

    if (!startChar) {
      throw new Error(`Could not find start character: ${startCharacterName}`)
    }

    if (!endChar) {
      throw new Error(`Could not find end character: ${endCharacterName}`)
    }

    debug.log("✅", "Successfully found characters:", startChar.name, "and", endChar.name)
    return { startChar, endChar }
  } catch (error) {
    debug.error("Error fetching initial characters:", error)

    // Enhanced fallback with more reliable characters
    debug.log("⚠️", "Using fallback characters...")
    return {
      startChar: {
        id: KNOWN_CHARACTER_IDS["Spider-Man"] || 1009610,
        name: "Spider-Man",
        description: "Friendly neighborhood Spider-Man",
        imageUrl: "/placeholder.svg?width=100&height=100&text=Spider-Man",
      },
      endChar: {
        id: KNOWN_CHARACTER_IDS["Iron Man"] || 1009368,
        name: "Iron Man",
        description: "Genius, billionaire, playboy, philanthropist",
        imageUrl: "/placeholder.svg?width=100&height=100&text=Iron+Man",
      },
    }
  }
}

export const searchCharactersByName = async (query: string): Promise<MarvelCharacter[]> => {
  if (!query || query.length < 2) return []

  debug.log("🔍", "searchCharactersByName called with query:", query)

  try {
    const data: MarvelApiResponse<any> = await callMarvelAPI("/characters", {
      nameStartsWith: query,
      limit: "20",
      orderBy: "name",
    })

    const results = data.data.results.map(
      (char: any): MarvelCharacter => ({
        id: char.id,
        name: char.name,
        description: char.description || "No description available",
        imageUrl: getImageUrl(char.thumbnail),
        thumbnail: char.thumbnail,
      }),
    )

    debug.log("✅", "searchCharactersByName returning:", results.length, "characters")
    return results
  } catch (error) {
    debug.error("Error searching characters:", error)
    return []
  }
}

export const findComicsConnectingCharacters = async (char1Id: number, char2Id: number): Promise<MarvelComic[]> => {
  debug.log("📚", "findComicsConnectingCharacters called with IDs:", char1Id, "and", char2Id)

  try {
    // Handle synthetic Venom character
    if (char1Id === 999999 || char2Id === 999999) {
      debug.log("⚠️", "Synthetic character detected, returning mock comics")
      return [
        {
          id: 999999,
          title: "Amazing Spider-Man",
          issueNumber: 300,
          description: "The first appearance of Venom!",
          coverImageUrl: "/placeholder.svg?width=120&height=180&text=ASM+300",
          characterIds: [char1Id, char2Id],
        },
      ]
    }

    debug.log("🔄", "Fetching comics for character 1 (ID:", char1Id, ")")
    // First, get comics for character 1
    const char1Data: MarvelApiResponse<any> = await callMarvelAPI(`/characters/${char1Id}/comics`, {
      limit: "100",
      orderBy: "-onsaleDate",
    })

    debug.log("📖", "Character 1 comics found:", char1Data.data.results.length)

    debug.log("🔄", "Fetching comics for character 2 (ID:", char2Id, ")")
    // Then get comics for character 2
    const char2Data: MarvelApiResponse<any> = await callMarvelAPI(`/characters/${char2Id}/comics`, {
      limit: "100",
      orderBy: "-onsaleDate",
    })

    debug.log("📖", "Character 2 comics found:", char2Data.data.results.length)

    // Find common comics
    const char1ComicIds = new Set(char1Data.data.results.map((comic: any) => comic.id))
    debug.log("📋", "Character 1 comic IDs:", Array.from(char1ComicIds).slice(0, 10), "...")

    const commonComics = char2Data.data.results.filter((comic: any) => char1ComicIds.has(comic.id))
    debug.log("🎯", "Common comics found:", commonComics.length)
    debug.log(
      "📋",
      "Common comic titles:",
      commonComics.slice(0, 5).map((c: any) => c.title),
    )

    const result = commonComics.slice(0, 10).map(
      (comic: any): MarvelComic => ({
        id: comic.id,
        title: comic.title,
        issueNumber: comic.issueNumber,
        description: comic.description || "",
        coverImageUrl: getImageUrl(comic.thumbnail, "portrait_medium"),
        thumbnail: comic.thumbnail,
        characterIds: [char1Id, char2Id], // We know these two are in it
        characters: comic.characters,
      }),
    )

    debug.log("✅", "Returning", result.length, "connecting comics")
    return result
  } catch (error) {
    debug.error("Error finding connecting comics:", error)
    return []
  }
}

export const getCharacterById = async (id: number): Promise<MarvelCharacter | undefined> => {
  debug.log("👤", "getCharacterById called with ID:", id)

  try {
    const data: MarvelApiResponse<any> = await callMarvelAPI(`/characters/${id}`)

    if (data.data.results.length === 0) {
      debug.log("❌", "No character found with ID:", id)
      return undefined
    }

    const char = data.data.results[0]
    debug.log("✅", "Character found:", char.name)
    return {
      id: char.id,
      name: char.name,
      description: char.description || "No description available",
      imageUrl: getImageUrl(char.thumbnail),
      thumbnail: char.thumbnail,
    }
  } catch (error) {
    debug.error("Error fetching character by ID:", error)
    return undefined
  }
}

export const getComicDetails = async (comicId: number): Promise<MarvelComic | null> => {
  debug.log("📖", "getComicDetails called with ID:", comicId)

  try {
    const data: MarvelApiResponse<any> = await callMarvelAPI(`/comics/${comicId}`)

    if (data.data.results.length === 0) {
      debug.log("❌", "No comic found with ID:", comicId)
      return null
    }

    const comic = data.data.results[0]
    const characterIds =
      comic.characters?.items
        ?.map((char: any) => extractCharacterIdFromUri(char.resourceURI))
        .filter((id: number) => id > 0) || []

    debug.log("✅", "Comic found:", comic.title, "with", characterIds.length, "characters")
    return {
      id: comic.id,
      title: comic.title,
      issueNumber: comic.issueNumber,
      description: comic.description || "",
      coverImageUrl: getImageUrl(comic.thumbnail, "portrait_xlarge"),
      thumbnail: comic.thumbnail,
      characterIds,
      characters: comic.characters,
    }
  } catch (error) {
    debug.error("Error fetching comic details:", error)
    return null
  }
}
