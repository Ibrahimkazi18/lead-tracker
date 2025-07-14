"use client"
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@/utils/axiosInstance"
import { ChevronRight, Search, Users, Phone, MapPin, Calendar, Eye, User, DollarSign, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import useAgent from "@/hooks/useAgent"
import { useRouter } from "next/navigation"
import { formatDate } from "@/utils/formatdate"
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
  expectedRevenue?: number // Added for converted leads
  visits: {
    id: string
    leadId: string
    images: string[]
    descitption?: string
    createdAt: string
  }[]
  status: string 
}

const ConvertedLeadsPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { agent } = useAgent()
  const router = useRouter()

  const { data: allLeads = [], isLoading } = useQuery({
    queryKey: ["converted-leads"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-agent-leads-by-status/${agent.id}`, {
        params: { status: "CONVERTED" },
      })
      return response?.data?.formattedLeads || []
    },
  })

  const sendToLeadDetail = async (leadId: string) => {
    router.push(`/dashboard/converted-leads/${leadId}`)
  }

  const filteredLeads = useMemo(() => {
    return allLeads.filter((a: LeadType) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, allLeads])

  const totalExpectedRevenue = useMemo(() => {
    return filteredLeads.reduce((sum: number, lead: LeadType) => sum + (lead.expectedRevenue || 0), 0)
  }, [filteredLeads])

  return (
    <>
      <Head>
        <title>Converted Leads | Open Leads</title>
        <meta
          name="description"
          content="Track all your successfully converted leads in one place. View expected revenue, contact details, and lead performance with Open Leads CRM."
        />
        <meta
          name="keywords"
          content="converted leads, CRM leads, sales funnel, real estate CRM, Open Leads, lead conversion tracking, expected revenue"
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Converted Leads | Open Leads" />
        <meta
          property="og:description"
          content="Monitor your converted leads, expected revenue, and detailed lead activity through Open Leads CRM."
        />
        <meta property="og:url" content="https://www.openleads.in/dashboard/converted-leads" />
        <meta property="og:site_name" content="Open Leads" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.openleads.in/og-image-converted.png" />
        <meta property="og:image:alt" content="Converted Leads - Open Leads Dashboard" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Converted Leads | Open Leads" />
        <meta
          name="twitter:description"
          content="Track and manage converted leads with ease using Open Leads CRM. Review contact details, budget, and revenue."
        />
        <meta name="twitter:image" content="https://www.openleads.in/og-image-converted.png" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Converted Leads</h1>
                  <p className="text-slate-600 dark:text-slate-300">View and manage your successfully converted leads</p>
                </div>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <Link
                    href="/dashboard"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <ChevronRight size={16} className="mx-2" />
                  <span>Converted Leads</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Your Converted Leads
                  {!isLoading && allLeads.length > 0 && (
                    <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                      {filteredLeads.length} of {allLeads.length}
                    </span>
                  )}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                  Successfully converted leads and their expected revenue
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
                  {/* Total Expected Revenue */}
                  {filteredLeads.length > 0 && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm text-green-700 dark:text-green-300">Total Expected Revenue</p>
                          <p className="text-xl font-bold text-green-900 dark:text-green-100">₹ {totalExpectedRevenue}</p>
                        </div>
                      </div>
                    </div>
                  )}

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
                                  <DollarSign className="w-4 h-4" />
                                  Expected Revenue
                                </div>
                              </th>
                              <th className="text-left py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Converted On
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
                                  <div className="text-slate-600 dark:text-slate-300">₹ {lead?.expectedRevenue || 0}</div>
                                </td>
                                <td className="py-4 px-2">
                                  <div className="text-slate-600 dark:text-slate-300">
                                    {lead?.convertedAt ? formatDate(lead.convertedAt) : "N/A"}
                                  </div>
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
                                <DollarSign className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600 dark:text-slate-300">
                                  Expected Revenue: ₹ {lead?.expectedRevenue || 0}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600 dark:text-slate-300">
                                  Converted On: {lead?.convertedAt ? formatDate(lead.convertedAt) : "N/A"}
                                </span>
                              </div>
                              <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => sendToLeadDetail(lead.id)}
                                    className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                                  >
                                    <Eye size={14} />
                                    Details
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
                        No converted leads match your search criteria. Try adjusting your search terms.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-slate-400" />
                      </div>
                      <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No converted leads yet</h4>
                      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                        You haven't converted any leads yet. Keep working on your active leads to see them here!
                      </p>
                      <Link
                        href="/dashboard/all-leads"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Users className="w-4 h-4" />
                        View Active Leads
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConvertedLeadsPage
