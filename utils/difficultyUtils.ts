export function getDifficultyDescription(difficulty: string): string {
  switch (difficulty) {
    case "Easy":
      return "Perfect for beginners - these characters have clear connections"
    case "Medium":
      return "A moderate challenge - requires some Marvel knowledge"
    case "Medium-Hard":
      return "Getting tricky - deeper comic connections needed"
    case "Hard":
      return "Challenging - obscure connections may be required"
    case "Very Hard":
      return "Expert level - extensive Marvel knowledge needed"
    case "Ultra Hard":
      return "Master level - only the most dedicated fans will succeed"
    default:
      return "Test your Marvel knowledge"
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "Easy":
      return "from-green-400 to-emerald-500"
    case "Medium":
      return "from-yellow-400 to-orange-500"
    case "Medium-Hard":
      return "from-orange-400 to-red-500"
    case "Hard":
      return "from-red-400 to-pink-500"
    case "Very Hard":
      return "from-pink-400 to-purple-500"
    case "Ultra Hard":
      return "from-purple-400 to-indigo-500"
    default:
      return "from-gray-400 to-gray-500"
  }
}
