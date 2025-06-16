export interface MarvelCharacter {
  id: number
  name: string
  description: string
  imageUrl: string
  thumbnail?: {
    path: string
    extension: string
  }
}

export interface MarvelComic {
  id: number
  title: string
  issueNumber?: number
  description?: string
  coverImageUrl: string
  thumbnail?: {
    path: string
    extension: string
  }
  characterIds: number[]
  characters?: {
    available: number
    items: Array<{
      resourceURI: string
      name: string
    }>
  }
}

export interface PathSegment {
  character: MarvelCharacter
  comicConnectingToPrevious?: MarvelComic
}

export interface MarvelApiResponse<T> {
  code: number
  status: string
  data: {
    offset: number
    limit: number
    total: number
    count: number
    results: T[]
  }
}

export interface DailyChallenge {
  day: number
  startCharacter: string
  endCharacter: string
  description: string
  difficulty: "Easy" | "Medium" | "Medium-Hard" | "Hard" | "Very Hard" | "Ultra Hard"
}
