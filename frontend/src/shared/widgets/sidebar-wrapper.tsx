"use client"
import { usePathname, useRouter } from "next/navigation"
import useSidebar from "@/hooks/useSidebar"
import { useEffect, useState } from "react"
import Link from "next/link"
import SidebarItem from "./sidebar-item"
import SidebarMenu from "./sidebar-menu"
import ThemeSwitcher from "./theme-switcher"
import MobileMenuButton from "./mobile-menu-button"
import Home from "@/assets/icons/home"

import {
  BadgeIndianRupee,
  LogOut,
  MapPinIcon as MapPinHouse,
  Settings,
  ShoppingCart,
  SquarePlus,
  UserRoundPlus,
  UsersRound,
  Building2,
} from "lucide-react"
import useAgent from "@/hooks/useAgent"
import toast from "react-hot-toast"

const SideBarWrapper = () => {
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
      await fetch(`${process.env.NEXT_PUBLIC_SEVER_URI}/logout-user`, {
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
    <>
      {/* Mobile Menu Button */}
      <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <Link href="/" className="block">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Open Leads</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Hello, {agent?.name?.split(" ")[0] || "User"}</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Dashboard */}
            <div>
              <SidebarItem
                title="Dashboard"
                isActive={activeSidebar === "/dashboard"}
                href="/dashboard"
                icon={<Home fill={activeSidebar === "/dashboard" ? "#ffffff" : "#64748b"} />}
              />
            </div>

            {/* Referral Section */}
            <SidebarMenu title="Referral">
              <SidebarItem
                title="Add Agents"
                isActive={activeSidebar === "/dashboard/add-agents"}
                href="/dashboard/add-agents"
                icon={<UserRoundPlus size={20} />}
              />
              <SidebarItem
                title="Your Agents"
                isActive={activeSidebar === "/dashboard/all-agents"}
                href="/dashboard/all-agents"
                icon={<UsersRound size={20} />}
              />
            </SidebarMenu>

            {/* Leads Section */}
            <SidebarMenu title="Leads">
              <SidebarItem
                title="Create Lead"
                isActive={activeSidebar === "/dashboard/create-lead"}
                href="/dashboard/create-lead"
                icon={<SquarePlus size={20} />}
              />
              <SidebarItem
                title="All Leads"
                isActive={activeSidebar.startsWith("/dashboard/all-leads")}
                href="/dashboard/all-leads"
                icon={<MapPinHouse size={20} />}
              />
            </SidebarMenu>

            {/* Plans Section */}
            <SidebarMenu title="Plans">
              <SidebarItem
                title="Buy Plan"
                isActive={activeSidebar === "/dashboard/buy-plan"}
                href="/dashboard/buy-plan"
                icon={<ShoppingCart size={20} />}
              />
              <SidebarItem
                title="Your Plan"
                isActive={activeSidebar === "/dashboard/your-plan"}
                href="/dashboard/your-plan"
                icon={<BadgeIndianRupee size={20} />}
              />
            </SidebarMenu>

            {/* Controllers Section */}
            <SidebarMenu title="Settings">
              <SidebarItem
                title="Settings"
                isActive={activeSidebar === "/dashboard/settings"}
                href="/dashboard/settings"
                icon={<Settings size={20} />}
              />
              <SidebarItem title="Logout" onClick={handleLogout} icon={<LogOut size={20} />} />
            </SidebarMenu>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {agent?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{agent?.name || "User"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {agent?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  )
}

export default SideBarWrapper
