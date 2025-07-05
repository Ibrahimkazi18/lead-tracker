import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SEVER_URI,
    withCredentials: true
})

let isRefreshing = false;
let refreshSubscribers : (() => void)[] = [];


// Handle logouts and prevent infinite loops
const handleLogout = () => {

    const isAdminRoute =
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/admin");

    if(window.location.pathname !== '/login' && !isAdminRoute) {
        window.location.href = '/login';
    }
    else if(window.location.pathname !== '/admin/login' && isAdminRoute) {
        window.location.href = '/admin/login';
    }
}


// Handle adding a new access token to queued requests
const subscribeTokenRefresh = (callback : () => void) => {
    refreshSubscribers.push(callback);
}


// Execute the queued requests after refreshing
const onRefreshSuccess = () => {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
}


// Handle API requests
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);


// Handle expired tokens and refresh logic
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // prevent inifinite loop problem
        if (error.response?.status === 401 && !originalRequest._retry) {
            if(isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)));
                })
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const isAdminRoute =
                    typeof window !== "undefined" &&
                    window.location.pathname.startsWith("/admin");

                const refreshEndpoint = isAdminRoute
                    ? "/refresh-admin-token"
                    : "/refresh-token";
                    
                await axios.post(
                    `${process.env.NEXT_PUBLIC_SEVER_URI}/${refreshEndpoint}`,
                    {},
                    { withCredentials : true}
                )

                isRefreshing = false;
                onRefreshSuccess();

                return axiosInstance(originalRequest);

            } catch (error) {
                isRefreshing = false;
                refreshSubscribers = [];
                handleLogout();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;