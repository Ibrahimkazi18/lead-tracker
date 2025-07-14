"use client"
import useAgent from "@/hooks/useAgent"
import { usePlanStatus } from "@/hooks/usePlan"
import axiosInstance from "@/utils/axiosInstance"
import { useQuery } from "@tanstack/react-query"
import {
  ChevronRight,
  CreditCard,
  Star,
  Calendar,
  DollarSign,
  Check,
  X,
  Smartphone,
  QrCode,
  Shield,
  Zap,
  Crown,
} from "lucide-react"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import Head from "next/head"

const SubscriptionPlansPage = () => {
  const { agent } = useAgent()
  const { isPlanActive } = usePlanStatus()
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [paymentRef, setPaymentRef] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [upiId, setUpiId] = useState("")

  useEffect(() => {
    const yourUpiId = process.env.NEXT_PUBLIC_UPI_ID as string
    setUpiId(yourUpiId)
  }, [])

  const yourName = process.env.NEXT_PUBLIC_UPI_ID as string

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-all-plans-agent`)
      return response?.data?.plans
    },
  })

  const getUPIUrl = (amount: number) => `upi://pay?pa=${upiId}&pn=${encodeURIComponent(yourName)}&am=${amount}&cu=INR`

  const openModal = (plan: any) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setPaymentRef("")
  }

  const handleManualPayment = async () => {
    if (!paymentRef) {
      toast.error("Please enter UPI payment reference.")
      return
    }
    try {
      await axiosInstance.post(`/request-subscription/${agent.id}`, {
        planId: selectedPlan.id || "",
        paymentRef,
      })
      toast.success("Payment request submitted for admin confirmation.")
      closeModal()
    } catch (err) {
      toast.error("Failed to submit payment request.")
    }
  }

  const getPlanIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Shield className="w-6 h-6" />
      case 1:
        return <Zap className="w-6 h-6" />
      case 2:
        return <Crown className="w-6 h-6" />
      default:
        return <CreditCard className="w-6 h-6" />
    }
  }

  return (
    <>
      <Head>
        <title>Subscription Plans | Open Leads</title>
        <meta
          name="description"
          content="Explore our flexible subscription plans tailored for agents. Unlock premium CRM features and grow your real estate business with Open Leads."
        />
        <meta
          name="keywords"
          content="subscription plans, real estate CRM pricing, lead management tools, Open Leads, agent subscription, premium plans"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Subscription Plans | Open Leads" />
        <meta
          property="og:description"
          content="Choose the perfect plan and unlock premium features to supercharge your sales pipeline with Open Leads."
        />
        <meta property="og:url" content="https://www.openleads.in/dashboard/subscription-plans" />
        <meta property="og:site_name" content="Open Leads" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.openleads.in/og-image-subscription.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Open Leads Subscription Plans" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Subscription Plans | Open Leads" />
        <meta
          name="twitter:description"
          content="Get access to powerful features by subscribing to one of Open Leads' premium plans tailored for agents."
        />
        <meta name="twitter:image" content="https://www.openleads.in/og-image-subscription.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Subscription Plans
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300">
                    Choose the perfect plan to unlock premium features and grow your business
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
                  <span>Available Plans</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Plan Notice */}
          {isPlanActive && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Active Subscription</h3>
                    <p className="text-green-700 dark:text-green-300">
                      You already have an active plan. Enjoy all the premium features!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 animate-pulse"
                  >
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                ))
              : plans?.map((plan: any, index: number) => {
                  const active = isPlanActive
                  const isPopular = index === 1
                  return (
                    <div
                      key={plan?.id}
                      className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                        isPopular
                          ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {/* Popular Badge */}
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                            <Star className="w-4 h-4 fill-current" />
                            Most Popular
                          </div>
                        </div>
                      )}

                      <div className="p-8">
                        {/* Plan Header */}
                        <div className="text-center mb-8">
                          <div
                            className={`inline-flex p-3 rounded-xl mb-4 ${
                              isPopular
                                ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {getPlanIcon(index)}
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan?.name}</h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed min-h-[48px]">
                            {plan?.description}
                          </p>
                        </div>

                        {/* Pricing */}
                        <div className="text-center mb-8">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-slate-500" />
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">₹{plan?.price}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{plan?.duration} days validity</span>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button
                          disabled={active}
                          onClick={() => openModal(plan)}
                          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                            active
                              ? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                              : isPopular
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl"
                                : "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl"
                          }`}
                        >
                          {active ? (
                            <>
                              <Check className="w-4 h-4" />
                              Active Plan
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4" />
                              Choose Plan
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
          </div>

          {/* Payment Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md relative overflow-hidden">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">UPI Payment</h2>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">Complete your subscription payment</p>
                    </div>
                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Plan Summary */}
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedPlan?.name}</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{selectedPlan?.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedPlan?.duration} days validity</span>
                    </div>
                  </div>

                  {/* Payment Instructions */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-slate-900 dark:text-white">Scan & Pay</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                      Scan the QR code with any UPI app to pay{" "}
                      <span className="font-semibold text-blue-600 dark:text-blue-400">₹{selectedPlan?.price}</span> to{" "}
                      <span className="font-semibold">{upiId}</span>
                    </p>

                    {/* QR Code */}
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-white rounded-xl shadow-inner border border-slate-200">
                        <QRCodeCanvas
                          value={getUPIUrl(selectedPlan?.price || 0)}
                          size={180}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="M"
                          includeMargin={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Transaction ID Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      UPI Transaction ID *
                    </label>
                    <div className="relative">
                      <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., 3456GH78UPI"
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enter the transaction ID you received after making the payment
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleManualPayment}
                    disabled={!paymentRef.trim()}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Submit Payment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SubscriptionPlansPage
