"use client";

import useAgent from "@/hooks/useAgent";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

const DashboardPage = () => {

  const { agent } = useAgent();

  const [expiringLeads, setExpiringLeads] = useState([]);

  const { data: weeklyLeads } = useQuery({
    queryKey: ["leadsByWeek"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-leads-by-week/${agent.id}`);
      return res.data.grouped.map((item : any) => ({
        ...item,
        week: new Date(item.week).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      }));
    },
  });

  const { data: convertedByMonth } = useQuery({
    queryKey: ["convertedLeads"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-converted-leads-by-month/${agent.id}`);
      return res.data;
    }
  });

  const { data: monthlyRevenue } = useQuery({
    queryKey: ["monthlyRevenue"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-monthly-revenue/${agent.id}`);
      return res.data.response;
    }
  });

  const { data: totalRevenue } = useQuery({
    queryKey: ["totalRevenue"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-total-revenue/${agent.id}`);
      return res.data.totalRevenue;
    }
  });

  const { data: topAgents, isLoading: loadingTopAgents } = useQuery({
    queryKey: ["topAgents"],
    queryFn: async () => {
      const res = await axiosInstance.get("/get-top-agents");
      return res.data;
    },
  });

  const { data: statusDistribution } = useQuery({
    queryKey: ["statusDistribution"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-status-distribution/${agent.id}`);
      return res.data;
    }
  });

  useEffect(() => {
    const fetchExpiring = async () => {
      const res = await axiosInstance.get(`/get-expiring-leads/${agent.id}`);
      setExpiringLeads(res.data.leads);
    };

    fetchExpiring();
  }, []);

  return (
    <div className="w-full min-h-screen p-8 text-white">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">{agent?.name.split(" ")[0]}'s Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {/* Total Revenue Card */}
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-white text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-400">₹ {totalRevenue ?? 0}</p>
        </div>

        {/* Leads by Week */}
        <div className="bg-gray-800 p-6 rounded-xl shadow col-span-2">
          <h3 className="text-white font-semibold mb-2">Leads per Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyLeads}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Converted Leads by Month */}
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-white font-semibold mb-2">Converted Leads by Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={convertedByMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#4ade80" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-gray-800 p-6 rounded-xl shadow col-span-2">
          <h3 className="text-white font-semibold mb-2">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyRevenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹ ${value}`} />
              <Bar dataKey="total" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Status Distribution */}
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-white font-semibold mb-2">Lead Status</h3>
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
                {statusDistribution?.map((entry:any, index:number) => (
                  <Cell key={`cell-${index}`} fill={["#38bdf8", "#facc15", "#f87171", "#34d399"][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-white font-semibold mb-2">Top 5 Agents</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={topAgents}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip />
              <Bar dataKey="total" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-white font-semibold mb-4">Leads Expiring Soon</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Created</th>
                  <th className="py-2">Days Old</th>
                </tr>
              </thead>
              <tbody>
                { 
                  expiringLeads?.map((lead : any) => {
                  const created = new Date(lead.createdAt);
                  const age = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={lead.id} className="border-b border-gray-700">
                      <td className="py-2 pr-4">{lead.name}</td>
                      <td className="py-2 pr-4">{created.toLocaleDateString()}</td>
                      <td className="py-2">{age} days</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage