"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { ChevronRight } from "lucide-react"
import Link from "next/link";
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form";
import Input from "@/shared/components/input";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatdate";
import DeleteModal from "@/shared/components/delete-modal";
import useAdmin from "@/hooks/useAdmin";
import toast from "react-hot-toast/headless";
import { MoreVertical, Trash2, PenLine, Star, X } from "lucide-react";
import SetDefaultModal from "@/shared/components/set-default-modal";
import UpdateModal from "@/shared/components/update-modal";

export interface PlanType {
    id : string;
    name : string;
    duration : number;
    price : number;
    description ?: string;
    isDefault : boolean;
    createdAt: string;
}

const PlanActions = ({ onDelete, onUpdate, onSetDefault }: any) => {
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
            onClick={() => { onDelete(); setOpen(false); }}
            className="flex outline-none items-center w-full px-4 py-2 hover:bg-gray-800 text-sm"
          >
            <Trash2 className="w-4 h-4 mr-2 text-red-500" />
            Delete
          </button>

          <button
            onClick={() => { onUpdate(); setOpen(false); }}
            className="flex outline-none items-center w-full px-4 py-2 hover:bg-gray-800 text-sm"
          >
            <PenLine className="w-4 h-4 mr-2 text-blue-500" />
            Update
          </button>

          <button
            onClick={() => { onSetDefault(); setOpen(false); }}
            className="flex outline-none items-center w-full px-4 py-2 hover:bg-gray-800 text-sm"
          >
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Set Default
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

const AllPlansPage = () => {
  const { register, control, reset, handleSubmit, formState : { errors }} = useForm({
    defaultValues : {
        referralIds : [],
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanType>();
  const [showSetDefaultModal, setShowSetDefaultModal] = useState(false);
  const [showDeletePlanModal, setShowDeletePlanModal] = useState(false);
  const [showUpdatePlanModal, setShowUpdatePlanModal] = useState(false);

  const { admin } = useAdmin();
  const router = useRouter()

  const queryClient = useQueryClient();

  const { data : allPlans = [], isLoading} = useQuery({
    queryKey : ["plans"],
    queryFn : async () => {
        const response = await axiosInstance.get(`/get-all-plans`);
        return response?.data?.plans || [];
    }
  });

  const deletePlanMutation = useMutation({
    mutationFn : async (planId : string) => {
        await axiosInstance.delete(`/delete-plan/${planId}`);
    },

    onSuccess : () => {
        queryClient.invalidateQueries({ queryKey : ["plans"] });
        toast.success("Deleted Plan Succesfully!");
        setShowDeletePlanModal(false);
    },

    onError : (err) => {
      toast.error(`${err}`);
      setShowDeletePlanModal(false);
    }
  });

  const setDefaultPlanMutation = useMutation({
    mutationFn : async (planId : string) => {
        await axiosInstance.patch(`/set-default/${planId}` );
    },

    onSuccess : () => {
        queryClient.invalidateQueries({ queryKey : ["plans"] });
        toast.success("Set Plan as Default Succesfully!");
        setShowSetDefaultModal(false);
    },

    onError : (err) => {
      toast.error(`${err}`);
      setShowSetDefaultModal(false);
    }
  });

  const updatePlanMutation = useMutation({
    mutationFn : async ({ planId, data }: { planId: string; data: any }) => {
      console.log("planId:", planId);
      console.log("data:", data);
      await axiosInstance.put(`/update-plan/${planId}`, data );
    },

    onSuccess : () => {
        queryClient.invalidateQueries({ queryKey : ["plans"] });
        toast.success("Plan Updated Succesfully!");
        setShowUpdatePlanModal(false);
    },

    onError : (err) => {
      toast.error(`${err}`);
      setShowUpdatePlanModal(false);
    }
  });

  const openDeletePlanModal = async (lead : PlanType) => {
    setSelectedPlan(lead);
    setShowDeletePlanModal(true);
  }

  const openSetDefaultModal = async (lead : PlanType) => {
    setSelectedPlan(lead);
    setShowSetDefaultModal(true);
  }

  const openUpdateModal = async (lead : PlanType) => {
    setSelectedPlan(lead);
    setShowUpdatePlanModal(true);
  }

  const filteredPlans = useMemo(() => {
    return allPlans.filter((a: PlanType) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allPlans]);

  return (
    <div className="w-full min-h-screen p-8 text-white">
        <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl text-white font-semibold">Available Plans</h2>
        </div>

        {/* Bread Crumbs */}
        <div className="flex items-center">
            <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
            <ChevronRight size={20} className="opacity-[.8]"/>
            <span className="">Available Plans</span>
        </div>

        {/* existing codes */}
        <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4 font-Poppins">Available Plans</h3>

            { isLoading ? (
                <p className="text-gray-400 text-center">Loading plans ... </p>
            ) : (
                <>
                    <div className="mb-4">
                        <Input
                          type="text"
                          placeholder="Search plans by name..."
                          className="mb-4 w-full"
                          value={searchQuery}
                          onChange={(e:any) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <table className="w-full text-white">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Price</th>
                                <th className="p-3 text-left">Duration (days)</th>
                                <th className="p-3 text-left">Defualt</th>
                                <th className="p-3 text-left">Created</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                filteredPlans.map((plan:any) => (
                                    <tr 
                                        key={plan?.id}
                                        className="border-b border-gray-800 hover:bg-gray-800 transition"
                                    >
                                        <td className="p-3">{plan?.name}</td>
                                        <td className="p-3">₹{plan?.price}</td>
                                        <td className="p-3">{plan?.duration}</td>
                                        <td className="p-3 truncate">{plan?.isDefault ? "Yes" : "No"}</td>
                                        <td className="p-3">{formatDate(plan?.createdAt)}</td>
                                        <td className="p-3 space-x-2 flex">
                                          <PlanActions 
                                            onDelete={() => openDeletePlanModal(plan)} 
                                            onUpdate={() => openUpdateModal(plan)} 
                                            onSetDefault={() => openSetDefaultModal(plan)} 
                                          />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table> 
                </>
            )}

            {allPlans?.length === 0 && !isLoading && (
                <p className="block text-center text-gray-400 w-full pt-4">No Plans Avaialable for you.</p>
            )}
        </div>

        {/* Add Visit Modal */}
        { showSetDefaultModal && selectedPlan && (
            <SetDefaultModal
                title={selectedPlan.name}
                description={`${selectedPlan.name} from your plans`}
                onClose={() => setShowSetDefaultModal(false)}
                onConfirm={() => setDefaultPlanMutation.mutate(selectedPlan?.id)}
            />
        )}

        {/* Delete PLan modal */}
        { showDeletePlanModal && selectedPlan && (
            <DeleteModal
                title={selectedPlan.name}
                description={`${selectedPlan.name} from your plans`}
                onClose={() => setShowDeletePlanModal(false)}
                onConfirm={() => deletePlanMutation.mutate(selectedPlan?.id)}
            />
        )}

        {/* Update plan modal */}
        {showUpdatePlanModal && selectedPlan && (
          <UpdateModal
            plan={{
              id : selectedPlan.id, 
              name : selectedPlan.name, 
              price : selectedPlan.price, 
              duration : selectedPlan.duration, 
              description : selectedPlan.description, 
            }}
            onClose={() => setShowUpdatePlanModal(false)}
            onSubmit={(updatedData) => updatePlanMutation.mutate({ planId : selectedPlan.id, data : updatedData})}
          />
        )}
    </div>
  )
}

export default AllPlansPage