import api from "./api";

const SERVICE_URL = "/recipes";

export default {
  // recuperer toutes recettes (publiques + miennes)
  getAll: async () => {
    const response = await api.get(SERVICE_URL);
    return response.data;
  },

  // 1 recette
  get: async (id) => {
    const response = await api.get(`${SERVICE_URL}/${id}`);
    return response.data;
  },

  // create
  create: async (data) => {
    const response = await api.post(SERVICE_URL, data);
    return response.data;
  },

  // edit
  update: async (id, data) => {
    const response = await api.patch(`${SERVICE_URL}/${id}`, data);
    return response.data;
  },

  // del
  delete: async (id) => {
    await api.delete(`${SERVICE_URL}/${id}`);
  }
};