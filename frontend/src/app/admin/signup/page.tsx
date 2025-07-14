"use client"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from "axios"
import toast from "react-hot-toast"

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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SEVER_URI}/admin-registration`, data)
      return response.data
    },
    onSuccess: (_, formData) => {
      setUserData(formData)
      setShowOtp(true)
      setCanResend(false)
      setTimer(60)
      startResendTimer()
      toast.success("OTP sent to your email!")
    },
    onError: (err: AxiosError) => {
      const errMessage = (err.response?.data as { message?: string })?.message || "Signup failed."
      toast.error(errMessage)
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) {
        toast.error("User data not found. Please sign up again.")
        return
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SEVER_URI}/verify-admin`,
        {
          ...userData,
          otp: otp.join(""),
        },
        { withCredentials: true },
      )
      return response.data
    },
    onSuccess: () => {
      toast.success("Account verified successfully! Redirecting to login...")
      router.push("/admin/login")
    },
    onError: (err: AxiosError) => {
      const errMessage = (err.response?.data as { message?: string })?.message || "OTP verification failed."
      toast.error(errMessage)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Sign Up</h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm">Create your admin account</p>
        </div>

        <h3 className="text-2xl font-semibold text-center text-slate-900 dark:text-white mb-2">
          Sign Up for Open Leads Admin
        </h3>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
          Already have an account?{" "}
          <Link href={"/admin/login"} className="text-blue-600 dark:text-blue-400 hover:underline">
            Login
          </Link>
        </p>

        {!showOtp ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  {...register("name", {
                    required: "Name is required.",
                  })}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{String(errors.name.message)}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="abc@xyz.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address.",
                    },
                  })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{String(errors.email.message)}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-500 transition-colors"
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                >
                  {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>}
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {signupMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Verify Your Email</h3>
              <p className="text-slate-600 dark:text-slate-300">
                A 4-digit OTP has been sent to <span className="font-medium">{userData?.email}</span>. Please enter it
                below to verify your account.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <input
                  type="text"
                  key={index}
                  ref={(el) => {
                    if (el) inputRef.current[index] = el
                  }}
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl font-bold bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                />
              ))}
            </div>
            <button
              disabled={verifyOtpMutation.isPending || otp.some((d) => d === "")}
              onClick={() => verifyOtpMutation.mutate()}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verifyOtpMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying OTP...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
            <p className="text-sm text-center text-slate-600 dark:text-slate-300">
              {canResend ? (
                <button onClick={resendOtp} className="text-blue-600 dark:text-blue-400 hover:underline">
                  Resend OTP
                </button>
              ) : (
                <span>Resend OTP in {timer}s</span>
              )}
            </p>
            {verifyOtpMutation.isError && verifyOtpMutation.error instanceof AxiosError && (
              <p className="text-red-500 text-sm text-center mt-2">
                {verifyOtpMutation.error.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Signup
