import axiosInstance from "../api/axiosInstance.js";

export const registerVendorService = async payload => {
  try {
    const { data } = await axiosInstance.post("/api/v1/user", payload);
    return data;
  } catch (error) {
    console.error("registerVendorService error:", error.response?.data || error.message);
    throw error;
  }
};

export const loginUserService = async ({ slNo, password }) => {
  try {
    const { data } = await axiosInstance.post("/api/v1/user/login", { slNo, password });
    return data;
  } catch (error) {
    console.error("loginUserService error:", error.response?.data || error.message);
    throw error;
  }
};
