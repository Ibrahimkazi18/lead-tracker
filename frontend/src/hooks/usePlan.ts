import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import useAgent from "./useAgent";

export const usePlanStatus = () => {
  const { agent } = useAgent();

  const { data: activePlan = {} } = useQuery({
    queryKey: ["active-plan"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-active-agent-plan/${agent.id}`);
      return response?.data?.active;
    },
    enabled: !!agent?.id,
  });

  const isPlanActive = activePlan ? true : false;

  const daysLeft = activePlan?.expiresAt
    ? Math.ceil((new Date(activePlan.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const willExpireSoon = typeof daysLeft === "number" && daysLeft <= 5 && daysLeft > 0;

  const isExpired = typeof daysLeft === "number" && daysLeft <= 0;

  return {
    isPlanActive,
    activePlan,
    daysLeft,
    willExpireSoon,
    isExpired,
  };
};
