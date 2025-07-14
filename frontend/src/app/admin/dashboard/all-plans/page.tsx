"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/utils/axiosInstance"
import {
  ChevronRight,
  Search,
  CreditCard,
  IndianRupee,
  Calendar,
  Star,
  MoreVertical,
  Trash2,
  PenLine,
  X,
  PlusCircle,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { formatDate } from "@/utils/formatdate"
import DeleteModal from "@/shared/components/delete-modal"
import SetDefaultModal from "@/shared/components/set-default-modal"
import UpdateModal from "@/shared/components/update-modal"
import toast from "react-hot-toast"

export interface PlanType {
  id: string
  name: string
  duration: number
  price: number
  description?: string
  isDefault: boolean
  createdAt: string
}

const PlanActions = ({ onDelete, onUpdate, onSetDefault }: any) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        onClick={() => setOpen(!open)}
        aria-label="More actions"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 overflow-hidden">
          <button
            onClick={() => {
              onDelete()
              setOpen(false)
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors outline-none"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
          <button
            onClick={() => {
              onUpdate()
              setOpen(false)
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors outline-none"
          >
            <PenLine className="w-4 h-4 mr-2" />
            Update
          </button>
          <button
            onClick={() => {
              onSetDefault()
              setOpen(false)
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors outline-none"
          >
            <Star className="w-4 h-4 mr-2" />
            Set Default
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors outline-none"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </button>
        </div>
      )}
    </div>
  )
}

const AllPlansPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<PlanType>()
  const [showSetDefaultModal, setShowSetDefaultModal] = useState(false)
  const [showDeletePlanModal, setShowDeletePlanModal] = useState(false)
  const [showUpdatePlanModal, setShowUpdatePlanModal] = useState(false)
  const queryClient = useQueryClient()

  const { data: allPlans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-all-plans`)
      return response?.data?.plans || []
    },
  })

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      await axiosInstance.delete(`/delete-plan/${planId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      toast.success("Deleted Plan Successfully!")
      setShowDeletePlanModal(false)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete plan.")
      setShowDeletePlanModal(false)
    },
  })

  const setDefaultPlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      await axiosInstance.patch(`/set-default/${planId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      toast.success("Set Plan as Default Successfully!")
      setShowSetDefaultModal(false)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to set default plan.")
      setShowSetDefaultModal(false)
    },
  })

  const updatePlanMutation = useMutation({
    mutationFn: async ({ planId, data }: { planId: string; data: any }) => {
      await axiosInstance.put(`/update-plan/${planId}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      toast.success("Plan Updated Successfully!")
      setShowUpdatePlanModal(false)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update plan.")
      setShowUpdatePlanModal(false)
    },
  })

  const openDeletePlanModal = async (plan: PlanType) => {
    setSelectedPlan(plan)
    setShowDeletePlanModal(true)
  }

  const openSetDefaultModal = async (plan: PlanType) => {
    setSelectedPlan(plan)
    setShowSetDefaultModal(true)
  }

  const openUpdateModal = async (plan: PlanType) => {
    setSelectedPlan(plan)
    setShowUpdatePlanModal(true)
  }

  const filteredPlans = useMemo(() => {
    return allPlans.filter((a: PlanType) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, allPlans])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Available Plans</h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Manage and configure all subscription plans for your platform
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
                <span>All Plans</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                All Subscription Plans
                {!isLoading && allPlans.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                    {filteredPlans.length} of {allPlans.length}
                  </span>
                )}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                View, edit, and manage all available subscription plans
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {allPlans.length > 0 && (
                  <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search plans by name..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Link
                      href="/dashboard/create-plan"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px]"
                    >
                      <PlusCircle size={16} />
                      Create Plan
                    </Link>
                  </div>
                )}

                {filteredPlans.length > 0 ? (
                  <div className="space-y-4">
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Name
                              </div>
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <IndianRupee className="w-4 h-4" />
                                Price
                              </div>
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Duration (days)
                              </div>
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                Default
                              </div>
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Created
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPlans.map((plan: any) => (
                            <tr
                              key={plan?.id}
                              className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                              <td className="py-4 px-2">
                                <div className="font-medium text-slate-900 dark:text-white">{plan?.name}</div>
                              </td>
                              <td className="py-4 px-2">
                                <div className="text-slate-600 dark:text-slate-300">₹{plan?.price}</div>
                              </td>
                              <td className="py-4 px-2">
                                <div className="text-slate-600 dark:text-slate-300">{plan?.duration}</div>
                              </td>
                              <td className="py-4 px-2">
                                <div className="text-slate-600 dark:text-slate-300">
                                  {plan?.isDefault ? "Yes" : "No"}
                                </div>
                              </td>
                              <td className="py-4 px-2">
                                <div className="text-slate-600 dark:text-slate-300">{formatDate(plan?.createdAt)}</div>
                              </td>
                              <td className="py-4 px-2">
                                <PlanActions
                                  onDelete={() => openDeletePlanModal(plan)}
                                  onUpdate={() => openUpdateModal(plan)}
                                  onSetDefault={() => openSetDefaultModal(plan)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile/Tablet Cards */}
                    <div className="lg:hidden space-y-4">
                      {filteredPlans.map((plan: any) => (
                        <div
                          key={plan?.id}
                          className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-slate-500" />
                              <span className="font-medium text-slate-900 dark:text-white">{plan?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IndianRupee className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-300">Price: ₹{plan?.price}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-300">
                                Duration: {plan?.duration} days
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-300">
                                Default: {plan?.isDefault ? "Yes" : "No"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-300">
                                Created: {formatDate(plan?.createdAt)}
                              </span>
                            </div>
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                              <div className="flex justify-end">
                                <PlanActions
                                  onDelete={() => openDeletePlanModal(plan)}
                                  onUpdate={() => openUpdateModal(plan)}
                                  onSetDefault={() => openSetDefaultModal(plan)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : allPlans.length > 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No plans found</h4>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      No plans match your search criteria. Try adjusting your search terms.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No plans yet</h4>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                      You haven't created any subscription plans yet.
                    </p>
                    <Link
                      href="/dashboard/create-plan"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Create Your First Plan
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Set Default Modal */}
        {showSetDefaultModal && selectedPlan && (
          <SetDefaultModal
            title="Set Default Plan"
            description={`Are you sure you want to set "${selectedPlan.name}" as the default plan?`}
            onClose={() => setShowSetDefaultModal(false)}
            onConfirm={() => setDefaultPlanMutation.mutate(selectedPlan?.id)}
          />
        )}
        {/* Delete Plan Modal */}
        {showDeletePlanModal && selectedPlan && (
          <DeleteModal
            title="Delete Plan"
            description={`Are you sure you want to delete the plan "${selectedPlan.name}"? This action cannot be undone.`}
            onClose={() => setShowDeletePlanModal(false)}
            onConfirm={() => deletePlanMutation.mutate(selectedPlan?.id)}
          />
        )}
        {/* Update Plan Modal */}
        {showUpdatePlanModal && selectedPlan && (
          <UpdateModal
            plan={{
              id: selectedPlan.id,
              name: selectedPlan.name,
              price: selectedPlan.price,
              duration: selectedPlan.duration,
              description: selectedPlan.description,
            }}
            onClose={() => setShowUpdatePlanModal(false)}
            onSubmit={(updatedData) => updatePlanMutation.mutate({ planId: selectedPlan.id, data: updatedData })}
          />
        )}
      </div>
    </div>
  )
}

export default AllPlansPage
