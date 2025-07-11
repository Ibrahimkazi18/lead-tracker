"use client"

import type React from "react"

import { useMutation } from "@tanstack/react-query"
import axios, { type AxiosError } from "axios"
import { Eye, EyeOff, Mail, Lock, KeyRound, ArrowRight, AlertCircle, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

type FormData = {
  email: string
  password: string
}

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email")
  const [otp, setOtp] = useState(["", "", "", ""])
  const [canResend, setCanResend] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [timer, setTimer] = useState(60)
  const [serverError, setServerError] = useState<string | null>(null)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const inputRef = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SEVER_URI}/forgot-password-user`, { email })
      return response.data
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email)
      setStep("otp")
      setServerError(null)
      setCanResend(false)
      startResendTimer()
    },
    onError: (error: AxiosError) => {
      const errMessage = (error.response?.data as { message?: string })?.message || "Invalid Credentials."
      setServerError(errMessage)
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) {
        return
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SEVER_URI}/verify-forgot-password-user`, {
        email: userEmail,
        otp: otp.join(""),
      })
      return response.data
    },
    onSuccess: () => {
      setStep("reset")
      setServerError(null)
    },
    onError: (error: AxiosError) => {
      const errMessage = (error.response?.data as { message?: string })?.message || "Invalid Credentials."
      setServerError(errMessage)
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!password) return
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SEVER_URI}/reset-password-user`, {
        email: userEmail,
        newPassword: password,
      })
      return response.data
    },
    onSuccess: () => {
      setStep("email")
      toast.success("Password reset successfully! Please login with your new password.")
      setServerError(null)
      router.push("/login")
    },
    onError: (error: AxiosError) => {
      const errMessage = (error.response?.data as { message?: string })?.message || "Invalid Credentials."
      setServerError(errMessage)
    },
  })

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < inputRef.current.length - 1) {
      inputRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus()
    }
  }

  const onSubmitEmail = ({ email }: { email: string }) => {
    requestOtpMutation.mutate({ email })
  }

  const onSubmitPassword = ({ password }: { password: string }) => {
    resetPasswordMutation.mutate({ password })
  }

  const getStepIcon = () => {
    switch (step) {
      case "email":
        return <Mail className="w-8 h-8 text-white" />
      case "otp":
        return <Shield className="w-8 h-8 text-white" />
      case "reset":
        return <KeyRound className="w-8 h-8 text-white" />
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case "email":
        return "Forgot Password?"
      case "otp":
        return "Check Your Email"
      case "reset":
        return "Reset Password"
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case "email":
        return "Enter your email address and we'll send you a verification code"
      case "otp":
        return "Enter the verification code sent to your email"
      case "reset":
        return "Create a new password for your account"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl mb-4">
            {getStepIcon()}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{getStepTitle()}</h1>
          <p className="text-slate-600 dark:text-slate-300">{getStepDescription()}</p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-8">
            {step === "email" && (
              <>
                {/* Back to Login */}
                <div className="text-center mb-6">
                  <p className="text-slate-600 dark:text-slate-300">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </Link>
                  </p>
                </div>

                {/* Email Form */}
                <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        {...register("email", {
                          required: "Email is required.",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address.",
                          },
                        })}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{String(errors.email.message)}</span>
                      </div>
                    )}
                  </div>

                  {/* Server Error */}
                  {serverError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{serverError}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={requestOtpMutation.isPending}
                    className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {requestOtpMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending code...
                      </>
                    ) : (
                      <>
                        Send Verification Code
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {step === "otp" && (
              <div className="space-y-6">
                {/* OTP Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    We've sent a 4-digit verification code to <span className="font-semibold">{userEmail}</span>
                  </p>
                </div>

                {/* OTP Input */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                    Enter Verification Code
                  </label>
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        ref={(el) => {
                          if (el) inputRef.current[index] = el
                        }}
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg font-semibold bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      />
                    ))}
                  </div>
                </div>

                {/* Server Error */}
                {serverError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{serverError}</span>
                    </div>
                  </div>
                )}

                {/* Verify Button */}
                <button
                  disabled={verifyOtpMutation.isPending || otp.some((digit) => !digit)}
                  onClick={() => verifyOtpMutation.mutate()}
                  className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifyOtpMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Code
                      <Shield className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                  {canResend ? (
                    <button
                      onClick={() => requestOtpMutation.mutate({ email: userEmail! })}
                      className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
                    >
                      Resend verification code
                    </button>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">Resend code in {timer}s</p>
                  )}
                </div>
              </div>
            )}

            {step === "reset" && (
              <>
                {/* Success Info */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Email verified successfully! Now create a new password for your account.
                  </p>
                </div>

                {/* Reset Password Form */}
                <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        {...register("password", {
                          required: "Password is required.",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters in length.",
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {passwordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{String(errors.password.message)}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={resetPasswordMutation.isPending}
                    className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {resetPasswordMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <KeyRound className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Need help?{" "}
            <Link
              href="/support"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
