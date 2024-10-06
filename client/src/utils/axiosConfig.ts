import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_HOST_URL}/api/v1`,
    withCredentials:true
});

export default axiosInstance;