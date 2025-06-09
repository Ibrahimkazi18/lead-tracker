import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import useAgent from "./useAgent";

export const usePlanStatus = () => {
  const { agent } = useAgent();

  const { data: activePlan } = useQuery({
    queryKey: ["active-plan"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/get-active-agent-plan/${agent.id}`);
      return response?.data?.active;
    },
    enabled: !!agent?.id,
  });

  const isPlanActive = activePlan ? true : false

  return { isPlanActive, activePlan };
};
