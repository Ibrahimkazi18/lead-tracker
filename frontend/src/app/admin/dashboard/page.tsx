"use client"
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@/utils/axiosInstance"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useMemo } from "react"
import { DollarSign, Calendar, BarChart3, PieChartIcon, TrendingUp } from "lucide-react"

const usePlanWiseRevenue = () => {
  return useQuery({
    queryKey: ["plan-wise-revenue"],
    queryFn: async () => {
      const response = await axiosInstance.get("/get-plan-wise-revenue-stats")
      return response.data.plans
    },
  })
}

const useRevenue = () => {
  return useQuery({
    queryKey: ["revenue"],
    queryFn: async () => {
      const response = await axiosInstance.get("/get-admin-revenue-stats")
      return response.data.totalRevenue
    },
  })
}

const useMonthlyRevenue = () => {
  return useQuery({
    queryKey: ["monthly-revenue"],
    queryFn: async () => {
      const response = await axiosInstance.get("/get-admin-monthly-revenue-stats")
      return response.data.monthlyRevenue
    },
  })
}

const COLORS = ["#3b82f6", "#eab308", "#ef4444", "#10b981", "#8b5cf6", "#f97316"] // More vibrant colors

const DashboardPage = () => {
  const { data: plans, isLoading: plansLoading } = usePlanWiseRevenue()
  const { data: totalRevenue, isLoading: totalRevenueLoading } = useRevenue()
  const { data: monthlyRevenue, isLoading: monthlyRevenueLoading } = useMonthlyRevenue()

  const monthlyChartData = useMemo(() => {
    if (!plans || plans.length === 0) return []
    const allMonths = new Set<string>()
    plans.forEach((plan: any) => {
      plan.monthlyRevenue.forEach((m: any) => allMonths.add(m.month))
    })
    const sortedMonths = Array.from(allMonths).sort((a, b) => {
      // Simple month sorting, might need more robust logic for full year
      const monthOrder: { [key: string]: number } = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12,
      }
      const [monthA, yearA] = a.split(" ")
      const [monthB, yearB] = b.split(" ")
      if (yearA !== yearB) return Number.parseInt(yearA) - Number.parseInt(yearB)
      return monthOrder[monthA] - monthOrder[monthB]
    })

    return sortedMonths.map((month: string) => {
      const entry: any = { month }
      plans.forEach((plan: any) => {
        const revenue = plan.monthlyRevenue.find((m: any) => m.month === month)?.revenue || 0
        entry[plan.name] = revenue
      })
      return entry
    })
  }, [plans])

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Overview of platform revenue and subscription performance
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
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Total Platform Revenue</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">All time earnings across all plans</p>
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

          {/* Monthly Revenue Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Revenue Overview</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Total revenue generated each month</p>
              </div>
            </div>
            {monthlyRevenueLoading ? (
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
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Plan-wise Monthly Revenue Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Plan-wise Monthly Revenue</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Revenue contribution by each subscription plan
                </p>
              </div>
            </div>
            {plansLoading ? (
              <div className="animate-pulse">
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyChartData}>
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
                  <Legend />
                  {plans?.map((plan: any, index: number) => (
                    <Bar
                      key={plan.planId}
                      dataKey={plan.name}
                      fill={COLORS[index % COLORS.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Total Revenue by Plan Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <PieChartIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Total Revenue by Plan</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Breakdown of total earnings per plan</p>
              </div>
            </div>
            {plansLoading ? (
              <div className="animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">
                        Plan Name
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">
                        Total Revenue (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans?.map((plan: any) => (
                      <tr
                        key={plan.planId}
                        className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="py-3 px-2 font-medium text-slate-900 dark:text-white">{plan.name}</td>
                        <td className="py-3 px-2 text-slate-600 dark:text-slate-300">₹{plan.totalRevenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
