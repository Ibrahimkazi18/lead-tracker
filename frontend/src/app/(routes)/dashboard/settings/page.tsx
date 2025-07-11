"use client"

import useAgent from "@/hooks/useAgent"
import axiosInstance from "@/utils/axiosInstance"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ChevronRight,
  Lock,
  Key,
  Calendar,
  Trash2,
  Save,
  AlertTriangle,
  Shield,
  SettingsIcon,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const SettingsPage = () => {
  const { agent } = useAgent()

  // Password change states
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordMsg, setPasswordMsg] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Expiry days state
  const { data: expDays } = useQuery({
    queryKey: ["expiringLeads"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-expiry-days/${agent.id}`)
      return res?.data?.expiryDays
    },
  })

  const queryClient = useQueryClient()
  const [expiryDays, setExpiryDays] = useState(90)
  const [expiryMsg, setExpiryMsg] = useState("")

  useEffect(() => {
    setExpiryDays(expDays)
  }, [expDays])

  // Delete account confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteMsg, setDeleteMsg] = useState("")

  const handleChangePassword = async () => {
    setPasswordMsg("")
    if (!oldPassword || !newPassword) {
      setPasswordMsg("Both fields are required")
      return
    }
    try {
      const res = await axiosInstance.post(`/change-password-user/${agent.id}`, {
        oldPassword,
        newPassword,
      })
      if (res.status === 200) {
        setPasswordMsg("Password changed successfully")
        setOldPassword("")
        setNewPassword("")
      }
    } catch (err: any) {
      setPasswordMsg(err?.response?.data?.message || "Failed to change password")
    }
  }

  const handleUpdateExpiry = async () => {
    setExpiryMsg("")
    if (expiryDays < 1) {
      setExpiryMsg("Expiry days must be at least 1")
      return
    }
    if (!expiryDays || expiryDays <= 0 || expiryDays > 365) {
      toast.error("Enter a valid number of days (1-365)")
      return
    }
    try {
      const res = await axiosInstance.post(`/update-expiry-days/${agent.id}`, { days: expiryDays })
      if (res.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["expiringLeads"] })
        setExpiryMsg("Expiry days updated")
      }
    } catch (err: any) {
      setExpiryMsg(err?.response?.data?.message || "Failed to update expiry")
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteMsg("")
    try {
      const res = await axiosInstance.delete(`/delete-user/${agent.id}`)
      if (res.status === 200) {
        localStorage.clear()
        setDeleteMsg("Account deleted successfully. Redirecting...")
        window.location.href = "/"
      }
    } catch (err: any) {
      setDeleteMsg(err?.response?.data?.message || "Failed to delete account")
    }
  }

  const getMessageColor = (message: string, isSuccess = false) => {
    if (message.includes("successfully") || message.includes("updated") || isSuccess) {
      return "text-green-600 dark:text-green-400"
    }
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                  <SettingsIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  Settings
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Manage your account preferences and security settings
                </p>
              </div>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <Link
                  href="/dashboard"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <ChevronRight size={16} className="mx-2" />
                <span>Settings</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Change Password Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Change Password</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Update your account password for better security
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Old Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Current Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <button
                  onClick={handleChangePassword}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Update Password
                </button>
                {passwordMsg && (
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    {passwordMsg.includes("successfully") ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <p className={`text-sm ${getMessageColor(passwordMsg)}`}>{passwordMsg}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lead Expiry Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Lead Expiry Settings</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Configure how long leads remain active in your system
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-4 items-center">
                <div className="space-y-2 flex-1 max-w-xs">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Expiry Days (1-365)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={expiryDays || ""}
                      onChange={(e) => setExpiryDays(Number.parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter days"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Current setting: {expDays || "Loading..."} days
                  </p>
                </div>

                <div className="flex flex-col gap-4 items-start">
                  <button
                    onClick={handleUpdateExpiry}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  {expiryMsg && (
                    <div className="flex items-center gap-2">
                      {expiryMsg.includes("updated") ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <p className={`text-sm ${getMessageColor(expiryMsg)}`}>{expiryMsg}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-6 border-b border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-900 dark:text-red-100">Danger Zone</h3>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    Permanently delete your account and all associated data
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {!deleteConfirm ? (
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">
                          This action cannot be undone
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Deleting your account will permanently remove all your data, including leads, settings, and
                          subscription information.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete My Account
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Are you absolutely sure?</h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                          This action is irreversible. All your data will be permanently deleted and cannot be
                          recovered.
                        </p>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          Type "DELETE" to confirm this action.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Yes, Delete Forever
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl border border-slate-300 dark:border-slate-600 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>

                  {deleteMsg && (
                    <div className="flex items-center gap-2">
                      {deleteMsg.includes("successfully") ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <p className={`text-sm ${getMessageColor(deleteMsg)}`}>{deleteMsg}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
