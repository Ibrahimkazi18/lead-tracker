"use client";

import ConfirmModal from "@/shared/components/confirm-modal";
import DeleteModal from "@/shared/components/delete-modal";
import Input from "@/shared/components/input";
import axiosInstance from "@/utils/axiosInstance";
import { formatDate } from "@/utils/formatdate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, MoreVertical, SquareCheck, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const ConfirmPaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const queryClient = useQueryClient();

  const { data : allRequests=[], isLoading} = useQuery({
    queryKey : ["requests"],
    queryFn : async () => {
        const response = await axiosInstance.get(`/get-pending-requests`);
        return response?.data?.requests || [];
    }
  });

  const confirmMutation = useMutation({
    mutationFn : async (id : string) => {
        await axiosInstance.put(`/confirm-subscription/${id}`);
    },

    onSuccess : () => {
        queryClient.invalidateQueries({ queryKey : ["requests"] });
        toast.success("Confirmed Request Succesfully!");
        setShowConfirmModal(false);
    },

    onError : (err) => {
      toast.error(`${err}`);
      setShowConfirmModal(false);
    }
  });

  const rejectMutation = useMutation({
    mutationFn : async (id : string) => {
        await axiosInstance.put(`/reject-subscription/${id}` );
    },

    onSuccess : () => {
        queryClient.invalidateQueries({ queryKey : ["requests"] });
        toast.success("Rejected Request Succesfully!");
        setShowRejectModal(false);
    },

    onError : (err) => {
      toast.error(`${err}`);
      setShowRejectModal(false);
    }
  });

  const openConfirmModal = async (request : any) => {
    setSelectedRequest(request);
    setShowConfirmModal(true);
  }

  const openRejectModal = async (request : any) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  }

  const filteredPlans = useMemo(() => {
    return allRequests.filter((a: any) =>
        a.agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allRequests]);

  return (
    <div className="w-full min-h-screen p-8 text-white">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">Confirm Payments</h2>
      </div>

      <div className="flex items-center">
        <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
        <ChevronRight size={20} className="opacity-[.8]"/>
        <span className="">Available Requests</span>
      </div>

      <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4 font-Poppins">Available Requests</h3>

          { isLoading ? (
              <p className="text-gray-400 text-center">Loading requests ... </p>
          ) : (
              <>
                  <div className="mb-4">
                      <Input
                        type="text"
                        placeholder="Search requests by name..."
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
                              <th className="p-3 text-left">Status</th>
                              <th className="p-3 text-left">Created</th>
                              <th className="p-3 text-left">Actions</th>
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
                                      <td className="p-3 truncate capitalize">{request?.status}</td>
                                      <td className="p-3">{formatDate(request?.createdAt)}</td>
                                      <td className="p-3 space-x-2 flex">
                                        <PlanActions 
                                          onConfirm={() => openConfirmModal(request)} 
                                          onReject={() => openRejectModal(request)} 
                                        />
                                      </td>
                                  </tr>
                              ))
                          }
                      </tbody>
                  </table> 
              </>
            )}

            {allRequests?.length === 0 && !isLoading && (
                <p className="block text-center text-gray-400 w-full pt-4">No Requests Avaialable for you.</p>
            )}

        </div>
        {/* Add Visit Modal */}
        { showConfirmModal && selectedRequest && (
            <ConfirmModal
                title={selectedRequest.agent.name}
                description={`${selectedRequest.agent.name} from your plans`}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => confirmMutation.mutate(selectedRequest?.id)}
            />
        )}

        {/* Delete PLan modal */}
        { showRejectModal && selectedRequest && (
            <DeleteModal
                title={selectedRequest.agent.name}
                description={`${selectedRequest.agent.name} from requests`}
                onClose={() => setShowRejectModal(false)}
                onConfirm={() => rejectMutation.mutate(selectedRequest?.id)}
            />
        )}
    </div>
  )
}

const PlanActions = ({ onConfirm, onReject }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="p-2 hover:bg-gray-700 cursor-pointer rounded"
        onClick={() => setOpen(!open)}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-900 border rounded shadow z-10">
          <button
            onClick={() => { onConfirm(); setOpen(false); }}
            className="flex outline-none items-center w-full px-4 py-2 hover:bg-gray-800 text-sm"
          >
            <SquareCheck className="w-4 h-4 mr-2 text-green-500" />
            Confirm
          </button>

          <button
            onClick={() => { onReject(); setOpen(false); }}
            className="flex outline-none items-center w-full px-4 py-2 hover:bg-gray-800 text-sm"
          >
            <Trash2 className="w-4 h-4 mr-2 text-red-500" />
            Reject
          </button>

          <button
            onClick={() => setOpen(false)}
            className="flex outline-none items-center w-full px-4 py-2 hover:bg-gray-800 text-sm"
          >
            <X className="w-4 h-4 mr-2 text-gray-500" />
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfirmPaymentsPage