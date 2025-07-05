"use client"

import useAgent from "@/hooks/useAgent";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { use } from "react";

interface LeadPageProps {
  params: Promise<{ leadId: string }>;
}

const LeadPage = ({ params }: LeadPageProps) => {
  const { leadId } = use(params);
  const {agent} = useAgent();
  
  const { data : lead, isLoading} = useQuery({
    queryKey : ["lead"],
    queryFn : async () => {
        const response = await axiosInstance.get(`/get-agent-leads/${agent.id}/${leadId}`);
        return response?.data?.formattedLead;
    }
  });

  return (
    <div className="w-full min-h-screen p-8 text-white">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">Lead Details</h2>
      </div>

      <div className="flex items-center">
        <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
        <ChevronRight size={20} className="opacity-[.8]"/>
        <Link href={"/dashboard/all-leads"} className="text-[#80Deea] cursor-pointer">Your Leads</Link>
        <ChevronRight size={20} className="opacity-[.8]"/>
        <span className="">Lead's Details</span>
      </div>

      <div className="mt-8 p-6">
        {
          isLoading 
            ? (
                <p>Loading ... </p>
              )
            : (
                <>
                  {/* Lead Details */}
                  <div className="bg-[#1f1f1f] rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">{lead.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                      <p><span className="font-semibold">Email:</span> {lead.email}</p>
                      <p><span className="font-semibold">Contact:</span> {lead.contactNo}</p>
                      <p><span className="font-semibold">Budget:</span> {lead.budget}</p>
                      <p><span className="font-semibold">Requirement:</span> {lead.requirement}</p>
                      <p><span className="font-semibold">Location:</span> {lead.location || "Not specified"}</p>
                      <p><span className="font-semibold">Project Detail:</span> {lead.projectDetail || "None"}</p>
                      <p><span className="font-semibold">How Heard:</span> {lead.howHeard}</p>
                      <p><span className="font-semibold">Status:</span> {lead.status}</p>
                      <p><span className="font-semibold">Created At:</span> {new Date(lead.createdAt).toLocaleString()}</p>

                      {/* Referred By Agent Info */}
                      {lead.referredBy && (
                        <div className="mt-1 bg-[#1f1f1f] p-6 rounded-lg border border-gray-700">
                          <h3 className="text-lg font-semibold mb-3">Referred By</h3>
                          <p className="text-sm">
                            <span className="font-semibold">Name:</span> {lead.referredBy.name}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">Email:</span> {lead.referredBy.email}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visits */}
                  <div className="mt-10">
                    <h3 className="text-xl font-semibold mb-4">Visits</h3>
                    {lead.visits?.length > 0 ? (
                      <div className="space-y-6">
                        {lead.visits.map((visit: any) => (
                          <div
                            key={visit.id}
                            className="bg-[#2b2b2b] p-4 rounded-lg border border-gray-700 shadow-sm"
                          >
                            <p className="text-sm mb-2">
                              <span className="font-semibold">Description:</span> {visit.descitption}
                            </p>
                            <p className="text-xs text-gray-400 mb-3">
                              <span className="font-semibold">Visited On:</span> {new Date(visit.createdAt).toLocaleString()}
                            </p>
                            {visit.images.length > 0 ? (
                              <div className="flex gap-4 flex-wrap">
                                {visit.images.map((imgUrl: string, i: number) => (
                                  <img
                                    key={i}
                                    src={imgUrl}
                                    alt="Visit Image"
                                    className="w-32 h-32 object-cover rounded-md border border-gray-600"
                                  />
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 italic text-sm">No images provided.</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No visits added yet.</p>
                    )}

                  </div>
                </>
              )
        }
      </div>
    </div>
  )
}

export default LeadPage