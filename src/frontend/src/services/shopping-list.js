import api from "./api";
const SERVICE_URL = "/shopping-lists";

export default {
  // Récupérer toutes les listes
    getAll: async () => {
    const response = await api.get(SERVICE_URL);
    return response.data;
  },

  // Créer une liste
  create: async (title) => {
    const response = await api.post(SERVICE_URL, { 
        title, 
        status: "OPEN" 
    });
    return response.data;
  },

  // Mettre à jour (ex: changer le statut)
  update: async (id, data) => {
    const response = await api.patch(`${SERVICE_URL}/${id}`, data);
    return response.data;
  },

  // Supprimer
  delete: async (id) => {
    await api.delete(`${SERVICE_URL}/${id}`);
  }
};