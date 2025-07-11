"use client"

import { X, TrendingUp, DollarSign, AlertCircle } from "lucide-react"
import { useState } from "react"

interface ConvertModalProps {
  title: string
  description: string
  onClose: () => void
  onConfirm: (expectedRevenue: number) => void
}

const ConvertModal = ({ title, onClose, description, onConfirm }: ConvertModalProps) => {
  const [expectedRevenue, setExpectedRevenue] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = () => {
    const revenue = Number.parseFloat(expectedRevenue)
    if (Number.isNaN(revenue) || revenue <= 0) {
      setError("Please enter a valid expected revenue amount.")
      return
    }
    onConfirm(revenue)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md relative overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Convert Lead</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Set expected revenue</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Info */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
            <p className="text-slate-600 dark:text-slate-300">
              You're about to convert{" "}
              <span className="font-semibold text-slate-900 dark:text-white">{description}</span> into a customer.
            </p>
          </div>

          {/* Revenue Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Expected Revenue (₹) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                placeholder="Enter expected amount"
                value={expectedRevenue}
                onChange={(e) => {
                  setExpectedRevenue(e.target.value)
                  setError(null)
                }}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter the expected revenue from this converted lead
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 font-medium rounded-xl border border-slate-300 dark:border-slate-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Convert Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConvertModal
