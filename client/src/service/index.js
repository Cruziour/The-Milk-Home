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

export const addVendorService = async formData => {
  try {
    const { data } = await axiosInstance.post("/api/v1/user", formData);
    return data;
  } catch (error) {
    console.error("addVendorService error:", error.response?.data || error.message);
    throw error;
  }
};

export const getUserBySlNoAndNameService = async ({ slNo }) => {
  try {
    const { data } = await axiosInstance.get(`/api/v1/user/get-user/${slNo}`);
    return data;
  } catch (error) {
    console.error("getUserBySlNoAndNameService error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateVendorService = async (id, updatedData) => {
  try {
    const { data } = await axiosInstance.put(`/api/v1/user/update/${id}`, updatedData);
    return data;
  } catch (error) {
    console.error("updateVendorService error:", error.response?.data || error.message);
    throw error;
  }
};
