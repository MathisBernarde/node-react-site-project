import api from "./api";
const SERVICE_URL = "/shopping-lists";

export default {
    getAll: async () => {
    const response = await api.get(SERVICE_URL);
    return response.data;
  },

  create: async (title) => {
    const response = await api.post(SERVICE_URL, { 
        title, 
        status: "OPEN" 
    });
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`${SERVICE_URL}/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`${SERVICE_URL}/${id}`);
  }
};