const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbz2M_FMdZKkhR-VLcN2sftoMn-roSo06uK3mO37Jw_EhO2YI-SkWcVmyjtqXiOCGtlGgg/exec";

export const leilaoClient = {
  getLotes: async () => {
    try {
      // Adicionamos t=Date.now para furar o cache da Vercel
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Lotes&t=${Date.now()}`, {
        method: "GET",
        mode: "cors", // Força o modo CORS
        redirect: "follow"
      });
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar lotes:", error);
      return [];
    }
  },

  getLeiloeiros: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Leiloeiros&t=${Date.now()}`, {
        method: "GET",
        mode: "cors",
        redirect: "follow"
      });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar leiloeiros:", error);
      return [];
    }
  }
};
