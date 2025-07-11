"use client"

import { usePlanStatus } from "@/hooks/usePlan"
import { AlertTriangle, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

const SubscriptionExpiryWarning = () => {
  const { willExpireSoon, daysLeft } = usePlanStatus()

  if (!willExpireSoon || !daysLeft) return null

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-6 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Subscription Expiring Soon</h3>
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-200 dark:bg-amber-800 rounded-full">
              <Clock className="w-3 h-3 text-amber-700 dark:text-amber-300" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                {daysLeft} day{daysLeft > 1 ? "s" : ""} left
              </span>
            </div>
          </div>
          <p className="text-amber-700 dark:text-amber-300 mb-4">
            Your subscription will expire in {daysLeft} day{daysLeft > 1 ? "s" : ""}. Renew now to continue enjoying all
            premium features without interruption.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/subscription-plans"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Renew Subscription
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/your-plan"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700 text-amber-800 dark:text-amber-200 font-medium rounded-lg border border-amber-300 dark:border-amber-600 transition-all duration-200"
            >
              View Plan Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionExpiryWarning
