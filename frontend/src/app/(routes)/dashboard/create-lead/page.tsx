"use client"
import useAgent from "@/hooks/useAgent"
import axiosInstance from "@/utils/axiosInstance"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ChevronRight, User, Mail, MapPin, Phone, DollarSign, Calendar, FileText, Building, IndianRupee } from "lucide-react"
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

const AddLeadPage = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: null,
      residenceAdd: "",
      contactNo: "",
      projectDetail: "",
      requirement: "",
      budget: "",
      howHeard: "",
      location: "",
      referredBy: "",
      createdAt: new Date().toISOString().slice(0, 10),
    },
  })

  const [loading, setLoading] = useState(false)
  const { agent } = useAgent()

  const { data: allAgents = [], isLoading } = useQuery({
    queryKey: ["referral-agents"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-referrals/${agent.id}`)
      return response?.data?.referrals || []
    },
  })

  const createLeadMutation = useMutation({
    mutationFn: async (data: any) => {
      const toSend = { ...data, agentId: agent.id }
      const response = await axiosInstance.post(`/create-lead`, toSend)
      return response.data
    },
    onSuccess: () => {
      toast.success("Lead created successfully!")
      setLoading(false)
      reset()
    },
    onError: () => {
      toast.error("Something went wrong, try again later.")
      setLoading(false)
      reset()
    },
  })

  const onSubmit = (data: any) => {
    setLoading(true)
    createLeadMutation.mutate(data)
  }

  return (
    <>
      <Head>
        <title>Create New Lead | Open Leads</title>
        <meta
          name="description"
          content="Add a new lead to your pipeline. Capture important lead details like contact info, budget, property requirements, and referral agent in Open Leads CRM."
        />
        <meta
          name="keywords"
          content="add lead, create lead, Open Leads CRM, real estate CRM, lead form, sales funnel, property management"
        />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:title" content="Create New Lead | Open Leads" />
        <meta
          property="og:description"
          content="Easily add and track new leads in your CRM. Open Leads helps you manage contact details, property needs, and project information all in one place."
        />
        <meta property="og:url" content="https://www.openleads.in/dashboard/create-lead" />
        <meta property="og:site_name" content="Open Leads" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.openleads.in/og-image-create.png" />
        <meta property="og:image:alt" content="Create Lead in Open Leads Dashboard" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Create New Lead | Open Leads" />
        <meta
          name="twitter:description"
          content="Fill out a simple form to add a new lead with contact, budget, and requirements. Start managing leads effectively with Open Leads."
        />
        <meta name="twitter:image" content="https://www.openleads.in/og-image-create.png" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Create New Lead</h1>
                  <p className="text-slate-600 dark:text-slate-300">
                    Add a new lead to your pipeline and track their progress
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
                  <span>Create Lead</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Personal Information
                      </h3>
                    </div>

                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Lead Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Enter lead's full name"
                          {...register("name", { required: "Name is required!" })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm flex items-center gap-1">{errors.name.message as string}</p>
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
                          placeholder="example@domain.com"
                          {...register("email", {
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email address.",
                            },
                          })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
                    </div>

                    {/* Residence Address */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Residence Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <textarea
                          placeholder="Enter complete residence address"
                          rows={3}
                          {...register("residenceAdd", { required: "Residence Address is required!" })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                      </div>
                      {errors.residenceAdd && (
                        <p className="text-red-500 text-sm">{errors.residenceAdd.message as string}</p>
                      )}
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Contact Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="+91 87654XXXXX"
                          {...register("contactNo", {
                            required: "Contact Number is required.",
                            pattern: {
                              value: /^\+?[1-9]\d{1,14}$/,
                              message: "Invalid phone number format",
                            },
                            minLength: {
                              value: 10,
                              message: "Phone number must be at least 10 digits",
                            },
                          })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      {errors.contactNo && <p className="text-red-500 text-sm">{errors.contactNo.message as string}</p>}
                    </div>

                    {/* Budget */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Budget *</label>
                      <div className="relative">
                        <select
                          {...register("budget", { required: "Budget is required!" })}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">
                            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            Select Budget
                          </option>
                          <option value="20L-50L">20L-50L</option>
                          <option value="51L-1Cr">51L-1Cr</option>
                          <option value="1Cr-2Cr">1Cr-2Cr</option>
                          <option value="Any">Any</option>
                        </select>
                        {errors.budget && (
                          <p className="text-red-500 text-sm">{errors.budget.message as string}</p>
                        )}
                      </div>
                    </div>

                    {/* Referred By */}
                    {isLoading ? (
                      <div className="space-y-2">
                        <div className="animate-pulse">
                          <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-1/3 mb-2"></div>
                          <div className="h-12 bg-slate-300 dark:bg-slate-600 rounded-xl"></div>
                        </div>
                      </div>
                    ) : allAgents.length > 0 ? (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Referred By
                        </label>
                        <select
                          {...register("referredBy")}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select referring agent</option>
                          {allAgents.map((agent: any) => (
                            <option value={agent.id} key={agent.id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                        {errors.referredBy && (
                          <p className="text-red-500 text-sm">{errors.referredBy.message as string}</p>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                        <p className="text-amber-800 dark:text-amber-200 text-sm">
                          No referral agents found. Add them in the{" "}
                          <Link href="/dashboard/add-agents" className="font-medium underline hover:no-underline">
                            Add Agents
                          </Link>{" "}
                          page.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Property Requirements
                      </h3>
                    </div>

                    {/* Search Area */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Search Area *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Enter preferred search area"
                          {...register("location", { required: "Search Area is required!" })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      {errors.location && <p className="text-red-500 text-sm">{errors.location.message as string}</p>}
                    </div>

                    {/* Requirement */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Property Type *
                      </label>
                      <select
                        {...register("requirement", { required: "Requirement is required!" })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select property type</option>
                        <option value="R_1RK">1RK</option>
                        <option value="R_1BHK">1BHK</option>
                        <option value="R_2BHK">2BHK</option>
                        <option value="R_3BHK">3BHK</option>
                        <option value="R_4BHK">4BHK</option>
                        <option value="SHOP">Shop</option>
                      </select>
                      {errors.requirement && (
                        <p className="text-red-500 text-sm">{errors.requirement.message as string}</p>
                      )}
                    </div>

                    {/* How Heard */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        How did you hear about us? *
                      </label>
                      <select
                        {...register("howHeard", { required: "This field is required!" })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select source</option>
                        <option value="HORDING">Hoarding</option>
                        <option value="FRIENDS">Friends</option>
                        <option value="STANDEY">Standey</option>
                        <option value="OTHER_SOURCES">Other Sources</option>
                      </select>
                      {errors.howHeard && <p className="text-red-500 text-sm">{errors.howHeard.message as string}</p>}
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Date of Lead *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          {...register("createdAt", { required: "Date is required" })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      {errors.createdAt && <p className="text-red-500 text-sm">{errors.createdAt.message as string}</p>}
                    </div>

                    {/* Project Detail */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Project Details
                        <span className="text-slate-500 text-xs ml-1">(Max 50 words)</span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <textarea
                          rows={4}
                          placeholder="Enter project description for quick overview..."
                          {...register("projectDetail", {
                            validate: (value) => {
                              if (!value) return true
                              const wordCount = value.trim().split(/\s+/).length
                              return wordCount <= 50 || `Project Detail cannot exceed 50 words (Current: ${wordCount})`
                            },
                          })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                      </div>
                      {errors.projectDetail && (
                        <p className="text-red-500 text-sm">{errors.projectDetail.message as string}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="px-6 sm:px-8 py-6 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Lead...
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4" />
                        Create Lead
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AddLeadPage
