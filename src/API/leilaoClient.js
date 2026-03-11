const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxvG3A5XX3vZuugLZXHChlpIzqJQKYQjev0gMEz4wDLxRn96zu2yK9DJgpOTr7STp5RHw/exec"; // <-- COLOQUE A URL DO NOVO DEPLOY AQUI!

export const leilaoClient = {
  /**
   * Busca Lotes ou Leiloeiros (GET)
   */
  getLotes: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Lotes`);
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar lotes:", error);
      return [];
    }
  },

  getLeiloeiros: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Leiloeiros`);
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar leiloeiros:", error);
      return [];
    }
  },

  /**
   * Executa a Varredura Completa (Botão Sincronizar)
   */
  executarVarreduraLotes: async () => {
    try {
      // Usamos fetch com modo simplificado para garantir que o Google Script receba
      await fetch(GOOGLE_API_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'varrer_todos_lotes' })
      });
      // Como o 'no-cors' não permite ler a resposta, retornamos sucesso manual
      return { status: "sucesso", message: "Comando de varredura enviado!" };
    } catch (error) {
      console.error("Erro na varredura:", error);
      throw error;
    }
  },

  /**
   * Executa a Busca de Leiloeiros via IA
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
   * Investigação de Placa (Individual)
   */
  rastrearVeiculo: async (placa, chassi) => {
    try {
      const response = await fetch(GOOGLE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'investigar', placa, chassi })
      });
      return await response.json();
    } catch (error) {
      console.error("Erro no rastreamento:", error);
      return { erro: "Falha na investigação." };
    }
  }
};
