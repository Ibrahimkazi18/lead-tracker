"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/utils/axiosInstance"
import { ChevronRight, Trash, Search, Users, Mail, User, UserMinus } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import useAgent from "@/hooks/useAgent"
import DeleteModal from "@/shared/components/delete-modal"

interface AgentType {
  id: string
  name: string
  email: string
}

const AllReferralAgentPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<any>()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { agent } = useAgent()
  const queryClient = useQueryClient()

  const { data: allAgents = [], isLoading } = useQuery({
    queryKey: ["referral-agents"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-referrals/${agent.id}`)
      return response?.data?.referrals || []
    },
  })

  const deleteDiscountCodeMutation = useMutation({
    mutationFn: async (referralId) => {
      await axiosInstance.delete(`/delete-referral-agent/${referralId}`, { params: { agentId: agent.id } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-agents"] })
      setShowDeleteModal(false)
    },
  })

  const handleDeleteClick = async (agent: any) => {
    setSelectedAgent(agent)
    setShowDeleteModal(true)
  }

  const filteredAgents = useMemo(() => {
    return allAgents.filter((a: AgentType) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, allAgents])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Referral Agents</h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Manage your network of referral agents and track their performance
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
                <span>Your Referral Agents</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Your Referral Agents
                {!isLoading && allAgents.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                    {filteredAgents.length} of {allAgents.length}
                  </span>
                )}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">Search and manage your referral network</p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Search Section */}
                {allAgents.length > 0 && (
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

                {/* Agents List */}
                {filteredAgents.length > 0 ? (
                  <div className="space-y-4">
                    {/* Desktop Table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Name
                              </div>
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                              </div>
                            </th>
                            <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAgents.map((agentItem: any) => (
                            <tr
                              key={agentItem?.id}
                              className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                              <td className="py-4 px-2">
                                <div className="font-medium text-slate-900 dark:text-white">{agentItem?.name}</div>
                              </td>
                              <td className="py-4 px-2">
                                <div className="text-slate-600 dark:text-slate-300">{agentItem?.email}</div>
                              </td>
                              <td className="py-4 px-2">
                                <button
                                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                  onClick={() => handleDeleteClick(agentItem)}
                                >
                                  <Trash size={16} />
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="sm:hidden space-y-4">
                      {filteredAgents.map((agentItem: any) => (
                        <div
                          key={agentItem?.id}
                          className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-500" />
                              <span className="font-medium text-slate-900 dark:text-white">{agentItem?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-300">{agentItem?.email}</span>
                            </div>
                            <div className="pt-2">
                              <button
                                className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                                onClick={() => handleDeleteClick(agentItem)}
                              >
                                <Trash size={16} />
                                Remove Agent
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : allAgents.length > 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No agents found</h4>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      No agents match your search criteria. Try adjusting your search terms.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <UserMinus className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No referral agents</h4>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                      You don't have any referral agents yet. Start building your network by adding new agents.
                    </p>
                    <Link
                      href="/dashboard/add-agents"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Users className="w-4 h-4" />
                      Add Referral Agents
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && selectedAgent && (
          <DeleteModal
            title="Referral Agent"
            description={`${selectedAgent.name} from your referrals`}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => deleteDiscountCodeMutation.mutate(selectedAgent?.id)}
          />
        )}
      </div>
    </div>
  )
}

export default AllReferralAgentPage
