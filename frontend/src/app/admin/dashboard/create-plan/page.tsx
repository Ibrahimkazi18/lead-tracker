"use client"
import axiosInstance from "@/utils/axiosInstance"
import { useMutation } from "@tanstack/react-query"
import { ChevronRight, PlusCircle, IndianRupee, CalendarDays, FileText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

const CreatePlanPage = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      duration: 0,
      price: 0,
    },
  })

  const [loading, setLoading] = useState(false)

  const createPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.post(`/create-plan`, data)
      return response.data
    },
    onSuccess: () => {
      setLoading(false)
      toast.success("Successfully created the plan!")
      reset()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong, try again later.")
      setLoading(false)
    },
  })

  const onSubmit = (data: any) => {
    setLoading(true)
    createPlanMutation.mutate(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Create New Plan</h1>
                <p className="text-slate-600 dark:text-slate-300">Define new subscription plans for your agents</p>
              </div>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <Link
                  href="/dashboard"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <ChevronRight size={16} className="mx-2" />
                <span>Create Plan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Plan Details
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                Fill in the details for your new subscription plan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Plan Name *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter plan's name"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      {...register("name", { required: "Plan Name is required!" })}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="price"
                      type="number"
                      placeholder="Enter Price"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      {...register("price", {
                        required: "Price is required!",
                        min: { value: 1, message: "Price must be at least 1" },
                      })}
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message as string}</p>}
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Duration (days) *
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="duration"
                      type="number"
                      placeholder="e.g., 30, 90, 365"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      {...register("duration", {
                        required: "Duration is required!",
                        min: { value: 1, message: "Duration must be at least 1 day" },
                      })}
                    />
                  </div>
                  {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message as string}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Plan Description (Max 50 words)
                  </label>
                  <textarea
                    id="description"
                    rows={7}
                    placeholder="Enter plan description for quick overview"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-y"
                    {...register("description", {
                      validate: (value) => {
                        if (!value) return true // Allow empty description
                        const wordCount = value.trim().split(/\s+/).length
                        return wordCount <= 50 || `Plan Description cannot exceed 50 words (Current: ${wordCount})`
                      },
                    })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusCircle size={16} />
                    Create Plan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePlanPage
