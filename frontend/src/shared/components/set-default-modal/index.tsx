"use client"

import { X, Star, CheckCircle } from "lucide-react"

interface SetDefaultModalProps {
  title: string
  description: string
  onClose: () => void
  onConfirm: () => void
}

const SetDefaultModal = ({ title, onClose, description, onConfirm }: SetDefaultModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md relative overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Set Default Plan</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Make this your default option</p>
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
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">Set as Default</h4>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  Are you sure you want to set <span className="font-semibold">{description}</span> as the default plan?
                </p>
                <p className="text-amber-600 dark:text-amber-400 text-xs mt-2">
                  This will be the default option for new users.
                </p>
              </div>
            </div>
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
              onClick={onConfirm}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Set as Default
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetDefaultModal
