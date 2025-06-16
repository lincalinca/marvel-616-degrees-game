import { NextResponse } from "next/server"
import crypto from "crypto"

function generateMarvelAuth() {
  const publicKey = process.env.NEXT_PUBLIC_MARVEL_PUBLIC
  const privateKey = process.env.MARVEL_PRIVATE_KEY

  if (!publicKey || !privateKey) {
    throw new Error("Marvel API keys not found in environment variables")
  }

  const timestamp = Date.now().toString()
  const hash = crypto
    .createHash("md5")
    .update(timestamp + privateKey + publicKey)
    .digest("hex")

  return {
    ts: timestamp,
    apikey: publicKey,
    hash: hash,
  }
}

function buildMarvelApiUrl(endpoint: string, params: Record<string, string> = {}) {
  const auth = generateMarvelAuth()
  const baseUrl = "https://gateway.marvel.com/v1/public"
  const url = new URL(`${baseUrl}${endpoint}`)

  // Add auth parameters
  url.searchParams.append("ts", auth.ts)
  url.searchParams.append("apikey", auth.apikey)
  url.searchParams.append("hash", auth.hash)

  // Add additional parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  return url.toString()
}

export async function POST(request: Request) {
  try {
    const { endpoint, params } = await request.json()
    const url = buildMarvelApiUrl(endpoint, params || {})

    const response = await fetch(url)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Marvel API error:", error)
    return NextResponse.json({ error: "Failed to fetch from Marvel API" }, { status: 500 })
  }
}
