"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { ChevronRight } from "lucide-react"
import Link from "next/link";
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form";
import useAgent from "@/hooks/useAgent";
import Input from "@/shared/components/input";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatdate";
import DeleteModal from "@/shared/components/delete-modal";
import ConvertModal from "@/shared/components/convert-modal";
import AddVisitModal from "@/shared/components/add-visit-modal/page";
import toast from "react-hot-toast";

export interface LeadType {
    id : string;
    name : string;
    email : string;
    contactNo : string;
    budget : string;
    location : string;
    projectDetail : string;
    residenceAdd : string;
    howHeard : string;
    requirement : string;
    referredById : string;
    agentId : string;
    createdAt: string;
    convertedAt?: string;
    rejectedAt?: string;
    visits : {
      id: string;
      leadId: string;
      images: string[];
      descitption ?: string;
      createdAt: string;
    }[];
}

const AllLeadsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadType>();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);

  const { agent } = useAgent();
  const router = useRouter()

  const queryClient = useQueryClient();

  const { data : allLeads = [], isLoading} = useQuery({
    queryKey : ["leads"],
    queryFn : async () => {
        const response = await axiosInstance.get(`/get-agent-leads/${agent.id}`);
        return response?.data?.formattedLeads || [];
    }
  });

  const addVisitMutation = useMutation({
    mutationFn : async ({ leadId, description, images }: { leadId: string; description: string; images: string[] }) => {
        const data = { leadId, description, images}
        await axiosInstance.put(`/add-visit`, data );
    },

    onSuccess : () => {
        toast.success("Visit added successfully!");
        queryClient.invalidateQueries({ queryKey : ["leads"] });
        setShowAddVisitModal(false);
    },

    onError : (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to add visit");
    }
  });

  const rejectLeadMutation = useMutation({
    mutationFn : async (leadId : string) => {
        const data = { leadId: leadId, status: "REJECTED" }
        await axiosInstance.put(`/update-lead-status`, data );
    },

    onSuccess : () => {
        queryClient.invalidateQueries({ queryKey : ["leads"] });
        setShowRejectModal(false);
    }
  });

  const convertLeadMutation = useMutation({
    mutationFn : async ({ leadId, expectedRevenue }: { leadId: string; expectedRevenue: number }) => {
        const data = { leadId, status: "CONVERTED", expectedRevenue };
        await axiosInstance.put(`/update-lead-status`, data );
    },

    onSuccess : () => {
        queryClient.invalidateQueries({ queryKey : ["leads"] });
        setShowConvertModal(false);
    }
  });

  const openAddVisitModal = async (lead : LeadType) => {
    setSelectedLead(lead);
    setShowAddVisitModal(true);
  }

  const convertLeadStatus = async (lead : LeadType) => {
    setSelectedLead(lead);
    setShowConvertModal(true);
  }

  const rejectLeadStatus = async (lead : LeadType) => {
    setSelectedLead(lead);
    setShowRejectModal(true);
  }

  const sendToLeadDetail = async (leadId : string) => {
    router.push(`/dashboard/all-leads/${leadId}`);
  }

  const filteredLeads = useMemo(() => {
    return allLeads.filter((a: LeadType) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allLeads]);

  return (
    <div className="w-full min-h-screen p-8 text-white">
        <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl text-white font-semibold">Active Leads</h2>
        </div>

        {/* Bread Crumbs */}
        <div className="flex items-center">
            <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
            <ChevronRight size={20} className="opacity-[.8]"/>
            <span className="">Your Active Leads</span>
        </div>

        {/* existing codes */}
        <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4 font-Poppins">Your Active Leads</h3>

            { isLoading ? (
                <p className="text-gray-400 text-center">Loading leads ... </p>
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
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Mobile</th>
                                <th className="p-3 text-left">Location</th>
                                <th className="p-3 text-left">Created</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                filteredLeads.map((lead:any) => (
                                    <tr 
                                        key={lead?.id}
                                        className="border-b border-gray-800 hover:bg-gray-800 transition"
                                    >
                                        <td className="p-3">{lead?.name}</td>
                                        <td className="p-3">{lead?.email}</td>
                                        <td className="p-3">{lead?.contactNo}</td>
                                        <td className="p-3 truncate">{lead?.location}</td>
                                        <td className="p-3">{formatDate(lead?.createdAt)}</td>
                                        <td className="p-3 space-x-2 flex">
                                          <button onClick={() => sendToLeadDetail(lead.id)} className="bg-yellow-600 cursor-pointer text-white px-2 py-1 rounded">Details</button>
                                          <button onClick={() => openAddVisitModal(lead)} className="bg-blue-600 cursor-pointer text-white px-2 py-1 rounded">Add Visit</button>
                                          <button onClick={() => convertLeadStatus(lead)} className="bg-green-600 cursor-pointer text-white px-2 py-1 rounded">Convert</button>
                                          <button onClick={() => rejectLeadStatus(lead)} className="bg-red-600 cursor-pointer text-white px-2 py-1 rounded">Reject</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table> 
                </>
            )}

            {allLeads?.length === 0 && !isLoading && (
                <p className="block text-center text-gray-400 w-full pt-4">No Leads Avaialable for you.</p>
            )}
        </div>

        {/* Add Visit Modal */}
        { showAddVisitModal && selectedLead && (
            <AddVisitModal
                title=""
                description={`${selectedLead.name} from your lead`}
                lead={selectedLead}
                onClose={() => setShowAddVisitModal(false)}
                onConfirm={(data : any) => addVisitMutation.mutate({ 
                    leadId: selectedLead.id, 
                    description: data.description, 
                    images: data.images 
                })}
            />
        )}

        {/* Reject lead modal */}
        { showRejectModal && selectedLead && (
            <DeleteModal
                title="Lead"
                description={`${selectedLead.name} from your lead`}
                onClose={() => setShowRejectModal(false)}
                onConfirm={() => rejectLeadMutation.mutate(selectedLead?.id)}
            />
        )}

        {/* Convert lead modal */}
        { showConvertModal && selectedLead && (
            <ConvertModal
                title=""
                description={`${selectedLead.name} from your lead`}
                onClose={() => setShowConvertModal(false)}
                onConfirm={(expectedRevenue : number) =>
                    convertLeadMutation.mutate({ 
                        leadId: selectedLead.id, 
                        expectedRevenue 
                    })
                }
            />
        )}
    </div>
  )
}

export default AllLeadsPage