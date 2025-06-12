"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import useAgent from "./useAgent";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useCheckActivePlan = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { agent } = useAgent();

  const { data: activePlan, isFetched } = useQuery({
    queryKey: ["active-plan"],
    queryFn: async () => {
      if (!agent?.id) return null;
      const res = await axiosInstance.get(`/get-active-agent-plan/${agent.id}`);
      return res.data.active;
    },
    enabled: !!agent?.id,
    staleTime: 1000 * 60 * 5, 
  });

  useEffect(() => {
    if (!isFetched) return;

    const protectedRoutes = [
      "/dashboard/add-agents",
      "/dashboard/create-lead",
    ];

    const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
    const isBuyPlan = pathname === "/dashboard/buy-plan";

    if (isProtected && !activePlan && !isBuyPlan) {
      toast("You don't have a plan. Please buy one to continue.", {duration : 6000});
      router.push("/dashboard/buy-plan");
    }
  }, [pathname, activePlan, isFetched, router]);
};

export default useCheckActivePlan;
