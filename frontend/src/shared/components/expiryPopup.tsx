"use client";

import { usePlanStatus } from "@/hooks/usePlan";
import { AlertTriangle } from "lucide-react";

const SubscriptionExpiryWarning = () => {
  const { willExpireSoon, daysLeft } = usePlanStatus();

  if (!willExpireSoon || !daysLeft) return null;

  return (
    <div className="bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 px-6 py-4 mb-6 rounded-lg shadow-md flex items-center">
      <AlertTriangle className="mr-3" />
      <div>
        <p className="font-semibold">Heads up! Your plan is expiring soon.</p>
        <p>You have {daysLeft} day{daysLeft > 1 ? "s" : ""} left to renew your subscription.</p>
      </div>
    </div>
  );
};

export default SubscriptionExpiryWarning;
