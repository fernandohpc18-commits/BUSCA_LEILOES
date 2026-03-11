import axios from 'axios';

const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbw3h4Xhe143SU2YymykGHxYnBXmOgcblnSnaCI4I-RmwSBVFKLCWuY438fqKSsoN826AA/exec";

export const leilaoClient = {
  /**
   * Busca Lotes (Aba Lotes)
   */
  getLotes: async () => {
    try {
      const response = await axios.get(`${GOOGLE_API_URL}?sheet=Lotes`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Erro ao buscar lotes:", error);
      return [];
    }
  },

  /**
   * Busca Leiloeiros (Aba Leiloeiros)
   */
  getLeiloeiros: async () => {
    try {
      const response = await axios.get(`${GOOGLE_API_URL}?sheet=Leiloeiros`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Erro ao buscar leiloeiros:", error);
      return [];
    }
  },

  /**
   * Investigação de Placa/Chassi (Gemini)
   */
  rastrearVeiculo: async (placa, chassi) => {
    try {
      // Usamos POST para enviar os dados de investigação
      const response = await axios.post(GOOGLE_API_URL, {
        placa: placa,
        chassi: chassi
      });
      return response.data;
    } catch (error) {
      console.error("Erro no rastreamento:", error);
      return { erro: "Falha na investigação." };
    }
  },

  /**
   * Executa a Busca Automática de Leiloeiros (IA)
   */
  executarBuscaAutomatica: async () => {
    try {
      const response = await axios.post(GOOGLE_API_URL, {
        action: 'buscar_leiloeiros_automatico'
      });
      return response.data;
    } catch (error) {
      console.error("Erro na busca automática:", error);
      throw error;
    }
  },

  /**
   * Executa a Varredura de Lotes nos sites (IA)
   */
  executarVarreduraLotes: async () => {
    try {
      const response = await axios.post(GOOGLE_API_URL, {
        action: 'varrer_todos_lotes'
      });
      return response.data;
    } catch (error) {
      console.error("Erro na varredura:", error);
      throw error;
    }
  }
};
