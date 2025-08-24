import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `${process.env.api_url}/api/v1/`,
    withCredentials: false
});

axiosClient.interceptors.request.use(config => {

    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosClient;