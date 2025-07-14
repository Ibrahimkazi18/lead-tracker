"use client"

import useAgent from "@/hooks/useAgent"
import axiosInstance from "@/utils/axiosInstance"
import { getDaysLeft } from "@/utils/formatdate"
import { useQuery } from "@tanstack/react-query"
import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock,
  DollarSign,
  TimerReset,
  Crown,
  Shield,
  CheckCircle,
  Calendar,
} from "lucide-react"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"

export const dynamic = "force-dynamic"

const YourPlanPage = () => {
  const { agent } = useAgent()
  const [daysLeft, setdaysLeft] = useState(0)

  const { data: activePlan = {} } = useQuery({
    queryKey: ["active-plan"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-active-agent-plan/${agent.id}`)
      return response?.data?.active
    },
  })

  const { data: planDetails } = useQuery({
    queryKey: ["plan-details", activePlan?.planId],
    enabled: !!activePlan?.planId,
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-plan/${activePlan?.planId}`)
      return response?.data?.plan
    },
  })

  useEffect(() => {
    setdaysLeft(getDaysLeft(activePlan?.expiresAt))
  }, [activePlan])

  const getPlanIcon = () => {
    if (planDetails?.name?.toLowerCase().includes("premium")) {
      return <Crown className="w-8 h-8" />
    }
    return <Shield className="w-8 h-8" />
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      default:
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
    }
  }

  return (
    <>
     <Head>
        <title>Your Plan | Open Leads</title>
        <meta
          name="description"
          content="View your current subscription plan details including status, duration, remaining days, and payment information. Manage your CRM plan efficiently with Open Leads."
        />
        <meta
          name="keywords"
          content="CRM subscription, plan status, manage plan, Open Leads plan, upgrade subscription, current plan details"
        />

        {/* Open Graph Meta */}
        <meta property="og:title" content="Your Plan | Open Leads" />
        <meta
          property="og:description"
          content="Track your active CRM subscription on Open Leads. See status, confirmed and expiry dates, amount paid, and remaining validity."
        />
        <meta property="og:url" content="https://www.openleads.in/dashboard/your-plan" />
        <meta property="og:site_name" content="Open Leads" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.openleads.in/og-image-plan.png" />
        <meta property="og:image:alt" content="Your Active Plan - Open Leads" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Your Plan | Open Leads" />
        <meta
          name="twitter:description"
          content="Get a full overview of your subscription plan on Open Leads. See how many days are left and manage your CRM usage effectively."
        />
        <meta name="twitter:image" content="https://www.openleads.in/og-image-plan.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Your Active Plan</h1>
                  <p className="text-slate-600 dark:text-slate-300">
                    Manage and view details of your current subscription plan
                  </p>
                </div>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <Link
                    href="/dashboard"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <ChevronRight size={16} className="mx-2" />
                  <span>Your Active Plan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Details Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {planDetails ? (
              <>
                {/* Plan Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl text-blue-600 dark:text-blue-400">
                        {getPlanIcon()}
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                          {planDetails?.name}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mt-1">{planDetails?.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activePlan?.status)}`}
                      >
                        {activePlan?.status ? activePlan?.status.toUpperCase() : "BASIC"}
                      </span>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Active Subscription</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Details Grid */}
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Price */}
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Total Amount</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">₹{planDetails?.price}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">One-time payment</div>
                    </div>

                    {/* Duration */}
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Plan Duration</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{planDetails?.duration}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Days validity</div>
                    </div>

                    {/* Days Left */}
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                          <TimerReset className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Remaining</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{daysLeft}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Day(s) left</div>
                    </div>
                  </div>

                  {/* Timeline Section */}
                  <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Subscription Timeline
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Confirmed Date */}
                      <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <BadgeCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Plan Confirmed</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">
                            {activePlan?.confirmedAt
                              ? new Date(activePlan.confirmedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Not available"}
                          </div>
                        </div>
                      </div>

                      {/* Expiry Date */}
                      <div className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                          <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Plan Expires</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">
                            {activePlan?.expiresAt
                              ? new Date(activePlan.expiresAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Not available"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href="/buy-plan"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-center"
                      >
                        Upgrade Plan
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl border border-slate-300 dark:border-slate-600 transition-all duration-200 text-center"
                      >
                        Back to Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Loading State */
              <div className="p-8">
                <div className="animate-pulse space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    <div className="space-y-2">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded mb-4"></div>
                        <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded mb-2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-24"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default YourPlanPage
