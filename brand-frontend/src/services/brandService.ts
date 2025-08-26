import axiosClient from "../config/axios";

export interface Brand {
  id: string;
  marca: string;
  titular: string;
  status: string;
  pais_registro: string;
  imagen_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const getBrands = async (): Promise<Brand[]> => {
  try {
    const response = await axiosClient.get<Brand[]>("/brands");
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const deleteBrand = async (id: string) => {
  try {
    const response = await axiosClient.delete(`/brands/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error eliminando brand:", error);
    throw error;
  }
};

export interface CreateBrandPayload {
  marca: string;
  titular: string;
  status: string;
  pais_registro?: string;
  imagen_url?: string;
}

export const updateBrand = async (id: string, payload: Partial<CreateBrandPayload>): Promise<Brand> => {
  try {
    const response = await axiosClient.put<Brand>(`/brands/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating brand with id ${id}:`, error);
    throw error;
  }
};

export const uploadBrandImage = async (id: string, image: File): Promise<Brand> => {
  const formData = new FormData();
  formData.append("image_file", image);

  try {
    const response = await axiosClient.put<Brand>(`/brands/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error uploading image for brand with id ${id}:`, error);
    throw error;
  }
};
