"use client"
import axiosInstance from "@/utils/axiosInstance"
import { formatDate } from "@/utils/formatdate"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight, Search, User, CreditCard, Calendar, CheckCircle, IndianRupee } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

const ActivePlansPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: allActivePlans = [], isLoading } = useQuery({
    queryKey: ["active-plans"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-all-active-plans`)
      return response?.data?.active || []
    },
  })

  const filteredPlans = useMemo(() => {
    return allActivePlans.filter((a: any) => a.agent.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, allActivePlans])

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Active
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
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Active Plans</h1>
                <p className="text-slate-600 dark:text-slate-300">
                  View and manage all active subscription plans across agents
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
                <span>Active Plans</span>
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
                All Active Subscription Plans
                {!isLoading && allActivePlans.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                    {filteredPlans.length} of {allActivePlans.length}
                  </span>
                )}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                Search and review details of currently active plans
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
                {allActivePlans.length > 0 && (
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search agents by name..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                      />
                    </div>
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
                              Payment Ref
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Status
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Confirmed On
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPlans.map((request: any) => (
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
                                <div className="text-slate-600 dark:text-slate-300">{request?.plan?.duration}</div>
                              </td>
                              <td className="py-4 px-2">
                                <div className="text-slate-600 dark:text-slate-300">{request?.paymentRef}</div>
                              </td>
                              <td className="py-4 px-2">{getStatusBadge(request?.status)}</td>
                              <td className="py-4 px-2">
                                <div className="text-slate-600 dark:text-slate-300">
                                  {formatDate(request?.confirmedAt)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile/Tablet Cards */}
                    <div className="lg:hidden space-y-4">
                      {filteredPlans.map((request: any) => (
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
                              <IndianRupee className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-300">₹{request?.plan?.price}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-300">
                                Duration: {request?.plan?.duration} days
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-600 dark:text-slate-300">
                                Payment Ref: {request?.paymentRef}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">{getStatusBadge(request?.status)}</div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-300">
                                Confirmed: {formatDate(request?.confirmedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : allActivePlans.length > 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No plans found</h4>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      No active plans match your search criteria. Try adjusting your search terms.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No active plans yet</h4>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      There are no active subscription plans at the moment.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivePlansPage
