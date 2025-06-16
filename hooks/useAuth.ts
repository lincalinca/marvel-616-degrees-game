"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { createOrUpdateUser } from "@/lib/database"

export function useAuth() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await createOrUpdateUser({
          id: user.id,
          email: user.email!,
          display_name: user.user_metadata?.full_name || user.email,
          avatar_url: user.user_metadata?.avatar_url,
        })
      }
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        await createOrUpdateUser({
          id: session.user.id,
          email: session.user.email!,
          display_name: session.user.user_metadata?.full_name || session.user.email,
          avatar_url: session.user.user_metadata?.avatar_url,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/marvel-game`,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, signInWithGoogle, signOut }
}
