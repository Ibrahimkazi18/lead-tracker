import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";


// fetch user data from the API
const fetchAgent = async () => {
    const response = await axiosInstance.get('/logged-in-user');
    return response.data.user;
}

const useAgent = () => {
    const {
        data: agent,
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ["agent"],
        queryFn: fetchAgent,
        staleTime: 1000 * 60 * 5,
        retry: 1
    });

    return { agent, isLoading, isError, refetch }
}

export default useAgent;