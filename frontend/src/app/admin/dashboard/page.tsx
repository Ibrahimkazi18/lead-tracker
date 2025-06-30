"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useMemo } from "react";

const usePlanWiseRevenue = () => {
  return useQuery({
    queryKey: ["plan-wise-revenue"],
    queryFn: async () => {
      const response = await axiosInstance.get("/get-plan-wise-revenue-stats");
      return response.data.plans; 
    },
  });
};

const useRevenue = () => {
  return useQuery({
    queryKey: ["revenue"],
    queryFn: async () => {
      const response = await axiosInstance.get("/get-admin-revenue-stats");
      return response.data.totalRevenue; 
    },
  });
};

const useMonthlyRevenue = () => {
  return useQuery({
    queryKey: ["monthly-revenue"],
    queryFn: async () => {
      const response = await axiosInstance.get("/get-admin-monthly-revenue-stats");
      return response.data.monthlyRevenue; 
    },
  });
};


const COLORS = ["#80DEEA", "#4DD0E1", "#00ACC1", "#00838F"];

const DashboardPage = () => {

  const { data: plans, isLoading } = usePlanWiseRevenue();
  const { data: revenue } = useRevenue();
  const { data: monthlyRevenue } = useMonthlyRevenue();

  console.log(monthlyRevenue);

  const monthlyChartData = useMemo(() => {
    if (!plans) return [];

    const months = plans[0]?.monthlyRevenue.map((m: any) => m.month);

    return months?.map((month:any) => {
      const entry: any = { month };
      plans?.forEach((plan: any) => {
        const revenue = plan.monthlyRevenue.find((m: any) => m.month === month)?.revenue || 0;
        entry[plan.name] = revenue;
      });
      return entry;
    });
  }, [plans]);
  
  return (
    <div className="w-full min-h-screen p-8 text-white">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">Dashboard</h2>
      </div>

      {
        !isLoading
          ? (
            <>
              <div className="grid grid-cols-6 mt-6">
                <div className="col-span-6">
                  <h3 className="text-2xl font-sans font-semibold text-white mb-2">Total Revenue</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlyRevenue}>
                      <XAxis dataKey="month" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-4 text-white col-span-5">
                  <h2 className="text-2xl font-semibold mb-4">Plan-wise Monthly Revenue</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlyChartData}>
                      <XAxis dataKey="month" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip />
                      <Legend />
                      {plans?.map((plan: any, index: number) => (
                        <Bar
                          key={plan.planId}
                          dataKey={plan.name}
                          fill={COLORS[index <= COLORS.length ? index : 0 ]}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Total Revenue by Plan</h3>
                  <table className="w-full border border-gray-700 text-white">
                    <thead>
                      <tr className="bg-gray-800 text-left">
                        <th className="p-3">Plan Name</th>
                        <th className="p-3">Total Revenue (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plans?.map((plan: any) => (
                        <tr key={plan.planId} className="border-t border-gray-700">
                          <td className="p-3">{plan.name}</td>
                          <td className="p-3">₹{plan.totalRevenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )
          : (
            <p>Loading stats ... </p>
          )
      }
    </div>
  )
}

export default DashboardPage