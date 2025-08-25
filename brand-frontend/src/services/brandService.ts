import axiosClient from "../config/axios";

export const deleteBrand = async (id: string) => {
  try {
    const response = await axiosClient.delete(`/brands/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error eliminando brand:", error);
    throw error;
  }
};