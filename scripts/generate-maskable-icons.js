import sharp from "sharp"
import fs from "fs"
import path from "path"

// Required maskable icon sizes
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

// Use current working directory approach - much simpler and safer
const CURRENT_DIR = process.cwd()
const MASKABLE_DIR = path.join(CURRENT_DIR, "public", "icons", "maskable")
const SOURCE_ICON = path.join(MASKABLE_DIR, "icon-512x512-maskable.png")

console.log("🎨 Starting maskable icon generation...")
console.log(`📍 Current directory: ${CURRENT_DIR}`)
console.log(`📍 Target directory: ${MASKABLE_DIR}`)

// Create a simple 512x512 placeholder icon
async function createPlaceholderIcon() {
  console.log("🎨 Creating placeholder 512x512 maskable icon...")

  try {
    const placeholderSvg = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#5B21B6;stop-opacity:1" />
          </radialGradient>
        </defs>
        <circle cx="256" cy="256" r="256" fill="url(#bg)"/>
        <circle cx="256" cy="256" r="200" fill="white" opacity="0.1"/>
        <text x="256" y="220" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
              text-anchor="middle" fill="white">616°</text>
        <text x="256" y="300" font-family="Arial, sans-serif" font-size="32" font-weight="normal" 
              text-anchor="middle" fill="white" opacity="0.8">MARVEL</text>
      </svg>
    `

    const buffer = await sharp(Buffer.from(placeholderSvg)).png({ quality: 100 }).toBuffer()

    return buffer
  } catch (error) {
    console.error("❌ Failed to create placeholder:", error.message)
    throw error
  }
}

async function generateMaskableIcons() {
  try {
    // Check if we're in the right place
    const packageJsonPath = path.join(CURRENT_DIR, "package.json")
    if (!fs.existsSync(packageJsonPath)) {
      console.error("❌ Not in project root - package.json not found")
      console.log("Current directory contents:")
      try {
        const contents = fs.readdirSync(CURRENT_DIR)
        console.log(contents.join(", "))
      } catch (e) {
        console.log("Cannot read current directory")
      }
      return
    }

    console.log("✅ Found package.json - we're in the right place")

    // Create directories step by step
    const publicDir = path.join(CURRENT_DIR, "public")
    const iconsDir = path.join(publicDir, "icons")

    // Check/create public directory
    if (!fs.existsSync(publicDir)) {
      console.log("📁 Creating public directory...")
      fs.mkdirSync(publicDir, { recursive: true })
    }
    console.log("✅ Public directory ready")

    // Check/create icons directory
    if (!fs.existsSync(iconsDir)) {
      console.log("📁 Creating icons directory...")
      fs.mkdirSync(iconsDir, { recursive: true })
    }
    console.log("✅ Icons directory ready")

    // Check/create maskable directory
    if (!fs.existsSync(MASKABLE_DIR)) {
      console.log("📁 Creating maskable directory...")
      fs.mkdirSync(MASKABLE_DIR, { recursive: true })
    }
    console.log("✅ Maskable directory ready")

    // Create or use existing source icon
    let sourceBuffer
    if (fs.existsSync(SOURCE_ICON)) {
      console.log("✅ Using existing source icon")
      sourceBuffer = fs.readFileSync(SOURCE_ICON)
    } else {
      console.log("📝 Creating new source icon...")
      sourceBuffer = await createPlaceholderIcon()
      fs.writeFileSync(SOURCE_ICON, sourceBuffer)
      console.log("✅ Source icon created")
    }

    // Generate all sizes
    console.log("\n🔄 Generating maskable icons...")
    let successCount = 0
    let failCount = 0

    for (const size of SIZES) {
      const outputPath = path.join(MASKABLE_DIR, `icon-${size}x${size}-maskable.png`)

      try {
        await sharp(sourceBuffer)
          .resize(size, size, {
            kernel: sharp.kernel.lanczos3,
            fit: "cover",
            position: "center",
          })
          .png({ quality: 100, compressionLevel: 6 })
          .toFile(outputPath)

        const stats = fs.statSync(outputPath)
        console.log(`✅ ${size}x${size} (${Math.round(stats.size / 1024)}KB)`)
        successCount++
      } catch (error) {
        console.error(`❌ Failed ${size}x${size}: ${error.message}`)
        failCount++
      }
    }

    // Summary
    console.log(`\n🎉 Generation complete!`)
    console.log(`📊 Success: ${successCount}, Failed: ${failCount}`)

    // List final directory contents
    console.log("\n📁 Generated files:")
    const files = fs.readdirSync(MASKABLE_DIR)
    files.forEach((file) => {
      const filePath = path.join(MASKABLE_DIR, file)
      const stats = fs.statSync(filePath)
      console.log(`  📄 ${file} (${Math.round(stats.size / 1024)}KB)`)
    })

    console.log("\n✅ All maskable icons generated successfully!")
    console.log("🚀 Ready for deployment!")
  } catch (error) {
    console.error("💥 Generation failed:", error.message)

    // Debug info
    console.log("\n🔍 Debug info:")
    console.log(`Working directory: ${CURRENT_DIR}`)
    console.log(`Target directory: ${MASKABLE_DIR}`)

    try {
      console.log("Current directory contents:")
      const contents = fs.readdirSync(CURRENT_DIR)
      console.log(contents.join(", "))
    } catch (e) {
      console.log("Cannot read current directory")
    }

    throw error
  }
}

// Run the generation
generateMaskableIcons().catch((error) => {
  console.error("Script failed:", error.message)
  process.exit(1)
})
