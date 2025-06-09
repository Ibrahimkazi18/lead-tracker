"use client"

import Input from "@/shared/components/input";
import axiosInstance from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const CreatePlanPage = () => {
  const { register, reset , handleSubmit, formState : { errors }} = useForm({
    defaultValues : {
      name : "",
      description : "",
      duration : 0,
      price: 0,
    }
  });

  const [loading, setLoading] = useState(false);

  const createPlanMutation = useMutation({
    mutationFn: async (data : any) => {
      const response = await axiosInstance.post(`/create-plan`, data);
      return response.data;
    },

    onSuccess : () => {
      setLoading(false);
      toast.success("Successfully created the plan!");
      reset();
    },

    onError : () => {
      toast.error("Something went wrong, try again later.")
      setLoading(false);
      reset();
    }
  });

  const onSubmit = (data : any) => {
    setLoading(true);
    console.log(data);
    createPlanMutation.mutate(data);
  }

  return (
    <form className="w-full mx-auto p-8 rounded-lg shadow-md text-white" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
        Create Plan
      </h2>

      <div className="flex items-center">
        <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
        <ChevronRight size={20} className="opacity-[.8]" />
        <span className="">Create Plan</span>
      </div>

      {/* Content layout 50-50 */}
      <div className="py-4 flex w-full gap-6">
        <div className="md:w-[50%]">
          <div className="w-full">
            <Input
              label="Plan Name *"
              type="text"
              placeholder="Enter plan's name"
              {...register("name", { required : "Name is required!"})}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message as string}
              </p>
            )}

            <div className="mt-4">
              <Input
                label="Price *"
                type="number"
                placeholder="Enter Price"
                {...register("price", { 
                  required : "Price is required!",
                  min: 1
                })}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message as string}
                </p>
              )}
            </div>
            
            <div className="mt-4">
              <Input
                label="Duration *"
                type="number"
                placeholder="eg. 30, 90, 365"
                {...register("duration", { 
                  required : "Duration is required!",
                })}
              />
              {errors.duration && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.duration.message as string}
                </p>
              )}
            </div>

          </div>
        </div>

        <div className="md:w-[50%]">
          <div className="w-full">
            <div className="mt-4">
              <Input 
                label="Plan Description (Max 50 words)"
                type="textarea"
                rows={7}
                cols={10}
                placeholder="Enter plan description for quick overview"
                {...register("description", { 
                  validate : (value) => {
                    const wordCount = value.trim().split(/\s+/).length;
                    return (
                      wordCount < 50 || `Plan Description cannot exceed 50 words (Current: ${wordCount})`
                    )
                  }
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message as string}
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
          { loading ? 'Creating Plan ... ' : 'Create Plan'} 
        </button>
      </div>      
    </form>
  )
}

export default CreatePlanPage