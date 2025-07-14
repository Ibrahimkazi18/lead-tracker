"use client"

import useCheckActivePlan from "@/hooks/useCheckActivePlan"
import DashboardLayout from "@/shared/components/dashboard-layout"
import SubscriptionExpiryWarning from "@/shared/components/expiryPopup"
import { Head } from "next/document"
import React from "react"

const Layout = ({ children } : { children : React.ReactNode }) => {
  useCheckActivePlan();

  return (
    <>
      <Head>
        <title>Dashboard | Open Leads</title>
        <meta
          name="description"
          content="Access your personalized dashboard on Open Leads. Manage leads, track subscriptions, view analytics, and stay updated with plan expiry warnings."
        />
        <meta
          name="keywords"
          content="CRM dashboard, Open Leads, lead management, plan expiry, analytics, CRM tools"
        />

        {/* Open Graph Meta */}
        <meta property="og:title" content="Dashboard | Open Leads" />
        <meta
          property="og:description"
          content="Monitor your performance and manage your leads efficiently with the Open Leads dashboard. Get alerts on subscription expiry and optimize your CRM usage."
        />
        <meta property="og:url" content="https://www.openleads.in/dashboard" />
        <meta property="og:site_name" content="Open Leads" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.openleads.in/og-image-dashboard.png" />
        <meta property="og:image:alt" content="Open Leads Dashboard Overview" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dashboard | Open Leads" />
        <meta
          name="twitter:description"
          content="Your CRM command center — manage leads, check your subscription status, and track all activities in one place."
        />
        <meta name="twitter:image" content="https://www.openleads.in/og-image-dashboard.png" />
      </Head>

      <DashboardLayout>
          <SubscriptionExpiryWarning />
          {children}
      </DashboardLayout>
    </>
  )
}

export default Layout