"use client"
import useAdmin from "@/hooks/useAdmin"
import axiosInstance from "@/utils/axiosInstance"
import { ChevronRight, Lock, KeyRound, Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"

const SettingsPage = () => {
  const { admin } = useAdmin()

  // Password change states
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Both fields are required.")
      return
    }
    setLoading(true)
    try {
      const res = await axiosInstance.post(`/change-password-admin/${admin.id}`, {
        oldPassword,
        newPassword,
      })
      if (res.status === 200) {
        toast.success("Password changed successfully!")
        setOldPassword("")
        setNewPassword("")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
                <p className="text-slate-600 dark:text-slate-300">Manage your account settings and preferences</p>
              </div>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <Link
                  href="/admin/dashboard"
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

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Change Password Section */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Change Password
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                Update your account password for enhanced security
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="old-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Old Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="old-password"
                    type="password"
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleChangePassword}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
