"use client"

import useCheckActivePlan from "@/hooks/useCheckActivePlan"
import SubscriptionExpiryWarning from "@/shared/components/expiryPopup"
import SideBarWrapper from "@/shared/widgets/sidebar-wrapper"
import React from "react"

const Layout = ({ children } : { children : React.ReactNode }) => {
  useCheckActivePlan();

  return (
    <div className="flex h-full bg-black min-h-screen">
        {/* Sidebar */}
        <aside className="w-[280px] min-w-[250px] max-w-[300px] border-r border-r-slate-800 text-white p-4">
            <div className="sticky top-0">
                <SideBarWrapper />
            </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1">
            <div className="overflow-auto">
                <SubscriptionExpiryWarning />
                {children}
            </div>
        </main>
    </div>
  )
}

export default Layout