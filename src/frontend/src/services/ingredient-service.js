import api from "./api";

const SERVICE_URL = "/ingredients";

export default {
  getAll: async () => {
    const response = await api.get(SERVICE_URL);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(SERVICE_URL, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`${SERVICE_URL}/${id}`, data);
    return response.data;
  },
  
  // (Optionnel si vous avez ajoutÃ© le delete dans le backend)
  delete: async (id) => {
     await api.delete(`${SERVICE_URL}/${id}`);
  }
};