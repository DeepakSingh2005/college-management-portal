import axios from "axios";
import { baseApiURL } from "../baseUrl";

const axiosWrapper = axios.create({
  baseURL: baseApiURL(),
});

// Request interceptor to add auth token to all requests
axiosWrapper.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosWrapper.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.data?.message === "Invalid or expired token" &&
      error.response?.data?.success === false &&
      error.response?.data?.data === null
    ) {
      localStorage.clear();
      window.location.href = "/";
    }
    
    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosWrapper;
