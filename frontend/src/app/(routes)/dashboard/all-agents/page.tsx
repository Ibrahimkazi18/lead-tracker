"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { ChevronRight, Trash } from "lucide-react"
import Link from "next/link";
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form";
import useAgent from "@/hooks/useAgent";
import Input from "@/shared/components/input";
import DeleteModal from "@/shared/components/delete-modal";

interface AgentType {
    id : string;
    name : string;
    email : string;
}

const AllReferralAgentPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<any>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { agent } = useAgent();

  const queryClient = useQueryClient();

  const { data : allAgents = [], isLoading} = useQuery({
    queryKey : ["referral-agents"],
    queryFn : async () => {
        const response = await axiosInstance.get(`/get-referrals/${agent.id}`);
        return response?.data?.referrals || [];
    }
  })

  const deleteDiscountCodeMutation = useMutation({
    mutationFn : async (referralId) => {
        await axiosInstance.delete(`/delete-referral-agent/${referralId}`, { params : { agentId : agent.id }});
    },

    onSuccess : () => {
        queryClient.invalidateQueries({ queryKey : ["referral-agents"] });
        setShowDeleteModal(false);
    }
  });

  const handleDeleteClick = async (agent : any) => {
    setSelectedAgent(agent)
    setShowDeleteModal(true);
  }

  const filteredAgents = useMemo(() => {
    return allAgents.filter((a: AgentType) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allAgents]);

  return (
    <div className="w-full min-h-screen p-8 text-white">
        <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl text-white font-semibold">Referral Agents</h2>
        </div>

        {/* Bread Crumbs */}
        <div className="flex items-center">
            <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
            <ChevronRight size={20} className="opacity-[.8]"/>
            <span className="">Your Referral Agents</span>
        </div>

        {/* existing codes */}
        <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4 font-Poppins">Your Referral Agents</h3>

            { isLoading ? (
                <p className="text-gray-400 text-center">Loading agents ... </p>
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
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                filteredAgents.map((agent:any) => (
                                    <tr 
                                        key={agent?.id}
                                        className="border-b border-gray-800 hover:bg-gray-800 transition"
                                    >
                                        <td className="p-3">{agent?.name}</td>
                                        <td className="p-3">{agent?.email}</td>
                                        <td className="p-3">
                                            <button
                                                className="cursor-pointer transition flex justify-center items-center px-2 py-1 rounded-md bg-gray-300 text-red-800 hover:bg-slate-600 hover:red-white"
                                                onClick={() => handleDeleteClick(agent)}
                                            >
                                                <Trash size={18} className="mr-2"/> Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table> 
                </>
            )}

            {allAgents?.length === 0 && !isLoading && (
                <p className="block text-center text-gray-400 w-full pt-4">No Referral Agent Avaialable for you.</p>
            )}
        </div>

        {/* Delete discount modal */}
        { showDeleteModal && selectedAgent && (
            <DeleteModal
                title="Referral Agent"
                description={`${agent.name} from your referrals`}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => deleteDiscountCodeMutation.mutate(selectedAgent?.id)}
            />
        ) }
    </div>
  )
}

export default AllReferralAgentPage