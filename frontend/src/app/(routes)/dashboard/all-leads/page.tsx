"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/utils/axiosInstance"
import {
  ChevronRight,
  Search,
  Users,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
  User,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import useAgent from "@/hooks/useAgent"
import { useRouter } from "next/navigation"
import { formatDate } from "@/utils/formatdate"
import DeleteModal from "@/shared/components/delete-modal"
import ConvertModal from "@/shared/components/convert-modal"
import AddVisitModal from "@/shared/components/add-visit-modal/page"
import toast from "react-hot-toast"
import Head from "next/head"

export interface LeadType {
  id: string
  name: string
  email: string
  contactNo: string
  budget: string
  location: string
  projectDetail: string
  residenceAdd: string
  howHeard: string
  requirement: string
  referredById: string
  agentId: string
  createdAt: string
  convertedAt?: string
  rejectedAt?: string
  visits: {
    id: string
    leadId: string
    images: string[]
    descitption?: string
    createdAt: string
  }[]
}

const AllLeadsPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLead, setSelectedLead] = useState<LeadType>()
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [showAddVisitModal, setShowAddVisitModal] = useState(false)
  const { agent } = useAgent()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: allLeads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-agent-leads/${agent.id}`)
      return response?.data?.formattedLeads || []
    },
  })

  const addVisitMutation = useMutation({
    mutationFn: async ({ leadId, description, images }: { leadId: string; description: string; images: string[] }) => {
      const data = { leadId, description, images }
      await axiosInstance.put(`/add-visit`, data)
    },
    onSuccess: () => {
      toast.success("Visit added successfully!")
      queryClient.invalidateQueries({ queryKey: ["leads"] })
      setShowAddVisitModal(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add visit")
    },
  })

  const rejectLeadMutation = useMutation({
    mutationFn: async (leadId: string) => {
      const data = { leadId: leadId, status: "REJECTED" }
      await axiosInstance.put(`/update-lead-status`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
      setShowRejectModal(false)
    },
  })

  const convertLeadMutation = useMutation({
    mutationFn: async ({ leadId, expectedRevenue }: { leadId: string; expectedRevenue: number }) => {
      const data = { leadId, status: "CONVERTED", expectedRevenue }
      await axiosInstance.put(`/update-lead-status`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
      setShowConvertModal(false)
    },
  })

  const openAddVisitModal = async (lead: LeadType) => {
    setSelectedLead(lead)
    setShowAddVisitModal(true)
  }

  const convertLeadStatus = async (lead: LeadType) => {
    setSelectedLead(lead)
    setShowConvertModal(true)
  }

  const rejectLeadStatus = async (lead: LeadType) => {
    setSelectedLead(lead)
    setShowRejectModal(true)
  }

  const sendToLeadDetail = async (leadId: string) => {
    router.push(`/dashboard/all-leads/${leadId}`)
  }

  const filteredLeads = useMemo(() => {
    return allLeads.filter((a: LeadType) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, allLeads])

  return (
    <>
      <Head>
        <title>Active Leads | Open Leads</title>
        <meta
          name="description"
          content="Track, manage, and convert your active real estate leads with Open Leads. Keep your sales pipeline organized and actionable."
        />
        <meta
          name="keywords"
          content="active leads, real estate CRM, lead management, convert leads, visit tracking, real estate dashboard, Open Leads, sales pipeline"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Active Leads | Open Leads" />
        <meta
          property="og:description"
          content="Manage your real estate leads from one dashboard with Open Leads. Track visits, conversions, and more."
        />
        <meta property="og:url" content="https://www.openleads.in/dashboard/all-leads" />
        <meta property="og:site_name" content="Open Leads" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.openleads.in/og-image-leads.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Manage and Convert Leads | Open Leads Dashboard" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Active Leads | Open Leads" />
        <meta
          name="twitter:description"
          content="Track and convert leads easily using Open Leads – the smartest real estate CRM dashboard."
        />
        <meta name="twitter:image" content="https://www.openleads.in/og-image-leads.png" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Active Leads</h1>
                  <p className="text-slate-600 dark:text-slate-300">
                    Manage and track your active leads through the sales pipeline
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
                  <span>Your Active Leads</span>
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
                  Your Active Leads
                  {!isLoading && allLeads.length > 0 && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                      {filteredLeads.length} of {allLeads.length}
                    </span>
                  )}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                  Search, manage, and track your lead conversions
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
                  {/* Search Section */}
                  {allLeads.length > 0 && (
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search leads by name..."
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={searchQuery}
                          onChange={(e: any) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Leads List */}
                  {filteredLeads.length > 0 ? (
                    <div className="space-y-4">
                      {/* Desktop Table */}
                      <div className="hidden lg:block overflow-x-auto">
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
                                  Mobile
                                </div>
                              </th>
                              <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Search Area
                                </div>
                              </th>
                              <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Created
                                </div>
                              </th>
                              <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredLeads.map((lead: any) => (
                              <tr
                                key={lead?.id}
                                className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                              >
                                <td className="py-4 px-2">
                                  <div className="font-medium text-slate-900 dark:text-white">{lead?.name}</div>
                                </td>
                                <td className="py-4 px-2">
                                  <div className="text-slate-600 dark:text-slate-300">{lead?.contactNo}</div>
                                </td>
                                <td className="py-4 px-2">
                                  <div className="text-slate-600 dark:text-slate-300 truncate max-w-32">
                                    {lead?.location}
                                  </div>
                                </td>
                                <td className="py-4 px-2">
                                  <div className="text-slate-600 dark:text-slate-300">{formatDate(lead?.createdAt)}</div>
                                </td>
                                <td className="py-4 px-2">
                                  <div className="flex gap-2 flex-wrap">
                                    <button
                                      onClick={() => sendToLeadDetail(lead.id)}
                                      className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-xs font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1"
                                    >
                                      <Eye size={12} />
                                      Details
                                    </button>
                                    <button
                                      onClick={() => openAddVisitModal(lead)}
                                      className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1"
                                    >
                                      <Plus size={12} />
                                      Visit
                                    </button>
                                    <button
                                      onClick={() => convertLeadStatus(lead)}
                                      className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1"
                                    >
                                      <CheckCircle size={12} />
                                      Convert
                                    </button>
                                    <button
                                      onClick={() => rejectLeadStatus(lead)}
                                      className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1"
                                    >
                                      <XCircle size={12} />
                                      Drop
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile/Tablet Cards */}
                      <div className="lg:hidden space-y-4">
                        {filteredLeads.map((lead: any) => (
                          <div
                            key={lead?.id}
                            className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-500" />
                                <span className="font-medium text-slate-900 dark:text-white">{lead?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600 dark:text-slate-300">{lead?.contactNo}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600 dark:text-slate-300">{lead?.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600 dark:text-slate-300">{formatDate(lead?.createdAt)}</span>
                              </div>
                              <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() => sendToLeadDetail(lead.id)}
                                    className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                                  >
                                    <Eye size={14} />
                                    Details
                                  </button>
                                  <button
                                    onClick={() => openAddVisitModal(lead)}
                                    className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                                  >
                                    <Plus size={14} />
                                    Add Visit
                                  </button>
                                  <button
                                    onClick={() => convertLeadStatus(lead)}
                                    className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                                  >
                                    <CheckCircle size={14} />
                                    Convert
                                  </button>
                                  <button
                                    onClick={() => rejectLeadStatus(lead)}
                                    className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                                  >
                                    <XCircle size={14} />
                                    Reject
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : allLeads.length > 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-slate-400" />
                      </div>
                      <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No leads found</h4>
                      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        No leads match your search criteria. Try adjusting your search terms.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-slate-400" />
                      </div>
                      <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No active leads</h4>
                      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                        You don't have any active leads yet. Start by creating your first lead to begin tracking your
                        sales pipeline.
                      </p>
                      <Link
                        href="/dashboard/create-lead"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="w-4 h-4" />
                        Create Your First Lead
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Add Visit Modal */}
          {showAddVisitModal && selectedLead && (
            <AddVisitModal
              title=""
              description={`${selectedLead.name} from your lead`}
              lead={selectedLead}
              onClose={() => setShowAddVisitModal(false)}
              onConfirm={(data: any) =>
                addVisitMutation.mutate({
                  leadId: selectedLead.id,
                  description: data.description,
                  images: data.images,
                })
              }
            />
          )}

          {/* Reject lead modal */}
          {showRejectModal && selectedLead && (
            <DeleteModal
              title="Lead"
              description={`${selectedLead.name} from your lead`}
              onClose={() => setShowRejectModal(false)}
              onConfirm={() => rejectLeadMutation.mutate(selectedLead?.id)}
            />
          )}

          {/* Convert lead modal */}
          {showConvertModal && selectedLead && (
            <ConvertModal
              title=""
              description={`${selectedLead.name} from your lead`}
              onClose={() => setShowConvertModal(false)}
              onConfirm={(expectedRevenue: number) =>
                convertLeadMutation.mutate({
                  leadId: selectedLead.id,
                  expectedRevenue,
                })
              }
            />
          )}
        </div>
      </div>
    </>
  )
}

export default AllLeadsPage
