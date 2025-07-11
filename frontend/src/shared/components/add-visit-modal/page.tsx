"use client"

import type { LeadType } from "@/app/(routes)/dashboard/all-leads/page"
import { X, Upload, FileImage, MessageSquare, Camera } from "lucide-react"
import { useState } from "react"

interface AddVisitModalProps {
  title: string
  description: string
  lead: LeadType
  onClose: () => void
  onConfirm: (data: { description: string; images: string[] }) => void
}

const AddVisitModal = ({ title, onClose, description, onConfirm }: AddVisitModalProps) => {
  const [visitDescription, setVisitDescription] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Convert files to Base64 strings
  const convertFilesToBase64 = async (files: File[]) => {
    const promises = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        }),
    )
    return Promise.all(promises)
  }

  const handleConfirm = async () => {
    if (selectedFiles.length > 0) {
      const base64Images = await convertFilesToBase64(selectedFiles)
      onConfirm({ description: visitDescription, images: base64Images })
    } else {
      onConfirm({ description: visitDescription, images: [] })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg relative overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Visit</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Record your visit details</p>
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
          {/* Description message */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
            <p className="text-slate-600 dark:text-slate-300">
              You are adding a visit for{" "}
              <span className="font-semibold text-slate-900 dark:text-white">{description}</span>
            </p>
          </div>

          {/* Visit Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Visit Description *
            </label>
            <textarea
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe your visit, what was discussed, outcomes, next steps..."
              rows={4}
              value={visitDescription}
              onChange={(e) => setVisitDescription(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileImage className="w-4 h-4" />
              Upload Images (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
              />
              <div className="flex items-center justify-center w-full h-32 bg-slate-50 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} file(s) selected`
                      : "Click to upload images or drag and drop"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PNG, JPG, GIF up to 10MB each</p>
                </div>
              </div>
            </div>
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                  >
                    {file.name}
                  </div>
                ))}
              </div>
            )}
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
              disabled={!visitDescription.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed"
            >
              Add Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddVisitModal
