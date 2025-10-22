import type { EventoListagem } from "../../interfaces/interfaces";
import api from "../api";
import axios from "axios";

/**
 * Busca os eventos disponíveis para inscrição.
 * Retorna uma lista de EventoListagem ou lança erro em caso de falha.
 */
export const buscarEventosDisponiveis = async (): Promise<EventoListagem[]> => {
  const endpoint = "/eventos/disponiveis";
  console.log("URL chamada:", api.defaults.baseURL + endpoint);

  try {
    // ✅ Usar mock (modo desenvolvimento)
    return await mockEventos();
    // const response = await api.get<EventoListagem[]>(endpoint);
    //  return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erro ao buscar eventos:",
        error.response?.data || error.message
      );
      throw new Error(
        "Falha na comunicação com o servidor. Tente novamente mais tarde."
      );
    } else {
      console.error("Erro inesperado:", error);
      throw new Error("Ocorreu um erro inesperado ao buscar os eventos.");
    }
  }
};

// 🔹 Função que simula o retorno da API com delay
async function mockEventos(): Promise<EventoListagem[]> {
  const eventosMock: EventoListagem[] = [
    {
      id: 1,
      nome: "CEOMG",
      logotipo: "/assets/images/eventos/ceomg.png",
      idadeMinima: 18,
      permiteInscricaoInfantil: false,
      periodoInscricao: {
        dataInicial: new Date("2026-01-01"),
        dataFinal: new Date("2026-02-29"),
      },
      periodoRealizacao: {
        dataInicial: new Date("2026-04-03"),
        dataFinal: new Date("2026-04-05"),
      },
    },
  ];

  // simula um pequeno tempo de resposta da API
  await new Promise((resolve) => setTimeout(resolve, 500));

  return eventosMock;
}
