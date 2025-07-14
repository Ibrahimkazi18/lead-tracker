"use client"

import useCheckActivePlan from "@/hooks/useCheckActivePlan"
import DashboardLayout from "@/shared/components/dashboard-layout"
import SubscriptionExpiryWarning from "@/shared/components/expiryPopup"
import React from "react"

const Layout = ({ children } : { children : React.ReactNode }) => {
  useCheckActivePlan();

  return (
    <>
      <DashboardLayout>
          <SubscriptionExpiryWarning />
          {children}
      </DashboardLayout>
    </>
  )
}

export default Layout