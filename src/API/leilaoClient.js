// Substitua pela URL do seu novo deploy (que termina em /exec)
const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxpxy2aeRpYE94BqGZl8BVJdzU30wtSK7ptCc3Qd6qBYcWIt_dscshvOAPG3y0kCqAWAw/exec";

export const leilaoClient = {
  /**
   * Busca os Lotes da Planilha (GET)
   */
  getLotes: async () => {
    try {
      const url = `${GOOGLE_API_URL}?sheet=Lotes&t=${new Date().getTime()}`;
      const response = await fetch(url);
      const data = await response.json();
      
      // Filtra para garantir que retorne um array, mesmo se a planilha estiver vazia
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar lotes:", error);
      return [];
    }
  },

  /**
   * Busca os Leiloeiros da Planilha (GET)
   */
  getLeiloeiros: async () => {
    try {
      const url = `${GOOGLE_API_URL}?sheet=Leiloeiros&t=${new Date().getTime()}`;
      const response = await fetch(url);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar leiloeiros:", error);
      return [];
    }
  },

  /**
   * Dispara a Varredura de Lotes via IA (POST)
   */
  executarVarreduraLotes: async () => {
    try {
      await fetch(GOOGLE_API_URL, {
        method: 'POST',
        mode: 'no-cors', // Essencial para evitar bloqueio CORS do Google
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'varrer_todos_lotes' })
      });
      // No modo no-cors não lemos o retorno, apenas confirmamos o envio
      return { status: "sucesso", message: "Varredura solicitada!" };
    } catch (error) {
      console.error("Erro na varredura:", error);
      throw error;
    }
  },

  /**
   * Dispara a Busca de novos Leiloeiros (POST)
   */
  executarBuscaAutomatica: async () => {
    try {
      await fetch(GOOGLE_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'buscar_leiloeiros_automatico' })
      });
      return { status: "sucesso" };
    } catch (error) {
      console.error("Erro na busca de leiloeiros:", error);
      throw error;
    }
  },

  /**
   * Investigação individual de veículo (POST)
   */
  rastrearVeiculo: async (placa, chassi) => {
    try {
      const response = await fetch(GOOGLE_API_URL, {
        method: 'POST',
        // Aqui não usamos no-cors porque precisamos ler o resultado do dossiê
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'investigar', 
          placa: placa, 
          chassi: chassi 
        })
      });
      return await response.json();
    } catch (error) {
      console.error("Erro no rastreamento:", error);
      return { status: "erro", message: "Falha na conexão com o servidor." };
    }
  }
};
