"use client";

import useAgent from "@/hooks/useAgent";
import { usePlanStatus } from "@/hooks/usePlan";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react"
import Link from "next/link"

const SubscriptionPlansPage = () => {
  const { agent } = useAgent();
  const { isPlanActive } = usePlanStatus();

  const { data : plans } = useQuery({
    queryKey : ["plans"],
    queryFn : async () => {
      const response = await axiosInstance.get(`/get-all-plans`);
      return response?.data?.plans;
    }
  });

  return (
    <div className="w-full min-h-screen p-8 text-white">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">Buy Plan</h2>
      </div>

      <div className="flex items-center">
        <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
        <ChevronRight size={20} className="opacity-[.8]"/>
        <span className="">Available Plans</span>
      </div>

      {isPlanActive && (
        <h2 className="mt-8">You Already Have an Active Plan.</h2>
      )}

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans?.map((plan: any, index: number) => {
          const active = isPlanActive;

          return (
            <div key={plan?.id} className={`bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 ${index === 1 ? "border-[#80Deea]" : ""}`}>
              {index === 1 && (
                <div className="text-sm text-[#80Deea] font-semibold mb-2">★ Most Popular</div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan?.name}</h3>
              <p className="text-gray-300 text-sm mb-4 min-h-[64px]">{plan?.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-semibold text-white">₹{plan?.price}</span>
                <span className="text-sm text-gray-400">{plan?.duration} days</span>
              </div>

              <button
                disabled={active}
                className={`w-full py-2 rounded-md font-medium transition ${
                  active
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#80Deea] hover:bg-[#4dd0e1] text-black"
                }`}
              >
                {active ? "Active Plan" : "Buy Now"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default SubscriptionPlansPage