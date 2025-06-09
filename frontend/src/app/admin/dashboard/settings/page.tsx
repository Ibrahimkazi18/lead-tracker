"use client";

import useAdmin from "@/hooks/useAdmin";
import axiosInstance from "@/utils/axiosInstance";
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { admin } = useAdmin();
  
  // Password change states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Both fields are required");
      return;
    }

    try {
      const res = await axiosInstance.post(`/change-password-admin/${admin.id}`, {
        oldPassword,
        newPassword,
      });
      if (res.status === 200) {
        toast.success("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="w-full min-h-screen p-8 text-white">
        <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl text-white font-semibold">Settings</h2>
        </div>

        <div className="flex items-center">
            <Link href={"/admin/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
            <ChevronRight size={20} className="opacity-[.8]"/>
            <span className="">Settings</span>
        </div>

        {/* Change Password */}
        <section className="mb-10 bg-gray-800 p-6 rounded-lg mt-6 shadow-md">
            <h3 className="text-xl mb-4 font-semibold">Change Password</h3>
            <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full mb-3 p-2 rounded bg-gray-900 border border-gray-700"
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mb-3 p-2 rounded bg-gray-900 border border-gray-700"
            />
            <button
                onClick={handleChangePassword}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
            >
            Update Password
            </button>
        </section>
    </div>
  )
}

export default SettingsPage