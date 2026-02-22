"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { getOwnProfile } from "@/lib/profiles"

export default function ProfileRedirectPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) { router.push("/login"); return }

    getOwnProfile().then(profile => {
      if (profile?.username) {
        router.push(`/profile/${profile.username}`)
      } else {
        router.push("/profile/setup")
      }
    })
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="h-6 w-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  )
}
