// Script to verify all required icons exist
const requiredIcons = [
  "/icons/icon-72x72.png",
  "/icons/maskable/icon-72x72-maskable.png",
  "/icons/icon-96x96.png",
  "/icons/maskable/icon-96x96-maskable.png",
  "/icons/icon-128x128.png",
  "/icons/maskable/icon-128x128-maskable.png",
  "/icons/icon-144x144.png",
  "/icons/maskable/icon-144x144-maskable.png",
  "/icons/icon-152x152.png",
  "/icons/maskable/icon-152x152-maskable.png",
  "/icons/icon-192x192.png",
  "/icons/maskable/icon-192x192-maskable.png",
  "/icons/icon-384x384.png",
  "/icons/maskable/icon-384x384-maskable.png",
  "/icons/icon-512x512.png",
  "/icons/maskable/icon-512x512-maskable.png",
]

async function verifyIcons(baseUrl) {
  console.log(`🔍 Checking icons at: ${baseUrl}`)
  console.log("=" * 50)

  let successCount = 0
  let failCount = 0

  for (const icon of requiredIcons) {
    try {
      const response = await fetch(`${baseUrl}${icon}`)
      if (response.status === 200) {
        console.log(`✅ ${icon}`)
        successCount++
      } else {
        console.log(`❌ ${icon} - Status: ${response.status}`)
        failCount++
      }
    } catch (error) {
      console.log(`❌ ${icon} - ERROR: ${error.message}`)
      failCount++
    }
  }

  console.log("\n" + "=" * 50)
  console.log(`📊 Results: ${successCount} success, ${failCount} failed`)

  if (failCount === 0) {
    console.log("🎉 All icons are accessible!")
  } else {
    console.log("⚠️  Some icons are missing or inaccessible")
  }
}

// Run verification
verifyIcons("https://v0-marvel-connection-game.vercel.app").catch((error) => {
  console.error("Script failed:", error)
})
