"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/utils/axiosInstance"
import { ChevronRight, Plus, Search, Users, Phone, Mail, User } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import useAgent from "@/hooks/useAgent"
import toast from "react-hot-toast"

interface AgentType {
  id: string
  name: string
  email: string
  phone: string
}

const AddReferralAgentPage = () => {
  const { reset } = useForm({
    defaultValues: {
      referralIds: [],
    },
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [allAgents, setAllAgents] = useState([])
  const { agent } = useAgent()
  const queryClient = useQueryClient()

  const createReferralAgentMutation = useMutation({
    mutationFn: async (data) => {
      const toSend = { agentId: agent.id, referralIds: data }
      await axiosInstance.put("/add-agent", toSend)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-agents"] })
      reset()
    },
  })

  const onSubmit = async (data: any) => {
    createReferralAgentMutation.mutate(data)
  }

  const handleSearch = async () => {
    if (!searchQuery) return toast.error("Enter a phone number to search.")
    setLoading(true)
    try {
      const response = await axiosInstance.get("/get-available-agents", {
        params: { phone: searchQuery, agentId: agent.id },
      })
      setAllAgents(response.data.agents)
      if (response.data.agents.length === 0) {
        toast.error("No agent found for this phone number.")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Search failed.")
      setAllAgents([])
    } finally {
      setLoading(false)
    }
  }

  const filteredAgents = useMemo(() => allAgents, [allAgents])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Add Referral Agents
                </h1>
                <p className="text-slate-600 dark:text-slate-300">Search and add new referral agents to your network</p>
              </div>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <Link
                  href="/dashboard"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <ChevronRight size={16} className="mx-2" />
                <span>Add Agent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Search Agents
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                Enter a mobile number to find available agents
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search agents by mobile number..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Search Results
                {filteredAgents.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                    {filteredAgents.length} found
                  </span>
                )}
              </h3>
            </div>

            {filteredAgents.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="hidden sm:block">
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
                            <Phone className="w-4 h-4" />
                            Phone
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
                      {filteredAgents.map((agent: any) => (
                        <tr
                          key={agent?.id}
                          className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <td className="py-4 px-2">
                            <div className="font-medium text-slate-900 dark:text-white">{agent?.name}</div>
                          </td>
                          <td className="py-4 px-2">
                            <div className="text-slate-600 dark:text-slate-300">{agent?.phone}</div>
                          </td>
                          <td className="py-4 px-2">
                            <div className="text-slate-600 dark:text-slate-300">{agent?.email}</div>
                          </td>
                          <td className="py-4 px-2">
                            <button
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                              onClick={() => onSubmit(agent.id)}
                            >
                              <Plus size={16} />
                              Add
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-4">
                  {filteredAgents.map((agent: any) => (
                    <div
                      key={agent?.id}
                      className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-500" />
                          <span className="font-medium text-slate-900 dark:text-white">{agent?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-600 dark:text-slate-300">{agent?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-600 dark:text-slate-300">{agent?.email}</span>
                        </div>
                        <div className="pt-2">
                          <button
                            className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                            onClick={() => onSubmit(agent.id)}
                          >
                            <Plus size={16} />
                            Add Agent
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No agents found</h4>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Please search for an agent using their mobile number to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddReferralAgentPage
