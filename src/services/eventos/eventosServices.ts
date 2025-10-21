import api from "../api";

export const buscarEventos = async () => {
  try {
    const response = await api.get("/eventos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    throw error;
  }
};
