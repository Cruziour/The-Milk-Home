import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 150000,
});

// Request Interceptor: Har request se pehle ye function chalega
axiosInstance.interceptors.request.use(
  config => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      config.headers.Authorization = `Bearer ${user._id}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
