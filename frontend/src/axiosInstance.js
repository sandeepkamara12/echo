import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BA_URL
});

axiosInstance.interceptors.request.use((config)=>{
    const token = JSON.parse(localStorage.getItem('access_token'));
    config.headers = {
        ...config.headers,
        'Content-Type': 'application/json',
    };
    if(token) {
        config.headers['authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use((response)=>response, (error)=> {
    // While using invalid token or token expires after the provided time period in the backend which is 1 minute.
    if(error.response && error.response.status === 401) {
        toast.error(error.response.data.message || "Unauthorized User!");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = "/login";
    }
    Promise.reject(error)
}
);

export default axiosInstance;