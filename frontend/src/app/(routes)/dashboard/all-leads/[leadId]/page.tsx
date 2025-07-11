"use client"
import useAgent from "@/hooks/useAgent"
import axiosInstance from "@/utils/axiosInstance"
import { useQuery } from "@tanstack/react-query"
import {
  ChevronRight,
  User,
  Mail,
  Phone,
  DollarSign,
  MapPin,
  Building,
  Calendar,
  FileText,
  Users,
  Camera,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { use } from "react"

interface LeadPageProps {
  params: Promise<{ leadId: string }>
}

const LeadPage = ({ params }: LeadPageProps) => {
  const { leadId } = use(params)
  const { agent } = useAgent()

  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-agent-leads/${agent.id}/${leadId}`)
      return response?.data?.formattedLead
    },
  })

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONVERTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Converted
          </span>
        )
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        )
      case "ACTIVE":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Active
          </span>
        )
    }
  }

  const getRequirementLabel = (requirement: string) => {
    const labels: { [key: string]: string } = {
      R_1RK: "1RK",
      R_1BHK: "1BHK",
      R_2BHK: "2BHK",
      R_3BHK: "3BHK",
      R_4BHK: "4BHK",
      SHOP: "Shop",
    }
    return labels[requirement] || requirement
  }

  const getHowHeardLabel = (howHeard: string) => {
    const labels: { [key: string]: string } = {
      HORDING: "Hoarding",
      FRIENDS: "Friends",
      STANDEY: "Standey",
      OTHER_SOURCES: "Other Sources",
    }
    return labels[howHeard] || howHeard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Lead Details</h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Complete information and visit history for this lead
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
                <Link
                  href="/dashboard/all-leads"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                >
                  Your Leads
                </Link>
                <ChevronRight size={16} className="mx-2" />
                <span>Lead Details</span>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                ))}
              </div>
              <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Lead Details Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{lead.name}</h2>
                    <p className="text-slate-600 dark:text-slate-300">Lead Information & Contact Details</p>
                  </div>
                  <div>{getStatusBadge(lead.status)}</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Personal Information
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                          <p className="font-medium text-slate-900 dark:text-white">{lead.email || "Not provided"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Contact Number</p>
                          <p className="font-medium text-slate-900 dark:text-white">{lead.contactNo}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <MapPin className="w-4 h-4 text-slate-500 mt-1" />
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Residence Address</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {lead.residenceAdd || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Created On</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {new Date(lead.createdAt).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Requirements */}
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Property Requirements
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <DollarSign className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Budget</p>
                          <p className="font-medium text-slate-900 dark:text-white">{lead.budget}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <Building className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Property Type</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {getRequirementLabel(lead.requirement)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Search Area</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {lead.location || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <Users className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">How They Heard About Us</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {getHowHeardLabel(lead.howHeard)}
                          </p>
                        </div>
                      </div>

                      {lead.projectDetail && (
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <FileText className="w-4 h-4 text-slate-500 mt-1" />
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Project Details</p>
                            <p className="font-medium text-slate-900 dark:text-white">{lead.projectDetail}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Referred By Section */}
                {lead.referredBy && (
                  <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <div className="pb-4 mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Referred By
                      </h3>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm text-blue-600 dark:text-blue-400">Agent Name</p>
                            <p className="font-medium text-blue-900 dark:text-blue-100">{lead.referredBy.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm text-blue-600 dark:text-blue-400">Agent Email</p>
                            <p className="font-medium text-blue-900 dark:text-blue-100">{lead.referredBy.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visits Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Visit History
                    {lead.visits?.length > 0 && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                        {lead.visits.length} visits
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                    Track all visits and interactions with this lead
                  </p>
                </div>

                {lead.visits?.length > 0 ? (
                  <div className="space-y-6">
                    {lead.visits.map((visit: any, index: number) => (
                      <div
                        key={visit.id}
                        className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            Visit #{index + 1}
                          </h4>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(visit.createdAt).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {visit.descitption && (
                          <div className="mb-4">
                            <p className="text-slate-700 dark:text-slate-300">{visit.descitption}</p>
                          </div>
                        )}

                        {visit.images?.length > 0 ? (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Camera className="w-4 h-4 text-slate-500" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Visit Photos ({visit.images.length})
                              </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {visit.images.map((imgUrl: string, i: number) => (
                                <div
                                  key={i}
                                  className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600"
                                >
                                  <Image
                                    src={imgUrl || "/placeholder.svg"}
                                    alt={`Visit photo ${i + 1}`}
                                    width={200}
                                    height={200}
                                    className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                                  />
                                  {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                  </div> */}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Camera className="w-4 h-4" />
                            <span className="text-sm italic">No photos provided for this visit</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <Eye className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No visits recorded</h4>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      No visits have been added for this lead yet. Visit history will appear here once visits are
                      recorded.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeadPage
