"use client";

import useAgent from "@/hooks/useAgent";
import axiosInstance from "@/utils/axiosInstance";
import { getDaysLeft } from "@/utils/formatdate";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, CalendarDays, ChevronRight, Clock, DollarSign, TimerReset } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const YourPlanPage = () => {
  const { agent } = useAgent();

  const [daysLeft, setdaysLeft] = useState(0);

  const { data : activePlan } = useQuery({
    queryKey : ["active-plan"],
    queryFn : async () => {
        const response = await axiosInstance.get(`/get-active-agent-plan/${agent.id}`);
        return response?.data?.active;
    }
  });

  const { data: planDetails } = useQuery({
    queryKey: ["plan-details", activePlan?.planId],
    enabled: !!activePlan?.planId,
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-plan/${activePlan?.planId}`);
      return response?.data?.plan;
    }
  });

  useEffect(() => {
    setdaysLeft(getDaysLeft(activePlan?.expiresAt));
  }, [activePlan]);

  return (
    <div className="w-full min-h-screen p-8 text-white">
        <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl text-white font-semibold">Your Plan</h2>
        </div>

        <div className="flex items-center">
            <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
            <ChevronRight size={20} className="opacity-[.8]"/>
            <span className="">Your Active Plan</span>
        </div>

        <div className="mt-10 bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg w-full max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-white">{planDetails?.name}</h3>
          <span className={`text-sm px-3 py-1 rounded-full font-medium 
            ${activePlan?.status === "confirmed" ? "bg-green-600 text-white" : "bg-yellow-500 text-black"}`}>
            {activePlan?.status.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-300 mb-6">{planDetails?.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-[#80Deea]" />
            <span><span className="text-white font-medium">₹{planDetails?.price}</span> total</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-[#80Deea]" />
            <span><span className="text-white font-medium">{planDetails?.duration}</span> days duration</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck size={18} className="text-[#80Deea]" />
            <span>Confirmed on: <span className="text-white font-medium">{new Date(activePlan?.confirmedAt).toLocaleDateString()}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#80Deea]" />
            <span>Expires on: <span className="text-white font-medium">{new Date(activePlan?.expiresAt).toLocaleDateString()}</span></span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <TimerReset size={18} className="text-[#80Deea]" />
            <span><span className="text-white font-medium">{daysLeft}</span> day(s) left</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourPlanPage