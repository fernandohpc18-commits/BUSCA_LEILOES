const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbz2M_FMdZKkhR-VLcN2sftoMn-roSo06uK3mO37Jw_EhO2YI-SkWcVmyjtqXiOCGtlGgg/exec";

export const leilaoClient = {
  // Puxa os dados (GET)
  getLotes: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Lotes&t=${Date.now()}`, { redirect: "follow" });
      return await response.json();
    } catch (error) {
      console.error("Erro nos Lotes:", error);
      return [];
    }
  },

  getLeiloeiros: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Leiloeiros&t=${Date.now()}`, { redirect: "follow" });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro nos Leiloeiros:", error);
      return [];
    }
  },

  // Aciona a IA (POST) - ESSA É A FUNÇÃO QUE FALTAVA
  executarBuscaAutomatica: async () => {
    try {
      const response = await fetch(GOOGLE_API_URL, {
        method: "POST",
        mode: "no-cors", // Necessário para evitar erro de CORS em chamadas POST simples ao Apps Script
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "varrer_todos_lotes" })
      });
      return { status: "solicitado" };
    } catch (error) {
      console.error("Erro na busca automática:", error);
      throw error;
    }
  }
};
