import api from "./api";

export default {
  getAll: async () => {
    const response = await api.get("/users");
    return response.data;
  },
};