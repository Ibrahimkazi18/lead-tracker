"use client"

import { useEffect, useState } from "react"
import { Loader2, ChevronDown } from "lucide-react"
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
  const [userProfile, setUserProfile] = useState<GoogleProfile | null>(null)
  const [showAccountPicker, setShowAccountPicker] = useState(false)

  const handleCredentialResponse = async (response: GoogleResponse) => {
    setIsLoading(true)
    setError(null)
    console.log("in handle google login");
    
    try {
      const payload = JSON.parse(atob(response.credential.split(".")[1]))

      setUserProfile({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      })
      
      const result = await axiosInstance.post(`${process.env.NEXT_PUBLIC_SEVER_URI}/google-auth`, {token : response.credential});

      if (result.status === 200) {
        setTimeout(() => {
          // window.location.assign("/dashboard");
          localStorage.setItem(
            "tempUserProfile",
            JSON.stringify({
              name: payload.name,
              email: payload.email,
              picture: payload.picture,
            })
          );

          window.location.assign("/complete-profile");    // for taking mobile number
        }, 100)
      } else {
        const errorMessage = result.data?.message || "Google Sign In failed."
        setError(errorMessage)
        setUserProfile(null)
      }

    } catch (err) {
      console.error("Google Sign In error", err)
      const errorMessage = "Network error. Please try again."
      setError(errorMessage)
      setUserProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  const initializeGoogleSignIn = () => {
    if (typeof window === "undefined" || !window.google?.accounts?.id) return

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
        ux_mode: 'popup',
        itp_support: true,            // for iOS/Safari
        use_fedcm_for_prompt: true,
      });

    } catch (err) {
      console.error("Failed to initialize Google Sign-In:", err)
      setError("Failed to load Google Sign-In")
    }
  }

  const handleGoogleSignIn = () => {
    if (window.google?.accounts?.id) {
      setShowAccountPicker(true);


      window.google.accounts.id.prompt((notification: any) => {
        setShowAccountPicker(false);

        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {  
          setError("Google sign-in was cancelled or blocked. Please try again.");
        }
      })


    } else {
      setError("Google Sign-In is not available")
    }
  }

  useEffect(() => {
    // Check if Google script is already loaded
    if (window.google?.accounts?.id) {
      initializeGoogleSignIn()
    } else {
      // Wait for Google script to load
      const checkGoogle = setInterval(() => {
        if (window.google?.accounts?.id) {
          initializeGoogleSignIn()
          clearInterval(checkGoogle)
        }
      }, 100)

      // Cleanup interval after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkGoogle)
        setError("Failed to load Google Sign-In")
      }, 10000)

      return () => {
        clearInterval(checkGoogle)
        clearTimeout(timeout)
      }
    }
  }, [])

  if (userProfile && isLoading) {
    return (
      <div className="w-full">
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
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">{userProfile.name}</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 truncate">Signing in...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-3">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main Google Sign-In Button */}
      <button
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
        className="w-full group relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          {/* Google Logo */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center">
              <div className="w-6 h-6 relative">
                {/* Google "G" using CSS */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 p-[1px]">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">
                      G
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Continue with Google</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sign in to your account</p>
              </div>

              {/* Loading or Arrow */}
              <div className="flex-shrink-0">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-red-500/5 via-yellow-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </button>

      {/* Account Picker Indicator */}
      {showAccountPicker && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Choose your Google account...</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Alternative Compact Version
export const CompactGoogleButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<GoogleProfile | null>(null)

  const handleCredentialResponse = async (response: GoogleResponse) => {
    setIsLoading(true)

    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split(".")[1]))
      setUserProfile({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      })

      // Send to backend
      const result = await fetch(`${process.env.NEXT_PUBLIC_SEVER_URI}/google-auth`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
      })

      const data = await result.json()

      if (result.ok) {
        setTimeout(() => {
          window.location.assign("/dashboard")
        }, 100)
      } else {
        setUserProfile(null)
        alert(data.message || "Google Sign In failed.")
      }
    } catch (err) {
      console.error("Google Sign In error", err)
      setUserProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt()
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
      })
    }
  }, [])

  if (userProfile && isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
        <img src={userProfile.picture || "/placeholder.svg"} alt={userProfile.name} className="w-8 h-8 rounded-full" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userProfile.name}</p>
        </div>
        <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
    >
      {/* Simple Google Icon */}
      <div className="w-8 h-8 bg-white rounded border border-slate-200 flex items-center justify-center">
        <span className="text-sm font-bold text-blue-500">G</span>
      </div>

      <span className="flex-1 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
        {isLoading ? "Signing in..." : "Continue with Google"}
      </span>

      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
    </button>
  )
}

// Extend Window interface for TypeScript
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
