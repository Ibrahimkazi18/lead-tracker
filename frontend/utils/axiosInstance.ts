import axios from "axios"

const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SEVER_URI}`,
    withCredentials: true
})

export default axiosInstance