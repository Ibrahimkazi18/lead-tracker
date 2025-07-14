import AdminDashboardLayout from "@/shared/components/admin-dashboard-layout"
import React from "react"

const Layout = ({ children } : { children : React.ReactNode }) => {
  return (
        <AdminDashboardLayout>
                {children}
        </AdminDashboardLayout>
  )
}

export default Layout