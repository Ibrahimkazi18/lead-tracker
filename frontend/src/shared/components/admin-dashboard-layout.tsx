"use client"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"

import useSidebar from "@/hooks/useSidebar"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  LogOut,
  Settings,
  Building2,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  BadgeCheck,
  ClipboardList,
  FilePlus,
  FolderKanban,
} from "lucide-react"
import Home from "@/assets/icons/home"
import useAgent from "@/hooks/useAgent"
import toast from "react-hot-toast"
import ThemeToggleButton from "@shared/components/theme-toggle"

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  isActive?: boolean
  href?: string
  onClick?: () => void
}

const SidebarItem = ({ icon, title, isActive, href, onClick }: SidebarItemProps) => {
  const content = (
    <div
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
        isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
      }`}
      onClick={onClick}
    >
      <div className={`flex-shrink-0 ${isActive ? "text-white" : ""}`}>{icon}</div>
      <span className="font-medium text-sm truncate">{title}</span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return content
}

interface SidebarMenuProps {
  title: string
  children: React.ReactNode
}

const SidebarMenu = ({ title, children }: SidebarMenuProps) => {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-2">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700">
        <div className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-md transition-colors ${
          theme === "light" ? "bg-white dark:bg-slate-700 shadow-sm" : "hover:bg-slate-200 dark:hover:bg-slate-700"
        }`}
        aria-label="Light theme"
      >
        <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-md transition-colors ${
          theme === "dark" ? "bg-white dark:bg-slate-700 shadow-sm" : "hover:bg-slate-200 dark:hover:bg-slate-700"
        }`}
        aria-label="Dark theme"
      >
        <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-md transition-colors ${
          theme === "system" ? "bg-white dark:bg-slate-700 shadow-sm" : "hover:bg-slate-200 dark:hover:bg-slate-700"
        }`}
        aria-label="System theme"
      >
        <Monitor className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      </button>
    </div>
  )
}

interface AdminDashboardLayoutProps {
  children: React.ReactNode
}

const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  const { activeSidebar, setActiveSidebar } = useSidebar()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathName = usePathname()
  const { agent } = useAgent()
  const router = useRouter()

  useEffect(() => {
    setActiveSidebar(pathName)
  }, [pathName, setActiveSidebar])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false)
  }, [pathName])

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SEVER_URI}/logout-admin`, {
        method: "POST",
        credentials: "include",
      })
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        ) : (
          <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:transform-none ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <Link href="/admin/admin/dashboard" className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white font-poppins">Open Leads</h1>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Hello, {agent?.name?.split(" ")[0] || "Admin"}</span>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Dashboard */}
              <div>
                <SidebarItem
                  title="Dashboard"
                  isActive={activeSidebar === "/admin/dashboard"}
                  href="/admin/dashboard"
                  icon={<Home fill={activeSidebar === "/admin/dashboard" ? "#ffffff" : "#64748b"} />}
                />
              </div>

              <SidebarMenu title="Manage Plans">
                <SidebarItem 
                    title="Confirm Payments" 
                    isActive={activeSidebar === "/admin/dashboard/confirm-payments"}
                    href="/admin/dashboard/confirm-payments"
                    icon={<BadgeCheck size={26} />}
                />

                <SidebarItem 
                    title="Active Plans" 
                    isActive={activeSidebar === "/admin/dashboard/active-plans"}
                    href="/admin/dashboard/active-plans"
                    icon={<ClipboardList size={26} />}
                />
              </SidebarMenu>

              <SidebarMenu title="Plans">
                <SidebarItem 
                    title="Create Plan" 
                    isActive={activeSidebar === "/admin/dashboard/create-plan"}
                    href="/admin/dashboard/create-plan"
                    icon={<FilePlus size={24} />}
                />

                <SidebarItem 
                    title="All Plans" 
                    isActive={activeSidebar.startsWith("/admin/dashboard/all-plans")}
                    href="/admin/dashboard/all-plans"
                    icon={<FolderKanban />}
                />
              </SidebarMenu>

              <SidebarMenu title="Controllers">
                <SidebarItem 
                    title="Settings" 
                    isActive={activeSidebar === "/admin/dashboard/settings"}
                    href="/admin/dashboard/settings"
                    icon={<Settings size={24} />}
                />

                <SidebarItem 
                    title="Logout" 
                    onClick={handleLogout}
                    icon={<LogOut size={24} />}
                />
              </SidebarMenu>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {agent?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {agent?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {agent?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              <ThemeToggleButton />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboardLayout
