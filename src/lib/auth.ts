import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export const useAuth = () => {
  const [user, setUser] = useState(null)

  const login = async () => {
    console.log("login")

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        skipBrowserRedirect: true
      }
    })

    if (error) {
      console.log(error)
      return
    }

    window.open(data.url)
  }

  const logout = () => {}

  return {
    user,
    login,
    logout
  }
}
