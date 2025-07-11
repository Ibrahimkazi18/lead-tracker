"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import axios, { type AxiosError } from "axios"
import { Phone, ArrowRight, CheckCircle, AlertCircle, ArrowLeft, Shield, Sparkles } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  name: string
  email: string
  picture: string
}

interface CompleteProfileData {
  mobile: string
}

const CompleteProfile = () => {
  const [mobile, setMobile] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isValidMobile, setIsValidMobile] = useState(false)
  const router = useRouter()

  // Validate mobile number (Indian format)
  const validateMobile = (phone: string) => {
    const mobileRegex = /^[6-9]\d{9}$/
    return mobileRegex.test(phone)
  }

  useEffect(() => {
    setIsValidMobile(validateMobile(mobile))
    setError(null)
  }, [mobile])

  useEffect(() => {
    const profileData = localStorage.getItem("tempUserProfile")
    if (profileData) {
      try {
        const profile = JSON.parse(profileData)
        setUserProfile(profile)
      } catch (err) {
        console.error("Failed to parse user profile:", err)
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const completeProfileMutation = useMutation({
    mutationFn: async (data: CompleteProfileData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SEVER_URI}/complete-profile`,
        {
          mobile: data.mobile,
          ...userProfile,
        },
        { withCredentials: true },
      )
      return response.data
    },
    onSuccess: () => {
      localStorage.removeItem("tempUserProfile")
      router.push("/dashboard")
    },
    onError: (err: AxiosError) => {
      const errMessage = (err.response?.data as { message?: string })?.message || "Failed to complete profile."
      setError(errMessage)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidMobile) {
      setError("Please enter a valid mobile number")
      return
    }
    completeProfileMutation.mutate({ mobile })
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
    setMobile(value)
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-4 relative">
            <Sparkles className="w-8 h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Complete Your Profile</h1>
          <p className="text-slate-600 dark:text-slate-300">Just one more step to get started</p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* User Info Header */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={userProfile.picture || "/placeholder.svg"}
                  alt={userProfile.name}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white truncate">{userProfile.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{userProfile.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Google Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mobile Number Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={handleMobileChange}
                    className={`w-full pl-16 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      mobile && isValidMobile
                        ? "border-green-300 dark:border-green-600 focus:ring-green-500"
                        : mobile && !isValidMobile
                          ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                          : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                    }`}
                    maxLength={10}
                  />
                  {mobile && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isValidMobile ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile validation feedback */}
                {mobile && (
                  <div
                    className={`text-xs flex items-center gap-1 ${
                      isValidMobile ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isValidMobile ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        <span>Valid mobile number</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        <span>Please enter a valid 10-digit mobile number</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Why do we need this?</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Your mobile number is needed for other agents to add you as a referral
                      and for other aspects too.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValidMobile || completeProfileMutation.isPending}
                className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {completeProfileMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Completing Profile...
                  </>
                ) : (
                  <>
                    Complete Profile
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfile
