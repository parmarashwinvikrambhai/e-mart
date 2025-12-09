import axios from "axios";
import {store} from "../redux/store"; 
import { logoutUser } from "../redux/slices/authSlice"; 

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    withCredentials: true,
});

// Response interceptor for 401 Unauthorized
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            window.location.pathname !== "/login"
        ) {
            store.dispatch(logoutUser());
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;
