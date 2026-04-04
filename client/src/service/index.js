import axiosInstance from "../api/axiosInstance.js";

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

export const getAllVendorsService = async () => {
  try {
    const { data } = await axiosInstance.get("/api/v1/user/get-all-users");
    return data;
  } catch (error) {
    console.error("getAllVendorsService error:", error.response?.data || error.message);
    throw error;
  }
};

// Milk related services
export const getAllMilkEntriesBySlNoService = async (slNo, logMonth, logYear) => {
  try {
    const { data } = await axiosInstance.get("/api/v1/milk/get-entries-by-slno", {
      params: {
        slNo,
        month: logMonth,
        year: logYear,
      },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("getAllMilkEntriesService error:", error.response?.data || error.message);
    throw error;
  }
};
export const getAllMilkEntriesService = async (logMonth, logYear) => {
  try {
    const { data } = await axiosInstance.get("/api/v1/milk/get-entries", {
      params: {
        month: logMonth,
        year: logYear,
      },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("getAllMilkEntriesService error:", error.response?.data || error.message);
    throw error;
  }
};

export const addMilkEntryService = async payload => {
  try {
    const { data } = await axiosInstance.post("/api/v1/milk/add", payload, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("addMilkEntryService error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateMilkEntryService = async (entryId, payload) => {
  try {
    const { data } = await axiosInstance.put(`/api/v1/milk/update-entry/${entryId}`, payload, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("updateMilkEntryService error:", error.response?.data || error.message);
    throw error;
  }
};

export const exportMilkEntriesService = async (slNo, month, year, format) => {
  try {
    return await axiosInstance.get("/api/v1/milk/export", {
      params: { slNo, month, year, format },
      responseType: "blob",
    });
  } catch (error) {
    console.error("exportMilkEntriesService error:", error.response?.data || error.message);
    throw error;
  }
};
