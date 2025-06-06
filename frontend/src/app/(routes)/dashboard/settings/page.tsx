"use client";

import useAgent from "@/hooks/useAgent";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { agent } = useAgent();
  
  // Password change states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  // Expiry days state 
  const { data: expDays} = useQuery({
    queryKey: ["expiringLeads"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-expiry-days/${agent.id}`);
      return res?.data?.expiryDays;
    },
  });

  const queryClient = useQueryClient();

  const [expiryDays, setExpiryDays] = useState(90);
  const [expiryMsg, setExpiryMsg] = useState("");

  useEffect(() => {
    setExpiryDays(expDays);
  }, [expDays])
  // Delete account confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState("");

  const handleChangePassword = async () => {
    setPasswordMsg("");
    if (!oldPassword || !newPassword) {
      setPasswordMsg("Both fields are required");
      return;
    }

    try {
      const res = await axiosInstance.post(`/change-password-user/${agent.id}`, {
        oldPassword,
        newPassword,
      });
      if (res.status === 200) {
        setPasswordMsg("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
      }
    } catch (err: any) {
      setPasswordMsg(err?.response?.data?.message || "Failed to change password");
    }
  };

  const handleUpdateExpiry = async () => {
    setExpiryMsg("");
    if (expiryDays < 1) {
      setExpiryMsg("Expiry days must be at least 1");
      return;
    }

    if (!expiryDays || expiryDays <= 0 || expiryDays > 365) {
      toast.error("Enter a valid number of days (1-365)");
      return;
    }

    try {
      const res = await axiosInstance.post(`/update-expiry-days/${agent.id}`, { days : expiryDays });
      if (res.status === 200) {
          queryClient.invalidateQueries({ queryKey : ["expiringLeads"] });
        setExpiryMsg("Expiry days updated");
      }
    } catch (err: any) {
      setExpiryMsg(err?.response?.data?.message || "Failed to update expiry");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteMsg("");
    try {
      const res = await axiosInstance.delete(`/delete-user/${agent.id}`);
      if (res.status === 200) {
        localStorage.clear();
        setDeleteMsg("Account deleted successfully. Redirecting...");
        window.location.href = "/";
      }
    } catch (err: any) {
      setDeleteMsg(err?.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div className="w-full min-h-screen p-8 text-white">
        <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl text-white font-semibold">Settings</h2>
        </div>

        <div className="flex items-center">
            <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">Dashboard</Link>
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
            {passwordMsg && <p className="mt-2 text-sm">{passwordMsg}</p>}
        </section>

        {/* Modify Lead Expiry */}
        <section className="mb-10 bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl mb-4 font-semibold">Modify Lead Expiry (days)</h3>
            <input
                type="number"
                min={1}
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                className="w-32 p-2 rounded bg-gray-900 border border-gray-700"
            />
            <button
                onClick={handleUpdateExpiry}
                className="ml-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
            >
            Save
            </button>
            {expiryMsg && <p className="mt-2 text-sm">{expiryMsg}</p>}
        </section>

        {/* Delete Account */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl mb-4 font-semibold text-red-500">Delete Account</h3>
            {!deleteConfirm ? (
            <button
                onClick={() => setDeleteConfirm(true)}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
            >
                Delete My Account
            </button>
            ) : (
            <>
                <p className="mb-4 text-sm">Are you sure? This action is irreversible.</p>
                <button
                    onClick={handleDeleteAccount}
                    className="bg-red-800 px-4 py-2 rounded hover:bg-red-900 transition mr-4"
                >
                Yes, Delete
                </button>
                <button
                    onClick={() => setDeleteConfirm(false)}
                    className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                Cancel
                </button>
                {deleteMsg && <p className="mt-2 text-sm">{deleteMsg}</p>}
            </>
            )}
        </section>
    </div>
  )
}

export default SettingsPage