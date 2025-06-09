"use client";

import Input from "@/shared/components/input";
import axiosInstance from "@/utils/axiosInstance";
import { formatDate } from "@/utils/formatdate";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const ActivePlansPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data : allActivePlans=[], isLoading} = useQuery({
    queryKey : ["active-plans"],
    queryFn : async () => {
        const response = await axiosInstance.get(`/get-all-active-plans`);
        return response?.data?.active || [];
    }
  });

  const filteredPlans = useMemo(() => {
    return allActivePlans.filter((a: any) =>
        a.agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allActivePlans]);

  return (
    <div className="w-full min-h-screen p-8 text-white">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">Active Plans</h2>
      </div>

      <div className="flex items-center">
        <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
        <ChevronRight size={20} className="opacity-[.8]"/>
        <span className="">Active Plans</span>
      </div>

      <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4 font-Poppins">Active Plans</h3>

          { isLoading ? (
              <p className="text-gray-400 text-center">Loading plans ... </p>
          ) : (
              <>
                  <div className="mb-4">
                      <Input
                        type="text"
                        placeholder="Search agents by name..."
                        className="mb-4 w-full"
                        value={searchQuery}
                        onChange={(e:any) => setSearchQuery(e.target.value)}
                      />
                  </div>
                  <table className="w-full text-white">
                      <thead>
                          <tr className="border-b border-gray-800">
                              <th className="p-3 text-left">Agent</th>
                              <th className="p-3 text-left">Plan</th>
                              <th className="p-3 text-left">Price</th>
                              <th className="p-3 text-left">Duration (days)</th>
                              <th className="p-3 text-left">Payment Ref</th>
                              <th className="p-3 text-left">Status</th>
                              <th className="p-3 text-left">Created</th>
                          </tr>
                      </thead>

                      <tbody>
                          {
                              filteredPlans.map((request:any) => (
                                  <tr 
                                      key={request?.id}
                                      className="border-b border-gray-800 hover:bg-gray-800 transition"
                                  >
                                      <td className="p-3">{request?.agent?.name}</td>
                                      <td className="p-3">{request?.plan?.name}</td>
                                      <td className="p-3">₹{request?.plan?.price}</td>
                                      <td className="p-3">{request?.plan?.duration}</td>
                                      <td className="p-3">{request?.paymentRef}</td>
                                      <td className="p-3 truncate capitalize">{request?.status}</td>
                                      <td className="p-3">{formatDate(request?.confirmedAt)}</td>
                                  </tr>
                              ))
                          }
                      </tbody>
                  </table> 
              </>
            )}

            {allActivePlans?.length === 0 && !isLoading && (
                <p className="block text-center text-gray-400 w-full pt-4">No Active Plans Avaialable.</p>
            )}

        </div>
    </div>
  )
}

export default ActivePlansPage