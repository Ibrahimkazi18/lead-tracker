"use client"

import { X, Trash2, AlertTriangle } from "lucide-react"

interface DeleteModalProps {
  title: string
  description: string
  onClose: () => void
  onConfirm: () => void
}

const DeleteModal = ({ title, onClose, description, onConfirm }: DeleteModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-red-200 dark:border-red-800 w-full max-w-md relative overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-6 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-900 dark:text-red-100">Delete {title}</h2>
                <p className="text-red-700 dark:text-red-300 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">Permanent Deletion</h4>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Are you sure you want to delete <span className="font-semibold">{description}</span>?
                </p>
                <p className="text-red-600 dark:text-red-400 text-xs mt-2 font-medium">
                  This action <strong>cannot be undone</strong> and all associated data will be permanently removed.
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
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Delete Forever
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
