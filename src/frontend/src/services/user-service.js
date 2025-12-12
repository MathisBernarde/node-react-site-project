import api from "./api";

export default {
  getAll: async () => {
    const response = await api.get("/users");
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  }
};