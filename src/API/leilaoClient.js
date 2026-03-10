import axios from 'axios';

// Substitua o texto abaixo pela URL que você gerou no Apps Script (que termina em /exec)
const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbw3h4Xhe143SU2YymykGHxYnBXmOgcblnSnaCI4I-RmwSBVFKLCWuY438fqKSsoN826AA/exec";

export const leilaoClient = {
  /**
   * Busca todos os lotes da Planilha Google (Aba Lotes)
   */
  getLotes: async () => {
    try {
      // O Google Apps Script exige seguir redirecionamentos, o axios faz isso por padrão
      const response = await axios.get(GOOGLE_API_URL);
      
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar lotes no Google Sheets:", error);
      return [];
    }
  },

  /**
   * Envia um novo lote capturado para a Planilha
   */
  salvarLote: async (dadosLote) => {
    try {
      const response = await axios.post(GOOGLE_API_URL, JSON.stringify(dadosLote));
      return response.data === "Sucesso";
    } catch (error) {
      console.error("Erro ao salvar lote:", error);
      return false;
    }
  },

  /**
   * Rastreamento Avançado (Busca no Google/IA para Recall e Histórico)
   * Esta função será conectada ao seu componente de Rastreamento
   */
  rastrearVeiculo: async (placa, chassi) => {
    try {
      console.log(`Iniciando investigação para Placa: ${placa} / Chassi: ${chassi}`);
      
      // Aqui o App solicita que o Google Script faça a pesquisa profunda
      const response = await axios.get(`${GOOGLE_API_URL}?action=rastrear&placa=${placa}&chassi=${chassi}`);
      return response.data;
    } catch (error) {
      console.error("Erro no rastreamento avançado:", error);
      return { erro: "Não foi possível completar a investigação agora." };
    }
  }
};
