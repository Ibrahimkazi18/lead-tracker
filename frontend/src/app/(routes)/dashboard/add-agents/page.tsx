"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { ChevronRight, Plus, Search } from "lucide-react"
import Link from "next/link";
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form";
import useAgent from "@/hooks/useAgent";
import Input from "@/shared/components/input";
import toast from "react-hot-toast";

interface AgentType {
    id : string;
    name : string;
    email : string;
    phone : string;
}

const AddReferralAgentPage = () => {
  const { reset } = useForm({
    defaultValues : {
        referralIds : [],
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [allAgents, setAllAgents] = useState([]);

  const { agent } = useAgent();

  const queryClient = useQueryClient();

  const createReferralAgentMutation = useMutation({
    mutationFn : async (data) => {
        const toSend = { agentId: agent.id, referralIds : data }
        await axiosInstance.put("/add-agent", toSend);
    },

    onSuccess : () => {
        queryClient.invalidateQueries({ queryKey : ["referral-agents"] });
        reset();
    }
  });

  const onSubmit = async (data : any) => {
    createReferralAgentMutation.mutate(data);
  }

  const handleSearch = async () => {
    if (!searchQuery) return toast.error("Enter a phone number to search.");

    setLoading(true);
    try {
        const response = await axiosInstance.get("/get-available-agents", {
            params: { phone: searchQuery, agentId: agent.id },
        });
        setAllAgents(response.data.agents);

        if (response.data.agents.length === 0) {
            toast.error("No agent found for this phone number.");
        }

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Search failed.");
      setAllAgents([]);

    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = useMemo(() => allAgents, [allAgents]);

  return (
    <div className="w-full min-h-screen p-8 text-white">
        <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl text-white font-semibold">Add Referral Agents</h2>
        </div>

        {/* Bread Crumbs */}
        <div className="flex items-center">
            <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
            <ChevronRight size={20} className="opacity-[.8]"/>
            <span className="">Add Agent</span>
        </div>

        {/* existing codes */}
        <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4 font-Poppins">Add Referral Agents</h3>

            <div className="flex gap-2 mb-4 justify-center items-center">
                <Input
                    type="text"
                    placeholder="Search agents by mobile number..."
                    className="mb-4 w-full"
                    value={searchQuery}
                    onChange={(e:any) => setSearchQuery(e.target.value)}
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white flex justify-between items-center gap-1"
                    disabled={loading}
                >
                    <Search size={16} />
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            { filteredAgents.length > 0 &&
                <>
                    <table className="w-full text-white">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Phone</th>
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
                                        <td className="p-3">{agent?.phone}</td>
                                        <td className="p-3">{agent?.email}</td>
                                        <td className="p-3">
                                            <button
                                                className="cursor-pointer transition flex justify-center items-center px-2 py-1 rounded-md bg-gray-300 text-gray-800 hover:bg-slate-600 hover:text-white"
                                                onClick={() => onSubmit(agent.id)}
                                            >
                                                <Plus size={18}/> Add
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table> 
                </>
            }

            {allAgents?.length === 0 && (
                <p className="block text-center text-gray-400 w-full pt-4">Please Search For Agent Using Mobile Number.</p>
            )}
        </div>
    </div>
  )
}

export default AddReferralAgentPage