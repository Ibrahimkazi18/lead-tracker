"use client"

import useAgent from "@/hooks/useAgent";
import Input from "@/shared/components/input";
import axiosInstance from "@/utils/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AddLeadPage = () => {
  const { register, reset , handleSubmit, formState : { errors }} = useForm({
    defaultValues : {
      name : "",
      email: null,
      residenceAdd : "",
      contactNo: "",
      projectDetail: "",
      requirement: "",
      budget: "",
      howHeard: "",
      location: "",
      referredBy: "",
      createdAt: new Date().toISOString().slice(0, 10),
    }
  });

  const [loading, setLoading] = useState(false);
  const { agent } = useAgent();

  const { data : allAgents = [], isLoading} = useQuery({
    queryKey : ["referral-agents"],
    queryFn : async () => {
        const response = await axiosInstance.get(`/get-referrals/${agent.id}`);
        return response?.data?.referrals || [];
    }
  })

  const createLeadMutation = useMutation({
    mutationFn: async (data : any) => {
      const toSend = { ...data, agentId : agent.id }
      const response = await axiosInstance.post(`/create-lead`, toSend);
      return response.data;
    },

    onSuccess : () => {
      toast.success("Lead created successfully!");
      setLoading(false);
      reset();
    },

    onError : () => {
      toast.error("Something went wrong, try again later.")
      setLoading(false);
      reset();
    }
  })

  const onSubmit = (data : any) => {
    setLoading(true);
    createLeadMutation.mutate(data);
  }

  return (
    <form className="w-full mx-auto p-8 rounded-lg shadow-md text-white" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
        Create Lead
      </h2>

      <div className="flex items-center">
        <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
        <ChevronRight size={20} className="opacity-[.8]" />
        <span className="">Create Lead</span>
      </div>

      {/* Content layout 50-50 */}
      <div className="py-4 flex w-full gap-6">
        <div className="md:w-[50%]">
          <div className="w-full">
            <Input
              label="Lead Name *"
              type="text"
              placeholder="Enter lead's name"
              {...register("name", { required : "Name is required!"})}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message as string}
              </p>
            )}

            <div className="mt-4">
              <Input
                label="Residence Address *"
                type="text"
                placeholder="Enter residence address"
                {...register("residenceAdd", { required : "Residence Address is required!"})}
              />
              {errors.residenceAdd && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.residenceAdd.message as string}
                </p>
              )}
            </div>

            <div className="mt-4">
              <Input
                label="Contact No *"
                type="text"
                placeholder="Enter contact number"
                {...register("contactNo", { 
                  required: "Contact Number is required.",
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,         
                    message: "Invalid phone number format"
                  },
                  minLength: {
                    value: 10,
                    message: 'Phone number must be atleast 10 digits',
                }})}
              />
              {errors.contactNo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contactNo.message as string}
                </p>
              )}
            </div>

            <div className="mt-4">
              <Input
                label="Email"
                type="text"
                placeholder="abc@xyz.com"
                {...register("email", { 
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address."
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>
            
            <div className="mt-4">
              <Input
                label="Budget *"
                type="text"
                placeholder="eg. 50L, 75L, 1CR"
                {...register("budget", { 
                  required : "Budget is required!",
                })}
              />
              {errors.budget && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.budget.message as string}
                </p>
              )}
            </div>

            { 
              isLoading
                ? (
                  <div className="mt-4">
                    Loading Referral Agents ... 
                  </div>
                )
                : (
                  allAgents.length > 0
                    ? (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-white mb-1">Referred By</label>
                        <select
                          {...register("referredBy")}
                          className="w-full bg-black border border-gray-600 rounded p-2 text-white focus:outline-none"
                        >
                          <option value="">Select Agent</option>
                          {allAgents.map((agent : any) => (
                            <option value={agent.id} key={agent.id}>{agent.name}</option>
                          ))}
                        </select>
                        {errors.referredBy && (
                          <p className="text-red-500 text-xs mt-1">{errors.referredBy.message as string}</p>
                        )}
                      </div>
                    )
                    : (
                      <div className="mt-4">
                        No referral agents add them in the <Link href={'/dashboard/add-agents'}>Add Agents{" "}</Link>page.
                      </div>
                    )
                )
            }
          </div>
        </div>

        <div className="md:w-[50%]">
          <div className="w-full">
            <div className="mt-4">
              <Input
                label="Search Area *"
                type="text"
                placeholder="Enter Search Area"
                {...register("location", { required : "Search Area is required!"})}
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.location.message as string}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-1">Requirement *</label>
              <select
                {...register("requirement", { required: "Requirement is required!" })}
                className="w-full bg-black border border-gray-600 rounded p-2 text-white focus:outline-none"
              >
                <option value="">Select Requirement</option>
                <option value="R_1RK">1RK</option>
                <option value="R_1BHK">1BHK</option>
                <option value="R_2BHK">2BHK</option>
                <option value="R_3BHK">3BHK</option>
                <option value="R_4BHK">4BHK</option>
                <option value="SHOP">Shop</option>
              </select>
              {errors.requirement && (
                <p className="text-red-500 text-xs mt-1">{errors.requirement.message as string}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-1">How did you hear about us? *</label>
              <select
                {...register("howHeard", { required: "This field is required!" })}
                className="w-full bg-black border border-gray-600 rounded p-2 text-white focus:outline-none"
              >
                <option value="">Select Source</option>
                <option value="HORDING">Hoarding</option>
                <option value="FRIENDS">Friends</option>
                <option value="STANDEY">Standey</option>
                <option value="OTHER_SOURCES">Other Sources</option>
              </select>
              {errors.howHeard && (
                <p className="text-red-500 text-xs mt-1">{errors.howHeard.message as string}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-1">Date of Lead *</label>
              <input
                type="date"
                {...register("createdAt", { required: "Date is required" })}
                className="w-full bg-black border border-gray-600 rounded p-2 text-white focus:outline-none"
              />
              {errors.createdAt && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.createdAt.message as string}
                </p>
              )}
            </div>

            <div className="mt-4">
              <Input 
                label="Project Detail (Max 50 words)"
                type="textarea"
                rows={7}
                cols={8}
                placeholder="Enter project description for quick overview"
                {...register("projectDetail", { 
                  validate : (value) => {
                    const wordCount = value.trim().split(/\s+/).length;
                    return (
                      wordCount < 50 || `Project Detail cannot exceed 150 words (Current: ${wordCount})`
                    )
                  }
                })}
              />
              {errors.projectDetail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.projectDetail.message as string}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full justify-end items-center flex">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-md cursor-pointer"
          disabled={loading}
        >
          { loading ? 'Creating Lead ... ' : 'Create Lead'} 
        </button>
      </div>      
    </form>
  )
}

export default AddLeadPage