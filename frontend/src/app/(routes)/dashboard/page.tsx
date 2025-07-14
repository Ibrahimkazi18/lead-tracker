"use client"

import useAgent from "@/hooks/useAgent"
import axiosInstance from "@/utils/axiosInstance"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { DollarSign, TrendingUp, Calendar, PieChartIcon, BarChart3, Clock, Award } from "lucide-react"
import Script from "next/script"

export const metadata = {
  title: "Agent Dashboard | Open Leads",
  description:
    "Monitor your lead performance, revenue insights, top agent rankings, and lead status trends on the Open Leads dashboard.",
  keywords: [
    "real estate dashboard",
    "lead tracking",
    "revenue insights",
    "real estate analytics",
    "agent performance",
    "Open Leads dashboard",
    "openlead", 
    "openleads", 
    "lead management", 
    "leads management", 
    "lead manager", 
    "leads manager", 
    "agent management", 
    "agents management", 
    "real estate leads", 
    "lead tracker", 
    "leads tracker", 
    "agent tracker", 
    "agents tracker", 
    "agent help website", 
    "agents help website", 
    "agent CRM", 
    "agents CRM", 
    "property sales management", 
    "open leads", 
    "real estate",
    "real estate lead",
    "real estate leads management",
    "software", 
    "lead management software", 
    "lead managing software", 
    "customer management", 
    "customer tracking"
  ],
  openGraph: {
    title: "Agent Dashboard | Open Leads",
    description:
      "Visualize your performance with live charts, top agents, expiring leads and lead status — all in one place.",
    url: "https://www.openleads.in/dashboard",
    siteName: "Open Leads",
    type: "website",
    images: [
      {
        url: "https://www.openleads.in/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Open Leads Dashboard Overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Dashboard | Open Leads",
    description: "Track your lead performance, conversions, and revenue in real-time.",
    images: ["https://www.openleads.in/favicon.ico"],
  },
}


const DashboardPage = () => {
  const { agent } = useAgent()
  const [expiringLeads, setExpiringLeads] = useState([])

  const { data: weeklyLeads, isLoading: weeklyLoading } = useQuery({
    queryKey: ["leadsByWeek"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-leads-by-week/${agent?.id}`)
      return res.data.grouped.map((item: any) => ({
        ...item,
        week: new Date(item.week).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }))
    },
  })

  const { data: convertedByMonth, isLoading: convertedLoading } = useQuery({
    queryKey: ["convertedLeads"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-converted-leads-by-month/${agent.id}`)
      return res.data
    },
  })

  const { data: monthlyRevenue, isLoading: revenueLoading } = useQuery({
    queryKey: ["monthlyRevenue"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-monthly-revenue/${agent.id}`)
      return res.data.response
    },
  })

  const { data: totalRevenue, isLoading: totalRevenueLoading } = useQuery({
    queryKey: ["totalRevenue"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-total-revenue/${agent.id}`)
      return res.data.totalRevenue
    },
  })

  const { data: topAgents, isLoading: topAgentsLoading } = useQuery({
    queryKey: ["topAgents"],
    queryFn: async () => {
      const res = await axiosInstance.get("/get-top-agents")
      return res.data
    },
  })

  const { data: statusDistribution, isLoading: statusLoading } = useQuery({
    queryKey: ["statusDistribution"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-status-distribution/${agent.id}`)
      return res.data
    },
  })

  useEffect(() => {
    if (!agent?.id) return
    const fetchExpiring = async () => {
      const res = await axiosInstance.get(`/get-expiring-leads/${agent.id}`)
      setExpiringLeads(res.data.leads)
    }
    fetchExpiring()
  }, [agent?.id])

  if (!agent?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-slate-900 dark:text-white font-medium">Loading Dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const LoadingCard = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="animate-pulse">
        <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      </div>
    </div>
  )

  return (
    <>
      <Script
          id="dashboard-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Agent Dashboard",
              "url": "https://www.openleads.in/dashboard",
              "description":
                "Real-time dashboard for real estate agents to track leads, conversions, revenue, and status distribution on Open Leads.",
              "about": {
                "@type": "SoftwareApplication",
                "name": "Open Leads",
                "applicationCategory": "CRM Software",
                "url": "https://www.openleads.in"
              }
            }),
          }}
        />
    
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Welcome back, {agent?.name.split(" ")[0]}!
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300">
                    Here's an overview of your performance and recent activity
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-800 dark:text-blue-200 font-medium text-sm">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Total Revenue Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Total Revenue</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">All time earnings</p>
                </div>
              </div>
              {totalRevenueLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                </div>
              ) : (
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹ {totalRevenue ?? 0}</p>
              )}
            </div>

            {/* Leads by Week */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Leads per Week</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Weekly lead generation trends</p>
                </div>
              </div>
              {weeklyLoading ? (
                <div className="animate-pulse">
                  <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyLeads}>
                    <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgb(30 41 59)",
                        border: "1px solid rgb(51 65 85)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Converted Leads by Month */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Converted Leads</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Monthly conversions</p>
                </div>
              </div>
              {convertedLoading ? (
                <LoadingCard title="" icon={() => null} />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={convertedByMonth}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgb(30 41 59)",
                        border: "1px solid rgb(51 65 85)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6" }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Revenue</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Revenue breakdown by month</p>
                </div>
              </div>
              {revenueLoading ? (
                <div className="animate-pulse">
                  <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyRevenue}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      formatter={(value) => [`₹ ${value}`, "Revenue"]}
                      contentStyle={{
                        backgroundColor: "rgb(30 41 59)",
                        border: "1px solid rgb(51 65 85)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="total" fill="#eab308" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Lead Status Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <PieChartIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Lead Status</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Status distribution</p>
                </div>
              </div>
              {statusLoading ? (
                <div className="animate-pulse">
                  <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      dataKey="total"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {statusDistribution?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={["#3b82f6", "#eab308", "#ef4444", "#10b981"][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgb(30 41 59)",
                        border: "1px solid rgb(51 65 85)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top 5 Agents */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top 5 Agents</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Performance leaders</p>
                </div>
              </div>
              {topAgentsLoading ? (
                <div className="animate-pulse">
                  <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart layout="vertical" data={topAgents}>
                    <XAxis type="number" stroke="#64748b" fontSize={12} />
                    <YAxis type="category" dataKey="name" width={120} stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgb(30 41 59)",
                        border: "1px solid rgb(51 65 85)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="total" fill="#f97316" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Leads Expiring Soon */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Leads Expiring Soon</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Requires immediate attention</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                {expiringLeads?.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Name</th>
                        <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Created</th>
                        <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Days Old</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiringLeads?.map((lead: any) => {
                        const created = new Date(lead.createdAt)
                        const age = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24))
                        return (
                          <tr
                            key={lead.id}
                            className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <td className="py-3 px-2 font-medium text-slate-900 dark:text-white">{lead.name}</td>
                            <td className="py-3 px-2 text-slate-600 dark:text-slate-300">
                              {created.toLocaleDateString()}
                            </td>
                            <td className="py-3 px-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  age > 25
                                    ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                    : age > 20
                                      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                      : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                }`}
                              >
                                {age} days
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">No expiring leads found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
