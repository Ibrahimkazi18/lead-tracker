"use client";

import useAgent from "@/hooks/useAgent";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const DashboardPage = () => {

  const { agent } = useAgent();

  const { data : leadsByWeek = [], isLoading} = useQuery({
    queryKey : ["referral-agents"],
    queryFn : async () => {
        const response = await axiosInstance.get(`/get-leads-by-week/${agent.id}`);
        return response?.data?.grouped || [];
    }
  })

  return (
    <div className="w-full min-h-screen p-8 text-white">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">{agent.name.split(" ")[0]}'s Dashboard</h2>
      </div>


    </div>
  )
}

export default DashboardPage