"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import axiosInstance from "@/utils/axiosInstance"

interface GoogleResponse {
  credential: string
}

interface GoogleProfile {
  email: string
  name: string
  picture: string
}

const ModernGoogleButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<GoogleProfile | null>(null);

  const handleCredentialResponse = async (response: GoogleResponse) => {
    setIsLoading(true)
    setError(null)

    try {
      const payload = JSON.parse(atob(response.credential.split(".")[1]))

      setUserProfile({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      })

      const result = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SEVER_URI}/google-auth`, {
        token: response.credential
      })

      const data = result.data;

      if (result.status === 200) {
        localStorage.setItem(
          "tempUserProfile",
          JSON.stringify({
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
          })
        )

        setTimeout(() => {
          if (!data.phoneExists) {
            window.location.assign("/complete-profile")
          } else if (data.phoneExists) {
            window.location.assign("/dashboard")
          }
        }, 100);

      } else {
        const errorMessage = result.data?.message || "Google Sign In failed."
        setError(errorMessage)
        setUserProfile(null)
      }
    } catch (err) {
      console.error("Google Sign In error", err)
      setError("Network error. Please try again.")
      setUserProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const tryInitGoogle = () => {
      if (!window.google?.accounts?.id) return

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: "signin",
        ux_mode: "popup",
        itp_support: true,
        use_fedcm_for_prompt: true,
      })

      window.google.accounts.id.prompt()

      const button = document.getElementById("google-btn")
      if (button) {
        window.google.accounts.id.renderButton(button, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "pill",
          logo_alignment: "left",
        })
      }
    }

    if (window.google?.accounts?.id) {
      tryInitGoogle()
    } else {
      const check = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(check)
          tryInitGoogle()
        }
      }, 100)

      const timeout = setTimeout(() => {
        clearInterval(check)
        setError("Failed to load Google Sign-In")
      }, 10000)

      return () => {
        clearInterval(check)
        clearTimeout(timeout)
      }
    }
  }, [])

  return (
    <div className="w-full space-y-3">
      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading with Profile */}
      {userProfile && isLoading && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="relative">
            <img
              src={userProfile.picture || "/placeholder.svg"}
              alt={userProfile.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">{userProfile.name}</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">Signing in...</p>
          </div>
        </div>
      )}

      {/* Google Button Container */}
      <div id="google-btn" className="w-full" />
    </div>
  )
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, config: any) => void
          prompt: (callback?: (notification: any) => void) => void
        }
      }
    }
  }
}

export default ModernGoogleButton
