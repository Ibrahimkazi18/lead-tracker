"use client"

import { useMutation } from "@tanstack/react-query"
import GoogleButton from "@/shared/components/google-button"
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowRight, AlertCircle, Shield, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from "axios"

type FormData = {
  name: string
  email: string
  password: string
}

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [timer, setTimer] = useState(60)
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState(["", "", "", ""])
  const [userData, setUserData] = useState<FormData | null>(null)
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

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SEVER_URI}/user-registration`, data);
      return response.data
    },
    onSuccess: (_, formData) => {
      setUserData(formData)
      setShowOtp(true)
      setCanResend(false)
      setTimer(60)
      startResendTimer()
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) {
        return
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SEVER_URI}/verify-user`, {
        ...userData,
        otp: otp.join(""),
      })
      return response.data
    },
    onSuccess: () => {
      router.push("/login")
    },
  })

  const onSubmit = (data: FormData) => {
    signupMutation.mutate(data)
  }

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

  const resendOtp = () => {
    if (userData) {
      signupMutation.mutate(userData)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl mb-4">
            {showOtp ? <Shield className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {showOtp ? "Verify Your Email" : "Create Account"}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {showOtp ? "Enter the verification code sent to your email" : "Join us and start managing your leads"}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-8">
            {!showOtp ? (
              <>
                {/* Login Link */}
                <div className="text-center mb-6">
                  <p className="text-slate-600 dark:text-slate-300">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>

                {/* Google Button */}
                <div className="mb-6">
                  <GoogleButton />
                </div>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-slate-300 dark:border-slate-600" />
                  <span className="px-4 text-sm text-slate-500 dark:text-slate-400">or sign up with email</span>
                  <div className="flex-1 border-t border-slate-300 dark:border-slate-600" />
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        {...register("name", {
                          required: "Name is required.",
                        })}
                      />
                    </div>
                    {errors.name && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{String(errors.name.message)}</span>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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

                            {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        {...register("phone", {
                          required: "Phone is required.",
                          pattern: {
                            value: /^[6-9]\d{9}$/,
                            message: "Invalid phone address.",
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

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {signupMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* OTP Verification */
              <div className="space-y-6">
                {/* OTP Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    We've sent a 4-digit verification code to <span className="font-semibold">{userData?.email}</span>
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
                        className="w-12 h-12 text-center text-lg font-semibold bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      />
                    ))}
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  disabled={verifyOtpMutation.isPending || otp.some((digit) => !digit)}
                  onClick={() => verifyOtpMutation.mutate()}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifyOtpMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Email
                      <Shield className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                  {canResend ? (
                    <button
                      onClick={resendOtp}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Resend verification code
                    </button>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">Resend code in {timer}s</p>
                  )}
                </div>

                {/* Error Display */}
                {verifyOtpMutation.isError && verifyOtpMutation.error instanceof AxiosError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{verifyOtpMutation.error.response?.data?.message || verifyOtpMutation.error.message}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {/* {!showOtp && (
          <div className="text-center mt-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default Signup
