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

axiosInstance.interceptors.request.use(
  config => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const accessToken = user.accessToken;
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
