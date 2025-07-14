"use client"
import ConfirmModal from "@/shared/components/confirm-modal"
import DeleteModal from "@/shared/components/delete-modal"
import axiosInstance from "@/utils/axiosInstance"
import { formatDate } from "@/utils/formatdate"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ChevronRight,
  MoreVertical,
  SquareCheck,
  Trash2,
  X,
  Search,
  DollarSign,
  Calendar,
  User,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import toast from "react-hot-toast"

const ConfirmPaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<any>()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const queryClient = useQueryClient()

  const { data: allRequests = [], isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-pending-requests`)
      return response?.data?.requests || []
    },
  })

  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.put(`/confirm-subscription/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] })
      toast.success("Confirmed Request Successfully!")
      setShowConfirmModal(false)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to confirm request.")
      setShowConfirmModal(false)
    },
  })

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.put(`/reject-subscription/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] })
      toast.success("Rejected Request Successfully!")
      setShowRejectModal(false)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to reject request.")
      setShowRejectModal(false)
    },
  })

  const openConfirmModal = async (request: any) => {
    setSelectedRequest(request)
    setShowConfirmModal(true)
  }

  const openRejectModal = async (request: any) => {
    setSelectedRequest(request)
    setShowRejectModal(true)
  }

  const filteredRequests = useMemo(() => {
    return allRequests.filter((a: any) => a.agent.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, allRequests])

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-medium rounded-full">
            <Calendar className="w-3 h-3" />
            Pending
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-full">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Confirm Payments</h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Review and confirm pending subscription payment requests
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
                <span>Pending Requests</span>
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
                Pending Subscription Requests
                {!isLoading && allRequests.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                    {filteredRequests.length} of {allRequests.length}
                  </span>
                )}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                Approve or reject new subscription payment requests
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
                {allRequests.length > 0 && (
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search requests by agent name..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {filteredRequests.length > 0 ? (
                  <div className="space-y-4">
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Agent
                              </div>
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Plan
                              </div>
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Price
                              </div>
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Created
                              </div>
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Status
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRequests.map((request: any) => (
                            <tr
                              key={request?.id}
                              className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                              <td className="py-4 px-2">
                                <div className="font-medium text-slate-900 dark:text-white">{request?.agent?.name}</div>
                              </td>
                              <td className="py-4 px-2">
                                <div className="text-slate-600 dark:text-slate-300">{request?.plan?.name}</div>
                              </td>
                              <td className="py-4 px-2">
                                <div className="text-slate-600 dark:text-slate-300">₹{request?.plan?.price}</div>
                              </td>
                              <td className="py-4 px-2">
                                <div className="text-slate-600 dark:text-slate-300">
                                  {formatDate(request?.requestedAt)}
                                </div>
                              </td>
                              <td className="py-4 px-2">{getStatusBadge(request?.status)}</td>
                              <td className="py-4 px-2">
                                <PlanActions
                                  onConfirm={() => openConfirmModal(request)}
                                  onReject={() => openRejectModal(request)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile/Tablet Cards */}
                    <div className="lg:hidden space-y-4">
                      {filteredRequests.map((request: any) => (
                        <div
                          key={request?.id}
                          className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-500" />
                              <span className="font-medium text-slate-900 dark:text-white">{request?.agent?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-300">{request?.plan?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-300">₹{request?.plan?.price}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-300">
                                Requested: {formatDate(request?.requestedAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">{getStatusBadge(request?.status)}</div>
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                              <div className="flex justify-end">
                                <PlanActions
                                  onConfirm={() => openConfirmModal(request)}
                                  onReject={() => openRejectModal(request)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : allRequests.length > 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No requests found</h4>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      No pending requests match your search criteria. Try adjusting your search terms.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No pending requests</h4>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      There are no pending subscription payment requests at the moment.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Confirm Modal */}
        {showConfirmModal && selectedRequest && (
          <ConfirmModal
            title="Confirm Subscription"
            description={`Are you sure you want to confirm the subscription for ${selectedRequest.agent.name} (${selectedRequest.plan.name})?`}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={() => confirmMutation.mutate(selectedRequest?.id)}
          />
        )}
        {/* Reject Modal */}
        {showRejectModal && selectedRequest && (
          <DeleteModal
            title="Reject Subscription"
            description={`Are you sure you want to reject the subscription for ${selectedRequest.agent.name} (${selectedRequest.plan.name})? This action cannot be undone.`}
            onClose={() => setShowRejectModal(false)}
            onConfirm={() => rejectMutation.mutate(selectedRequest?.id)}
          />
        )}
      </div>
    </div>
  )
}

const PlanActions = ({ onConfirm, onReject }: any) => {
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
              onConfirm()
              setOpen(false)
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors outline-none"
          >
            <SquareCheck className="w-4 h-4 mr-2" />
            Confirm
          </button>
          <button
            onClick={() => {
              onReject()
              setOpen(false)
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors outline-none"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reject
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

export default ConfirmPaymentsPage
