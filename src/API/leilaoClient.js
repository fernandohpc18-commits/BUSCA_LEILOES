// Verifique se a URL termina em /exec
const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbz2M_FMdZKkhR-VLcN2sftoMn-roSo06uK3mO37Jw_EhO2YI-SkWcVmyjtqXiOCGtlGgg/exec";

export const leilaoClient = {
  getLotes: async () => {
    try {
      // O modo 'cors' e o cache 'no-store' ajudam a evitar o erro 401
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Lotes&t=${Date.now()}`, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        redirect: "follow"
      });
      return await response.json();
    } catch (error) {
      console.error("Erro nos Lotes:", error);
      return [];
    }
  },

  getLeiloeiros: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Leiloeiros&t=${Date.now()}`, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        redirect: "follow"
      });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro nos Leiloeiros:", error);
      return [];
    }
  }
};
